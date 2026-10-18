"use client";

import { useState } from "react";
import { Shot } from "@/components/devices/Shot";
import { Bubbles, Eyebrow, Frame, Headline, Item, Stagger, WinCard } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";
import { cn } from "@/lib/cn";

type ProblemSlide = Extract<Slide, { type: "problem" }>;

/**
 * What Maya meets today. One screenshot with numbered callouts or highlight boxes and her
 * reaction beside it, or two screenshots with captions. Always ends on the quickest win.
 */
export function Problem({ slide }: { slide: ProblemSlide }) {
  /* A callout lights up while hovered, and stays lit once clicked (tap on touch). */
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const activeCallout = hovered ?? pinned;
  const pair = slide.shots.length > 1;

  if (pair) {
    return (
      <Frame rows="top-foot">
        <Stagger className="contents">
          <Item>
            <Eyebrow accent>{slide.eyebrow}</Eyebrow>
          </Item>
          <Item>
            <Headline size="headline">{slide.headline}</Headline>
          </Item>
          <Item className="grid gap-gap self-center landscape:grid-cols-2">
            {slide.shots.map((shot) => (
              <Shot key={shot.src} shot={shot} sizes="(orientation: landscape) 42vw, 100vw" />
            ))}
          </Item>
          <Item>
            <WinCard label={slide.win.label} text={slide.win.text} />
          </Item>
        </Stagger>
      </Frame>
    );
  }

  const shot = slide.shots[0];
  const toggle = (n: string) => setPinned((current) => (current === n ? null : n));
  return (
    <Frame rows="top">
      <Stagger className="contents">
        <Item className="grid gap-[1.2cqh]">
          <Eyebrow accent>{slide.eyebrow}</Eyebrow>
          <Headline size="headline">{slide.headline}</Headline>
        </Item>
        <div className="grid gap-gap landscape:grid-cols-12 landscape:items-center">
          <Item className="min-w-0 landscape:col-span-8">
            <Shot shot={shot} sizes="(orientation: landscape) 58vw, 100vw">
              {slide.callouts?.map((callout) => {
                const on = activeCallout === callout.n;
                return (
                  <button
                    key={callout.n}
                    type="button"
                    onClick={() => toggle(callout.n)}
                    onMouseEnter={() => setHovered(callout.n)}
                    onMouseLeave={() => setHovered(null)}
                    aria-pressed={pinned === callout.n}
                    aria-label={`${callout.n}: ${callout.text}`}
                    className="absolute grid size-tap -translate-x-1/2 -translate-y-1/2 place-items-center"
                    style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
                  >
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-full text-small font-semibold text-accent-fg ring-4 ring-bg/80 transition-transform duration-(--duration-fast) ease-out",
                        on ? "scale-110 bg-fg" : "bg-accent",
                      )}
                    >
                      {callout.n}
                    </span>
                  </button>
                );
              })}
              {slide.highlights?.map((box, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="absolute rounded-sm border-2 border-accent"
                  style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
                />
              ))}
            </Shot>
          </Item>

          <Item className="grid content-center gap-[2.4cqh] landscape:col-span-4 landscape:col-start-9">
            {slide.bubbles ? <Bubbles bubbles={slide.bubbles} mood={slide.mood ?? "worried"} /> : null}
            {slide.callouts ? (
              <ol className="grid gap-[1.2cqh]">
                {slide.callouts.map((callout) => {
                  const on = activeCallout === callout.n;
                  return (
                    <li key={callout.n}>
                      <button
                        type="button"
                        onClick={() => toggle(callout.n)}
                        onMouseEnter={() => setHovered(callout.n)}
                        onMouseLeave={() => setHovered(null)}
                        aria-pressed={pinned === callout.n}
                        className="flex w-full items-center gap-4 text-left"
                      >
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-full text-small font-semibold text-accent-fg transition-colors duration-(--duration-fast) ease-out",
                            on ? "bg-fg" : "bg-accent",
                          )}
                        >
                          {callout.n}
                        </span>
                        <span className="text-lead text-fg">{callout.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : null}
            {slide.points ? (
              <ul className="grid gap-[1.2cqh]">
                {slide.points.map((point) => (
                  <li key={point} className="flex items-center gap-4">
                    <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-lead text-fg">{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <WinCard label={slide.win.label} text={slide.win.text} />
          </Item>
        </div>
      </Stagger>
    </Frame>
  );
}
