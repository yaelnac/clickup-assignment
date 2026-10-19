"use client";

import { motion } from "motion/react";
import type { RefObject } from "react";
import { chapters, slides, type Chapter } from "@/content/slides";
import { pad2 } from "@/lib/deck";
import { transition } from "@/lib/motion";

/** One segment per chapter, sized by how many slides it holds. */
const segments = chapters
  .map((chapter) => {
    const indexes = slides.flatMap((slide, i) => (slide.chapter === chapter.id ? [i] : []));
    return { id: chapter.id, start: indexes[0] ?? 0, count: indexes.length };
  })
  .filter((segment) => segment.count > 0);

interface ChromeProps {
  index: number;
  total: number;
  chapter: Chapter;
  /** Replaces the chapter name for this slide, e.g. "Moment 1 · Setup". */
  section?: string;
  /** Step inside the current slide, e.g. "2 of 8". */
  step?: string;
  onOverview: () => void;
  counterRef: RefObject<HTMLButtonElement | null>;
}

/**
 * The only chrome: a progress bar along the top edge, split into chapters so position is
 * visible without words, and one small line top-right (chapter · counter) that opens the overview.
 */
export function Chrome({ index, total, chapter, section, step, onOverview, counterRef }: ChromeProps) {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 z-30 flex h-0.5 gap-1.5">
        {segments.map((segment) => {
          const done = index >= segment.start + segment.count ? 1 : index < segment.start ? 0 : (index - segment.start + 1) / segment.count;
          return (
            <div key={segment.id} className="h-full bg-border" style={{ flexGrow: segment.count }}>
              <motion.div className="h-full w-full origin-left bg-fg" initial={false} animate={{ scaleX: done }} transition={transition.slide} />
            </div>
          );
        })}
      </div>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 mx-auto flex h-chrome max-w-measure items-center justify-end px-pad">
        <button
          ref={counterRef}
          type="button"
          onClick={onOverview}
          aria-haspopup="dialog"
          className="pointer-events-auto -mr-3 flex min-h-tap shrink-0 items-center gap-2 rounded-sm px-3 font-mono text-label uppercase text-fg-muted transition-colors duration-(--duration-fast) ease-out hover:text-fg"
        >
          <span className="sr-only">Open overview. </span>
          <span className="hidden @md:inline">{section ?? chapter.title}</span>
          <span aria-hidden="true" className="hidden @md:inline">
            ·
          </span>
          {step ? (
            <>
              <span className="hidden @md:inline">{step}</span>
              <span aria-hidden="true" className="hidden @md:inline">
                ·
              </span>
            </>
          ) : null}
          <span className="flex items-baseline gap-1.5">
            <span className="text-fg">{pad2(index + 1)}</span>
            <span aria-hidden="true">/</span>
            <span>{pad2(total)}</span>
          </span>
        </button>
      </header>
    </>
  );
}
