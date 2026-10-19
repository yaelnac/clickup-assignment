// Renders the mockups in design/mockups to the slide 12 screens and the slide 13 email in public/evidence.
// Run from the project root:  node design/mockups/render.mjs
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../../public/evidence");
const names = { 1: "brain-1-offer.png", 2: "brain-2-draft.png", 3: "brain-3-every-friday.png" };

const browser = await chromium.launch();
for (const state of [1, 2, 3]) {
  const page = await browser.newPage({ viewport: { width: 1470, height: 710 }, deviceScaleFactor: 2 });
  await page.goto(`file://${here}/brain.html#${state}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, names[state]) });
  console.log("wrote", names[state]);
  await page.close();
}
// slide 13: the Friday email
{
  const page = await browser.newPage({ viewport: { width: 600, height: 592 }, deviceScaleFactor: 2 });
  await page.goto(`file://${here}/friday-email.html`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, "friday-email.png") });
  console.log("wrote friday-email.png");
  await page.close();
}
await browser.close();
