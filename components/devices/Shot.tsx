"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useStage } from "@/components/deck/SlideStage";
import type { Shot as ShotSpec } from "@/content/slides";
import { cn } from "@/lib/cn";

interface ShotProps {
  shot: ShotSpec;
  sizes?: string;
  className?: string;
  /** Overlays (callouts, highlights) positioned over the image. */
  children?: ReactNode;
  caption?: ReactNode;
}

/** A real screenshot at its own ratio, in a rounded hairline frame, with an optional caption. */
export function Shot({ shot, sizes = "60vw", className, children, caption }: ShotProps) {
  const { mode } = useStage();
  return (
    <figure className={cn("grid min-w-0 gap-3", className)}>
      <div className="relative overflow-hidden rounded-lg border border-border bg-surface" style={{ aspectRatio: String(shot.width / shot.height) }}>
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          sizes={mode === "thumb" ? "320px" : sizes}
          loading={mode === "deck" ? "eager" : "lazy"}
          className="absolute inset-0 size-full object-cover"
        />
        {children}
      </div>
      {caption ?? (shot.caption ? <figcaption className="text-body text-fg">{shot.caption}</figcaption> : null)}
    </figure>
  );
}
