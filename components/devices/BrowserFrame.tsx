import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BrowserFrameProps {
  /** Mono tag at the right of the title bar, e.g. "My proposal · example data". */
  badge?: string;
  children: ReactNode;
  className?: string;
  /** Natural ratio (width / height) of the content. */
  aspectRatio?: number;
  /** Used when no ratio is given. */
  aspectClassName?: string;
  label?: string;
}

/** A quiet frame: three hairline dots, an optional tag, a viewport. */
export function BrowserFrame({ badge, children, className, aspectRatio, aspectClassName = "aspect-[16/10]", label }: BrowserFrameProps) {
  const style: CSSProperties | undefined = aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined;
  return (
    <figure
      aria-label={label}
      className={cn("flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-hairline", className)}
    >
      <div className="flex h-[2.4cqw] min-h-10 shrink-0 items-center gap-[0.8cqw] border-b border-border bg-surface-2 px-[1cqw]">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full border border-border-strong" />
          <span className="size-2.5 rounded-full border border-border-strong" />
          <span className="size-2.5 rounded-full border border-border-strong" />
        </span>
        {badge ? <span className="ml-auto truncate font-mono text-micro uppercase text-fg-muted">{badge}</span> : null}
      </div>
      <div className={cn("relative min-h-0 flex-1 overflow-hidden bg-bg", aspectRatio ? undefined : aspectClassName)} style={style}>
        {children}
      </div>
    </figure>
  );
}
