"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useStage } from "@/components/deck/SlideStage";
import { Frame, Item, Stagger } from "@/components/slides/primitives";
import { Thoughts } from "@/components/slides/Thoughts";
import type { Connector, Slide } from "@/content/slides";
import { cn } from "@/lib/cn";
import { arrowHead, boxWithin, pathFrom, type Point } from "@/lib/connectors";
import { transition } from "@/lib/motion";
import { useEntryDirection, useSlideSteps, useStepLabel } from "@/lib/steps";

type OnboardingSlide = Extract<Slide, { type: "onboarding" }>;

/**
 * ClickUp's eight setup questions as Maya met them, one screen at a time. Next and Previous
 * (keys, buttons, swipe) walk through the screens before leaving the slide. Each screen shows
 * the question pill and her draining patience, the real screenshot with a dashed outline on
 * what she reacts to, and a line from that outline to her thought.
 */
export function Onboarding({ slide, forcedStep }: { slide: OnboardingSlide; forcedStep?: number }) {
  const { mode, active } = useStage();
  const steps = slide.steps;
  const last = steps.length - 1;
  const entry = useEntryDirection();
  const [step, setStep] = useState(() => forcedStep ?? (entry === -1 ? last : 0));
  const current = steps[Math.min(step, last)];
  const questions = Math.max(...steps.map((s) => s.question));
  const animated = mode === "deck";
  const live = active && mode === "deck" && forcedStep === undefined;

  useSlideSteps(
    {
      next: () => {
        if (step >= last) return false;
        setStep(step + 1);
        return true;
      },
      prev: () => {
        if (step <= 0) return false;
        setStep(step - 1);
        return true;
      },
    },
    live,
  );
  useStepLabel(`${current.question} of ${questions}`, live);

  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPolygonElement>(null);
  useConnector(wrapRef, lineRef, headRef, step, current.connector);

  return (
    <Frame rows="single">
      <Stagger className="contents">
        <div ref={wrapRef} className="relative grid gap-gap self-center landscape:grid-cols-12 landscape:items-end">
          {/* question, patience, screenshot */}
          <Item className="grid min-w-0 gap-[1.8cqh] landscape:col-span-8">
            <div className="flex flex-wrap items-center gap-x-[max(0.75rem,1.6cqw)] gap-y-2">
              <h1 className="rounded-full bg-accent/10 px-[max(0.8rem,1.1cqw)] py-[max(0.35rem,0.55cqw)] text-body font-normal text-fg">{current.title}</h1>
              <p className="flex items-center gap-[0.8cqw] text-body text-fg-muted" aria-label={`Her patience: ${current.patience} of 5`}>
                <span aria-hidden="true">Her patience</span>
                <span aria-hidden="true" className="flex gap-[0.35cqw]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "size-[0.7cqw] min-h-2 min-w-2 rounded-full transition-colors duration-(--duration-base) ease-out",
                        i < current.patience ? "bg-accent" : "bg-border",
                      )}
                    />
                  ))}
                </span>
              </p>
            </div>

            <div
              className="relative overflow-hidden rounded-xl border border-border bg-fg"
              style={{ aspectRatio: String(current.shot.width / current.shot.height) }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={step}
                  className="absolute inset-0"
                  initial={animated ? { opacity: 0 } : false}
                  animate={{ opacity: 1, transition: transition.base }}
                  exit={{ opacity: 0, transition: transition.fast }}
                >
                  <Image
                    src={current.shot.src}
                    alt={current.shot.alt}
                    width={current.shot.width}
                    height={current.shot.height}
                    sizes={mode === "thumb" ? "320px" : "60vw"}
                    loading={mode === "deck" ? "eager" : "lazy"}
                    className="absolute inset-0 size-full object-cover"
                  />
                  {current.highlight ? (
                    <span
                      data-highlight={step}
                      aria-hidden="true"
                      className="absolute rounded-lg border-2 border-dashed border-accent-bright"
                      style={{
                        left: `${current.highlight.x}%`,
                        top: `${current.highlight.y}%`,
                        width: `${current.highlight.w}%`,
                        height: `${current.highlight.h}%`,
                      }}
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
            {mode === "deck" && step < last ? (
              <Image src={steps[step + 1].shot.src} alt="" width={16} height={11} sizes="60vw" className="sr-only" aria-hidden="true" />
            ) : null}
          </Item>

          {/* Maya's thoughts, bottom-aligned with the screenshot */}
          <Item className="min-w-0 landscape:col-span-4">
            <Thoughts bubbles={current.bubbles} mood={current.mood} stepKey={step} animated={animated} />
          </Item>

          {/* the line from the outline to her thought (landscape only) */}
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible portrait:hidden">
            <path
              key={`line-${step}`}
              ref={lineRef}
              pathLength={1}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.6}
              strokeLinejoin="round"
              className={animated ? "connector-line" : undefined}
            />
            <polygon key={`head-${step}`} ref={headRef} fill="var(--accent)" className={animated ? "connector-head" : undefined} />
          </svg>
        </div>
      </Stagger>
    </Frame>
  );
}

/** Draws the connector imperatively (no re-render), and redraws on resize and once fonts settle. */
function useConnector(
  wrapRef: RefObject<HTMLDivElement | null>,
  lineRef: RefObject<SVGPathElement | null>,
  headRef: RefObject<SVGPolygonElement | null>,
  step: number,
  connector: Connector | undefined,
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const draw = () => {
      const line = lineRef.current;
      const head = headRef.current;
      if (!line || !head) return;
      const clear = () => {
        line.setAttribute("d", "");
        head.setAttribute("points", "");
      };
      if (!connector) return clear();
      const boxEl = wrap.querySelector<HTMLElement>(`[data-highlight="${step}"]`);
      const bubbleEl = wrap.querySelector<HTMLElement>(`[data-step="${step}"] [data-bubble="${connector.target ?? 0}"]`);
      if (!boxEl || !bubbleEl) return clear();
      const b = boxWithin(boxEl, wrap);
      const t = boxWithin(bubbleEl, wrap);
      if (!b || !t) return clear();

      const gap = 8;
      const targetY = t.top + t.height / 2;
      const boxMidY = b.top + b.height / 2;
      let pts: Point[];
      if (connector.kind === "elbow-down" && targetY > b.top + b.height + 16) {
        const x = b.left + b.width * (connector.at ?? 0.5);
        pts = [[x, b.top + b.height], [x, targetY], [t.left - gap, targetY]];
      } else if (connector.kind === "elbow-right" && t.top > boxMidY + 16) {
        const x = t.left + t.width * 0.1;
        pts = [[b.left + b.width, boxMidY], [x, boxMidY], [x, t.top - gap]];
      } else {
        pts = [[b.left + b.width, boxMidY], [t.left - gap, targetY]];
      }
      line.setAttribute("d", pathFrom(pts));
      head.setAttribute("points", arrowHead(pts));
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(wrap);
    const thoughts = wrap.querySelector("[data-thoughts]");
    if (thoughts) observer.observe(thoughts);
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) draw();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [wrapRef, lineRef, headRef, step, connector]);
}
