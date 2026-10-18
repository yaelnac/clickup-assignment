"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Frame, Headline, Item, Stagger } from "@/components/slides/primitives";
import type { Slide } from "@/content/slides";

type ThoughtSlide = Extract<Slide, { type: "thought" }>;

/**
 * A chapter opener: headline, one quiet line, then Maya thinking out loud. The bubble and the
 * two dots that join it to her are positioned in multiples of the avatar size, so the group
 * keeps its proportions at every scale.
 */
export function Thought({ slide }: { slide: ThoughtSlide }) {
  const s = (k: number) => `calc(var(--s) * ${k})`;
  const group: CSSProperties & Record<"--s", string> = {
    "--s": "max(6rem, min(11cqw, 24cqh))",
    paddingTop: s(0.3),
  };
  return (
    <Frame rows="mid">
      <Stagger className="contents">
        <span />
        <div className="grid content-center gap-[5.5cqh]">
          <Item className="grid gap-[1.6cqh]">
            <Headline size="headline">{slide.headline}</Headline>
            <p className="max-w-[60ch] text-lead text-fg-muted">{slide.subline}</p>
          </Item>
          <Item>
            <div className="relative" style={group}>
              <Image
                src={`/maya/${slide.mood}.png`}
                alt="Maya"
                width={512}
                height={512}
                sizes="240px"
                className="rounded-full"
                style={{ width: s(1), height: s(1) }}
              />
              <span aria-hidden="true" className="absolute rounded-full bg-accent/10" style={{ left: s(1), top: s(0.51), width: s(0.093), height: s(0.093) }} />
              <span aria-hidden="true" className="absolute rounded-full bg-accent/10" style={{ left: s(1.13), top: s(0.335), width: s(0.14), height: s(0.14) }} />
              <p
                className="absolute top-0 w-max rounded-[2rem] bg-accent/10 px-[max(1rem,1.8cqw)] py-[max(0.6rem,1.2cqw)] text-lead text-fg"
                style={{ left: s(1.31), maxWidth: `calc(100cqw - 2 * var(--pad) - ${s(1.31)})` }}
              >
                {slide.thought}
              </p>
            </div>
          </Item>
        </div>
        <span />
      </Stagger>
    </Frame>
  );
}
