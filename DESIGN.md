# Design plan: the deck

A 23-slide presentation for one reader, read asynchronously on a laptop or a phone.
One idea per slide. Apple keynote pacing, ElevenLabs / Linear polish. Same stack as before
(Next.js App Router, Tailwind 4 tokens, Motion), same voice: warm off-white and near-black,
Geist Sans for reading, Geist Mono for labels, one vermilion accent.

## Slide engine

```
app/page.tsx            <Deck />                       the presentation
app/print/page.tsx      every slide at 1600 x 900      one landscape page each, for PDF
components/deck/        Deck, Chrome, NavButtons, Overview, Thumb, KeyLegend, SlideStage
components/slides/      SlideView (switch on type) + one component per layout type
content/slides.ts       chapters + the ordered, typed slide array
lib/deck.ts             hash <-> index, key map helpers, swipe maths
lib/slide-rules.ts      word limits, run in dev and via `npm run check:slides`
```

**The stage.** Every slide renders inside a `SlideStage`: a box with `container-type: size`.
On a landscape screen the stage is a fixed 1600 x 900 canvas, centred and scaled with a
transform to fit the window, the way Keynote fits a slide. The scaling is pure CSS
(`.deck-canvas` plus an inline script that sets `--deck-scale` before first paint), so the
server-rendered layout and the first paint agree and nothing shifts after hydration. A slide therefore either fits the
canvas or it is wrong; nothing scrolls, and `scripts`-level fit checks confirm every slide
at 1600 x 900. The overview thumbnails and the print pages are the same 1600 x 900 canvas.
Only portrait screens (phones) use a fluid stage: layouts restack and a tall slide may scroll
inside itself. Type, padding and breakpoints are container-relative (`cqw`, `cqh`,
container orientation), so one component serves all of these.

**State model.** `index` (0-based), `direction` (1 | -1, drives the transition), `overview`
(boolean), `hint` (boolean, the keyboard hint). Derived: `slide`, `chapter`, `tone`,
`canPrev`, `canNext`. The URL hash `#/7` is the public form of `index`; it is read once
before first paint and written with `replaceState` on every change; `hashchange` is honoured
for back / forward.

**Mounting.** Only `index - 1`, `index`, `index + 1` are mounted. The exit gate uses
`useIsPresent`, never `usePresence`, so an exiting slide is actually unmounted when its exit
animation ends. The overview renders outside the scaled canvas (crisp at any window size) with
a content box of `slide width x deck scale`, so its edges match the slides. The active slide sits in an
`AnimatePresence` keyed by index. Neighbours render in a hidden, `inert`, `aria-hidden`
layer so their images are already decoded when they slide in. The overview mounts all 23
as inert thumbnails only while open.

**Key map** (ignored when a modifier is held, when focus is in a text field, or when focus
is inside an element marked `data-captures-keys`, except F / O / Esc which always work):

| Keys                                  | Action                   |
| ------------------------------------- | ------------------------ |
| Right, Down, Space, PageDown          | next                     |
| Left, Up, PageUp                      | previous                 |
| Home / End                            | first / last             |
| F                                     | toggle fullscreen        |
| O, Esc                                | toggle overview          |
| → / Next on a stepped slide            | next step, then next slide |

**Steps.** A slide can own internal steps (the onboarding slide's nine screens). It registers
a handler through `StepsContext`; `next` / `prev` in the deck ask that handler first and only
move to another slide when it declines, so keys, the Next button and swipes all walk through
the steps the way Keynote walks through builds. Entering a stepped slide backwards starts on
its last step. Thumbnails show the first step; print renders one page per step.

Chapters: Intro, The customer, Onboarding, Three moments, The system, Testing, Close. All light.

Space and Enter are left alone when focus is on a button, so a focused Next button does not
advance twice.

**Touch.** Horizontal swipe on the stage (48px, mostly horizontal, under 800ms), read from
`touchstart` / `touchend` rather than pointer events, because browsers cancel the pointer
stream once a touch moves. The stage declares `touch-action: pan-y` so vertical scrolling
inside a tall slide still works. Every tap target is at least 44px.

**Transitions.** 400ms, `cubic-bezier(0.22, 1, 0.36, 1)`. The outgoing slide moves 4% against
the direction of travel and fades; the incoming one arrives from the other side. Inside a
slide, `Stagger` / `Item` reveal children with a 60ms step after a 150ms hold. Under
`prefers-reduced-motion`, `MotionConfig reducedMotion="user"` makes every transform instant,
so only the fades remain.

**Chrome.** One line, top-right: chapter name and `07 / 20`, which is also the button that
opens the overview (the only overview affordance on touch devices). Along the top edge a 2px
progress bar split into one segment per chapter, so position in the deck is visible without
words. Nothing top-left. Slides carry an eyebrow only when it says something the chrome and
the headline do not (finding and moment numbering, the persona's caveat). Previous / Next bottom-right on landscape stages;
a full-width bottom bar on portrait stages. The keyboard legend (move, overview, fullscreen)
is part of the cover's footer row, right-aligned on the byline's baseline and directly above
the arrow buttons it explains; pointer devices only, never on later slides.

**Accessibility.** Each slide is a `section` with `aria-roledescription="slide"` and a label
`"Slide 7 of 23: Finding 1"`. Inactive slides are `inert` and `aria-hidden`. A polite live
region announces the same label on change. Tabs, radiogroups and hotspots are real buttons
with ARIA roles and visible 2px focus rings. All text pairs meet AA; mono labels were raised
to `fg-muted` at L 0.44 (light) / 0.76 (dark).

## Tokens

Everything is in `app/globals.css`. Components reference tokens only.

**Tones.** The deck is light throughout, in the register of clickup.com: white background,
near-black type, neutral greys, black pill buttons, one purple accent. A dark palette remains
defined under `data-tone="dark"` and can be set per chapter, but no chapter uses it.

| Token           | Light (default)           | Dark (available)          |
| --------------- | ------------------------- | ------------------------- |
| `bg`            | `oklch(1 0 0)`            | `oklch(0.16 0 0)`         |
| `surface`       | `oklch(0.965 0 0)`        | `oklch(0.2 0 0)`          |
| `surface-2`     | `oklch(0.93 0 0)`         | `oklch(0.24 0 0)`         |
| `border`        | `oklch(0.905 0 0)`        | `oklch(0.29 0 0)`         |
| `border-strong` | `oklch(0.78 0 0)`         | `oklch(0.40 0 0)`         |
| `fg-muted`      | `oklch(0.46 0 0)`         | `oklch(0.76 0 0)`         |
| `fg`            | `oklch(0.2 0 0)`          | `oklch(0.97 0 0)`         |
| `accent`        | `oklch(0.6 0.19 285)`     | `oklch(0.7 0.16 285)`     |

**Type** (container-relative; values at 1920 / 1440 / 1024 / 390 wide):

| Token            | clamp()                                      | 1920 | 1440 | 1024 | 390 | Tracking | Leading |
| ---------------- | -------------------------------------------- | ---- | ---- | ---- | --- | -------- | ------- |
| `text-display`   | `clamp(2.25rem, 4.6cqw, 5.5rem)`, 600        | 88   | 66   | 47   | 36  | -0.035em | 1.02    |
| `text-headline`  | `clamp(1.75rem, 3.2cqw, 4rem)`, 600          | 61   | 46   | 33   | 28  | -0.03em  | 1.08    |
| `text-statement` | `clamp(1.375rem, 2cqw, 2.5rem)`              | 38   | 29   | 22   | 22  | -0.02em  | 1.15    |
| `text-lead`      | `clamp(1.125rem, 0.75rem + 0.8cqw, 1.5rem)`  | 24   | 23   | 20   | 18  | -0.012em | 1.35    |
| `text-body`      | `clamp(1.0625rem, 0.75rem + 0.6cqw, 1.25rem)` | 20  | 20   | 18   | 17  | -0.005em | 1.5     |
| `text-small`     | `clamp(0.9375rem, 0.65rem + 0.5cqw, 1.0625rem)` | 17 | 17  | 15.5 | 15  | 0        | 1.45    |
| `text-label`     | `clamp(0.6875rem, 0.5rem + 0.3cqw, 0.8125rem)` mono, caps | 13 | 13 | 11 | 11 | 0.08em | 1 |
| `text-data`      | `clamp(0.75rem, 0.55rem + 0.4cqw, 0.9375rem)` mono | 15 | 15 | 13 | 12 | 0       | 1.4     |

Titles were brought down from a 134px display after a reading pass: the deck is read, not
projected, so the largest line on any slide is about 88px and most headlines sit near 60px.
Display is used for Cover, Statement and MomentIntro; headline for everything else.

**Container variants.** `landscape:` / `portrait:` follow the stage's orientation and drive
every restack; `pointer-fine:` gates the keyboard hint to devices with a keyboard.

**Measure and margins.** Content sits in a centred measure of `84rem` plus margins:
`pad` = `clamp(1.5rem, 6cqw, 9rem)` horizontal and `pad-y` = `clamp(5rem, 11cqh, 9rem)`
vertical, which clears the chrome. The chrome and the Next / Previous pair align to the same
measure. `gap` = `clamp(1rem, 2cqw, 2.5rem)`. Rows are never allowed to shrink below their
content, so text can never land on text; on landscape screens the fixed canvas guarantees
that nothing needs to scroll either.

**Radii.** `sm 8px`, `md 12px`, `lg 20px`, `xl 28px`, only on product-like surfaces (device
frames, placeholders, the explorer and board panels). Lists are ruled, never carded.

## Slide rules, enforced

`lib/slide-rules.ts` counts words: headline <= 12, body <= 35. It runs in development (a
console warning naming the slide) and as `npm run check:slides`. Layout components accept
only the fields their type defines, so a slide cannot grow a second idea without changing
its type. Placeholders are `Placeholder` blocks: tinted, hairlined, labelled, with crop marks
and the right aspect ratio.

## Layout types

Cover, Lead (accent highlight + three columns), Persona, Assumptions, Thought (Maya and one
thought bubble, used as a chapter opener), Onboarding (stepped),
Annotated (screenshot with numbered outlines whose labels sit above, below or beside the image,
joined by drawn connector lines), Problem (real screenshot with callouts or highlight boxes,
Maya's bubbles, the quickest win),
Screen (data-drawn in-app mock), Email, Journey, Flow, Table, Close.

Maya appears as an illustrated avatar with two moods and speaks in rounded bubbles, in the
register of growth.design case studies: the reader sees the screen and what she thinks of it
on the same slide. Proposed actions inside mocks use the purple accent; the deck's own
controls stay black and grey.
