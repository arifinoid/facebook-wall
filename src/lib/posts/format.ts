import type { Post } from "./types";

/** Return a newest-first copy; the input array is never mutated. */
export function sortPostsNewestFirst(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

/** Relative "2 hours ago" style label, with an injectable clock for tests. */
export function formatRelativeTime(
  iso: string,
  now: number = Date.now(),
): string {
  const then = Date.parse(iso);

  if (Number.isNaN(then)) {
    return "";
  }

  const seconds = Math.max(0, Math.round((now - then) / 1000));

  if (seconds < 45) {
    return "Just now";
  }

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.round(hours / 24);
  if (days === 1) {
    return "Yesterday";
  }
  if (days < 7) {
    return `${days} days ago`;
  }

  return new Date(then).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function initialForName(name: string): string {
  return Array.from(name.trim())[0]?.toUpperCase() ?? "?";
}
