"use client";

import { useState, type FormEvent } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DISPLAY_NAME, MAX_BODY_LENGTH } from "@/lib/posts/constants";
import { countChars } from "@/lib/posts/validation";

type PostComposerProps = {
  onShare: (body: string) => void;
  submitting: boolean;
};

export function PostComposer({ onShare, submitting }: PostComposerProps) {
  const [value, setValue] = useState("");
  const remaining = MAX_BODY_LENGTH - countChars(value);
  const isEmpty = value.trim().length === 0;
  const isOverLimit = remaining < 0;
  const disabled = isEmpty || isOverLimit || submitting;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    onShare(value);
    setValue("");
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Avatar aria-hidden="true">{DISPLAY_NAME.charAt(0)}</Avatar>
            <Textarea
              id="wall-message"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              aria-label="Write a message to share"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span
              aria-live="polite"
              className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
            >
              {remaining} characters left
            </span>
            <Button type="submit" disabled={disabled}>
              {submitting ? "Sharing…" : "Share"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
