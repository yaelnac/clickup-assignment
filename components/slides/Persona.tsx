"use client";

import Image from "next/image";
import { Frame, Headline, Item, Stagger } from "@/components/slides/primitives";
import { Icon } from "@/components/ui/Icon";
import type { Slide } from "@/content/slides";

type PersonaSlide = Extract<Slide, { type: "persona" }>;

/** Maya's profile card on the left (portrait, role, chips, her quote); five facts with icons on the right. */
export function Persona({ slide }: { slide: PersonaSlide }) {
  return (
    <Frame rows="mid">
      <Stagger className="contents">
        <span />
        <div className="grid content-center gap-[4.5cqh]">
          <Item>
            <Headline size="headline">{slide.headline}</Headline>
          </Item>
          <div className="grid items-center gap-gap landscape:grid-cols-12">
            <Item className="grid gap-[2.4cqh] rounded-xl border border-border bg-surface p-[2.2cqw] landscape:col-span-5">
              <div className="flex items-center gap-[1.4cqw]">
                <Image
                  src={slide.portrait.src}
                  alt={slide.portrait.alt}
                  width={slide.portrait.width}
                  height={slide.portrait.height}
                  sizes="200px"
                  className="size-[7.5cqw] min-h-20 min-w-20 rounded-full"
                />
                <div className="grid gap-1">
                  <p className="text-statement text-fg">{slide.name}</p>
                  <p className="text-lead text-fg-muted">{slide.role}</p>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2">
                {slide.chips.map((chip) => (
                  <li key={chip} className="rounded-full bg-accent/10 px-[1cqw] py-[0.5cqw] text-small text-fg">
                    {chip}
                  </li>
                ))}
              </ul>
              <p className="rounded-lg bg-accent/10 px-[1.4cqw] py-[1.2cqw] text-lead text-fg">{slide.quote}</p>
            </Item>

            <Item as="dl" className="grid gap-[6cqh] landscape:col-span-6 landscape:col-start-7">
              {slide.facts.map((fact) => (
                <div key={fact.label} className="flex items-center gap-[1.4cqw]">
                  <span className="grid size-[3.6cqw] min-h-11 min-w-11 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                    <Icon name={fact.icon} className="size-[45%]" />
                  </span>
                  <div className="grid gap-[0.6cqh]">
                    <dt className="text-small text-fg-muted">{fact.label}</dt>
                    <dd className="text-lead text-fg">{fact.value}</dd>
                  </div>
                </div>
              ))}
            </Item>
          </div>
        </div>
        <span />
      </Stagger>
    </Frame>
  );
}
