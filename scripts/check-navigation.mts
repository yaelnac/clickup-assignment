import assert from "node:assert/strict";
import { chromium, type Page } from "playwright";
import { slides } from "../content/slides.ts";

// Run against `npm run dev` so the Next.js refresh and HMR paths are exercised.
const baseURL = process.env.DECK_TEST_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
const errors: string[] = [];

/** Slide 1 is the bare URL; slide n is `#/n`. */
const hashFor = (number: number) => (number === 1 ? "" : `#/${number}`);

async function expectSlide(page: Page, number: number) {
  await page.waitForFunction(({ hash, number, headline }) => {
    const visibleSlides = document.querySelectorAll('section[aria-roledescription="slide"]');
    const slide = visibleSlides[0];
    const heading = slide?.querySelector("h1");
    const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
    if (!(
      location.hash === hash &&
      visibleSlides.length === 1 &&
      slide.getAttribute("aria-label")?.startsWith(`Slide ${number} of`) &&
      heading && normalize(heading.textContent ?? "").includes(normalize(headline))
    )) return false;
    for (let element: Element | null = heading; element; element = element.parentElement) {
      const style = getComputedStyle(element);
      if (Number(style.opacity) < 0.9 || style.visibility === "hidden" || style.display === "none") return false;
    }
    return heading.getBoundingClientRect().width > 0;
  }, { hash: hashFor(number), number, headline: slides[number - 1].headline }).catch(async (error: unknown) => {
    console.error("Navigation did not settle", {
      expectedSlide: number,
      url: page.url(),
      visibleSlides: await page.locator('section[aria-roledescription="slide"]').evaluateAll(
        (slides) => slides.map((slide) => slide.getAttribute("aria-label")),
      ),
    });
    throw error;
  });
  if (number !== 1) {
    assert.equal(await page.getByRole("heading", { name: slides[0].headline, exact: true }).count(), 0,
      "The cover heading must disappear when navigating to another slide");
  }
}

/** Resolves once the deck's mount effect has run, i.e. keys and buttons are live. */
async function waitForDeck(page: Page) {
  await page.waitForFunction(() => document.documentElement.dataset.deckReady === "1");
}

async function refresh(page: Page, number: number) {
  const response = page.waitForResponse((response) => response.request().headers().rsc === "1");
  await page.evaluate(() => {
    const nextWindow = window as Window & { next?: { router: { refresh(): void } } };
    if (!nextWindow.next) throw new Error("Start the development server with npm run dev before this check.");
    nextWindow.next.router.refresh();
  });
  await response;
  await page.waitForLoadState("networkidle");
  assert.equal(new URL(page.url()).hash, hashFor(number), "A router refresh must keep the current slide URL");
  await expectSlide(page, number);
}

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    // A new context per viewport is a new browser profile: empty cache, first visit.
    const context = await browser.newContext({ viewport });
    try {
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) errors.push(message.text());
      });
      page.setDefaultTimeout(10_000);

      // First visit to the bare URL: the very first key press after hydration must navigate.
      await page.goto(baseURL, { waitUntil: "commit" });
      await waitForDeck(page);
      await page.keyboard.press("ArrowRight");
      await expectSlide(page, 2);
      await page.keyboard.press("ArrowLeft");
      await expectSlide(page, 1);

      await refresh(page, 1);
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expectSlide(page, 2);
      await refresh(page, 2);
      await page.keyboard.press("ArrowRight");
      await expectSlide(page, 3);
      await refresh(page, 3);
      await page.keyboard.press("ArrowLeft");
      await expectSlide(page, 2);

      await page.goto("about:blank");
      const deepLink = new URL(baseURL);
      deepLink.hash = "/3";
      await page.goto(deepLink.href, { waitUntil: "networkidle" });
      await expectSlide(page, 3);
      await refresh(page, 3);

      // Clearing the hash goes back to slide 1 without a document reload.
      await page.evaluate(() => { location.hash = ""; });
      await expectSlide(page, 1);
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expectSlide(page, 2);

      // Slow JavaScript: presses made before hydration are dropped, and the deck must still
      // respond to the first press once it is live, with no refresh.
      await page.goto("about:blank");
      let release = () => {};
      const loading = new Promise<void>((resolve) => { release = resolve; });
      await page.route("**/_next/**/*.js*", async (route) => {
        await loading;
        await route.continue();
      });
      try {
        await page.goto(baseURL, { waitUntil: "commit" });
        await page.getByRole("button", { name: "Next", exact: true }).waitFor({ state: "visible" });
        await page.keyboard.press("ArrowRight");
        assert.equal(new URL(page.url()).hash, "", "Nothing can navigate before React has hydrated");
      } finally {
        release();
      }
      await waitForDeck(page);
      await expectSlide(page, 1);
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expectSlide(page, 2);
      await page.keyboard.press("ArrowRight");
      await expectSlide(page, 3);
      await refresh(page, 3);
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expectSlide(page, 4);
      console.log(`check:navigation  ${viewport.width}px: first visit, direct links, refreshes, buttons, keys, delayed JavaScript passed`);
    } finally {
      await context.close();
    }
  }
  assert.deepEqual(errors, [], "Navigation must not produce browser errors");
} finally {
  await browser.close();
}
