"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useStage } from "@/components/deck/SlideStage";
import { Frame, Headline, Item, Stagger } from "@/components/slides/primitives";
import { Thoughts } from "@/components/slides/Thoughts";
import type { Mark, Slide } from "@/content/slides";
import { cn } from "@/lib/cn";
import { arrowHead, boxWithin, pathFrom, type Point } from "@/lib/connectors";

type AnnotatedSlide = Extract<Slide, { type: "annotated" }>;

/**
 * A real screenshot with numbered outlines. Each outline has a label above or below the image,
 * joined by a line, and one outline also points at Maya's thought on the right.
 */
export function Annotated({ slide }: { slide: AnnotatedSlide }) {
  const { mode } = useStage();
  const animated = mode === "deck";
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  useMarkConnectors(wrapRef, svgRef, slide);

  const above = slide.marks.filter((m) => m.label.side === "above");
  const below = slide.marks.filter((m) => m.label.side === "below");
  const right = slide.marks.filter((m) => m.label.side === "right");
  const lines = [...slide.marks.map((m) => `mark-${m.n}`), ...(slide.toBubble ? ["bubble"] : [])];

  return (
    <Frame rows="top">
      <Stagger className="contents">
        <Item>
          <Headline size="headline" className="max-w-none">
            {slide.headline}
          </Headline>
        </Item>
        <div ref={wrapRef} className="relative grid gap-gap self-start landscape:grid-cols-12 landscape:items-end">
          <Item className="grid min-w-0 gap-[2.4cqh] landscape:col-span-8">
            {above.length ? (
              <div className="grid gap-3 landscape:items-end">
                {above.map((m) => (
                  <MarkLabel key={m.n} mark={m} />
                ))}
              </div>
            ) : null}

            {/* the screenshot, its outlines, and the number badges on their corners */}
            <div className="relative" style={{ aspectRatio: String(slide.shot.width / slide.shot.height) }}>
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
                    className="absolute rounded-md border-2 border-dashed border-accent bg-accent/10"
                    style={percentBox(m)}
                  />
                ))}
              </div>
              {slide.marks.map((m) => (
                <span
                  key={m.n}
                  aria-hidden="true"
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${m.box.x}%`, top: `${m.box.y}%` }}
                >
                  <Badge n={m.n} ring />
                </span>
              ))}
            </div>

            {/* labels below the image */}
            {below.length ? (
              <div className="grid gap-3 landscape:items-start">
                {below.map((m) => (
                  <MarkLabel key={m.n} mark={m} />
                ))}
              </div>
            ) : null}
          </Item>

          {/* labels beside the image at the top, Maya's thoughts at the bottom */}
          <Item className="flex min-w-0 flex-col justify-between gap-gap landscape:col-span-4 landscape:self-stretch">
            {right.length ? (
              <div className="grid justify-items-start gap-3">
                {right.map((m) => (
                  <MarkLabel key={m.n} mark={m} />
                ))}
              </div>
            ) : (
              <span />
            )}
            <Thoughts bubbles={slide.bubbles} mood={slide.mood} animated={animated} />
          </Item>

          <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible portrait:hidden">
            {lines.map((id, i) => (
              <g key={id}>
                <path
                  data-line={id}
                  pathLength={1}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.6}
                  className={animated ? "connector-line" : undefined}
                  style={animated ? { animationDelay: `${260 + i * 110}ms` } : undefined}
                />
                <polygon
                  data-head={id}
                  fill="var(--accent)"
                  className={animated ? "connector-head" : undefined}
                  style={animated ? { animationDelay: `${720 + i * 110}ms` } : undefined}
                />
              </g>
            ))}
          </svg>
        </div>
      </Stagger>
    </Frame>
  );
}

function percentBox(m: Mark): CSSProperties {
  return { left: `${m.box.x}%`, top: `${m.box.y}%`, width: `${m.box.w}%`, height: `${m.box.h}%` };
}

function Badge({ n, ring = false }: { n: string; ring?: boolean }): ReactNode {
  return (
    <span
      className={cn(
        "grid size-[max(1.5rem,1.75cqw)] shrink-0 place-items-center rounded-full bg-accent text-small font-semibold text-accent-fg",
        ring && "ring-2 ring-bg",
      )}
    >
      {n}
    </span>
  );
}

/** A label stacked in one grid cell with its siblings, placed horizontally by margin so it lines up with its outline. */
function MarkLabel({ mark }: { mark: Mark }) {
  const end = mark.label.anchor === "end";
  const stacked = mark.label.side !== "right";
  const vars: CSSProperties & Record<"--offset" | "--measure", string> = {
    "--offset": `${end ? 100 - mark.label.x : mark.label.x}%`,
    "--measure": `${mark.label.width ?? 20}ch`,
  };
  return (
    <p
      data-label={mark.n}
      style={vars}
      className={cn(
        "flex w-fit items-center gap-[max(0.6rem,0.8cqw)] rounded-lg border border-accent bg-bg px-[max(0.9rem,1.1cqw)] py-[max(0.55rem,0.75cqw)] text-body text-fg",
        stacked && "landscape:[grid-area:1/1]",
        stacked && (end ? "landscape:mr-(--offset) landscape:justify-self-end" : "landscape:ml-(--offset) landscape:justify-self-start"),
      )}
    >
      <Badge n={mark.n} />
      <span className="max-w-(--measure)">{mark.text}</span>
    </p>
  );
}

/** Lines from each label to its outline, plus one from an outline to Maya's bubble. Drawn imperatively. */
function useMarkConnectors(
  wrapRef: React.RefObject<HTMLDivElement | null>,
  svgRef: React.RefObject<SVGSVGElement | null>,
  slide: AnnotatedSlide,
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
        const box = find(`[data-box="${m.n}"]`);
        const label = find(`[data-label="${m.n}"]`);
        if (!box || !label) {
          set(`mark-${m.n}`, null);
          continue;
        }
        if (m.label.side === "right") {
          set(`mark-${m.n}`, [
            [label.left - 2, label.top + label.height / 2],
            [box.left + box.width + 5, box.top + box.height / 2],
          ]);
          continue;
        }
        const x = Math.min(Math.max(label.left + label.width / 2, box.left + 16), box.left + box.width - 16);
        set(
          `mark-${m.n}`,
          m.label.side === "below"
            ? [[x, label.top], [x, box.top + box.height + 5]]
            : [[x, label.top + label.height], [x, box.top - 5]],
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
  }, [wrapRef, svgRef, slide]);
}
