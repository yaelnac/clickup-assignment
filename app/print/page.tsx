import type { Metadata } from "next";
import { SlideStage } from "@/components/deck/SlideStage";
import { SlideView } from "@/components/slides/SlideView";
import { chapterOf, deck, slides, stepCount, type Slide } from "@/content/slides";
import { pad2 } from "@/lib/deck";
import { STAGE_H as H, STAGE_W as W } from "@/lib/stage";

export const metadata: Metadata = {
  title: `${deck.htmlTitle} · Print`,
  robots: { index: false, follow: false },
};

/** Every slide at 1600 x 900, one landscape page each; a stepped slide prints one page per step. */
export default function PrintPage() {
  type PrintSlide = { slide: Slide; i: number; step?: number };
  const pages = slides.flatMap<PrintSlide>((slide, i) => {
    const count = stepCount(slide);
    return count > 1 ? Array.from({ length: count }, (_, step) => ({ slide, i, step })) : [{ slide, i }];
  });
  return (
    <main data-tone="light" className="min-h-dvh bg-surface text-fg">
      <div className="mx-auto grid max-w-[1600px] gap-6 px-6 py-10 print:hidden">
        <p className="font-mono text-label uppercase text-fg-muted">Print view</p>
        <p className="max-w-[60ch] text-body text-fg">
          Press ⌘P or Ctrl+P and choose “Save as PDF”. The page size is preset to 1600 × 900, one slide per
          landscape page. Slides that build in steps print one page per step.
        </p>
      </div>
      <ol className="mx-auto grid max-w-[1600px] gap-6 px-6 pb-10 print:m-0 print:max-w-none print:gap-0 print:p-0">
        {pages.map(({ slide, i, step }) => (
          <li key={`${slide.id}-${step ?? 0}`} className="print-page overflow-hidden rounded-lg border border-border print:rounded-none print:border-0" style={{ width: W, height: H }}>
            <SlideStage tone={chapterOf(slide).tone} mode="print" active={false} className="h-full w-full">
              <SlideView slide={slide} step={step} />
              <span aria-hidden="true" className="absolute bottom-4 right-6 font-mono text-micro text-fg-muted">
                {pad2(i + 1)} / {pad2(slides.length)}
              </span>
            </SlideStage>
          </li>
        ))}
      </ol>
    </main>
  );
}
