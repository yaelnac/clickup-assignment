import type { Transition, Variants } from "motion/react";

/** One ease for the whole deck. Mirrors --ease-out in globals.css. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.2,
  base: 0.32,
  slide: 0.4,
  slow: 0.52,
} as const;

export const transition = {
  fast: { duration: duration.fast, ease } satisfies Transition,
  base: { duration: duration.base, ease } satisfies Transition,
  slide: { duration: duration.slide, ease } satisfies Transition,
  slow: { duration: duration.slow, ease } satisfies Transition,
  layout: { type: "spring", stiffness: 520, damping: 46, mass: 1 } satisfies Transition,
};

/** Slide-to-slide: a 4% shift against the direction of travel plus a fade. */
export const slideVariants: Variants = {
  enter: (direction: 1 | -1) => ({ x: `${direction * 4}%`, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: transition.slide },
  exit: (direction: 1 | -1) => ({ x: `${direction * -4}%`, opacity: 0, transition: { duration: 0.28, ease } }),
};

/** Inside a slide: children arrive with a short stagger after the slide settles. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

export const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: transition.slow },
};

/** Content swap inside interactive panels. */
export const swap: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: transition.base },
  exit: { opacity: 0, y: -4, transition: transition.fast },
};
