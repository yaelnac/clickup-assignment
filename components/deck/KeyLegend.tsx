import type { ReactNode } from "react";
import { deck } from "@/content/slides";
import { cn } from "@/lib/cn";

/**
 * The keyboard legend: move, overview, fullscreen. Lives in the cover's footer row, on
 * pointer devices only, so it reads as part of the slide rather than a floating toast.
 */
export function KeyLegend({ className }: { className?: string }) {
  const items = [
    { keys: ["←", "→"], label: deck.hint.move },
    { keys: ["O"], label: deck.hint.overview },
    { keys: ["F"], label: deck.hint.fullscreen },
  ];
  return (
    <ul aria-label="Keyboard" className={cn("hidden items-center gap-7 font-mono text-label uppercase text-fg-muted pointer-fine:flex", className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          {item.keys.map((key) => (
            <Kbd key={key} size="md">
              {key}
            </Kbd>
          ))}
          <span className="ml-1">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function Kbd({ children, size = "sm" }: { children: ReactNode; size?: "sm" | "md" }) {
  return (
    <kbd
      className={cn(
        "grid place-items-center rounded-sm border border-border-strong bg-bg font-mono text-fg",
        size === "md" ? "h-7 min-w-7 px-1.5 text-data" : "h-5 min-w-5 px-1 text-micro",
      )}
    >
      {children}
    </kbd>
  );
}
