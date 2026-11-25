import type { SupabaseClient } from "@supabase/supabase-js";
import { ANON_USER_ID } from "./constants";
import { sortPostsNewestFirst } from "./format";
import type { Post, PostRow } from "./types";

/** Map a database row onto the UI model. */
export function mapRow(row: PostRow): Post {
  return {
    id: row.id,
    userId: row.user_id ?? ANON_USER_ID,
    body: row.body,
    createdAt: row.created_at,
  };
}

export async function fetchPosts(supabase: SupabaseClient): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("id, user_id, body, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as PostRow[];
  return sortPostsNewestFirst(rows.map(mapRow));
}

export async function insertPost(
  supabase: SupabaseClient,
  body: string,
): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: ANON_USER_ID, body })
    .select("id, user_id, body, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data as PostRow);
}

export type PostsSubscription = {
  unsubscribe: () => Promise<void>;
};

/** Subscribe to new inserts and prepend them on the caller's side. */
export function subscribeToInserts(
  supabase: SupabaseClient,
  onInsert: (post: Post) => void,
): PostsSubscription {
  const channel = supabase
    .channel("wall-posts")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      (payload) => {
        onInsert(mapRow(payload.new as PostRow));
      },
    )
    .subscribe();

  return {
    unsubscribe: async () => {
      await supabase.removeChannel(channel);
    },
  };
}
