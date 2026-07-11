/**
 * The single source of truth for the MinDrop storybook.
 * Every marketing page is a chapter. Order matters — it drives
 * prev/next, the book menu, and the "Previously…" recap.
 */

export type ChapterSlug =
  | "overwhelm"
  | "drop"
  | "ping"
  | "walk"
  | "settings"
  | "why"
  | "free"
  | "take-home";

export type ChapterPath =
  | "/"
  | "/do-it-later"
  | "/notify-feature"
  | "/places-feature"
  | "/settings-feature"
  | "/why-mindrop"
  | "/pricing"
  | "/download";

export type TimeOfDay =
  | "dawn"
  | "morning"
  | "noon"
  | "afternoon"
  | "evening"
  | "dusk"
  | "twilight"
  | "night";

export interface Chapter {
  slug: ChapterSlug;
  number: number;
  path: ChapterPath;
  romanNumeral: string;
  title: string;
  teaser: string;        // one-liner in the Book menu
  recap: string;         // Keeper-voice summary, shown at TOP of the NEXT chapter
  time: TimeOfDay;
  /** Hex sky color used for the chapter's ambient background */
  skyTop: string;
  skyBottom: string;
  /** Ink/text color that reads on the sky */
  ink: string;
}

export const CHAPTERS: Chapter[] = [
  {
    slug: "overwhelm",
    number: 1,
    path: "/",
    romanNumeral: "I",
    title: "The Overwhelm",
    teaser: "Too much to hold. Meet the Keeper.",
    recap: "You met the Keeper — the little you that never forgets — right when your head was full of sticky notes.",
    time: "dawn",
    skyTop: "#f7d9b6",
    skyBottom: "#f9f0e2",
    ink: "#2b1d14",
  },
  {
    slug: "drop",
    number: 2,
    path: "/do-it-later",
    romanNumeral: "II",
    title: "The Drop",
    teaser: "One tap. Thought lands on a shelf.",
    recap: "You learned to drop small thoughts onto a shelf, so your head stayed clear.",
    time: "morning",
    skyTop: "#ffe9c9",
    skyBottom: "#fbf6ea",
    ink: "#241a10",
  },
  {
    slug: "ping",
    number: 3,
    path: "/notify-feature",
    romanNumeral: "III",
    title: "The Quiet Ping",
    teaser: "A ping arrives. A rule catches it.",
    recap: "You taught the Keeper to watch pings you already get and hand back the ones that matter.",
    time: "noon",
    skyTop: "#ffe6a8",
    skyBottom: "#fef4d8",
    ink: "#2a1e0a",
  },
  {
    slug: "walk",
    number: 4,
    path: "/places-feature",
    romanNumeral: "IV",
    title: "The Walk-Past",
    teaser: "A map pin glows as you walk past.",
    recap: "You pinned memories to real spots on the map — a quiet tap as you walked in, silence otherwise.",
    time: "afternoon",
    skyTop: "#ffd39a",
    skyBottom: "#fdead2",
    ink: "#2a1d0e",
  },
  {
    slug: "settings",
    number: 5,
    path: "/settings-feature",
    romanNumeral: "V",
    title: "Make It Yours",
    teaser: "Colour, type, and the small dials that make the app yours.",
    recap: "You dressed the app in your own colours and type — small dials, honest defaults.",
    time: "evening",
    skyTop: "#f2a978",
    skyBottom: "#f6d3b2",
    ink: "#28150a",
  },
  {
    slug: "why",
    number: 6,
    path: "/why-mindrop",
    romanNumeral: "VI",
    title: "Why This Book",
    teaser: "What the Keeper does differently.",
    recap: "You saw where MinDrop agrees with other apps, and the few places it walks a different way.",
    time: "dusk",
    skyTop: "#c98a76",
    skyBottom: "#e9c2ac",
    ink: "#1e0f0a",
  },
  {
    slug: "free",
    number: 7,
    path: "/pricing",
    romanNumeral: "VII",
    title: "The Free Promise",
    teaser: "5 drops, 3 rules, 3 places — honest.",
    recap: "You saw the Free Promise, exactly as the app enforces it. No tricks, no dark patterns.",
    time: "twilight",
    skyTop: "#8a6a86",
    skyBottom: "#c9b1c3",
    ink: "#1a0f18",
  },
  {
    slug: "take-home",
    number: 8,
    path: "/download",
    romanNumeral: "VIII",
    title: "Take It Home",
    teaser: "Keeper sleeps. Phone glows. Get the app.",
    recap: "You reached the last page. The Keeper is on your phone now, quietly ready.",
    time: "night",
    skyTop: "#1b2340",
    skyBottom: "#3a3f5c",
    ink: "#f6efe1",
  },
];

export const CHAPTER_BY_PATH: Record<string, Chapter> = Object.fromEntries(
  CHAPTERS.map((c) => [c.path, c])
);

export function chapterFor(pathname: string): Chapter | undefined {
  return CHAPTER_BY_PATH[pathname];
}

export function prevOf(c: Chapter): Chapter | undefined {
  return CHAPTERS[c.number - 2];
}

export function nextOf(c: Chapter): Chapter | undefined {
  return CHAPTERS[c.number];
}

/** Chapter numbers whose recap should show on the current chapter. */
export function recapChapters(c: Chapter): Chapter[] {
  // Show every chapter before the current one, in order.
  if (c.number <= 1) return [];
  return CHAPTERS.slice(0, c.number - 1);
}

export const READ_KEY = "mindrop.book.read.v1";

export function readChaptersFromStorage(): Set<ChapterSlug> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as ChapterSlug[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function markChapterRead(slug: ChapterSlug) {
  if (typeof window === "undefined") return;
  const set = readChaptersFromStorage();
  set.add(slug);
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify(Array.from(set)));
  } catch {
    /* ignore */
  }
}
