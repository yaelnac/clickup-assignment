import { slides } from "../content/slides.ts";
import { checkSlides } from "../lib/slide-rules.ts";

const violations = checkSlides(slides);
if (violations.length === 0) {
  console.log(`check:slides  ${slides.length} slides, all within limits`);
} else {
  for (const v of violations) {
    console.error(`check:slides  ${v.id}: ${v.field} has ${v.words} words (limit ${v.limit})`);
  }
  process.exit(1);
}
