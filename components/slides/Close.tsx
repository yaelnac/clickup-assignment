"use client";

import { Frame, Headline, Item, Stagger } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";

type CloseSlide = Extract<Slide, { type: "close" }>;

/** What ships first, in order, and a closing line. */
export function Close({ slide }: { slide: CloseSlide }) {
  return (
    <Frame rows="mid">
      <Stagger className="contents">
        <span />
        <Item className="grid content-center gap-[3cqh]">
          <Headline size="headline">{slide.headline}</Headline>
          <ol className="grid divide-y divide-border border-y border-border">
            {slide.items.map((entry, n) => (
              <li key={entry.title} className="grid grid-cols-[2.5rem_1fr] gap-x-2 gap-y-1 py-[2.2cqh]">
                <span className="text-lead font-semibold text-accent">{n + 1}</span>
                <span className="text-lead font-semibold text-fg">{entry.title}</span>
                <span className="col-start-2 text-body text-fg-muted">{entry.note}</span>
              </li>
            ))}
          </ol>
          <p className="max-w-[70ch] text-body text-fg-muted">{slide.footer}</p>
        </Item>
        <span />
      </Stagger>
    </Frame>
  );
}
