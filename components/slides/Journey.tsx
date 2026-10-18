"use client";

import { Frame, Headline, Item, Stagger } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";

type JourneySlide = Extract<Slide, { type: "journey" }>;

/** Five states across, with the message that fires at each, what we show, and what AI does. */
export function Journey({ slide }: { slide: JourneySlide }) {
  const rows = [
    { key: "show" as const, label: slide.rowLabels.show, cell: "rounded-md border border-border bg-bg px-[1cqw] py-[1.4cqh] text-body text-fg" },
    { key: "ai" as const, label: slide.rowLabels.ai, cell: "rounded-md bg-surface px-[1cqw] py-[1.4cqh] text-body text-fg" },
  ];
  return (
    <Frame rows="mid">
      <Stagger className="contents">
        <span />
        <Item className="grid content-center gap-[3cqh]">
          <Headline size="headline" className="max-w-none">
            {slide.headline}
          </Headline>
          <div className="hidden grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-x-gap-sm gap-y-3 landscape:grid">
            <span />
            {slide.steps.map((step) => (
              <span key={step.state} className="text-small font-medium text-accent">
                {step.message ?? ""}
              </span>
            ))}
            <span />
            {slide.steps.map((step) => (
              <span key={step.state} className="rounded-md bg-fg px-[1cqw] py-[1.6cqh] text-lead font-semibold text-bg">
                {step.state}
              </span>
            ))}
            {rows.map((row) => (
              <div key={row.key} className="contents">
                <span className="self-center pr-[1cqw] text-small text-fg-muted">{row.label}</span>
                {slide.steps.map((step) => (
                  <span key={step.state} className={row.cell}>
                    {step[row.key]}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <ol className="grid gap-gap landscape:hidden">
            {slide.steps.map((step) => (
              <li key={step.state} className="grid gap-1.5 border-t border-border pt-4">
                {step.message ? <span className="text-small font-medium text-accent">{step.message}</span> : null}
                <span className="text-lead font-semibold text-fg">{step.state}</span>
                <span className="text-body text-fg">{step.show}</span>
                <span className="text-body text-fg-muted">
                  {slide.rowLabels.ai}: {step.ai}
                </span>
              </li>
            ))}
          </ol>
        </Item>
        <span />
      </Stagger>
    </Frame>
  );
}
