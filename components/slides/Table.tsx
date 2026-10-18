"use client";

import { Frame, Headline, Item, Stagger } from "@/components/slides/primitives";
import { cn } from "@/lib/cn";
import type { Slide } from "@/content/slides";

type TableSlide = Extract<Slide, { type: "table" }>;

/** A headline and a ruled table. */
export function Table({ slide }: { slide: TableSlide }) {
  return (
    <Frame rows="mid">
      <Stagger className="contents">
        <span />
        <Item className="grid content-center gap-[3cqh]">
          <Headline size="headline">{slide.headline}</Headline>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                {slide.columns.map((column, i) => (
                  <th key={column} scope="col" className={cn("py-3 pr-4 text-small font-normal text-fg-muted", i === 0 ? "w-1/2" : "w-1/4")}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slide.rows.map((row) => (
                <tr key={row[0]} className="border-b border-border">
                  {row.map((cell, i) => (
                    <td key={cell} className={cn("py-[2.2cqh] pr-4 text-lead", i === 2 ? "text-fg-muted" : "text-fg")}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Item>
        <span />
      </Stagger>
    </Frame>
  );
}
