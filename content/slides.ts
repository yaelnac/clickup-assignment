/**
 * The deck: chapters, then the ordered slide array. Every string on screen lives here.
 * Each slide has a `type`; the type picks the layout and fixes which fields it accepts.
 * Screenshots live in /public/evidence, Maya's avatars in /public/maya.
 * Rules: headline <= 12 words, body <= 35 words (npm run check:slides).
 * This file must not import from "@/" so the check script can run it with plain Node.
 */

export type Tone = "dark" | "light";
export type ChapterId = "intro" | "customer" | "onboarding" | "moments" | "system" | "testing" | "close";

export interface Chapter {
  id: ChapterId;
  number: string;
  title: string;
  tone: Tone;
}

export interface Fact {
  label: string;
  value: string;
}

/** A real screenshot. */
export interface Shot {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export type Mood = "happy" | "worried" | "neutral" | "delighted" | "annoyed" | "exasperated";

/** Something Maya thinks, shown as a speech bubble next to her avatar. */
export interface Bubble {
  text: string;
}

/** A numbered marker on a screenshot. x and y are percentages of the image. */
export interface Callout {
  n: string;
  x: number;
  y: number;
  text: string;
}

/** An outlined box on a screenshot. All values are percentages of the image. */
export interface Highlight {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A numbered annotation on a screenshot: an outlined box, and a label above or below the image. */
export interface Mark {
  n: string;
  /** Outline on the screenshot, in percent of the image. */
  box: Highlight;
  /** Label text. A line break (\n) sets where it wraps. Leave out `text` and `label` for a numbered outline alone. */
  text?: string;
  /**
   * Where the label sits. "above" / "below": its left edge ("start") or right edge ("end") at `x`
   * percent of the image width. "right": at the top of the column beside the image. "beside": next
   * to the image, level with the middle of its outline (`x` unused for both).
   */
  label?: { side: "above" | "below" | "right" | "beside"; x: number; anchor?: "start" | "end" };
  /** Where the number badge sits on its outline, so it doesn't cover the UI. Default "top-left". "none" hides it. */
  badge?: "top-left" | "top-right" | "left" | "right" | "below" | "none";
  /** The line to the outline is vertical where the label sits under it. "slanted" draws it from the label's centre instead. */
  line?: "slanted";
}

/** An annotated screen: a real screenshot with numbered outlines, and optionally Maya's thoughts. */
export interface AnnotatedScreen {
  headline: string;
  /** A second headline line, in grey. */
  headlineMuted?: string;
  subline?: string;
  shot: Shot;
  /** A pill above the screenshot, e.g. "My proposal: Friday 3 PM". */
  pill?: string;
  /**
   * For tall screenshots: the image's height on landscape screens, in % of the slide height. It then
   * keeps its own width and Maya's thoughts sit right beside it instead of at the far right.
   */
  shotHeight?: number;
  /** "dark" for dark product screenshots: outlines switch to the brighter purple. Default "light". */
  shotTone?: "light" | "dark";
  marks: Mark[];
  mood?: Mood;
  bubbles?: Bubble[];
  /** A line from one mark's outline to one of Maya's bubbles. */
  toBubble?: { mark: string; target: number };
  /** A purple note with a star under everything else. */
  note?: string;
  /** A small grey source line at the bottom of the slide. */
  footnote?: string;
  /**
   * Show the screen clean first; the outlines, labels, lines and Maya's thoughts build in on the
   * next arrow press. Walkthrough screens always build.
   */
  build?: boolean;
}

/** One screen of a walkthrough. */
export type WalkStep = AnnotatedScreen;

/** A task card inside a ClickUp digest email. */
export interface DigestCard {
  status: string;
  /** Breadcrumb, e.g. ["Acme Co", "Social"]. The last part is bold. */
  path: string[];
  title?: string;
  /** Initials of the assignee. */
  assignee: string;
  /** Assigned but not invited yet: the avatar is a dashed circle. */
  pending?: boolean;
  /** A short purple line under the title. */
  note?: string;
  /** Purple left border and tint. */
  highlight?: boolean;
  /** Red left border. */
  overdue?: boolean;
  /** Number of the dashed outline drawn around this card. */
  mark?: string;
}

/** The body of a ClickUp digest email, drawn from data. */
export interface DigestEmail {
  stats: { label: string; value: number; alert?: boolean }[];
  sections: {
    title: string;
    cards: DigestCard[];
    cta?: { label: string; secondary?: string };
    /** Number of the dashed outline drawn around this section's cards and button. */
    mark?: string;
  }[];
  /** The email continues below the fold: cut it at the height of the email beside it. */
  clipped?: boolean;
}

/** One side of a side-by-side email comparison. */
export interface CompareSide {
  pill: string;
  inbox: { from: string; subject: string; preview?: string; time?: string; unread?: boolean; mark?: string };
  email: DigestEmail;
  /** Labels stacked beside the email, matched to outlines by number. */
  labels: { n: string; text: string }[];
}

/** A proposed in-app screen, drawn from data. */
export interface AppMockSpec {
  /** Breadcrumb at the top of the page, e.g. "Team Space". */
  space: string;
  /** "card": everything inside one white card. "page": heading and rows on the page, AI card below. */
  variant: "card" | "page";
  welcome?: string;
  heading?: string;
  title?: string;
  input?: string;
  rows?: { label: string; meta: string }[];
  ai?: { text: string; primary: string; secondary: string };
  stats?: { value: string; label: string }[];
  line?: string;
  primary?: string;
  secondary?: string;
}

export interface EmailSpec {
  from: string;
  subject: string;
  body: string;
  card?: { title: string; meta: string };
  cta: string;
}

/** A purple line from the outlined element to one of Maya's thoughts. */
export interface Connector {
  /** "straight": box edge to bubble. "elbow-down": down from the box, then across. "elbow-right": across, then down onto the bubble. */
  kind: "straight" | "elbow-down" | "elbow-right";
  /** Which bubble it points at (0 = first). */
  target?: number;
  /** For "elbow-down": where along the box's bottom edge the line starts, 0 to 1. */
  at?: number;
}

export interface OnboardingStep {
  /** Shown in the pill, e.g. "Question 3 of 8". */
  title: string;
  /** 1-8, shown in the top-right counter. */
  question: number;
  /** Her patience, 0 to 5 dots. */
  patience: number;
  mood: Mood;
  bubbles: Bubble[];
  shot: Shot;
  /** Dashed outline on the screenshot, in percent of the image. */
  highlight?: Highlight;
  connector?: Connector;
}

interface Base {
  id: string;
  chapter: ChapterId;
  /** Short title for the overview grid and screen-reader announcements. */
  title: string;
  /** One short mono line above the headline. Only when it adds something the chrome lacks. */
  eyebrow?: string;
  /** Replaces the chapter name in the top-right counter for this slide, e.g. "Moment 1 · Setup". */
  section?: string;
}

export type Slide = Base &
  (
    | { type: "cover"; headline: string; subline: string; byline: string; meta: string }
    | { type: "lead"; headline: string; highlight: string; columns: { label: string; text: string }[] }
    | {
        type: "persona";
        headline: string;
        name: string;
        role: string;
        portrait: Shot;
        /** Short tags under her name. */
        chips: string[];
        /** Something she says, shown as a quote on her card. */
        quote: string;
        /** Facts beside her card, each with an icon. Icons: alert, bolt, star, users, chart. */
        facts: (Fact & { icon: "alert" | "bolt" | "star" | "users" | "chart" })[];
      }
    | { type: "assumptions"; headline: string; headlineMuted: string; rows: { label: string; text: string; leadsTo: string; mood: Mood }[] }
    | { type: "thought"; headline: string; subline: string; mood: Mood; thought: string }
    | { type: "onboarding"; headline: string; steps: OnboardingStep[] }
    | {
        type: "problem";
        headline: string;
        shots: Shot[];
        mood?: Mood;
        bubbles?: Bubble[];
        callouts?: Callout[];
        highlights?: Highlight[];
        points?: string[];
        win: { label: string; text: string };
      }
    | ({ type: "annotated" } & AnnotatedScreen)
    | { type: "compare"; headline: string; headlineMuted?: string; subline?: string; sides: CompareSide[] }
    | { type: "walkthrough"; headline: string; steps: WalkStep[] }
    | { type: "screen"; headline: string; mood: Mood; bubble: Bubble; facts: Fact[]; screen: AppMockSpec; tag: string }
    | { type: "email"; headline: string; facts: Fact[]; email: EmailSpec; tag: string }
    | {
        type: "journey";
        headline: string;
        rowLabels: { show: string; ai: string };
        steps: { state: string; show: string; ai: string; message?: string }[];
      }
    | { type: "flow"; headline: string; steps: { label: string; body: string }[]; note: string }
    | { type: "table"; headline: string; columns: string[]; rows: string[][] }
    | { type: "close"; headline: string; items: { title: string; note: string }[]; footer: string }
  );

export type SlideType = Slide["type"];

export const deck = {
  htmlTitle: "Yael · ClickUp lifecycle plan",
  description: "How to turn a ClickUp signup into a paying customer: three messages, one system, and how to test it.",
  author: "Yael",
  overviewLabel: "Overview",
  closeLabel: "Close",
  hint: { move: "move", overview: "overview", fullscreen: "fullscreen" },
  nav: { prev: "Previous", next: "Next" },
} as const;

export const chapters: readonly Chapter[] = [
  { id: "intro", number: "01", title: "Intro", tone: "light" },
  { id: "customer", number: "02", title: "The customer", tone: "light" },
  { id: "onboarding", number: "03", title: "Onboarding", tone: "light" },
  { id: "moments", number: "04", title: "Three moments", tone: "light" },
  { id: "system", number: "05", title: "The system", tone: "light" },
  { id: "testing", number: "06", title: "Testing", tone: "light" },
  { id: "close", number: "07", title: "Close", tone: "light" },
];

/* ---------------------------------------------------------------- */
/* Assets                                                            */
/* ---------------------------------------------------------------- */

const onboardingShot = (n: number, alt: string): Shot => ({
  src: `/evidence/onboarding-${String(n).padStart(2, "0")}.png`,
  alt,
  width: 1978,
  height: 1350,
});


const firstScreenLight: Shot = {
  src: "/evidence/first-screen-light.png",
  alt: "ClickUp home after setup, light mode: a list with Task 1, Task 2 and Task 3",
  width: 2192,
  height: 1053,
};

const setupShot = (file: string, alt: string): Shot => ({ src: `/evidence/${file}`, alt, width: 2940, height: 1420 });

const proposal = "My proposal · example data";

/* ---------------------------------------------------------------- */
/* The 18 slides                                                     */
/* ---------------------------------------------------------------- */

export const slides: readonly Slide[] = [
  // INTRO
  {
    id: "cover",
    chapter: "intro",
    type: "cover",
    title: "Cover",
    headline: "How to turn a ClickUp signup into a paying customer.",
    subline: "Three messages, one system, and how to test it.",
    byline: "By Yael Nachumow",
    meta: "",
  },

  // THE CUSTOMER
  {
    id: "customer",
    chapter: "customer",
    type: "lead",
    title: "One customer",
    headline: "To make it concrete, I\u00A0picked one customer:",
    highlight: "small marketing agencies.",
    columns: [
      { label: "Already on ClickUp", text: "ClickUp sells to agencies and publishes their stories." },
      { label: "Self-serve", text: "Small teams pick a plan and check out. No sales call." },
      { label: "Grow by seats", text: "The owner starts alone, then invites the team." },
    ],
  },
  {
    id: "maya",
    chapter: "customer",
    type: "persona",
    title: "Meet Maya",
    headline: "Meet Maya, my customer.",
    name: "Maya",
    role: "Marketing agency owner",
    portrait: { src: "/maya/happy.png", alt: "Maya, illustrated", width: 512, height: 512 },
    chips: ["10 employees", "12 clients", "Pays by card"],
    quote: "“I spend half my day asking: where are we on this?”",
    facts: [
      { icon: "alert", label: "Her pain", value: "Work slips across Slack, sheets and email." },
      { icon: "bolt", label: "Her job to be done", value: "Set up every new client fast." },
      { icon: "chart", label: "How she grows", value: "More clients, more seats." },
    ],
  },
  {
    id: "assumptions",
    chapter: "customer",
    type: "assumptions",
    title: "Four assumptions",
    headline: "I have no ClickUp data.",
    headlineMuted: "So I made four assumptions about Maya.",
    rows: [
      {
        label: "Activation",
        mood: "worried",
        text: "She’s comparing 2\u2060–\u20603 tools. If day one feels hard, she picks another.",
        leadsTo: "Her new first screen",
      },
      {
        label: "Retention",
        mood: "neutral",
        text: "She signs up, a client calls, she forgets. Nothing brings her back.",
        leadsTo: "The next-morning email",
      },
      {
        label: "AI adoption",
        mood: "delighted",
        text: "She won’t explore AI menus. But one click for her client’s 4-week plan? She’ll try.",
        leadsTo: "AI inside her project",
      },
      {
        label: "Conversion",
        mood: "happy",
        text: "$170 a month (10 × $17). Worth it once her team works here, not in sheets.",
        leadsTo: "Upgrade at the limit",
      },
    ],
  },

  // ONBOARDING
  {
    id: "sign-up",
    chapter: "onboarding",
    type: "thought",
    title: "Sign up as Maya",
    headline: "Now, let’s sign up as Maya.",
    subline: "ClickUp’s real signup: 8 questions before she sees the product.",
    mood: "happy",
    thought: "This should take two minutes.",
  },
  // (interactive: one slide, nine screens)
  {
    id: "onboarding",
    chapter: "onboarding",
    type: "onboarding",
    title: "Eight questions",
    headline: "Question 1 of 8",
    steps: [
      {
        title: "Question 1 of 8",
        question: 1,
        patience: 5,
        mood: "neutral",
        bubbles: [{ text: "Work. Hopefully this is quick." }],
        shot: onboardingShot(1, "What would you like to use ClickUp for? Work, Personal, School"),
        highlight: { x: 4.04, y: 45.76, w: 13.26, h: 8.86 },
        connector: { kind: "elbow-down", target: 0, at: 0.5 },
      },
      {
        title: "Question 2 of 8",
        question: 2,
        patience: 4,
        mood: "worried",
        bubbles: [{ text: "Where’s “client projects”? That’s what I actually manage." }, { text: "We’re a marketing agency, so… Marketing, I guess." }],
        shot: onboardingShot(2, "What would you like to manage? Fourteen options from Startup to Other"),
        highlight: { x: 22.47, y: 46.13, w: 13.76, h: 8.67 },
        connector: { kind: "elbow-down", target: 1, at: 0.95 },
      },
      {
        title: "Question 3 of 8",
        question: 3,
        patience: 3,
        mood: "worried",
        bubbles: [{ text: "Ugh, a marketing survey now?" }, { text: "Come on, I just want to try the tool." }],
        shot: onboardingShot(3, "How did you hear about us? Twelve options"),
        highlight: { x: 3.41, y: 27.12, w: 38.0, h: 8.49 },
        connector: { kind: "elbow-right", target: 0 },
      },
      {
        title: "Question 4 of 8",
        question: 4,
        patience: 2,
        mood: "annoyed",
        bubbles: [{ text: "My phone number? So a sales rep can call me mid-meeting?" }, { text: "Nope. Skip." }],
        shot: onboardingShot(4, "Enter your phone number if you'd like help with account setup"),
        highlight: { x: 3.91, y: 42.07, w: 28.54, h: 9.78 },
        connector: { kind: "straight", target: 0 },
      },
      {
        title: "Question 5 of 8",
        question: 5,
        patience: 2,
        mood: "annoyed",
        bubbles: [{ text: "Invite my team to something I haven’t even tried?" }, { text: "If it’s a mess, I look bad. Not yet." }],
        shot: onboardingShot(5, "Invite people to your Workspace"),
        highlight: { x: 3.9, y: 38.56, w: 92.6, h: 9.59 },
        connector: { kind: "straight", target: 0 },
      },
      {
        title: "Question 5 of 8, asked twice",
        question: 5,
        patience: 1,
        mood: "exasperated",
        bubbles: [{ text: "Seriously? I already said no." }, { text: "Stop pushing. Skip." }],
        shot: onboardingShot(6, "Skip without inviting? People that invite others are 4x more successful"),
        highlight: { x: 26.89, y: 37.64, w: 46.46, h: 24.54 },
        connector: { kind: "straight", target: 0 },
      },
      {
        title: "Question 6 of 8",
        question: 6,
        patience: 1,
        mood: "exasperated",
        bubbles: [{ text: "Wait, what is this for?" }, { text: "Will it bring my stuff in, or is it just another survey?" }],
        shot: onboardingShot(7, "Do you use any of these tools? Eighteen logos"),
        highlight: { x: 3.41, y: 20.48, w: 41.04, h: 7.75 },
        connector: { kind: "elbow-right", target: 0 },
      },
      {
        title: "Question 7 of 8",
        question: 7,
        patience: 1,
        mood: "exasperated",
        bubbles: [{ text: "How would I know? I haven’t even seen the tool yet." }, { text: "I just want my clients in one place." }],
        shot: onboardingShot(8, "Which features are you interested in trying? Eighteen features"),
        highlight: { x: 3.41, y: 20.48, w: 58.08, h: 7.75 },
        connector: { kind: "elbow-right", target: 0 },
      },
      {
        title: "Question 8 of 8",
        question: 8,
        patience: 1,
        mood: "neutral",
        bubbles: [{ text: "Finally, the last one." }, { text: "My agency name. Now show me the tool." }],
        shot: onboardingShot(9, "Lastly, what would you like to name your Workspace?"),
        highlight: { x: 3.91, y: 41.51, w: 79.04, h: 9.78 },
        connector: { kind: "straight", target: 0 },
      },
    ],
  },

  // MOMENT 1
  {
    id: "m1-problem",
    chapter: "moments",
    type: "annotated",
    build: true,
    title: "Moment 1 · First screen",
    headline: "8 questions later: a blank project and no first step.",
    shot: firstScreenLight,
    marks: [
      {
        n: "1",
        box: { x: 25.19, y: 33.86, w: 71.52, h: 15.75 },
        text: "Task 1, 2, 3. Nothing\nfrom her answers.",
        label: { side: "below", x: 54.9 },
      },
      {
        n: "2",
        box: { x: 4.43, y: 2.89, w: 17.34, h: 96.06 },
        text: "6 ways to create something.\nNone says “add a client.”",
        label: { side: "below", x: 0 },
      },
      {
        n: "3",
        box: { x: 73.67, y: 5.51, w: 26.08, h: 6.04 },
        text: "AI is just one more button.",
        label: { side: "right", x: 0 },
      },
    ],
    mood: "exasperated",
    bubbles: [{ text: "Oh god, this is a lot." }, { text: "I just want to set up my new client. Where do I even start?" }],
    toBubble: { mark: "1", target: 1 },
  },
  {
    id: "m1-setup",
    chapter: "moments",
    type: "walkthrough",
    title: "Moment 1 · Setup",
    section: "Moment 1 · Setup",
    headline: "My fix, step 1: she adds the client and her services.",
    steps: [
      {
        headline: "My fix, step 1: she adds the client and her services.",
        subline: "My proposal, for owners who pick Agency in setup.",
        shot: setupShot("setup-1-add-the-client.png", "Proposed setup, step 1 of 3: name the client and pick the services"),
        marks: [
          {
            n: "1",
            box: { x: 36.87, y: 43.98, w: 38.13, h: 7.85 },
            text: "Each service\nbecomes a list.",
            label: { side: "below", x: 100, anchor: "end" },
          },
          {
            n: "2",
            box: { x: 4.8, y: 27.75, w: 15.4, h: 14.66 },
            text: "Each client gets\nits own folder.",
            label: { side: "below", x: 0 },
          },
        ],
        mood: "neutral",
        bubbles: [{ text: "Oh, it’s asking about my actual client." }, { text: "Social and paid ads. Easy." }],
        toBubble: { mark: "1", target: 0 },
      },
      {
        headline: "Step 2: she adds this week’s real work.",
        shot: setupShot("setup-2-add-the-work.png", "Proposed setup, step 2 of 3: add this week's tasks under each service"),
        marks: [
          {
            n: "1",
            box: { x: 20.96, y: 58.12, w: 77.27, h: 14.92 },
            text: "Her tasks, her dates.\nNo templates.",
            label: { side: "below", x: 0 },
            line: "slanted",
          },
          {
            n: "2",
            box: { x: 20.96, y: 84.55, w: 77.27, h: 9.69 },
            text: "Or she pastes rows from her sheet.",
            label: { side: "below", x: 100, anchor: "end" },
          },
        ],
        mood: "neutral",
        bubbles: [{ text: "What’s due this week…" }, { text: "Oh nice, I can just paste my sheet." }],
        toBubble: { mark: "1", target: 0 },
      },
      {
        headline: "Step 3: she assigns tasks without inviting anyone.",
        shot: setupShot("setup-3-assign-owners.png", "Proposed setup, step 3 of 3: assign a teammate without sending an invite"),
        marks: [
          {
            n: "1",
            box: { x: 71.46, y: 83.51, w: 20.83, h: 16.49 },
            text: "Assign now, invite later.\nHer team never sees a mess.",
            label: { side: "below", x: 100, anchor: "end" },
          },
        ],
        mood: "delighted",
        bubbles: [{ text: "Wait, I can assign Sam without inviting him?" }, { text: "Good. They’ll see it once it’s ready." }],
        toBubble: { mark: "1", target: 0 },
      },
      {
        headline: "Done: her client is set up. Next, she invites the team.",
        shot: setupShot("setup-4-done.png", "Setup done: Acme Co is set up, with an Invite Lia and Sam button"),
        marks: [
          {
            n: "1",
            box: { x: 84.72, y: 25.65, w: 12.25, h: 7.07 },
            text: "Next: invite the team.\nEach invite is a new seat.",
            label: { side: "right", x: 0 },
          },
          {
            n: "2",
            box: { x: 21.34, y: 23.3, w: 39.65, h: 11.52 },
            text: "Reminders bring her back.",
            label: { side: "below", x: 31.94 },
          },
        ],
        mood: "delighted",
        bubbles: [{ text: "Okay, Acme’s actually in one place." }, { text: "Now I’ll invite the team." }],
        toBubble: { mark: "1", target: 1 },
      },
    ],
  },
  {
    id: "signup-gap",
    chapter: "moments",
    type: "annotated",
    title: "Signup never asks",
    headline: "You might be thinking: signup never asks if she’s an agency.",
    headlineMuted: "True. And post-signup only knows what signup asks.",
    shot: {
      src: "/evidence/onboarding-02-options.png",
      alt: "Signup question: What would you like to manage? Fourteen options, none of them agency",
      width: 1837,
      height: 536,
    },
    shotTone: "dark",
    marks: [
      {
        n: "1",
        box: { x: 0.8, y: 27.3, w: 98.6, h: 68.2 },
        text: "14 options.\nNone says “agency.”",
        label: { side: "beside", x: 0 },
      },
    ],
    note: "So I redesigned signup too. A bonus, outside my 3 hours. I’ll show it at the end.",
  },
  {
    id: "m1-email",
    chapter: "moments",
    type: "compare",
    title: "Moment 1 · Email",
    headline: "Back to Maya: she gets busy and forgets to invite Sam.",
    headlineMuted: "Next morning, email her client’s work, not ClickUp’s tutorial.",
    subline: "",
    sides: [
      {
        pill: "Today: a real ClickUp email",
        inbox: { from: "ClickUp", subject: "Daily Summary | Yael n’s Workspace", mark: "1" },
        email: {
          stats: [
            { label: "Due Today", value: 1 },
            { label: "Tomorrow", value: 1 },
            { label: "Overdue", value: 4, alert: true },
          ],
          sections: [
            {
              title: "Due Today",
              cards: [
                {
                  status: "TO DO",
                  path: ["Team Space", "Get Started with ClickUp"],
                  title: "🔗 Integrate Your Favorite Tools in ClickUp",
                  assignee: "YN",
                  mark: "2",
                },
              ],
            },
            {
              title: "Due Tomorrow",
              cards: [{ status: "TO DO", path: ["Team Space", "Get Started with ClickUp"], title: "🧠 Work Smarter with ClickUp AI", assignee: "YN" }],
            },
            {
              title: "Overdue",
              cards: [{ status: "TO DO", path: ["Team Space", "Get Started with ClickUp"], assignee: "YN", overdue: true }],
            },
          ],
          clipped: true,
        },
        labels: [
          { n: "1", text: "“Daily Summary.” Why open it?" },
          { n: "2", text: "All ClickUp’s tutorial. 4 overdue." },
        ],
      },
      {
        pill: "My proposal: same template, one job",
        inbox: {
          from: "ClickUp",
          subject: "Sam can’t see his Acme task yet",
          preview: "It’s due tomorrow. Plus: brand assets are due today.",
          time: "8:00 AM",
          unread: true,
          mark: "3",
        },
        email: {
          stats: [
            { label: "Due Today", value: 1 },
            { label: "Tomorrow", value: 1 },
            { label: "Overdue", value: 0 },
          ],
          sections: [
            {
              title: "Due Today",
              cards: [{ status: "TO DO", path: ["Acme Co", "Social"], title: "Get brand assets from Acme", assignee: "M" }],
            },
            {
              title: "Due Tomorrow",
              mark: "4",
              cards: [
                {
                  status: "TO DO",
                  path: ["Acme Co", "Paid ads"],
                  title: "Get access to their Meta ads",
                  assignee: "S",
                  pending: true,
                  note: "Sam can’t see this yet.",
                  highlight: true,
                },
              ],
              cta: { label: "Invite Sam to Acme Co", secondary: "or open Acme Co" },
            },
          ],
        },
        labels: [
          { n: "3", text: "Her client and a deadline, in the subject." },
          { n: "4", text: "The invite, asked the day Sam is needed." },
        ],
      },
    ],
  },

  // MOMENT 2
  {
    id: "m2-problem",
    chapter: "moments",
    type: "annotated",
    build: true,
    title: "Moment 2 · Five AI buttons",
    headline: "Friday: Acme wants an update, so she starts chasing the team.",
    headlineMuted: "Brain could write it, but none of its 5 buttons says so.",
    shot: firstScreenLight,
    marks: [
      { n: "1", box: { x: 0.7, y: 24, w: 3.1, h: 8 }, badge: "left" },
      { n: "2", box: { x: 4.8, y: 30, w: 16.6, h: 7.6 }, badge: "top-right" },
      { n: "3", box: { x: 53.3, y: 0.8, w: 6.8, h: 3.6 }, badge: "right" },
      { n: "4", box: { x: 76.8, y: 6.7, w: 5.4, h: 3.6 }, badge: "below" },
      { n: "5", box: { x: 89, y: 6.7, w: 4.8, h: 3.6 }, badge: "below" },
    ],
    mood: "annoyed",
    bubbles: [{ text: "Acme wants a status by 5. Time to ping everyone on Slack." }, { text: "Could one of these AI buttons do it? Which one?" }],
  },
  {
    id: "m2-screen",
    chapter: "moments",
    type: "walkthrough",
    title: "Moment 2 · AI draft",
    section: "Moment 2 · AI draft",
    headline: "My fix, step 1: on Friday, AI offers to write Acme’s update.",
    steps: [
      {
        headline: "My fix, step 1: on Friday, AI offers to write Acme’s update.",
        subline: "My proposal. On the free AI trial, right where she’s working.",
        shot: setupShot("brain-1-offer.png", "Proposed banner in Acme Co: It's Friday. Want me to draft Acme's weekly update? with Free AI trial, Not now and Draft update"),
        marks: [
          {
            n: "1",
            box: { x: 22.65, y: 25.85, w: 36.07, h: 6.9 },
            text: "Right job, right day:\nFriday, inside Acme.",
            label: { side: "below", x: 33 },
          },
          {
            n: "2",
            box: { x: 75.81, y: 26.2, w: 20.79, h: 6.2 },
            text: "One click, on the free AI trial.\nNo card.",
            label: { side: "right", x: 0 },
          },
        ],
        mood: "neutral",
        bubbles: [{ text: "Oh right, Acme wants an update today." }, { text: "Sure, let’s see what it writes." }],
        footnote: "Free plan: trial AI, 500 credits per workspace (ClickUp pricing, Oct 2026).",
      },
      {
        headline: "Step 2: the draft comes from her team’s real work.",
        shot: setupShot("brain-2-draft.png", "Brain panel with Acme Co's week 1 update, based on 3 tasks and 4 comments from this week"),
        marks: [
          {
            n: "1",
            box: { x: 68.3, y: 18.45, w: 30.54, h: 3.8 },
            text: "Built from her team’s work.\nNothing made up.",
            label: { side: "right", x: 0 },
          },
          {
            n: "2",
            box: { x: 69.32, y: 43.16, w: 28.64, h: 7.06 },
            text: "Flags what Acme owes her.",
            label: { side: "below", x: 100, anchor: "end" },
          },
        ],
        mood: "delighted",
        bubbles: [{ text: "Wait, it knows Lia’s waiting on their logo?" }, { text: "That’s an hour of Slack pings, done." }],
      },
      {
        headline: "Step 3: one click makes it every Friday.",
        shot: setupShot("brain-3-every-friday.png", "Brain offers to draft Acme's update every Friday at 3 PM, with an Every Friday button"),
        marks: [
          {
            n: "1",
            box: { x: 68.3, y: 44.93, w: 30.68, h: 18.35 },
            text: "A weekly habit, not a one-off.\nEvery new client gets it too.",
            label: { side: "right", x: 0 },
          },
        ],
        mood: "delighted",
        bubbles: [{ text: "Every Friday? Yes, please." }, { text: "Now I want all my clients in here." }],
      },
    ],
  },
  {
    id: "m2-email",
    chapter: "moments",
    type: "annotated",
    build: true,
    title: "Moment 2 · Email",
    headline: "Not in ClickUp on Friday? The same offer lands in her inbox.",
    headlineMuted: "One click, and Acme’s draft is waiting.",
    pill: "My proposal: Friday 3 PM, only if she hasn’t opened Acme",
    shot: {
      src: "/evidence/friday-email.png",
      alt: "Email from ClickUp: Acme will want an update today. Brain can draft Acme's weekly update, with a Draft Acme's update button",
      width: 1200,
      height: 1184,
    },
    shotHeight: 56,
    marks: [
      { n: "1", box: { x: 2, y: 9.46, w: 60.03, h: 6.08 }, badge: "none" },
      { n: "2", box: { x: 28.98, y: 71.11, w: 42.05, h: 11.66 }, badge: "none" },
    ],
    mood: "neutral",
    bubbles: [{ text: "Oh no, Acme’s update. I totally forgot." }, { text: "One click? Fine, do it." }],
  },

  // MOMENT 3
  {
    id: "m3-problem",
    chapter: "moments",
    type: "problem",
    title: "Moment 3 · Problem",
    eyebrow: "Moment 3 of 3 · Problem",
    headline: "She has seen value. Now give her a reason to pay.",
    shots: [
      {
        src: "/evidence/05-ai-analytics.png",
        alt: "AI Analytics: time saved 16 minutes, human cost savings $13",
        width: 1580,
        height: 742,
        caption: "ClickUp knows: AI saved her 16 minutes.",
      },
      {
        src: "/evidence/06-credits-wall.png",
        alt: "Credits wall: Get more work done with AI Super Credits, $0.001 per credit",
        width: 1580,
        height: 754,
        caption: "It asks her to pay with: “Keep the AI momentum going!”",
      },
    ],
    win: { label: "The quickest win", text: "Put her own numbers next to the price." },
  },
  {
    id: "m3-screen",
    chapter: "moments",
    type: "screen",
    title: "Moment 3 · New screen",
    eyebrow: "Moment 3 of 3 · New screen",
    headline: "Ask for money with her own results.",
    mood: "happy",
    bubble: { text: "Fair. It did save me time." },
    facts: [
      { label: "Who", value: "Maya, after her first AI win." },
      { label: "When", value: "She hits a plan limit." },
    ],
    tag: proposal,
    screen: {
      space: "Home",
      variant: "card",
      title: "Your first month in ClickUp",
      stats: [
        { value: "1", label: "client project" },
        { value: "16 min", label: "saved by AI" },
        { value: "3", label: "teammates" },
      ],
      line: "Keep AI on for your team: $17 per user a month.",
      primary: "Upgrade to Business",
      secondary: "Not now",
    },
  },
  {
    id: "m3-email",
    chapter: "moments",
    type: "email",
    title: "Moment 3 · Email",
    eyebrow: "Moment 3 of 3 · Email",
    headline: "Her results make the pitch.",
    facts: [
      { label: "Who", value: "Maya, if she did not upgrade." },
      { label: "When", value: "Once. Then 14 quiet days." },
    ],
    tag: proposal,
    email: {
      from: "ClickUp",
      subject: "Acme Co is live. Here is what ClickUp did for you.",
      body: "1 client set up. 3 teammates. 16 minutes saved by AI.",
      cta: "Keep it going on Business",
    },
  },

  // THE SYSTEM
  {
    id: "system",
    chapter: "system",
    type: "journey",
    title: "The system",
    headline: "Rules choose the moment. AI writes the message.",
    rowLabels: { show: "We show", ai: "AI does" },
    steps: [
      { state: "Signed up", show: "First client", ai: "Picks the starter", message: "Message 1" },
      { state: "First project", show: "Next task", ai: "Writes the email" },
      { state: "AI win", show: "AI builds the rest", ai: "Builds 11 tasks", message: "Message 2" },
      { state: "Repeat use", show: "Save as template", ai: "Finds gaps" },
      { state: "Paid", show: "Her results", ai: "Counts time saved", message: "Message 3" },
    ],
  },

  // TESTING
  {
    id: "loop",
    chapter: "testing",
    type: "flow",
    title: "The loop",
    headline: "Every message is tested against a group that gets nothing.",
    steps: [
      { label: "Bet", body: "One number to move." },
      { label: "Test", body: "Half get it." },
      { label: "Read", body: "AI drafts it weekly." },
      { label: "Decide", body: "Ship or cut." },
    ],
    note: "5% of users never get any message. That is how we know what the system adds.",
  },
  {
    id: "tests",
    chapter: "testing",
    type: "table",
    title: "The first three tests",
    headline: "The first three tests.",
    columns: ["Test", "Should move", "Must not hurt"],
    rows: [
      ["Starter project vs blank tasks", "First project", "Time to first task"],
      ["Next-morning email vs none", "Next-day return", "Unsubscribes"],
      ["Her numbers vs generic prompt", "Paid in 30 days", "Repeat use"],
    ],
  },

  // CLOSE
  {
    id: "close",
    chapter: "close",
    type: "close",
    title: "What ships first",
    headline: "What ships first.",
    items: [
      { title: "Starter project + next-morning email", note: "Every new user. No AI cost." },
      { title: "AI offer inside the project", note: "Only users with AI access." },
      { title: "Upgrade screen with her results", note: "Uses data ClickUp already has." },
    ],
    footer: "How I used AI here: drafting copy and this deck. Every claim comes from a screen I saw.",
  },
];

export function chapterOf(slide: Slide): Chapter {
  return chapters.find((c) => c.id === slide.chapter) ?? chapters[0];
}

/** How many internal steps a slide has (1 for a plain slide). Print renders one page per step. */
export function stepCount(slide: Slide): number {
  switch (slide.type) {
    case "onboarding":
    case "walkthrough":
      return slide.steps.length;
    case "compare":
      // the emails alone, then each side's annotations in turn
      return slide.sides.length + 1;
    default:
      return 1;
  }
}
