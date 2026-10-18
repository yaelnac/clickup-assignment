"use client";

import { Avatar, Frame, Headline, Item, Stagger } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";

type AssumptionsSlide = Extract<Slide, { type: "assumptions" }>;

/** Two-line headline, then four cards in a row joined by arrows: Maya's face, the label, the assumption, what it leads to. */
export function Assumptions({ slide }: { slide: AssumptionsSlide }) {
  return (
    <Frame rows="mid">
      <Stagger className="contents">
        <span />
        <div className="grid content-center gap-[5cqh]">
          <Item>
            <Headline size="headline" className="max-w-none">
              {slide.headline}
              <br />
              <span className="text-accent">{slide.headlineMuted}</span>
            </Headline>
          </Item>
          <Item as="ol" className="grid gap-gap-sm landscape:grid-cols-4 landscape:gap-x-[1.6cqw]">
            {slide.rows.map((row, i) => (
              <li key={row.label} className="relative flex flex-col gap-[2.4cqh] rounded-xl border border-border bg-surface p-[1.1cqw]">
                <div className="flex items-start justify-between gap-3">
                  <Avatar mood={row.mood} size="card" />
                  <span className="rounded-full bg-accent/10 px-[1cqw] py-[0.45cqw] text-small text-fg">{row.label}</span>
                </div>
                <p className="flex-1 text-body text-fg">{row.text}</p>
                <p className="flex items-baseline gap-1 rounded-md bg-accent/10 px-[0.6cqw] py-[0.8cqw] text-body text-fg">
                  <span aria-hidden="true" className="text-small">→</span>
                  <span className="landscape:whitespace-nowrap">{row.leadsTo}</span>
                </p>
                {i < slide.rows.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-full top-1/2 hidden w-[1.6cqw] -translate-y-1/2 text-center text-body text-accent/50 landscape:block"
                  >
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </Item>
        </div>
        <span />
      </Stagger>
    </Frame>
  );
}
