"use client";

import { Frame, Headline, Item, Stagger } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";

type FlowSlide = Extract<Slide, { type: "flow" }>;

/** Four steps in a row, joined by arrows, and one line on the holdout. */
export function Flow({ slide }: { slide: FlowSlide }) {
  return (
    <Frame rows="mid">
      <Stagger className="contents">
        <span />
        <Item className="grid content-center gap-[3cqh]">
          <Headline size="headline" className="max-w-[30ch]">
            {slide.headline}
          </Headline>
          <ol className="grid gap-gap-sm landscape:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] landscape:items-stretch">
            {slide.steps.map((step, i) => (
              <li key={step.label} className="contents">
                <div className="grid content-start gap-2 rounded-lg border border-border bg-surface px-[1.4cqw] py-[2cqh]">
                  <span className="text-statement text-fg">{step.label}</span>
                  <span className="text-body text-fg-muted">{step.body}</span>
                </div>
                {i < slide.steps.length - 1 ? (
                  <span aria-hidden="true" className="hidden items-center px-1 text-lead text-border-strong landscape:flex">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="max-w-[64ch] text-body text-fg-muted">{slide.note}</p>
        </Item>
        <span />
      </Stagger>
    </Frame>
  );
}
