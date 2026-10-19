"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useStage, type StageMode } from "@/components/deck/SlideStage";
import { Frame, Headline, Item, NumberBadge, Stagger } from "@/components/slides/primitives";
import { Thoughts } from "@/components/slides/Thoughts";
import { Icon } from "@/components/ui/Icon";
import type { AnnotatedScreen, Mark, Slide } from "@/content/slides";
import { cn } from "@/lib/cn";
import { arrowHead, boxWithin, pathFrom, type Point } from "@/lib/connectors";
import { useEntryDirection, useSlideSteps } from "@/lib/steps";

type AnnotatedSlide = Extract<Slide, { type: "annotated" }>;

/** What one annotated screen needs. A single slide and each walkthrough step both fit it. */
export type AnnotatedData = AnnotatedScreen;

/** A single annotated slide. With `build`, it opens clean and the annotations build in on the next arrow. */
export function Annotated({ slide }: { slide: AnnotatedSlide }) {
  const { mode, active } = useStage();
  const builds = Boolean(slide.build) && mode === "deck";
  const entry = useEntryDirection();
  const [revealed, setRevealed] = useState(() => !builds || entry === -1);
  useSlideSteps(
    {
      next: () => {
        if (revealed) return false;
        setRevealed(true);
        return true;
      },
      prev: () => {
        if (!revealed) return false;
        setRevealed(false);
        return true;
      },
    },
    builds && active,
  );
  return <AnnotatedView data={slide} mode={mode} revealed={revealed} />;
}

/**
 * Reveal timeline, in ms after the arrow press: outlines settle, badges pop, labels slide in one
 * by one, lines draw, then Maya's thoughts rise and the line to her bubble draws last.
 */
const T = { box: 60, badge: 220, label: 360, labelStep: 90, line: 560, lineStep: 110, thoughts: 820, bubbleLine: 1180 };

/** Classes for one revealable piece: shown with a delay, hidden quickly. Hidden pieces keep their space. */
function reveal(shown: boolean, hiddenTransform: string) {
  return cn(
    "transition-[opacity,scale,translate,visibility] ease-out motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100",
    shown ? "visible opacity-100 duration-[480ms]" : cn("invisible opacity-0 delay-0 duration-200", hiddenTransform),
  );
}

/**
 * A real screenshot with numbered outlines. Each outline has a label above, below or beside the
 * image, joined by a line, and one outline also points at Maya's thought on the right.
 * With `revealed` false only the headline and the screenshot show; everything else keeps its
 * space and builds in when it turns true.
 */
export function AnnotatedView({ data: slide, mode, revealed = true }: { data: AnnotatedData; mode: StageMode; revealed?: boolean }) {
  const animated = mode === "deck";
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  useMarkConnectors(wrapRef, svgRef, slide, revealed);
  const delay = (ms: number): CSSProperties => ({ transitionDelay: revealed ? `${ms}ms` : "0ms" });

  const labelled = slide.marks.filter((m) => m.label && m.text);
  const above = labelled.filter((m) => m.label?.side === "above");
  const below = labelled.filter((m) => m.label?.side === "below");
  const right = labelled.filter((m) => m.label?.side === "right");
  const beside = labelled.filter((m) => m.label?.side === "beside");
  const thinking = slide.mood && slide.bubbles?.length ? { mood: slide.mood, bubbles: slide.bubbles } : null;
  const dark = slide.shotTone === "dark";
  const lines = [...labelled.map((m) => `mark-${m.n}`), ...(slide.toBubble ? ["bubble"] : [])];
  // labels get their order across the whole screen, so they arrive one after another
  const labelOrder = new Map(labelled.map((m, i) => [m.n, i]));
  const labelProps = (m: Mark) => ({ mark: m, revealed, delayMs: T.label + (labelOrder.get(m.n) ?? 0) * T.labelStep });

  return (
    <Frame rows="single" tight>
      <Stagger className="grid gap-y-gap self-center">
        <Item className="grid gap-[1cqh]">
          <Headline size="headline" className={cn("max-w-none", slide.headlineMuted && "text-headline-pair")}>
            {slide.headline}
            {slide.headlineMuted ? (
              <>
                <br />
                <span className="text-fg-muted">{slide.headlineMuted}</span>
              </>
            ) : null}
          </Headline>
          {slide.subline ? <p className="text-lead text-fg-muted">{slide.subline}</p> : null}
        </Item>
        <div
          ref={wrapRef}
          className={cn(
            "relative grid gap-gap landscape:items-end",
            slide.shotHeight
              ? "landscape:grid-cols-[auto_minmax(0,27rem)] landscape:justify-start landscape:gap-x-[5cqw]"
              : "landscape:grid-cols-[minmax(0,1fr)_19rem]",
          )}
        >
          <Item className="grid min-w-0 gap-[2.4cqh]">
            {slide.pill ? (
              <p className="justify-self-start rounded-full bg-accent/10 px-[max(0.8rem,1.1cqw)] py-[max(0.35rem,0.5cqw)] text-small text-fg">
                {slide.pill}
              </p>
            ) : null}
            {above.length ? (
              <div className="grid gap-3 landscape:items-end">
                {above.map((m) => (
                  <MarkLabel key={m.n} {...labelProps(m)} />
                ))}
              </div>
            ) : null}

            {/* the screenshot, its outlines, the number badges on their corners, and labels beside it */}
            <div className="relative grid gap-3">
            <div
              className={cn("relative", Boolean(slide.shotHeight) && "landscape:h-(--shot-h) landscape:w-auto")}
              style={{ aspectRatio: String(slide.shot.width / slide.shot.height), ...(slide.shotHeight ? { "--shot-h": `${slide.shotHeight}cqh` } : {}) } as CSSProperties}
            >
              <div className="absolute inset-0 overflow-hidden rounded-xl border border-border bg-bg">
                <Image
                  src={slide.shot.src}
                  alt={slide.shot.alt}
                  width={slide.shot.width}
                  height={slide.shot.height}
                  sizes={mode === "thumb" ? "320px" : "60vw"}
                  loading={mode === "deck" ? "eager" : "lazy"}
                  className="absolute inset-0 size-full object-cover"
                />
                {slide.marks.map((m) => (
                  <span
                    key={m.n}
                    data-box={m.n}
                    aria-hidden="true"
                    className={cn(
                      "absolute rounded-md border-2 border-dashed",
                      dark ? "border-accent-bright" : "border-accent bg-accent/10",
                      reveal(revealed, "scale-[1.02]"),
                    )}
                    style={{ ...percentBox(m), ...delay(T.box) }}
                  />
                ))}
              </div>
              {slide.marks.map((m) => {
                if (m.badge === "none") return null;
                const place = badgePlacement[m.badge ?? "top-left"];
                return (
                <span key={m.n} aria-hidden="true" className={cn("absolute", place.className)} style={place.at(m)}>
                  <span className={cn("block", reveal(revealed, "scale-50"))} style={delay(T.badge)}>
                    <NumberBadge n={m.n} ring />
                  </span>
                </span>
                );
              })}
            </div>
            {beside.map((m) => (
              <MarkLabel key={m.n} {...labelProps(m)} />
            ))}
            </div>

            {/* labels below the image */}
            {below.length ? (
              <div className="grid gap-3 landscape:items-start">
                {below.map((m) => (
                  <MarkLabel key={m.n} {...labelProps(m)} />
                ))}
              </div>
            ) : null}
          </Item>

          {/* labels beside the image at the top, Maya's thoughts at the bottom */}
          {right.length || thinking ? (
            <Item className="flex min-w-0 flex-col justify-between gap-gap landscape:self-stretch">
              {right.length ? (
                <div className="grid justify-items-start gap-3">
                  {right.map((m) => (
                    <MarkLabel key={m.n} {...labelProps(m)} />
                  ))}
                </div>
              ) : (
                <span />
              )}
              {thinking ? (
                <div aria-hidden={!revealed} className={reveal(revealed, "translate-y-2")} style={delay(T.thoughts)}>
                  <Thoughts bubbles={thinking.bubbles} mood={thinking.mood} animated={animated} />
                </div>
              ) : null}
            </Item>
          ) : null}

          <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible portrait:hidden">
            {/* lines mount when the annotations reveal, so they draw themselves in each time */}
            {revealed
              ? lines.map((id, i) => {
                  const start = id === "bubble" ? T.bubbleLine : T.line + i * T.lineStep;
                  return (
                    <g key={id}>
                      <path
                        data-line={id}
                        pathLength={1}
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth={1.6}
                        className={animated ? "connector-line" : undefined}
                        style={animated ? { animationDelay: `${start}ms` } : undefined}
                      />
                      <polygon
                        data-head={id}
                        fill="var(--accent)"
                        className={animated ? "connector-head" : undefined}
                        style={animated ? { animationDelay: `${start + 460}ms` } : undefined}
                      />
                    </g>
                  );
                })
              : null}
          </svg>
        </div>
        {slide.note ? (
          <Item className="flex w-fit items-center gap-[max(0.75rem,1.1cqw)] rounded-full bg-accent/10 py-[max(0.6rem,0.8cqw)] pl-[max(0.6rem,0.8cqw)] pr-[max(1.2rem,1.8cqw)] text-body text-fg">
            <span className="grid size-[max(2.25rem,2.8cqw)] shrink-0 place-items-center rounded-full bg-accent text-accent-fg">
              <Icon name="star" className="size-[45%]" />
            </span>
            <p>{slide.note}</p>
          </Item>
        ) : null}
        {/* on landscape the source line sits at the bottom of the slide, level with the arrows, out of the content's way */}
        {slide.footnote ? (
          <Item className="landscape:absolute landscape:inset-x-0 landscape:bottom-[2.1rem] landscape:mx-auto landscape:max-w-measure landscape:px-pad">
            <p className="text-small text-fg-muted">{slide.footnote}</p>
          </Item>
        ) : null}
      </Stagger>
    </Frame>
  );
}

/** Where a number badge sits relative to its outline: a point on the outline, then a shift. */
const badgePlacement: Record<Exclude<NonNullable<Mark["badge"]>, "none">, { at: (m: Mark) => CSSProperties; className: string }> = {
  "top-left": { at: (m) => ({ left: `${m.box.x}%`, top: `${m.box.y}%` }), className: "-translate-x-1/2 -translate-y-1/2" },
  "top-right": { at: (m) => ({ left: `${m.box.x + m.box.w}%`, top: `${m.box.y}%` }), className: "-translate-x-1/2 -translate-y-1/2" },
  left: { at: (m) => ({ left: `${m.box.x}%`, top: `${m.box.y + m.box.h / 2}%` }), className: "-translate-x-1/2 -translate-y-1/2" },
  right: { at: (m) => ({ left: `${m.box.x + m.box.w}%`, top: `${m.box.y + m.box.h / 2}%` }), className: "translate-x-[35%] -translate-y-1/2" },
  below: { at: (m) => ({ left: `${m.box.x + m.box.w / 2}%`, top: `${m.box.y + m.box.h}%` }), className: "-translate-x-1/2 translate-y-[35%]" },
};

function percentBox(m: Mark): CSSProperties {
  return { left: `${m.box.x}%`, top: `${m.box.y}%`, width: `${m.box.w}%`, height: `${m.box.h}%` };
}

/** A label stacked in one grid cell with its siblings, placed horizontally by margin so it lines up with its outline. */
function MarkLabel({ mark, revealed, delayMs }: { mark: Mark; revealed: boolean; delayMs: number }) {
  const label = mark.label ?? { side: "below" as const, x: 0 };
  const end = label.anchor === "end";
  const stacked = label.side === "above" || label.side === "below";
  const beside = label.side === "beside";
  const vars: CSSProperties & Record<"--offset" | "--mid", string> = {
    "--offset": `${end ? 100 - label.x : label.x}%`,
    "--mid": `${mark.box.y + mark.box.h / 2}%`,
  };
  // each label slides in from the side its line comes from
  const from = { above: "-translate-y-1.5", below: "translate-y-1.5", right: "translate-x-2", beside: "translate-x-2" }[label.side];
  return (
    <p
      data-label={mark.n}
      aria-hidden={!revealed}
      style={{ ...vars, transitionDelay: revealed ? `${delayMs}ms` : "0ms" }}
      className={cn(
        reveal(revealed, from),
        "flex w-max max-w-full items-center gap-[max(0.6rem,0.75cqw)] rounded-lg border border-accent bg-bg px-[max(0.85rem,1cqw)] py-[max(0.55rem,0.7cqw)] text-small text-fg",
        stacked && "landscape:[grid-area:1/1]",
        beside && "landscape:absolute landscape:left-[calc(100%+3.2cqw)] landscape:top-(--mid) landscape:-translate-y-1/2",
        stacked && (end ? "landscape:mr-(--offset) landscape:justify-self-end" : "landscape:ml-(--offset) landscape:justify-self-start"),
      )}
    >
      <NumberBadge n={mark.n} />
      <span className="whitespace-pre-line">{mark.text}</span>
    </p>
  );
}

/** Lines from each label to its outline, plus one from an outline to Maya's bubble. Drawn imperatively. */
function useMarkConnectors(
  wrapRef: React.RefObject<HTMLDivElement | null>,
  svgRef: React.RefObject<SVGSVGElement | null>,
  slide: AnnotatedData,
  revealed: boolean,
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;
    const set = (id: string, pts: Point[] | null) => {
      const line = svg.querySelector(`[data-line="${id}"]`);
      const head = svg.querySelector(`[data-head="${id}"]`);
      line?.setAttribute("d", pts ? pathFrom(pts) : "");
      head?.setAttribute("points", pts ? arrowHead(pts) : "");
    };
    const find = (selector: string) => {
      const el = wrap.querySelector<HTMLElement>(selector);
      return el ? boxWithin(el, wrap) : null;
    };
    const draw = () => {
      for (const m of slide.marks) {
        if (!m.label || !m.text) continue;
        const box = find(`[data-box="${m.n}"]`);
        const label = find(`[data-label="${m.n}"]`);
        if (!box || !label) {
          set(`mark-${m.n}`, null);
          continue;
        }
        if (m.label.side === "beside") {
          // the label is centred on the outline's middle with a transform, which offset geometry ignores
          const y = box.top + box.height / 2;
          set(`mark-${m.n}`, [[label.left - 2, y], [box.left + box.width + 5, y]]);
          continue;
        }
        if (m.label.side === "right") {
          set(`mark-${m.n}`, [
            [label.left - 2, label.top + label.height / 2],
            [box.left + box.width + 5, box.top + box.height / 2],
          ]);
          continue;
        }
        // Vertical where the label and its outline overlap horizontally; otherwise slanted from the label's centre.
        const centre = label.left + label.width / 2;
        const lo = Math.max(label.left, box.left);
        const hi = Math.min(label.left + label.width, box.left + box.width);
        let from = centre;
        let to = Math.min(Math.max(centre, box.left + 16), box.left + box.width - 16);
        if (m.line !== "slanted" && hi - lo > 0) {
          from = to = hi - lo < 24 ? (lo + hi) / 2 : Math.min(Math.max(centre, lo + 12), hi - 12);
        }
        set(
          `mark-${m.n}`,
          m.label.side === "below"
            ? [[from, label.top], [to, box.top + box.height + 5]]
            : [[from, label.top + label.height], [to, box.top - 5]],
        );
      }
      if (slide.toBubble) {
        const box = find(`[data-box="${slide.toBubble.mark}"]`);
        const bubble = find(`[data-bubble="${slide.toBubble.target}"]`);
        set(
          "bubble",
          box && bubble
            ? [[box.left + box.width, box.top + box.height / 2], [bubble.left - 8, bubble.top + bubble.height / 2]]
            : null,
        );
      }
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(wrap);
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) draw();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [wrapRef, svgRef, slide, revealed]);
}
