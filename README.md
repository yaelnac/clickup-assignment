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
| `assumptions` | 4         | headline, muted second line, four cards (label, mood, text, leadsTo) |
| `thought`     | 5         | headline, subline, Maya's mood, one thought bubble                 |
| `onboarding`  | 6         | nine steps: title, question, patience, mood, bubbles, screenshot, highlight, connector |
| `annotated`   | 7         | headline, screenshot, numbered marks (outline + label above / below / right), Maya's bubbles, one mark-to-bubble line |
| `problem`     | 10, 13    | headline, one or two screenshots, bubbles, callouts or highlights or points, the quickest win |
| `screen`      | 8, 11, 14 | headline, Maya's bubble, who / when, the in-app mock (`AppMockSpec`) |
| `email`       | 9, 12, 15 | headline, who / when, the email (`EmailSpec`)                      |
| `journey`     | 16        | headline, five states with what we show and what AI does           |
| `flow`        | 17        | headline, four steps, the holdout note                             |
| `table`       | 18        | headline, column names, rows                                       |
| `close`       | 19        | headline, three items, footer                                      |

**The onboarding slide steps.** Next and Previous (keys, buttons, swipe) walk through its
nine screens before leaving the slide; entering it backwards lands on the last one. The top-right
counter shows the question ("2 of 8"). Each step sets Maya's face (`mood`), her patience (0–5
dots), a dashed `highlight` on the screenshot (percent of the image) and a `connector` from that
outline to one of her bubbles. Add or remove steps in the `steps` array and nothing else changes.

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
