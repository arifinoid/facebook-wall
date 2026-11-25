/** A post as consumed by the UI. */
export type Post = {
  id: string;
  userId: string;
  body: string;
  /** ISO 8601 timestamp. */
  createdAt: string;
};

/** A raw row from the `posts` table. */
export type PostRow = {
  id: string;
  user_id: string | null;
  body: string;
  created_at: string;
};
