"use client";

import { useIsPresent } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

/** A slide with internal steps (builds). `next`/`prev` return true when they consumed the move. */
export interface StepHandler {
  next: () => boolean;
  prev: () => boolean;
}

export interface StepsApi {
  /** Registers the active slide's handler. The returned function clears it only if it is still the current one. */
  register: (handler: StepHandler) => () => void;
  /** Sets the short step label shown in the chrome, e.g. "2 of 8". `null` clears it if `owner` set it. */
  setLabel: (owner: symbol, label: string | null) => void;
  /** Direction the visitor arrived from: 1 forward, -1 backward. */
  direction: 1 | -1;
}

export const StepsContext = createContext<StepsApi | null>(null);

/**
 * Lets the active slide intercept Next / Previous (keys, buttons, swipe) while it still has
 * steps to show, the way Keynote walks through builds before leaving a slide. A slide that is
 * animating out stops intercepting immediately.
 */
export function useSlideSteps(handler: StepHandler, enabled: boolean): void {
  const api = useContext(StepsContext);
  const isPresent = useIsPresent();
  const ref = useRef<StepHandler>(handler);
  useEffect(() => {
    ref.current = handler;
  });
  const on = enabled && isPresent;
  useEffect(() => {
    if (!api || !on) return;
    return api.register({ next: () => ref.current.next(), prev: () => ref.current.prev() });
  }, [api, on]);
}

/** Shows `label` next to the chapter name in the chrome while this slide is the active one. */
export function useStepLabel(label: string, enabled: boolean): void {
  const api = useContext(StepsContext);
  const isPresent = useIsPresent();
  const [owner] = useState(() => Symbol("step-label"));
  const on = enabled && isPresent;
  useEffect(() => {
    if (!api || !on) return;
    api.setLabel(owner, label);
    return () => api.setLabel(owner, null);
  }, [api, on, owner, label]);
}

export function useEntryDirection(): 1 | -1 {
  return useContext(StepsContext)?.direction ?? 1;
}
