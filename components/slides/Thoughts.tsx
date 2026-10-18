"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Bubble, Mood } from "@/content/slides";
import { swap } from "@/lib/motion";

interface ThoughtsProps {
  bubbles: readonly Bubble[];
  mood: Mood;
  /** Changes when the thoughts change, so the bubbles cross-fade. */
  stepKey?: number | string;
  animated: boolean;
}

/**
 * Maya thinking: her bubbles stacked, then two thought dots and her face underneath.
 * Bubbles carry `data-bubble` and the stack carries `data-step` so connectors can find them.
 */
export function Thoughts({ bubbles, mood, stepKey = 0, animated }: ThoughtsProps) {
  const s = (k: number) => `calc(var(--s) * ${k})`;
  const vars: CSSProperties & Record<"--s", string> = { "--s": "max(4.5rem, min(7.4cqw, 13cqh))" };
  return (
    <div data-thoughts className="grid content-end">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={stepKey}
          data-step={stepKey}
          variants={swap}
          initial={animated ? "initial" : false}
          animate="animate"
          exit="exit"
          className="grid gap-[max(0.5rem,0.7cqw)]"
        >
          {bubbles.map((bubble, i) => (
            <p key={bubble.text} data-bubble={i} className="rounded-3xl bg-accent/10 px-[max(1rem,1.4cqw)] py-[max(0.65rem,1cqw)] text-body text-fg">
              {bubble.text}
            </p>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="relative" style={{ ...vars, height: s(1.47) }}>
        <span aria-hidden="true" className="absolute rounded-full bg-accent/10" style={{ left: s(0.865), top: s(0.07), width: s(0.173), height: s(0.173) }} />
        <span aria-hidden="true" className="absolute rounded-full bg-accent/10" style={{ left: s(0.66), top: s(0.29), width: s(0.096), height: s(0.096) }} />
        <Image
          src={`/maya/${mood}.png`}
          alt=""
          width={300}
          height={300}
          sizes="160px"
          className="absolute bottom-0 left-0 rounded-full"
          style={{ width: s(1), height: s(1) }}
        />
      </div>
    </div>
  );
}
