"use client";

import { Annotated } from "@/components/slides/Annotated";
import { Assumptions } from "@/components/slides/Assumptions";
import { Close } from "@/components/slides/Close";
import { Compare } from "@/components/slides/Compare";
import { Cover } from "@/components/slides/Cover";
import { Email } from "@/components/slides/Email";
import { Flow } from "@/components/slides/Flow";
import { Journey } from "@/components/slides/Journey";
import { Lead } from "@/components/slides/Lead";
import { Onboarding } from "@/components/slides/Onboarding";
import { Persona } from "@/components/slides/Persona";
import { Problem } from "@/components/slides/Problem";
import { Screen } from "@/components/slides/Screen";
import { Table } from "@/components/slides/Table";
import { Thought } from "@/components/slides/Thought";
import { Walkthrough } from "@/components/slides/Walkthrough";
import type { Slide } from "@/content/slides";

/** One component per layout type. The slide's `type` picks it. `step` pins a stepped slide (print). */
export function SlideView({ slide, step }: { slide: Slide; step?: number }) {
  switch (slide.type) {
    case "cover":
      return <Cover slide={slide} />;
    case "lead":
      return <Lead slide={slide} />;
    case "persona":
      return <Persona slide={slide} />;
    case "assumptions":
      return <Assumptions slide={slide} />;
    case "thought":
      return <Thought slide={slide} />;
    case "onboarding":
      return <Onboarding slide={slide} forcedStep={step} />;
    case "annotated":
      return <Annotated slide={slide} />;
    case "walkthrough":
      return <Walkthrough slide={slide} forcedStep={step} />;
    case "problem":
      return <Problem slide={slide} />;
    case "screen":
      return <Screen slide={slide} />;
    case "email":
      return <Email slide={slide} />;
    case "compare":
      return <Compare slide={slide} forcedStep={step} />;
    case "journey":
      return <Journey slide={slide} />;
    case "flow":
      return <Flow slide={slide} />;
    case "table":
      return <Table slide={slide} />;
    case "close":
      return <Close slide={slide} />;
  }
}
