"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import { SlideStage } from "@/components/deck/SlideStage";
import { SlideView } from "@/components/slides/SlideView";
import { chapterOf, type Slide } from "@/content/slides";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/deck";
import { STAGE_H as THUMB_H, STAGE_W as THUMB_W } from "@/lib/stage";

interface ThumbProps {
  slide: Slide;
  index: number;
  active: boolean;
  onClick: () => void;
  ref?: Ref<HTMLButtonElement>;
}

/** The real slide, rendered at 1600 x 900 and scaled down. Inert; the button is the control. */
export function Thumb({ slide, index, active, onClick, ref }: ThumbProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.15);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / THUMB_W));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="group relative grid gap-2">
      <div
        ref={boxRef}
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-md border transition-colors duration-(--duration-fast) ease-out",
          active ? "border-fg" : "border-border group-hover:border-border-strong",
        )}
      >
        <div
          aria-hidden="true"
          inert
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: THUMB_W, height: THUMB_H, transform: `scale(${scale})` }}
        >
          <SlideStage tone={chapterOf(slide).tone} mode="thumb" active={false} className="h-full w-full">
            <SlideView slide={slide} />
          </SlideStage>
        </div>
      </div>
      <span aria-hidden="true" className="flex gap-2 font-mono text-data text-fg-muted">
        <span className="text-fg">{pad2(index + 1)}</span>
        <span className="truncate">{slide.title}</span>
      </span>
      {/* The control: covers the thumbnail, carries the name, never wraps interactive content. */}
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-current={active ? "true" : undefined}
        aria-label={`Slide ${index + 1}: ${slide.title}`}
        className="absolute inset-0 rounded-md"
      />
    </div>
  );
}
