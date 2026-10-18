"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type RefObject } from "react";
import { Kbd } from "@/components/deck/KeyLegend";
import { Thumb } from "@/components/deck/Thumb";
import { chapters, deck, slides } from "@/content/slides";
import { transition } from "@/lib/motion";

interface OverviewProps {
  open: boolean;
  index: number;
  onClose: () => void;
  onJump: (index: number) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}

/** Every slide as a thumbnail, grouped by chapter. Click to jump. */
export function Overview({ open, index, onClose, onJump, returnFocusRef }: OverviewProps) {
  const activeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => activeRef.current?.focus({ preventScroll: false }), 50);
      wasOpen.current = true;
      return () => window.clearTimeout(t);
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      returnFocusRef.current?.focus();
    }
  }, [open, returnFocusRef]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={deck.overviewLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition.base}
          className="absolute inset-0 z-40 overflow-y-auto overscroll-contain bg-bg"
        >
          {/* Header and grid share the slides' measure and gutters, so the overview lines up with the deck. */}
          <div className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur-md">
            <div className="overview-measure flex h-chrome items-center justify-between">
              <p className="font-mono text-label uppercase text-fg-muted">{deck.overviewLabel}</p>
              <button
                type="button"
                onClick={onClose}
                className="-mr-3 flex min-h-tap items-center gap-2 rounded-sm px-3 font-mono text-label uppercase text-fg-muted hover:text-fg"
              >
                {deck.closeLabel}
                <Kbd>Esc</Kbd>
              </button>
            </div>
          </div>
          <div className="overview-measure grid gap-10 pb-16 pt-8">
            {chapters.map((chapter) => (
              <section key={chapter.id} aria-labelledby={`ov-${chapter.id}`}>
                <h2 id={`ov-${chapter.id}`} className="mb-4 flex items-baseline gap-3 font-mono text-label uppercase text-fg-muted">
                  <span className="text-fg">{chapter.number}</span>
                  {chapter.title}
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 @3xl:grid-cols-4 @6xl:grid-cols-6">
                  {slides.map((slide, i) =>
                    slide.chapter === chapter.id ? (
                      <Thumb
                        key={slide.id}
                        ref={i === index ? activeRef : undefined}
                        slide={slide}
                        index={i}
                        active={i === index}
                        onClick={() => onJump(i)}
                      />
                    ) : null,
                  )}
                </div>
              </section>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
