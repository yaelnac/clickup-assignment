"use client";

import { AppMock } from "@/components/devices/AppMock";
import { BrowserFrame } from "@/components/devices/BrowserFrame";
import { Bubbles, Eyebrow, Frame, Headline, Item, Labelled, Stagger } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";

type ScreenSlide = Extract<Slide, { type: "screen" }>;

/** The proposed in-app screen: headline, Maya's reaction and who / when on the left, the mock on the right. */
export function Screen({ slide }: { slide: ScreenSlide }) {
  return (
    <Frame rows="top">
      <Stagger className="contents">
        <Item>
          <Eyebrow accent>{slide.eyebrow}</Eyebrow>
        </Item>
        <div className="grid gap-gap landscape:grid-cols-12 landscape:items-center">
          <Item className="grid content-start gap-[2.2cqh] landscape:col-span-4">
            <Headline size="headline">{slide.headline}</Headline>
            <Bubbles bubbles={[slide.bubble]} mood={slide.mood} />
            <dl className="grid gap-[1.6cqh]">
              {slide.facts.map((fact) => (
                <Labelled key={fact.label} label={fact.label} valueClassName="text-body">
                  {fact.value}
                </Labelled>
              ))}
            </dl>
          </Item>
          <Item className="min-w-0 landscape:col-span-8 landscape:col-start-5">
            <BrowserFrame badge={slide.tag} aspectClassName="aspect-[4/5] landscape:aspect-[16/10]" label={slide.screen.title ?? slide.screen.heading}>
              <AppMock spec={slide.screen} />
            </BrowserFrame>
          </Item>
        </div>
      </Stagger>
    </Frame>
  );
}
