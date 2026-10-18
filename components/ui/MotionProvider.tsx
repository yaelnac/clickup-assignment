"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * One place for motion policy. With reducedMotion="user", transform and layout
 * animations become instant when the visitor prefers reduced motion, while
 * opacity still fades. Server and client render the same initial styles.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
