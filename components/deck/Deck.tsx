"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { Chrome } from "@/components/deck/Chrome";
import { NavButtons } from "@/components/deck/NavButtons";
import { Overview } from "@/components/deck/Overview";
import { SlideStage } from "@/components/deck/SlideStage";
import { markDeckHydrated } from "@/components/slides/primitives";
import { SlideView } from "@/components/slides/SlideView";
import { chapterOf, slides } from "@/content/slides";
import { capturesKeys, formatHash, isEditable, isInteractive, parseHash, swipeDirection } from "@/lib/deck";
import { checkSlides } from "@/lib/slide-rules";
import { StepsContext, type StepHandler } from "@/lib/steps";

const total = slides.length;
const clamp = (n: number) => Math.max(0, Math.min(total - 1, n));

/**
 * Mirrors the current slide in the address bar so a link to a slide can be shared.
 * Slide 1 is the bare URL; from slide 2 on it is `#/n`. Passing `null` (not the current state)
 * lets Next.js's patched replaceState record the new URL; state carrying Next's `__NA` flag is
 * treated as its own write and ignored, so the next router refresh (HMR) restored the old URL.
 * The URL is cosmetic: if the write fails, nothing else is affected.
 */
function showInUrl(index: number, force = false) {
  const url = index === 0 ? window.location.pathname + window.location.search : formatHash(index);
  if (!force && window.location.hash === (index === 0 ? "" : url)) return;
  try {
    window.history.replaceState(null, "", url);
  } catch {
    /* ignore */
  }
}

export function Deck() {
  /* The slide number is plain state. Keys, buttons, swipes and the overview all set it directly. */
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [overview, setOverview] = useState(false);
  const counterRef = useRef<HTMLButtonElement>(null);

  const go = useCallback((n: number, dir?: 1 | -1) => {
    const current = indexRef.current;
    const target = clamp(n);
    setOverview(false);
    if (target === current) return;
    indexRef.current = target;
    setDirection(dir ?? (target > current ? 1 : -1));
    setIndex(target);
    showInUrl(target);
  }, []);

  /* Slides with internal steps register here and get first call on Next / Previous. */
  const stepsRef = useRef<StepHandler | null>(null);
  const [stepLabel, setStepLabel] = useState<{ owner: symbol; label: string } | null>(null);
  const stepsApi = useMemo(
    () => ({
      register: (handler: StepHandler) => {
        stepsRef.current = handler;
        return () => {
          if (stepsRef.current === handler) stepsRef.current = null;
        };
      },
      setLabel: (owner: symbol, label: string | null) =>
        setStepLabel((current) => (label !== null ? { owner, label } : current?.owner === owner ? null : current)),
      direction,
    }),
    [direction],
  );
  const next = useCallback(() => {
    if (stepsRef.current?.next()) return;
    go(indexRef.current + 1, 1);
  }, [go]);
  const prev = useCallback(() => {
    if (stepsRef.current?.prev()) return;
    go(indexRef.current - 1, -1);
  }, [go]);

  /* Once mounted: open a shared link's slide, then follow back / forward and hand-edited hashes. */
  useEffect(() => {
    const linked = parseHash(window.location.hash, total);
    if (linked !== null && linked !== indexRef.current) {
      indexRef.current = linked;
      setIndex(linked);
    } else if (linked === 0) {
      showInUrl(0);
    }
    markDeckHydrated();
    // tells scripts/check-navigation.mts that keys and buttons are wired up
    document.documentElement.dataset.deckReady = "1";
    const onHashChange = () => {
      const n = parseHash(window.location.hash, total);
      if (n !== null) go(n);
      // The hash changed outside the router (typed, cleared, back / forward). Write it through
      // history even if it already matches, so Next.js records it and a later render or
      // refresh does not put the old URL back. A junk hash keeps the slide and is tidied.
      showInUrl(n ?? indexRef.current, true);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [go]);

  /* Slide rules, surfaced in development. */
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    for (const v of checkSlides(slides)) {
      console.warn(`[slides] ${v.id}: ${v.field} has ${v.words} words (limit ${v.limit})`);
    }
  }, []);

  /* Key map. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditable(event.target)) return;
      const key = event.key;
      const lower = key.toLowerCase();

      if (lower === "f") {
        event.preventDefault();
        void toggleFullscreen();
        return;
      }
      if (lower === "o" || key === "Escape") {
        event.preventDefault();
        setOverview((open) => !open);
        return;
      }
      if (overview) return;
      if (capturesKeys(event.target)) return;
      if ((key === " " || key === "Enter") && isInteractive(event.target)) return;

      switch (key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          event.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          prev();
          break;
        case "Home":
          event.preventDefault();
          go(0);
          break;
        case "End":
          event.preventDefault();
          go(total - 1);
          break;
        default:
          return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overview, next, prev, go]);

  /* Swipe. Touch events, not pointer events: browsers cancel the pointer stream once a
     touch moves, but touchend still arrives with the final position. */
  const touch = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) {
      touch.current = null;
      return;
    }
    const point = event.touches[0];
    touch.current = { x: point.clientX, y: point.clientY, t: performance.now() };
  };
  const onTouchEnd = (event: TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    const point = event.changedTouches[0];
    if (!start || !point) return;
    const d = swipeDirection(point.clientX - start.x, point.clientY - start.y, performance.now() - start.t);
    if (d === 1) next();
    if (d === -1) prev();
  };
  const onTouchCancel = () => {
    touch.current = null;
  };

  const slide = slides[index];
  const chapter = chapterOf(slide);
  const label = `Slide ${index + 1} of ${total}: ${slide.title}`;
  const neighbours = [index - 1, index + 1].filter((i) => i >= 0 && i < total);

  return (
    <div
      data-tone={chapter.tone}
      className="stage fixed inset-x-0 top-0 h-dvh overflow-hidden bg-bg text-fg transition-colors duration-(--duration-slide) ease-out"
    >
      {/* The canvas: see .deck-canvas in globals.css. */}
      <div className="deck-canvas stage overflow-hidden">
        <Chrome
          index={index}
          total={total}
          chapter={chapter}
          section={slide.section}
          step={stepLabel?.label}
          onOverview={() => setOverview(true)}
          counterRef={counterRef}
        />

        <div className="absolute inset-0 touch-pan-y" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={onTouchCancel}>
          <section key={slide.id} className="absolute inset-0" aria-roledescription="slide" aria-label={label}>
            <SlideStage tone={chapter.tone} mode="deck" active className="h-full w-full">
              <StepsContext.Provider value={stepsApi}>
                <SlideView slide={slide} />
              </StepsContext.Provider>
            </SlideStage>
          </section>

          {/* Neighbours: mounted, hidden, inert, so their images are ready. */}
          <div aria-hidden="true" inert className="pointer-events-none invisible absolute inset-0">
            {neighbours.map((i) => (
              <SlideStage key={slides[i].id} tone={chapterOf(slides[i]).tone} mode="deck" active={false} className="absolute inset-0">
                <SlideView slide={slides[i]} />
              </SlideStage>
            ))}
          </div>
        </div>

        <NavButtons index={index} total={total} onPrev={prev} onNext={next} />
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {stepLabel ? `${label}, question ${stepLabel.label}` : label}
      </p>
      <Overview open={overview} index={index} onClose={() => setOverview(false)} onJump={go} returnFocusRef={counterRef} />
    </div>
  );
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    /* fullscreen unavailable (iOS Safari); nothing to do */
  }
}
