/**
 * Slide rules, enforced in development and in `npm run check:slides`.
 * One idea per slide: headline <= 12 words, supporting text <= 35 words.
 */
export const limits = { headline: 12, body: 35 } as const;

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export interface RuleViolation {
  id: string;
  field: string;
  words: number;
  limit: number;
}

interface CheckableSlide {
  id: string;
  headline?: string;
  body?: string;
  job?: string;
}

export function checkSlides(slides: readonly CheckableSlide[]): RuleViolation[] {
  const out: RuleViolation[] = [];
  for (const slide of slides) {
    if (slide.headline && wordCount(slide.headline) > limits.headline) {
      out.push({ id: slide.id, field: "headline", words: wordCount(slide.headline), limit: limits.headline });
    }
    for (const field of ["body", "job"] as const) {
      const text = slide[field];
      if (text && wordCount(text) > limits.body) {
        out.push({ id: slide.id, field, words: wordCount(text), limit: limits.body });
      }
    }
  }
  return out;
}
