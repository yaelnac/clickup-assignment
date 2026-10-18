"use client";

import { Frame, Headline, Item, Stagger } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";

type LeadSlide = Extract<Slide, { type: "lead" }>;

/** A statement whose last words carry the accent, with its three reasons right under it as soft cards. */
export function Lead({ slide }: { slide: LeadSlide }) {
  return (
    <Frame rows="mid">
      <Stagger className="contents">
        <span />
        <div className="grid content-center gap-[4.5cqh]">
          <Item>
            <Headline size="headline" className="max-w-[26ch]">
              {slide.headline}
              <br />
              <span className="text-accent">{slide.highlight}</span>
            </Headline>
          </Item>
          <Item as="dl" className="grid gap-gap-sm landscape:grid-cols-3">
            {slide.columns.map((column, i) => (
              <div key={column.label} className="grid content-start gap-[1.2cqh] rounded-lg bg-surface px-[1.6cqw] py-[2.2cqh]">
                <dt className="flex items-center gap-3 text-small text-fg-muted">
                  <span className="font-mono text-data text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {column.label}
                </dt>
                <dd className="max-w-[26ch] text-lead text-fg">{column.text}</dd>
              </div>
            ))}
          </Item>
        </div>
        <span />
      </Stagger>
    </Frame>
  );
}
