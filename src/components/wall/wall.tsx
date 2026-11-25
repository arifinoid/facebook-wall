"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import {
  fetchPosts,
  insertPost,
  subscribeToInserts,
  type PostsSubscription,
} from "@/lib/posts/queries";
import { validateBody } from "@/lib/posts/validation";
import type { Post } from "@/lib/posts/types";
import { PostComposer } from "./post-composer";
import { PostFeed } from "./post-feed";

function toMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function Wall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal: AbortSignal) => {
    try {
      const data = await fetchPosts(getSupabase());
      if (signal.aborted) {
        return;
      }
      setPosts(data);
      setError(null);
    } catch (cause) {
      if (signal.aborted) {
        return;
      }
      setError(toMessage(cause, "Could not load the wall."));
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let subscription: PostsSubscription | null = null;

    try {
      const client = getSupabase();
      void load(controller.signal);
      subscription = subscribeToInserts(client, (post) => {
        setPosts((current) => [
          post,
          ...current.filter((item) => item.id !== post.id),
        ]);
      });
    } catch (cause) {
      setError(toMessage(cause, "Could not connect to Supabase."));
      setLoading(false);
    }

    // Fallback: if Realtime is unavailable, refresh when the tab regains focus.
    const onFocus = () => {
      void load(controller.signal);
    };

    window.addEventListener("focus", onFocus);

    return () => {
      controller.abort();
      window.removeEventListener("focus", onFocus);
      void subscription?.unsubscribe();
    };
  }, [load]);

  const share = async (body: string) => {
    const validation = validateBody(body);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const post = await insertPost(getSupabase(), body);
      setPosts((current) => [
        post,
        ...current.filter((item) => item.id !== post.id),
      ]);
    } catch (cause) {
      setError(toMessage(cause, "Could not share. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-label="Wall" className="flex flex-col gap-4">
      <PostComposer onShare={share} submitting={submitting} />

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <PostFeed posts={posts} loading={loading} />
    </section>
  );
}
