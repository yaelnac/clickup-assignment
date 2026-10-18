"use client";

import { KeyLegend } from "@/components/deck/KeyLegend";
import { useStage } from "@/components/deck/SlideStage";
import { Frame, Headline, Item, Stagger } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";

type CoverSlide = Extract<Slide, { type: "cover" }>;

/** Headline and subline in the middle; one footer row with the byline and, in the deck, the keyboard legend. */
export function Cover({ slide }: { slide: CoverSlide }) {
  const { mode } = useStage();
  return (
    <Frame rows="mid">
      <Stagger className="contents">
        <span />
        <Item className="grid content-center gap-gap">
          <Headline size="display" className="max-w-[18ch]">
            {slide.headline}
          </Headline>
          <p className="max-w-[60ch] text-lead text-fg-muted">{slide.subline}</p>
        </Item>
        <Item className="flex flex-wrap items-center justify-between gap-x-gap gap-y-4 border-t border-border pt-[2.2cqh]">
          <p className="text-small text-fg-muted">
            <span className="text-fg">{slide.byline}</span>
          </p>
          {mode === "deck" ? <KeyLegend /> : null}
        </Item>
      </Stagger>
    </Frame>
  );
}
