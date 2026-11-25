import type { Post } from "@/lib/posts/types";
import { PostCard } from "./post-card";

type PostFeedProps = {
  posts: Post[];
  loading: boolean;
};

export function PostFeed({ posts, loading }: PostFeedProps) {
  if (loading) {
    return (
      <div
        className="flex flex-col gap-3"
        aria-busy="true"
        aria-label="Loading posts"
      >
        <div className="h-24 animate-pulse rounded-xl bg-card" />
        <div className="h-24 animate-pulse rounded-xl bg-card" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        Nothing here yet. Be the first to share something.
      </p>
    );
  }

  return (
    <ol aria-live="polite" className="flex flex-col gap-3">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ol>
  );
}
