"use client";

import { deck } from "@/content/slides";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/deck";

interface NavButtonsProps {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

/** Previous / Next. A floating pair on landscape stages, a full-width bar on portrait ones. */
export function NavButtons({ index, total, onPrev, onNext }: NavButtonsProps) {
  const canPrev = index > 0;
  const canNext = index < total - 1;
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 mx-auto hidden max-w-measure justify-end px-pad landscape:flex">
        <div className="pointer-events-auto flex items-center gap-2">
          <RoundButton direction="prev" label={deck.nav.prev} disabled={!canPrev} onClick={onPrev} />
          <RoundButton direction="next" label={deck.nav.next} disabled={!canNext} onClick={onNext} primary />
        </div>
      </div>

      <nav
        aria-label="Slides"
        className="absolute inset-x-0 bottom-0 z-30 flex h-bar items-stretch border-t border-border bg-bg pb-[env(safe-area-inset-bottom)] landscape:hidden"
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="flex flex-1 items-center justify-center gap-2 font-mono text-label uppercase text-fg transition-opacity disabled:opacity-35"
        >
          <Chevron direction="prev" />
          {deck.nav.prev}
        </button>
        <span className="flex items-center gap-1.5 border-x border-border px-5 font-mono text-label text-fg-muted">
          <span className="text-fg">{pad2(index + 1)}</span>
          <span aria-hidden="true">/</span>
          <span>{pad2(total)}</span>
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="flex flex-1 items-center justify-center gap-2 bg-fg font-mono text-label uppercase text-bg transition-opacity disabled:opacity-35"
        >
          {deck.nav.next}
          <Chevron direction="next" />
        </button>
      </nav>
    </>
  );
}

interface RoundButtonProps {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
  primary?: boolean;
}

function RoundButton({ direction, label, disabled, onClick, primary }: RoundButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "grid size-12 place-items-center rounded-full transition-[opacity,background-color] duration-(--duration-fast) ease-out",
        primary ? "bg-fg text-bg hover:bg-fg/90" : "bg-surface text-fg hover:bg-surface-2",
        "disabled:cursor-default disabled:opacity-35",
      )}
    >
      <Chevron direction={direction} />
    </button>
  );
}

function Chevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={cn("size-5", direction === "prev" && "-scale-x-100")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}
