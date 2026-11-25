import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { DISPLAY_NAME } from "@/lib/posts/constants";
import { formatRelativeTime } from "@/lib/posts/format";
import type { Post } from "@/lib/posts/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar aria-hidden="true">{DISPLAY_NAME.charAt(0)}</Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-fb-link">
              {DISPLAY_NAME}
            </span>
            <time
              dateTime={post.createdAt}
              className="text-xs text-muted-foreground"
            >
              {formatRelativeTime(post.createdAt)}
            </time>
          </div>
        </div>

        <p className="text-sm break-words whitespace-pre-wrap text-fb-text">
          {post.body}
        </p>
      </CardContent>
    </Card>
  );
}
