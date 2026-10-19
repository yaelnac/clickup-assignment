# Growth plan for ClickUp — the deck

A 23-slide interactive presentation built as the visual foundation for a Growth Marketing
Strategist take-home. Design decisions and the engine plan are in [DESIGN.md](./DESIGN.md).

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static production build
npm start            # serve it
npm run check:slides # word limits: headline <= 12, body <= 35
npm run check:navigation # with dev server running: first load, arrows, router refreshes
```

Deploys to Vercel with no configuration.

## Navigate

| Input                          | Action                     |
| ------------------------------ | -------------------------- |
| → ↓ Space PageDown · swipe left | next slide                 |
| ← ↑ PageUp · swipe right        | previous slide             |
| Home / End                     | first / last               |
| F                              | fullscreen                 |
| O or Esc                       | overview grid              |
| → on the onboarding slide        | next question, then next slide |
| `#/12` in the URL              | open slide 12 directly     |

On a landscape screen every slide is a fixed 1600 × 900 canvas scaled to fit the window, so
nothing ever scrolls. The keyboard hint shows on the first slide only. Phones in portrait
use a stacked layout instead.

`/print` renders every slide at 1600 × 900, one landscape page each (the onboarding slide prints one page per question). Print to PDF from there.

## Edit the content

Everything is in `content/slides.ts`: the `chapters` array and the ordered `slides` array.
Each slide has a `type`; the type decides which layout renders it and which fields it
accepts, so the compiler tells you what is missing.

| Type          | Slides    | What it needs                                                      |
| ------------- | --------- | ------------------------------------------------------------------ |
| `cover`       | 1         | headline, subline, byline, meta                                    |
| `lead`        | 2         | headline, the accent `highlight`, three columns                     |
| `persona`     | 3         | headline, name, role, portrait, chips, quote, facts with icons      |
| `assumptions` | 4         | headline, second line, four cards (label, mood, text, leadsTo)     |
| `thought`     | 5         | headline, subline, Maya's mood, one thought bubble                 |
| `onboarding`  | 6         | nine steps: title, question, patience, mood, bubbles, screenshot, highlight, connector |
| `annotated`   | 7, 9, 11, 13 | headline (+ grey second line), screenshot, numbered marks (with or without labels), Maya's bubbles or a starred note |
| `walkthrough` | 8         | steps, each an annotated screen; each screen shows clean, then its annotations build in |
| `compare`     | 10        | headline (+ grey line), two sides: pill, inbox row, digest email (drawn from data), numbered labels |
| `email`       | 13, 16    | headline, who / when, the email (`EmailSpec`)                      |
| `problem`     | 14        | headline, one or two screenshots, bubbles, callouts or highlights or points, the quickest win |
| `screen`      | 15        | headline, Maya's bubble, who / when, the in-app mock (`AppMockSpec`) |
| `journey`     | 17        | headline, five states with what we show and what AI does           |
| `flow`        | 18        | headline, four steps, the holdout note                             |
| `table`       | 19        | headline, column names, rows                                       |
| `close`       | 20        | headline, three items, footer                                      |

**The onboarding slide steps.** Next and Previous (keys, buttons, swipe) walk through its
nine screens before leaving the slide; entering it backwards lands on the last one. The top-right
counter shows the question ("2 of 8"). Each step sets Maya's face (`mood`), her patience (0–5
dots), a dashed `highlight` on the screenshot (percent of the image) and a `connector` from that
outline to one of her bubbles. Add or remove steps in the `steps` array and nothing else changes.

**Outlines without labels** (slide 11): leave out `text` and `label` on a mark and only the
numbered outline shows. `badge` puts its number at `top-left` (default), `top-right`, `left`,
`right` or `below` the outline, so it doesn't cover the UI.

**Clean first** (slides 7, 8 and 11): each screen opens with only the headline and the screenshot;
the next arrow builds in the outlines, badges, labels, lines and Maya's thoughts, in that order.
`build: true` turns this on for an `annotated` slide; walkthrough screens always do it.

**Marks** (slides 7 and 8): `box` is the outline in percent of the screenshot; the label sits
`below`, `above`, `right` (top of the side column) or `beside` (level with the outline) of the image, and a `\n` in its text sets where it wraps. The line is
vertical where the label sits under its outline; `line: "slanted"` draws it from the label's
centre instead. `section` on a slide replaces the chapter name in the top-right counter.

**Slide 10's emails** are drawn from data (`DigestEmail`, `InboxRow`), not images: edit the
cards, counts, button and subject lines in `content/slides.ts`. A card or section with `mark`
gets a numbered dashed outline. The slide builds in three steps: the two emails alone, then the
first email's outlines and labels (the other email dims), then the second email's. Labels appear
in the lane between the emails, next to the email they explain.

**Slide 12's screens** (`brain-1-offer.png`, `brain-2-draft.png`, `brain-3-every-friday.png`)
are rendered from `design/mockups/brain.html`, a mockup in the same style as the setup screens.
Edit the HTML (`#1`, `#2`, `#3` in the URL pick the state), then run
`node design/mockups/render.mjs` to regenerate the PNGs. If you move an element, update its
outline `box` on slide 12. Replace the PNGs with your own exports any time; keep 2940 × 1420.
Slide 13's email (`friday-email.png`, 1200 × 1184) comes from `design/mockups/friday-email.html`
and is rendered by the same script. `shotHeight` on that slide keeps the tall email at its own
width with Maya beside it; `badge: "none"` shows an outline without a number; `pill` adds the
"My proposal" pill above the screenshot.

**Slide 8's screens** are `public/evidence/setup-1..4-*.png`, copied from your Downloads.

**Slide 7's light screenshot** (`first-screen-light.png`) was rebuilt from PDF pages 14 and 17,
which show the same screen with boxes in different places. Replace it with the original capture
if you have one; mark positions are percentages of the image.

**Screenshots** live in `public/evidence/` (`onboarding-01..09.png`, `02-first-screen.png`,
`05-ai-analytics.png`, `06-credits-wall.png`). Callout and highlight positions are
percentages of the image. Maya's avatars are `public/maya/happy.png` and `worried.png`.

## Structure

```
app/                 layout, page (deck), print route, global tokens
components/deck      Deck (state, keys, swipe, hash), Chrome, NavButtons, Overview, Thumb, KeyLegend, SlideStage
components/slides    SlideView + one component per layout type, shared primitives (Avatar, Bubbles, WinCard)
components/devices   BrowserFrame, Shot (screenshot with overlays), AppMock (in-app screen), EmailFrame
components/ui        MotionProvider
content/slides.ts    chapters and the ordered slide array
lib/                 cn, motion tokens, deck helpers, slide steps, slide rules
scripts/             check-slides
public/evidence/     screenshot slots
```

## Tokens

All colour, type, spacing, radius and motion values live in `app/globals.css` and are
container-relative, so a slide looks the same full-screen, as a thumbnail, and on a printed
page. Chapters alternate dark and light tones; the single accent appears once per slide.
