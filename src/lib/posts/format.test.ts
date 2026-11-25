import { describe, expect, it } from "vitest";
import { formatRelativeTime, initialForName, sortPostsNewestFirst } from "./format";
import type { Post } from "./types";

describe("sortPostsNewestFirst", () => {
  it("sorts newest first without mutating the input", () => {
    const posts: Post[] = [
      { id: "1", userId: "u", body: "old", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "2", userId: "u", body: "new", createdAt: "2026-01-03T00:00:00.000Z" },
      { id: "3", userId: "u", body: "mid", createdAt: "2026-01-02T00:00:00.000Z" },
    ];

    const sorted = sortPostsNewestFirst(posts);

    expect(sorted.map((post) => post.id)).toEqual(["2", "3", "1"]);
    expect(posts.map((post) => post.id)).toEqual(["1", "2", "3"]);
  });
});

describe("formatRelativeTime", () => {
  const now = Date.parse("2026-01-10T12:00:00.000Z");

  it("returns Just now for recent posts", () => {
    expect(formatRelativeTime("2026-01-10T11:59:30.000Z", now)).toBe("Just now");
  });

  it("formats minutes", () => {
    expect(formatRelativeTime("2026-01-10T11:30:00.000Z", now)).toBe(
      "30 minutes ago",
    );
  });

  it("formats a single minute", () => {
    expect(formatRelativeTime("2026-01-10T11:59:00.000Z", now)).toBe(
      "1 minute ago",
    );
  });

  it("formats hours", () => {
    expect(formatRelativeTime("2026-01-10T09:00:00.000Z", now)).toBe(
      "3 hours ago",
    );
  });

  it("formats yesterday", () => {
    expect(formatRelativeTime("2026-01-09T12:00:00.000Z", now)).toBe(
      "Yesterday",
    );
  });

  it("returns an empty string for invalid input", () => {
    expect(formatRelativeTime("not-a-date", now)).toBe("");
  });
});

describe("initialForName", () => {
  it("returns the uppercased first character", () => {
    expect(initialForName("Guest")).toBe("G");
  });

  it("falls back for an empty name", () => {
    expect(initialForName("   ")).toBe("?");
  });
});
