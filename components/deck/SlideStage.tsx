"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import type { Tone } from "@/content/slides";
import { cn } from "@/lib/cn";

export type StageMode = "deck" | "thumb" | "print";

interface StageContextValue {
  mode: StageMode;
  /** True only for the slide the visitor is looking at. */
  active: boolean;
}

const StageContext = createContext<StageContextValue>({ mode: "deck", active: true });

export function useStage(): StageContextValue {
  return useContext(StageContext);
}

interface SlideStageProps {
  tone: Tone;
  mode: StageMode;
  active?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * A size container with its own tone. Everything inside sizes itself from the stage,
 * so the same slide renders full-screen, as a thumbnail, and as a print page.
 */
export function SlideStage({ tone, mode, active = false, className, style, children }: SlideStageProps) {
  return (
    <StageContext.Provider value={{ mode, active }}>
      <div data-tone={tone} className={cn("stage relative overflow-hidden bg-bg text-fg", className)} style={style}>
        {children}
      </div>
    </StageContext.Provider>
  );
}
