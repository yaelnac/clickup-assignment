"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Bubble, Mood } from "@/content/slides";
import { useStage } from "@/components/deck/SlideStage";
import { cn } from "@/lib/cn";
import { item, staggerContainer } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* Frame: the shared grid every slide sits in                          */
/* ------------------------------------------------------------------ */

interface FrameProps {
  children: ReactNode;
  className?: string;
  /** Row template. Slides of one type share one so nothing jumps between them. */
  rows?: "single" | "top" | "mid" | "top-foot";
}

const rowTemplates = {
  /** One block, centred vertically. */
  single: "grid-rows-[1fr]",
  top: "grid-rows-[auto_1fr]",
  mid: "grid-rows-[auto_1fr_auto]",
  "top-foot": "grid-rows-[auto_auto_1fr_auto]",
} as const;

/**
 * The slide's content area: a centred measure with the deck's margins. When content is
 * shorter than the stage the rows fill it; when it is taller the slide scrolls internally.
 * Rows are never allowed to shrink below their content, so nothing can overlap.
 */
export function Frame({ children, className, rows = "top" }: FrameProps) {
  return (
    <div className="h-full w-full overflow-y-auto overscroll-contain">
      <div
        className={cn(
          "mx-auto grid min-h-full w-full max-w-measure gap-y-gap px-pad pb-pad-y pt-pad-y portrait:pb-[calc(var(--bar-h)+2rem)]",
          rowTemplates[rows],
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger: children arrive in sequence on the active slide            */
/* ------------------------------------------------------------------ */

interface StaggerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "dl" | "section";
}

export function Stagger({ children, className, as = "div" }: StaggerProps) {
  const { mode } = useStage();
  const Tag = motion[as];
  return (
    <Tag className={className} variants={staggerContainer} initial={mode === "deck" ? "hidden" : false} animate="show">
      {children}
    </Tag>
  );
}

interface ItemProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "p" | "h1" | "h2" | "figure" | "dl" | "dd" | "dt" | "ol" | "ul" | "section";
}

export function Item({ children, className, as = "div" }: ItemProps) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Type                                                                */
/* ------------------------------------------------------------------ */

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  /** The one accent on slides that have no other call-to-attention. */
  accent?: boolean;
}

export function Eyebrow({ children, className, accent = false }: EyebrowProps) {
  if (!children) return null;
  return (
    <p className={cn("flex items-center gap-3 font-mono text-label uppercase text-fg-muted", className)}>
      {accent ? <span aria-hidden="true" className="size-2 rounded-sm bg-accent" /> : null}
      <span>{children}</span>
    </p>
  );
}

interface HeadlineProps {
  children: ReactNode;
  size?: "display" | "headline" | "statement";
  className?: string;
  id?: string;
}

const headlineSizes = {
  display: "text-display max-w-[20ch]",
  headline: "text-headline max-w-[26ch]",
  statement: "text-statement max-w-[32ch]",
} as const;

/** The slide's single idea. Always the h1 of its slide. */
export function Headline({ children, size = "headline", className, id }: HeadlineProps) {
  return (
    <h1 id={id} className={cn("text-balance", headlineSizes[size], className)}>
      {children}
    </h1>
  );
}

export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("max-w-[52ch] text-body text-fg-muted", className)}>{children}</p>;
}

export function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("font-mono text-data text-fg-muted", className)}>{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Labelled: a compact mono label over a value, inside a dl            */
/* ------------------------------------------------------------------ */

interface LabelledProps {
  label: string;
  children: ReactNode;
  className?: string;
  valueClassName?: string;
}

export function Labelled({ label, children, className, valueClassName }: LabelledProps) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <dt className="font-mono text-label uppercase text-fg-muted">{label}</dt>
      <dd className={cn("text-small text-fg", valueClassName)}>{children}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Maya: avatar, speech bubbles, and the "quickest win" card            */
/* ------------------------------------------------------------------ */

const avatarSizes = { sm: "size-10", md: "size-12", card: "size-[6cqw] min-h-14 min-w-14", lg: "size-[10cqw] min-h-28 min-w-28" } as const;

export function Avatar({ mood = "happy", size = "md", className }: { mood?: Mood; size?: keyof typeof avatarSizes; className?: string }) {
  const px = size === "lg" ? 320 : size === "card" ? 160 : 96;
  return (
    <Image
      src={`/maya/${mood}.png`}
      alt=""
      width={px}
      height={px}
      className={cn("shrink-0 rounded-full", avatarSizes[size], className)}
    />
  );
}

/** Maya's avatar once, then one rounded bubble per thought. */
export function Bubbles({ bubbles, mood = "worried", className }: { bubbles: readonly Bubble[]; mood?: Mood; className?: string }) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Avatar mood={mood} />
      <div className="grid min-w-0 gap-2">
        {bubbles.map((bubble) => (
          <p key={bubble.text} className="w-fit max-w-[30ch] rounded-2xl rounded-tl-md bg-surface px-[1.1cqw] py-[0.8cqw] text-body text-fg">
            {bubble.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export function WinCard({ label, text, className }: { label: string; text: string; className?: string }) {
  return (
    <div className={cn("grid gap-2 rounded-lg border border-border bg-surface px-[1.4cqw] py-[1.2cqw]", className)}>
      <p className="text-small font-medium text-accent">{label}</p>
      <p className="text-lead text-fg">{text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Placeholder: tinted, hairlined, labelled, with crop marks            */
/* ------------------------------------------------------------------ */

interface PlaceholderProps {
  label: string;
  /** width / height */
  ratio: number;
  className?: string;
}

/** Where a screenshot will go: tinted, hairlined, labelled, with crop marks. */
export function Placeholder({ label, ratio, className }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative grid w-full place-items-center overflow-hidden rounded-lg border border-border bg-surface-2 p-4 text-center",
        className,
      )}
      style={{
        aspectRatio: String(ratio),
        backgroundImage: "radial-gradient(var(--border-strong) 0.75px, transparent 0.75px)",
        backgroundSize: "1.5cqw 1.5cqw",
      }}
    >
      <CropMarks />
      <span className="max-w-full truncate rounded-sm border border-border bg-bg px-3 py-2 font-mono text-data text-fg-muted">{label}</span>
    </div>
  );
}

function CropMarks() {
  const mark = "absolute size-4 border-border-strong";
  return (
    <span aria-hidden="true">
      <span className={cn(mark, "left-2 top-2 border-l border-t")} />
      <span className={cn(mark, "right-2 top-2 border-r border-t")} />
      <span className={cn(mark, "bottom-2 left-2 border-b border-l")} />
      <span className={cn(mark, "bottom-2 right-2 border-b border-r")} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Ruled list rows                                                     */
/* ------------------------------------------------------------------ */

export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-border", className)} />;
}
