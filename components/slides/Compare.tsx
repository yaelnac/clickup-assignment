"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useStage } from "@/components/deck/SlideStage";
import { DigestEmail } from "@/components/devices/DigestEmail";
import { InboxRow } from "@/components/devices/InboxRow";
import { MarkVisibility } from "@/components/devices/Marked";
import { Frame, Headline, Item, NumberBadge, Stagger } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";
import { cn } from "@/lib/cn";
import { arrowHead, boxWithin, pathFrom, type Point } from "@/lib/connectors";
import { useEntryDirection, useSlideSteps } from "@/lib/steps";

type CompareSlide = Extract<Slide, { type: "compare" }>;

/**
 * Two emails side by side: what ClickUp sends today and the proposal. Each side is a pill, the
 * inbox row and the email body. The emails sit on the outer edges with one lane between them;
 * each side's numbered labels appear in that lane, each one level with its own outline, with a
 * short straight arrow into it. The other email dims while one side is being explained.
 *
 * The annotations build in steps so the slide isn't overwhelming: first the two emails alone,
 * then the first side's outlines and labels, then only the second side's.
 */
export function Compare({ slide, forcedStep }: { slide: CompareSlide; forcedStep?: number }) {
  const { mode, active } = useStage();
  const animated = mode === "deck";
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const marks = slide.sides.flatMap((side, s) => side.labels.map((label) => ({ n: label.n, side: s })));

  const last = slide.sides.length;
  const entry = useEntryDirection();
  const [step, setStep] = useState(() => forcedStep ?? (entry === -1 ? last : 0));
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
    active && mode === "deck" && forcedStep === undefined,
  );
  /** Step 0 shows no annotations; step k shows side k - 1's. */
  const activeSide = step - 1;
  const shownMarks = marks.filter((m) => m.side === activeSide);
  const isShown = (n: string) => shownMarks.some((m) => m.n === n);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;
    const draw = () => {
      // Place every label (shown or not, so none jumps when it appears) level with its outline.
      for (const m of marks) {
        const boxEl = wrap.querySelector<HTMLElement>(`[data-mark-box="${m.n}"]`);
        const labelEl = wrap.querySelector<HTMLElement>(`[data-label="${m.n}"]`);
        const colEl = wrap.querySelector<HTMLElement>(`[data-labels="${m.side}"]`);
        const box = boxEl ? boxWithin(boxEl, wrap) : null;
        const col = colEl ? boxWithin(colEl, wrap) : null;
        if (!box || !col || !labelEl) continue;
        const h = labelEl.offsetHeight;
        const centre = box.top + box.height / 2 - col.top;
        labelEl.style.top = `${Math.max(0, Math.min(col.height - h, centre - h / 2))}px`;
      }
      for (const m of shownMarks) {
        const line = svg.querySelector(`[data-line="${m.n}"]`);
        const head = svg.querySelector(`[data-head="${m.n}"]`);
        const boxEl = wrap.querySelector<HTMLElement>(`[data-mark-box="${m.n}"]`);
        const colEl = wrap.querySelector<HTMLElement>(`[data-labels="${m.side}"]`);
        const box = boxEl ? boxWithin(boxEl, wrap) : null;
        const col = colEl ? boxWithin(colEl, wrap) : null;
        if (!box || !col) {
          line?.setAttribute("d", "");
          head?.setAttribute("points", "");
          continue;
        }
        const y = box.top + box.height / 2;
        // the first email is left of the lane, the second is right of it
        const pts: Point[] =
          m.side === 0
            ? [[col.left - 2, y], [box.left + box.width + 5, y]]
            : [[col.left + col.width + 2, y], [box.left - 5, y]];
        line?.setAttribute("d", pathFrom(pts));
        head?.setAttribute("points", arrowHead(pts, 8, 4));
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
    // marks derive from slide (static content) and the current step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, step]);

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
          {slide.subline ? <p className="text-small text-fg-muted">{slide.subline}</p> : null}
        </Item>

        <Item>
          <MarkVisibility.Provider value={isShown}>
          <div
            ref={wrapRef}
            className="relative grid gap-x-[1.1rem] gap-y-[0.6rem] landscape:grid-cols-[minmax(0,1fr)_12.75rem_minmax(0,1fr)] landscape:grid-rows-[auto_auto_auto]"
          >
            {slide.sides.map((side, s) => {
              // columns: email | label lane (shared, one side at a time) | email
              const col = s === 0 ? 1 : 3;
              const labelsCol = 2;
              const dim = cn(
                "transition-opacity duration-500 ease-out",
                activeSide !== -1 && activeSide !== s ? "opacity-40" : "opacity-100",
              );
              // grid placement applies on landscape only; on a phone everything stacks in source order
              const at = (column: number, row: string): CSSProperties => ({ "--c": String(column), "--r": row }) as CSSProperties;
              const placed = "landscape:col-(--c) landscape:row-(--r)";
              return (
                <Fragment key={side.pill}>
                  <p
                    className={cn(placed, dim, "justify-self-start rounded-full bg-accent/10 px-[max(0.8rem,1.1cqw)] py-[max(0.35rem,0.5cqw)] text-small text-fg")}
                    style={at(col, "1")}
                  >
                    {side.pill}
                  </p>
                  <div style={at(col, "2")} className={cn(placed, dim, "min-w-0")}>
                    <InboxRow inbox={side.inbox} />
                  </div>
                  <div style={at(col, "3")} className={cn(placed, dim, "min-w-0")}>
                    <DigestEmail email={side.email} />
                  </div>
                  <ol
                    data-labels={s}
                    aria-hidden={s !== activeSide}
                    className={cn(placed, "grid content-start gap-[0.45rem] portrait:mb-4 landscape:relative")}
                    style={at(labelsCol, "1 / span 3")}
                  >
                    {side.labels.map((label, i) => {
                      const shown = s === activeSide;
                      return (
                      <li
                        key={label.n}
                        data-label={label.n}
                        // labels slide in one after another toward their email; they leave with a quick fade
                        style={{ transitionDelay: shown ? `${300 + i * 90}ms` : "0ms" }}
                        className={cn(
                          "flex items-start gap-[max(0.5rem,0.7cqw)] rounded-lg border border-accent bg-bg px-[max(0.75rem,0.75cqw)] py-[max(0.55rem,0.8cqw)] text-small text-fg",
                          "landscape:absolute landscape:inset-x-0",
                          "transition-[opacity,translate,visibility] ease-out motion-reduce:translate-x-0",
                          shown
                            ? "visible translate-x-0 opacity-100 duration-[480ms]"
                            : cn("invisible opacity-0 duration-200", s === 0 ? "translate-x-3" : "-translate-x-3"),
                        )}
                      >
                        <NumberBadge n={label.n} />
                        <span className="pt-[0.1em]">{label.text}</span>
                      </li>
                      );
                    })}
                  </ol>
                </Fragment>
              );
            })}

            <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible portrait:hidden">
              {/* keyed by step so the lines draw again each time their side appears */}
              {shownMarks.map((m, i) => (
                <g key={`${m.n}-${step}`}>
                  <path
                    data-line={m.n}
                    pathLength={1}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={1.6}
                    className={animated ? "connector-line" : undefined}
                    style={animated ? { animationDelay: `${560 + i * 110}ms` } : undefined}
                  />
                  <polygon
                    data-head={m.n}
                    fill="var(--accent)"
                    className={animated ? "connector-head" : undefined}
                    style={animated ? { animationDelay: `${980 + i * 110}ms` } : undefined}
                  />
                </g>
              ))}
            </svg>
          </div>
          </MarkVisibility.Provider>
        </Item>
      </Stagger>
    </Frame>
  );
}
