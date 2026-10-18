"use client";

import { EmailFrame } from "@/components/devices/EmailFrame";
import { Eyebrow, Frame, Headline, Item, Labelled, Stagger } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";

type EmailSlide = Extract<Slide, { type: "email" }>;

/** The proposed email: headline and who / when on the left, the message on the right. */
export function Email({ slide }: { slide: EmailSlide }) {
  return (
    <Frame rows="top">
      <Stagger className="contents">
        <Item>
          <Eyebrow accent>{slide.eyebrow}</Eyebrow>
        </Item>
        <div className="grid gap-gap landscape:grid-cols-12 landscape:items-center">
          <Item className="grid content-start gap-[2.2cqh] landscape:col-span-4">
            <Headline size="headline">{slide.headline}</Headline>
            <dl className="grid gap-[1.6cqh]">
              {slide.facts.map((fact) => (
                <Labelled key={fact.label} label={fact.label} valueClassName="text-body">
                  {fact.value}
                </Labelled>
              ))}
            </dl>
          </Item>
          <Item className="min-w-0 landscape:col-span-8 landscape:col-start-5">
            <EmailFrame email={slide.email} tag={slide.tag} />
          </Item>
        </div>
      </Stagger>
    </Frame>
  );
}
