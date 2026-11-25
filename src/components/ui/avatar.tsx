import type { ComponentProps } from "react";
import { cn } from "cn";

function Avatar({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar };
