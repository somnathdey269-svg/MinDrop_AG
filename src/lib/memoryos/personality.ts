// Personality defaults engine — admin-editable mapping from PersonalityId
// to the defaults that quietly tune the app (nudge style, time-of-day,
// pack ordering, copy variants, capture-wizard timing order, re-challenge
// cadence). User data never leaves the device.

import { useEffect, useMemo, useState } from "react";
import type { PersonalityId } from "./quiz";
import { useOnboarding, useMemories } from "./store";

export type WhenId = "hours" | "tomorrow" | "pick" | "schedule";

export interface PersonalityDefaults {
  defaultNotify: "notification" | "alarm";
  defaultTomorrowTime: string; // "HH:MM" 24h
  whenOrder: WhenId[]; // capture wizard timing order
  packAffinity: string[]; // pack IDs ranked
  taglines: string[]; // BrandMark cycles
  homeEmptyCopy: string; // first-time home blurb
  bannerCopy: string; // welcome banner subtitle
  ribbonLabel: string; // "{n} thoughts off-loaded, {Personality}"
}

export interface EngagementConfig {
  activeCapturesPerWeek: number; // >= → active
  casualCapturesPerWeek: number; // >= → casual, else dormant
  activeCadenceDays: number; // re-challenge frequency
  casualCadenceDays: number;
  dormantOnReturn: boolean; // re-challenge on app open after gap
  dormantGapDays: number;
  shortQuestionCount: number; // re-takes use fewer Qs
  bannerTitle: string;
  bannerBody: string;
}

export interface SetupOption {
  id: string;
  label: string;
  preview: string;
  how: string;
  patch?: Partial<PersonalityDefaults>;
  premium?: boolean;
}

export interface SetupCategory {
  id: string;
  icon: string; // lucide name key
  title: string;
  subtitle: string;
  options: SetupOption[];
  relevantFor: PersonalityId[]; // primary vs "More options"
  defaultOptionId: string;
  personalityDefaults: Partial<Record<PersonalityId, string>>;
  enabledByDefault: boolean;
  premium?: boolean; // whole category paywalled
}

export interface PersonalityConfig {
  defaults: Record<PersonalityId, PersonalityDefaults>;
  engagement: EngagementConfig;
  setupCatalog: SetupCategory[];
}


export const BALANCED_DEFAULTS: PersonalityDefaults = {
  defaultNotify: "notification",
  defaultTomorrowTime: "09:00",
  whenOrder: ["hours", "tomorrow", "pick", "schedule"],
  packAffinity: [],
  taglines: [
    "Remember less. Live more.",
    "Off-load a thought.",
    "Your second brain, quietly.",
    "Forget on purpose.",
    "Held for you, gently.",
  ],
  homeEmptyCopy: "Tap Capture and tell us one tiny thing on your mind.",
  bannerCopy: "Small thoughts, safely held — until you need them.",
  ribbonLabel: "thoughts off-loaded",
};

export const DEFAULT_PERSONALITY_CONFIG: PersonalityConfig = {
  engagement: {
    activeCapturesPerWeek: 7,
    casualCapturesPerWeek: 2,
    activeCadenceDays: 7,
    casualCadenceDays: 30,
    dormantOnReturn: true,
    dormantGapDays: 14,
    shortQuestionCount: 5,
    bannerTitle: "Your habits have changed",
    bannerBody: "90 seconds to re-tune MinDrop to who you are now.",
  },
  defaults: {
    juggler: {
      defaultNotify: "alarm",
      defaultTomorrowTime: "08:00",
      whenOrder: ["hours", "tomorrow", "schedule", "pick"],
      packAffinity: ["work-sprint", "errands", "promises"],
      taglines: [
        "Drop a tab. Breathe.",
        "Nine open tabs? We'll hold two.",
        "Catch it before it slips.",
        "One less thing to track.",
        "Your brain, decluttered.",
      ],
      homeEmptyCopy: "Drop the loudest thing on your mind. We'll hold it.",
      bannerCopy: "You're holding nine things. Let us hold two.",
      ribbonLabel: "tabs closed",
    },
    storyteller: {
      defaultNotify: "notification",
      defaultTomorrowTime: "10:00",
      whenOrder: ["hours", "tomorrow", "pick", "schedule"],
      packAffinity: ["people", "birthdays", "gratitude"],
      taglines: [
        "Every name, every moment.",
        "Hold the small details.",
        "For the things you'd never forgive yourself for forgetting.",
        "People-shaped memory.",
        "Stories don't fade here.",
      ],
      homeEmptyCopy: "A name? A moment? A small kindness owed? Drop it here.",
      bannerCopy: "Names, dates, the little kindnesses — held with care.",
      ribbonLabel: "moments kept",
    },
    explorer: {
      defaultNotify: "notification",
      defaultTomorrowTime: "09:00",
      whenOrder: ["hours", "tomorrow", "pick", "schedule"],
      packAffinity: ["travel", "parking", "stuff"],
      taglines: [
        "Maps for the things you put down.",
        "Where did I park, again?",
        "Bookmarks for real life.",
        "Find it on the first try.",
        "A second map, just for you.",
      ],
      homeEmptyCopy: "Where did you leave it? What did you see? Drop it in.",
      bannerCopy: "Where you put it, what it looked like — held visually.",
      ribbonLabel: "places pinned",
    },
    planner: {
      defaultNotify: "notification",
      defaultTomorrowTime: "07:30",
      whenOrder: ["schedule", "pick", "tomorrow", "hours"],
      packAffinity: ["bills", "work-sprint", "routines"],
      taglines: [
        "Calendar, but quieter.",
        "The unscheduled thing, scheduled.",
        "Less nag. More learn.",
        "Your system, with memory.",
        "Plan once. Trust forever.",
      ],
      homeEmptyCopy: "Add the next loose end. We'll thread it into your day.",
      bannerCopy: "Future you is already nodding in approval.",
      ribbonLabel: "loops closed",
    },
    freespirit: {
      defaultNotify: "notification",
      defaultTomorrowTime: "11:00",
      whenOrder: ["hours", "tomorrow", "pick", "schedule"],
      packAffinity: ["ideas", "gratitude", "music"],
      taglines: [
        "Gentle nudges. No nagging.",
        "Vibes you can return to.",
        "Catch the spark. Let the rest float.",
        "It'll come to you — and to us too.",
        "A soft place for loose thoughts.",
      ],
      homeEmptyCopy: "Catch the spark before it floats off. One line is enough.",
      bannerCopy: "Soft holds for the things that almost slipped.",
      ribbonLabel: "sparks caught",
    },
  },
  setupCatalog: [],
};

// ------------------------------------------------------------------
// Setup catalog — dynamic, admin-editable, personality-aware defaults
// ------------------------------------------------------------------
export const DEFAULT_SETUP_CATALOG: SetupCategory[] = [
  {
    id: "nudge",
    icon: "Bell",
    title: "Nudge style",
    subtitle: "How MinDrop pings you",
    relevantFor: ["juggler", "planner", "storyteller", "explorer", "freespirit"],
    defaultOptionId: "gentle",
    personalityDefaults: { juggler: "firm", planner: "firm", freespirit: "silent" },
    enabledByDefault: true,
    options: [
      { id: "gentle", label: "Gentle poke", preview: "Soft notification, no re-ping", how: "One quiet tap. If you miss it, MinDrop waits until you open the app.", patch: { defaultNotify: "notification" } },
      { id: "firm", label: "Firm alarm", preview: "Wakes you up, hard to miss", how: "Full-screen alarm you have to dismiss — for things that must not slip.", patch: { defaultNotify: "alarm" } },
      { id: "silent", label: "Silent hold", preview: "No sound, just a badge", how: "MinDrop holds it silently. You'll see it next time you open the app." },
    ],
  },
  {
    id: "timing",
    icon: "Clock",
    title: "Smart timing",
    subtitle: "When 'Tomorrow' lands",
    relevantFor: ["planner", "juggler", "storyteller", "explorer", "freespirit"],
    defaultOptionId: "morning",
    personalityDefaults: { planner: "early", juggler: "morning", storyteller: "midday", freespirit: "lateam" },
    enabledByDefault: true,
    options: [
      { id: "early",   label: "Early bird (7:30)",    preview: "Ready before the day starts", how: "Reminders land at 7:30 so you're ahead of the day, not chasing it.", patch: { defaultTomorrowTime: "07:30" } },
      { id: "morning", label: "Morning (9:00)",       preview: "First cup of coffee timing",   how: "The classic 9am nudge — clear head, first check-in of the day.",     patch: { defaultTomorrowTime: "09:00" } },
      { id: "lateam",  label: "Late morning (11:00)", preview: "For slow starters",            how: "You warm up gradually. Reminders wait until you're actually up.",   patch: { defaultTomorrowTime: "11:00" } },
      { id: "midday",  label: "Midday (13:00)",       preview: "Post-lunch reset",             how: "The lull after lunch is when your reminders show up.",                patch: { defaultTomorrowTime: "13:00" } },
      { id: "evening", label: "Evening (18:00)",      preview: "Wind-down pings",              how: "Evening-only reminders so mornings stay quiet.",                      patch: { defaultTomorrowTime: "18:00" } },
    ],
  },
  {
    id: "packs",
    icon: "Package",
    title: "Starter packs",
    subtitle: "Which memory kits appear first",
    relevantFor: ["juggler", "planner", "storyteller", "explorer", "freespirit"],
    defaultOptionId: "auto",
    personalityDefaults: {},
    enabledByDefault: true,
    options: [
      { id: "auto",    label: "Pick for me",  preview: "Top 3 for your type",       how: "MinDrop pre-orders the packs most useful for your memory type." },
      { id: "browse",  label: "I'll browse",  preview: "Show all packs, no order",  how: "No ranking. You'll pick your own packs when you're ready.", patch: { packAffinity: [] } },
      { id: "none",    label: "No packs",     preview: "Just a blank canvas",       how: "Skip packs entirely. You can still add them later from Packs.", patch: { packAffinity: [] } },
    ],
  },
  {
    id: "copy",
    icon: "MessageCircle",
    title: "Tone of copy",
    subtitle: "How MinDrop talks to you",
    relevantFor: ["storyteller", "freespirit", "juggler", "planner", "explorer"],
    defaultOptionId: "personalised",
    personalityDefaults: {},
    enabledByDefault: true,
    options: [
      { id: "personalised", label: "Tuned to me",  preview: "Copy matches your type",   how: "Taglines, banners, empty states all speak in your memory-type's voice." },
      { id: "neutral",      label: "Keep it neutral", preview: "Balanced, no vibe",     how: "Uses the default balanced copy — no personality-specific flavour.",
        patch: { taglines: BALANCED_DEFAULTS.taglines, homeEmptyCopy: BALANCED_DEFAULTS.homeEmptyCopy, bannerCopy: BALANCED_DEFAULTS.bannerCopy, ribbonLabel: BALANCED_DEFAULTS.ribbonLabel } },
      { id: "playful",      label: "Playful",       preview: "Winks and jokes",         how: "More cheeky one-liners. Not for serious moods.",
        patch: { taglines: ["Held. Like a very polite parrot.", "Your brain called. It said thanks.", "Off-loaded. Officially not your problem."], ribbonLabel: "brain tabs closed" } },
      { id: "minimal",      label: "Minimal",       preview: "Just the essentials",     how: "Zero-flair copy. Reminders and lists, no personality.",
        patch: { taglines: ["MinDrop.", "Reminders.", "Held for you."], homeEmptyCopy: "Add a thought.", bannerCopy: "Reminders held.", ribbonLabel: "saved" } },
    ],
  },
  {
    id: "recall_drills",
    icon: "Brain",
    title: "Recall drills",
    subtitle: "Passive practice for what you've saved",
    relevantFor: ["storyteller", "explorer", "planner"],
    defaultOptionId: "weekly",
    personalityDefaults: { storyteller: "daily", freespirit: "on_demand" },
    enabledByDefault: false,
    options: [
      { id: "daily",     label: "Daily cue",       preview: "One tiny recall drill each day", how: "A one-tap practice card each day — helps names, places, and promises stick." },
      { id: "weekly",    label: "Weekly review",   preview: "Sunday review card",             how: "One combined recall card per week. Low-effort, high-return." },
      { id: "on_demand", label: "Only when I open Recall", preview: "No auto-cues",           how: "MinDrop won't nudge you to practice. Recall waits for you to visit." },
    ],
  },
  {
    id: "privacy_shield",
    icon: "Shield",
    title: "Privacy shield",
    subtitle: "What shows on your lock screen",
    relevantFor: ["planner", "storyteller"],
    defaultOptionId: "hide",
    personalityDefaults: {},
    enabledByDefault: false,
    options: [
      { id: "hide",  label: "Hide preview",    preview: "'You have a MinDrop reminder'", how: "Notifications show a generic label. The actual thought only shows after you unlock." },
      { id: "show",  label: "Show preview",    preview: "Full text on lock screen",       how: "Fastest read — but anyone glancing at your phone sees the reminder." },
      { id: "ask",   label: "Ask each time",   preview: "Choose per capture",             how: "Every time you save a thought, MinDrop asks if you want to hide its preview." },
    ],
  },
  {
    id: "shortcut_order",
    icon: "ListOrdered",
    title: "Capture shortcut order",
    subtitle: "Which timing option appears first",
    relevantFor: ["juggler", "planner"],
    defaultOptionId: "hours_first",
    personalityDefaults: { planner: "schedule_first" },
    enabledByDefault: false,
    options: [
      { id: "hours_first",    label: "In hours first",    preview: "For quick same-day pings",     how: "Puts 'In hours' at the top of the capture wizard.",                                         patch: { whenOrder: ["hours", "tomorrow", "pick", "schedule"] } },
      { id: "tomorrow_first", label: "Tomorrow first",    preview: "For overnight-hold thinkers",  how: "Puts 'Tomorrow' first — good if most of your reminders are for the next morning.",         patch: { whenOrder: ["tomorrow", "hours", "pick", "schedule"] } },
      { id: "schedule_first", label: "Schedule first",    preview: "Calendar-brain first",         how: "Puts 'Schedule' at the top — for calendar-heavy planners.",                                 patch: { whenOrder: ["schedule", "pick", "tomorrow", "hours"] } },
    ],
  },
  {
    id: "recovery_window",
    icon: "Archive",
    title: "Recovery window",
    subtitle: "How long we hold completed thoughts",
    relevantFor: ["planner", "storyteller"],
    defaultOptionId: "7d",
    personalityDefaults: {},
    enabledByDefault: false,
    options: [
      { id: "3d",  label: "3 days",  preview: "Lean vault",          how: "Completed thoughts drop off after 3 days. Keeps Recovery uncluttered." },
      { id: "7d",  label: "7 days",  preview: "The MinDrop default", how: "Free plan keeps 7 days of history in Recovery." },
      { id: "14d", label: "14 days", preview: "Two-week memory",     how: "Paid plan: two weeks of Recovery.",  premium: true },
      { id: "30d", label: "30 days", preview: "Full month",          how: "Paid plan: a month of Recovery.",    premium: true },
    ],
  },
];

// mutate the constant to attach the seeded catalog
(DEFAULT_PERSONALITY_CONFIG as { setupCatalog: SetupCategory[] }).setupCatalog = DEFAULT_SETUP_CATALOG;

// Resolve the effective option ID for a personality on a given category
export function resolveSetupOption(
  cat: SetupCategory,
  personality: PersonalityId | null,
  choices: Record<string, { optionId: string; enabled: boolean }> | undefined,
): { optionId: string; enabled: boolean; option: SetupOption } {
  const choice = choices?.[cat.id];
  const optionId = choice?.optionId
    ?? (personality ? cat.personalityDefaults[personality] : undefined)
    ?? cat.defaultOptionId;
  const option = cat.options.find((o) => o.id === optionId) ?? cat.options[0];
  const enabled = choice?.enabled ?? cat.enabledByDefault;
  return { optionId: option.id, enabled, option };
}


const KEY = "memoryos.personality.v1";
const RECHALLENGE_KEY = "memoryos.rechallenge.v1";

interface RechallengeState {
  lastQuizAt: number | null; // ms epoch
  lastSeenAt: number | null; // last app open (for dormant detection)
  dismissedUntil: number | null;
}

const RECH_DEFAULT: RechallengeState = { lastQuizAt: null, lastSeenAt: null, dismissedUntil: null };

export function usePersonalityConfig() {
  const [config, setConfig] = useState<PersonalityConfig>(DEFAULT_PERSONALITY_CONFIG);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setConfig({
          ...DEFAULT_PERSONALITY_CONFIG,
          ...parsed,
          // ensure catalog present even for older saved configs
          setupCatalog: parsed.setupCatalog?.length ? parsed.setupCatalog : DEFAULT_SETUP_CATALOG,
        });
      }
    } catch {}
    setHydrated(true);
  }, []);
  const save = (next: PersonalityConfig) => {
    setConfig(next);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };
  const reset = () => {
    try { window.localStorage.removeItem(KEY); } catch {}
    setConfig(DEFAULT_PERSONALITY_CONFIG);
  };
  return { config, save, reset, hydrated };
}

// MCQ / personality auto-adjust commented out — always return balanced defaults
export function usePersonalityDefaults(): PersonalityDefaults {
  // const { state } = useOnboarding();
  // const { config } = usePersonalityConfig();
  // return useMemo(() => {
  //   if (!state.personality) return BALANCED_DEFAULTS;
  //   const base = config.defaults[state.personality] ?? BALANCED_DEFAULTS;
  //   let result: PersonalityDefaults = { ...base };
  //   const choices = state.setupChoices;
  //   for (const cat of config.setupCatalog) {
  //     const { enabled, option } = resolveSetupOption(cat, state.personality, choices);
  //     if (!enabled) { ... }
  //     if (option.patch) result = { ...result, ...option.patch };
  //   }
  //   return result;
  // }, [state.personality, state.setupChoices, config]);
  return BALANCED_DEFAULTS;
}

// Read a single setup category's active option — for downstream components
export function useSetupChoice(categoryId: string) {
  const { state } = useOnboarding();
  const { config } = usePersonalityConfig();
  return useMemo(() => {
    const cat = config.setupCatalog.find((c) => c.id === categoryId);
    if (!cat) return null;
    return { category: cat, ...resolveSetupOption(cat, state.personality, state.setupChoices) };
  }, [config.setupCatalog, categoryId, state.personality, state.setupChoices]);
}


// MCQ re-challenge commented out — never prompt the user to retake the quiz
export function useRechallenge() {
  // const { state } = useOnboarding();
  // const { config } = usePersonalityConfig();
  // const { list: memories } = useMemories();
  // const [rs, setRs] = useState<RechallengeState>(RECH_DEFAULT);
  // const [hydrated, setHydrated] = useState(false);
  // ...original logic omitted...
  return { due: false, tier: "active" as const, recentCount: 0, hydrated: true, markTaken: () => {}, dismissForDays: (_d: number) => {}, config: DEFAULT_PERSONALITY_CONFIG.engagement };
}
