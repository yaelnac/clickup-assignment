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
  text: string;
  /**
   * Where the label sits. "above" / "below": its left edge ("start") or right edge ("end") at `x`
   * percent of the image width. "right": at the top of the column beside the image (`x` unused).
   * `width` caps the label's text width in ch, which decides where it wraps (default 20).
   */
  label: { side: "above" | "below" | "right"; x: number; anchor?: "start" | "end"; width?: number };
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
    | {
        type: "annotated";
        headline: string;
        shot: Shot;
        marks: Mark[];
        mood: Mood;
        bubbles: Bubble[];
        /** A line from one mark's outline to one of Maya's bubbles. */
        toBubble?: { mark: string; target: number };
      }
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

const firstScreen: Shot = {
  src: "/evidence/02-first-screen.png",
  alt: "ClickUp home after setup: a list with Task 1, Task 2 and Task 3",
  width: 2176,
  height: 1046,
};

const firstScreenLight: Shot = {
  src: "/evidence/first-screen-light.png",
  alt: "ClickUp home after setup, light mode: a list with Task 1, Task 2 and Task 3",
  width: 2192,
  height: 1053,
};

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
    title: "Moment 1 · First screen",
    headline: "8 questions later: a blank project and no first step.",
    shot: firstScreenLight,
    marks: [
      {
        n: "1",
        box: { x: 25.19, y: 33.86, w: 71.52, h: 15.75 },
        text: "Task 1, 2, 3. Nothing from her answers.",
        label: { side: "below", x: 54.9, width: 14 },
      },
      {
        n: "2",
        box: { x: 4.43, y: 2.89, w: 17.34, h: 96.06 },
        text: "6 ways to create something. None says “add a client.”",
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
    id: "m1-screen",
    chapter: "moments",
    type: "screen",
    title: "Moment 1 · New screen",
    eyebrow: "Moment 1 of 3 · New screen",
    headline: "Her first screen: one task.",
    mood: "happy",
    bubble: { text: "My new client. Exactly what I need today." },
    facts: [
      { label: "Who", value: "New owners who picked Marketing." },
      { label: "When", value: "Right after setup." },
    ],
    tag: proposal,
    screen: {
      space: "Team Space",
      variant: "card",
      welcome: "Welcome, Maya.",
      title: "Which client are we setting up first?",
      input: "Acme Co",
      rows: [
        { label: "Kickoff call", meta: "Tomorrow" },
        { label: "Collect brand assets", meta: "Thursday" },
        { label: "First report", meta: "Friday" },
      ],
      primary: "Create Acme Co project",
      secondary: "Skip",
    },
  },
  {
    id: "m1-email",
    chapter: "moments",
    type: "email",
    title: "Moment 1 · Email",
    eyebrow: "Moment 1 of 3 · Email",
    headline: "Next morning, bring her back.",
    facts: [
      { label: "Who", value: "Maya, if she has not come back." },
      { label: "When", value: "8:00 the next day." },
    ],
    tag: proposal,
    email: {
      from: "ClickUp",
      subject: "Acme Co: your kickoff call is today",
      body: "Hi Maya, your Acme Co project is ready.",
      card: { title: "Kickoff call", meta: "Due today" },
      cta: "Open the task",
    },
  },

  // MOMENT 2
  {
    id: "m2-problem",
    chapter: "moments",
    type: "problem",
    title: "Moment 2 · Problem",
    eyebrow: "Moment 2 of 3 · Problem",
    headline: "She has a project. Now get her to use AI.",
    shots: [firstScreen],
    mood: "worried",
    bubbles: [{ text: "So… which AI button?" }],
    highlights: [
      { x: 53, y: 1, w: 7.5, h: 3.6 },
      { x: 0.6, y: 24, w: 3.6, h: 7 },
      { x: 5, y: 30, w: 16, h: 8 },
      { x: 76.5, y: 7, w: 6, h: 3.6 },
      { x: 88.8, y: 7, w: 5.4, h: 3.6 },
    ],
    points: ["AI shows up in 5 places.", "None says what it can do for her."],
    win: { label: "The quickest win", text: "Offer the result inside her project." },
  },
  {
    id: "m2-screen",
    chapter: "moments",
    type: "screen",
    title: "Moment 2 · New screen",
    eyebrow: "Moment 2 of 3 · New screen",
    headline: "AI offers the rest of her project.",
    mood: "happy",
    bubble: { text: "Wait, it wrote the whole onboarding?" },
    facts: [
      { label: "Who", value: "Maya, with AI access and 3+ tasks." },
      { label: "When", value: "Her second visit, no AI used yet." },
    ],
    tag: proposal,
    screen: {
      space: "Client onboarding",
      variant: "page",
      heading: "Acme Co",
      rows: [
        { label: "Kickoff call", meta: "Tomorrow" },
        { label: "Collect brand assets", meta: "Thursday" },
        { label: "First report", meta: "Friday" },
      ],
      ai: {
        text: "AI can write the other 11 onboarding tasks, with owners and dates.",
        primary: "Build it with AI",
        secondary: "Not now",
      },
    },
  },
  {
    id: "m2-email",
    chapter: "moments",
    type: "email",
    title: "Moment 2 · Email",
    eyebrow: "Moment 2 of 3 · Email",
    headline: "Same offer, in her inbox.",
    facts: [
      { label: "Who", value: "Maya, if she has not tried AI." },
      { label: "When", value: "2 days after her first project." },
    ],
    tag: proposal,
    email: {
      from: "ClickUp",
      subject: "Acme Co has 3 tasks. AI can write the other 11.",
      body: "One click, and the full onboarding is ready.",
      cta: "Build it with AI",
    },
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
      return slide.steps.length;
    default:
      return 1;
  }
}
