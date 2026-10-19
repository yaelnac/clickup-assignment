"use client";

import { createContext, useContext, type ReactNode } from "react";
import { NumberBadge } from "@/components/slides/primitives";
import { cn } from "@/lib/cn";

/** Which outlines are showing. A slide that builds its annotations in steps provides this. */
export const MarkVisibility = createContext<(n: string) => boolean>(() => true);

/**
 * Wraps an element in a dashed purple outline with a number badge on its corner.
 * Without `n` it renders the children untouched. The outline carries `data-mark-box` so
 * connector lines can find it, and fades in and out with `MarkVisibility`.
 */
export function Marked({ n, children, inset = false }: { n?: string; children: ReactNode; inset?: boolean }) {
  const isShown = useContext(MarkVisibility);
  if (!n) return <>{children}</>;
  const shown = isShown(n);
  // Showing: the outline settles in, then its badge grows in. Hiding: both fade out quickly.
  const base = "transition-[opacity,scale,visibility] ease-out motion-reduce:scale-100";
  const box = cn(base, shown ? "visible scale-100 opacity-100 delay-[120ms] duration-[460ms]" : "invisible scale-[1.03] opacity-0 delay-0 duration-200");
  const badge = cn(base, shown ? "visible scale-100 opacity-100 delay-[260ms] duration-[360ms]" : "invisible scale-50 opacity-0 delay-0 duration-150");
  return (
    <div className="relative">
      {children}
      <span
        data-mark-box={n}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute rounded-md border-2 border-dashed border-accent bg-accent/10",
          inset ? "inset-0" : "-inset-[0.35cqw]",
          box,
        )}
      />
      <span
        aria-hidden="true"
        className={cn("absolute -translate-x-1/2 -translate-y-1/2", inset ? "left-0 top-0" : "-left-[0.35cqw] -top-[0.35cqw]", badge)}
      >
        <NumberBadge n={n} ring />
      </span>
    </div>
  );
}
