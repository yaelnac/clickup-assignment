"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useStage } from "@/components/deck/SlideStage";
import { AnnotatedView } from "@/components/slides/Annotated";
import type { Slide } from "@/content/slides";
import { transition } from "@/lib/motion";
import { useEntryDirection, useSlideSteps, useStepLabel } from "@/lib/steps";

type WalkthroughSlide = Extract<Slide, { type: "walkthrough" }>;

/**
 * Several annotated screens on one slide. Each screen takes two arrow presses: first it shows
 * clean (headline and screenshot only), then its outlines, labels, lines and Maya's thoughts
 * build in. The next press fades it out and brings in the next screen, clean again.
 * Print and thumbnails show each screen annotated.
 */
export function Walkthrough({ slide, forcedStep }: { slide: WalkthroughSlide; forcedStep?: number }) {
  const { mode, active } = useStage();
  const screens = slide.steps;
  const last = screens.length * 2 - 1;
  const entry = useEntryDirection();
  const [step, setStep] = useState(() => (entry === -1 ? last : 0));
  const live = active && mode === "deck" && forcedStep === undefined;

  useSlideSteps(
    {
      next: () => {
        if (step >= last) return false;
        setStep(step + 1);
        return true;
      },
      prev: () => {
        if (step <= 0) return false;
        setStep(step - 1);
        return true;
      },
    },
    live,
  );

  const screen = Math.min(Math.floor(step / 2), screens.length - 1);
  useStepLabel(`${screen + 1} of ${screens.length}`, live);

  // Print renders one page per screen (forcedStep is the screen), always annotated.
  if (mode !== "deck") return <AnnotatedView data={screens[Math.min(forcedStep ?? 0, screens.length - 1)]} mode={mode} />;

  const revealed = step % 2 === 1;
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={screen} className="h-full w-full" exit={{ opacity: 0, transition: transition.fast }}>
          <AnnotatedView data={screens[screen]} mode={mode} revealed={revealed} />
        </motion.div>
      </AnimatePresence>
      {/* Preload the next screen so it never waits on the image. */}
      {screen < screens.length - 1 ? (
        <Image src={screens[screen + 1].shot.src} alt="" width={16} height={8} sizes="60vw" className="sr-only" aria-hidden="true" />
      ) : null}
    </>
  );
}
