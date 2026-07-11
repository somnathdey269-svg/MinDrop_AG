// Recall engine — every category and every pack is a first-class pattern.
// Super Admin edits defaults + per-category / per-pack overrides. Nothing is hardcoded.

import { useEffect, useMemo, useState } from "react";
import { useCategories, useMemories, type Category } from "./store";
import { usePacks, type Pack } from "./packs";
import { isPersonalMemory, type Memory } from "./types";
import { generateRecallContent, fillMethodExample, type MethodExample } from "./recallContent";

export type { MethodExample } from "./recallContent";

export type RecallMethodId =
  | "story"
  | "image"
  | "quote"
  | "checklist"
  | "location"
  | "person"
  | "before-leave"
  | "rehearsal"
  | "song"
  | "smell"
  | "chain"
  | "number-hook";

export interface RecallMethod {
  id: RecallMethodId;
  emoji: string;
  name: string;
  shortDesc: string;
  instruction: string;
  benefit: string;
  enabled: boolean;
  premium: boolean;
  color: string;
  /** Real ready-to-use example the user can copy. Supports {name}. */
  exampleTitle?: string;
  exampleText?: string;
  exampleImageUrl?: string;
  exampleItems?: string[];
}

export interface RecallRule {
  enabled: boolean;
  threshold: number;
  windowDays: number;
  methodIds: RecallMethodId[];
  premium: boolean;
  title: string;         // supports {name}
  patternCopy: string;   // supports {name} and {n}
  whyCopy: string;
  nextTimeCopy: string;
  benefit: string;
  emotion?: string;      // e.g. "💡 Spark" — shown as pill on the card
  /** Per-method example overrides — admin edits override auto-generated content. */
  methodExamples?: Partial<Record<RecallMethodId, MethodExample>>;
  /** true once admin has edited the rule; false rules track defaults + live source name */
  customized?: boolean;
}

export interface RecallDefaults {
  threshold: number;
  windowDays: number;
  methodIds: RecallMethodId[];
  premium: boolean;
  title: string;
  patternCopy: string;
  whyCopy: string;
  nextTimeCopy: string;
  benefit: string;
  emotion: string;
}

export type RecallRuleKind = "category" | "pack";

export interface EffectiveRule extends RecallRule {
  id: string;         // "category:idea" | "pack:parking-pack"
  key: string;        // "idea" | "parking-pack"
  kind: RecallRuleKind;
  sourceName: string; // e.g. "Idea" or "Peace of mind"
  sourceEmoji?: string;
}

export interface RecallConfig {
  unlockThreshold: number;
  unlockBehavior: "lock-visible" | "hide";
  unlockBanner: string;
  heroCopy: string;
  emptyStateTitle: string;
  emptyStateCopy: string;
  methods: RecallMethod[];
  defaults: RecallDefaults;
  categoryRules: Record<string, RecallRule>;
  packRules: Record<string, RecallRule>;
}

export interface RecallSuggestion {
  id: string;
  rule: EffectiveRule;
  memories: Memory[];
  count: number;
  sampleText: string;
  primaryMethod: RecallMethod;
  methods: RecallMethod[];
}

export interface RecallNearMiss {
  ruleId: string;
  name: string;
  count: number;
  threshold: number;
}

interface AcceptedSuggestion {
  suggestionId: string;
  ruleId: string;
  methodId: RecallMethodId;
  acceptedAt: number;
}

interface RecallState {
  accepted: AcceptedSuggestion[];
  dismissedRuleIds: string[];
  streakDays: number;
  lastActionDay: string | null;
  /** Recall methods the user recently accepted — always surfaced first, most recent first. */
  preferredMethodIds: RecallMethodId[];
  /** User-defined minimum captures needed to form a pattern. null = follow admin defaults. */
  userThreshold: number | null;
}

export const USER_THRESHOLD_MIN = 3;
export const USER_THRESHOLD_MAX = 10;

const KEY = "memoryos.recall.trends.v2";
const STATE_KEY = "memoryos.recall.trendstate.v1";
const STATE_EVENT = "memoryos:recall-state";
const CONFIG_EVENT = "memoryos:recall-config";
const STATE_DEFAULT: RecallState = { accepted: [], dismissedRuleIds: [], streakDays: 0, lastActionDay: null, preferredMethodIds: [], userThreshold: null };

export const DEFAULT_METHODS: RecallMethod[] = [
  { id: "story",        emoji: "📖",  name: "Tiny story",        shortDesc: "Turn the detail into a small scene.",       instruction: "Attach it to a 10-second scene with one surprising twist.", benefit: "Scenes stick faster than plain reminders.", enabled: true, premium: false, color: "#FFE7C2",
    exampleTitle: "Your {name} story",
    exampleText: "Picture this — it's a quiet morning at home. The kettle is boiling, the toaster pops, and just as you reach for your cup, a giant neon signboard flashes “{name}!” right above the stove. From now on, every time you hear a kettle whistle, {name} will pop up in your head like a friend tapping your shoulder." },
  { id: "image",        emoji: "🖼️", name: "Image anchor",      shortDesc: "Notice one visual object around it.",       instruction: "Pair it with one visible object, sign, colour, or photo.", benefit: "Your eyes recognise it before memory does.", enabled: true, premium: false, color: "#DDEBFF",
    exampleTitle: "Your {name} anchor",
    exampleImageUrl: "",
    exampleText: "Take a photo of the exact spot — the blue water bottle on the shelf, the poster on the wall, the sign near the door — and mentally stick {name} onto it. That object becomes your bookmark." },
  { id: "quote",        emoji: "💬",  name: "Sticky phrase",     shortDesc: "One line you can hum in your head.",         instruction: "Turn it into one short catchy phrase that repeats itself.", benefit: "Short lines replay on their own.", enabled: true, premium: false, color: "#F1ECFF",
    exampleTitle: "Say it like this",
    exampleText: "“{name} — do it now, or lose it later.”" },
  { id: "checklist",    emoji: "✅",   name: "Tiny checklist",    shortDesc: "Break it into 2–3 steps.",                   instruction: "Save it as: what, when, done.", benefit: "Small steps kill the panic.", enabled: true, premium: false, color: "#D6F2E0",
    exampleTitle: "Your {name} checklist",
    exampleItems: ["Write one clear line about {name}", "Decide the exact moment you'll need it", "Tick it off the second it's done"] },
  { id: "location",     emoji: "📍",  name: "Place cue",         shortDesc: "Tie it to where you'll be.",                 instruction: "Include the place where it should pop up.", benefit: "The place becomes the alarm.", enabled: true, premium: false, color: "#CFEFFF",
    exampleTitle: "Your {name} place cue",
    exampleText: "Pin {name} to the front door of your home. The moment your hand touches the handle — {name} rings in your head. No willpower needed." },
  { id: "person",       emoji: "👤",  name: "Person cue",        shortDesc: "Attach it to a person.",                     instruction: "Save the person's name plus the one detail that matters.", benefit: "People are stronger cues than notes.", enabled: true, premium: false, color: "#FFD6E6",
    exampleTitle: "Your {name} person cue",
    exampleText: "Pair {name} with the next person you'll meet today — “when I see Alex, remember {name}.” Their face becomes the alarm." },
  { id: "before-leave", emoji: "🚪",  name: "Before you leave",  shortDesc: "Surface it at the exit moment.",             instruction: "Set it for the second before you step out, not after.", benefit: "Catches it while there's still time.", enabled: true, premium: true, color: "#FFE1B8",
    exampleTitle: "Right before you leave",
    exampleItems: ["Keys, wallet, phone — check", "{name} handled?", "Close the door only when both are ✓"] },
  { id: "rehearsal",    emoji: "🔁",  name: "Mental replay",     shortDesc: "Replay it once in your head.",               instruction: "Take a breath, mentally do it correctly, one time.", benefit: "Future you already did it once.", enabled: true, premium: true, color: "#E0E4D4",
    exampleTitle: "Rehearse {name} in 10 seconds",
    exampleText: "Close your eyes. See yourself doing {name} from start to finish — pick it up, handle it, done. Open your eyes. The trailer has already played." },
  { id: "song",         emoji: "🎵",  name: "Jingle it",         shortDesc: "Sing it to a tune you already know.",        instruction: "Set {name} to a tune or jingle you already hum.", benefit: "Music sits in memory for years.", enabled: true, premium: true, color: "#FFE9F1",
    exampleTitle: "Your {name} jingle",
    exampleText: "Sing it to “Happy Birthday” — “{name}, {name}, {name}…” Sing it once and your brain will repeat it for you." },
  { id: "smell",        emoji: "👃",  name: "Smell hook",        shortDesc: "Tie it to a smell around you.",              instruction: "Link {name} to a smell you meet often — coffee, soap, fresh laundry.", benefit: "Smell memory is the stickiest of all.", enabled: true, premium: true, color: "#F5E4C7",
    exampleTitle: "Your {name} smell",
    exampleText: "Every morning, when you smell your first coffee, think of {name}. In three days — the smell hits and {name} shows up on its own." },
  { id: "chain",        emoji: "🔗",  name: "Link it up",         shortDesc: "Chain it to something you already do.",      instruction: "Attach {name} to a daily habit — brushing, coffee, unlocking your phone.", benefit: "Old habit carries the new memory piggyback.", enabled: true, premium: true, color: "#E8F0D9",
    exampleTitle: "Piggyback {name}",
    exampleItems: ["Pick one daily thing — brushing, first coffee, phone unlock", "Every time it happens — say {name} in your head", "In 3 days the habit will pull {name} along with it"] },
  { id: "number-hook",  emoji: "🔢",  name: "Number hook",        shortDesc: "Turn it into a small number rhyme.",         instruction: "Give {name} a number and a rhyme — 1-bun, 2-shoe style.", benefit: "Numbers + rhymes = super grip.", enabled: true, premium: true, color: "#EFE0FF",
    exampleTitle: "Number rhyme for {name}",
    exampleText: "“One — {name} is done. Two — see it through. Three — {name} and me.” Say it out loud once and it sticks in your ears." },
];

export const DEFAULT_RULE_DEFAULTS: RecallDefaults = {
  threshold: 2,
  windowDays: 30,
  methodIds: ["story", "image", "quote", "checklist", "location", "person", "before-leave", "rehearsal", "song", "smell", "chain", "number-hook"],
  premium: false,
  title: "{name} keeps coming back",
  patternCopy: "You've saved {n} {name} thoughts recently.",
  whyCopy: "When the same thing repeats, it usually means the moment to remember it needs a sharper cue — not just another note.",
  nextTimeCopy: "Next time it happens, use one of the recall tricks below so you catch it before it slips.",
  emotion: "🧠 On your mind",
  benefit: "You stop re-saving the same reminder — future you just remembers.",
};

export const DEFAULT_RECALL_CONFIG: RecallConfig = {
  unlockThreshold: 3,
  unlockBehavior: "lock-visible",
  unlockBanner: "Capture {n} more thoughts to unlock automatic recall ideas.",
  heroCopy: "MinDrop studies what you keep saving, then suggests an easier way to remember it next time.",
  emptyStateTitle: "Recall starts after a pattern appears.",
  emptyStateCopy: "Capture similar things a few times and this page will suggest the best recall trick automatically.",
  methods: DEFAULT_METHODS,
  defaults: DEFAULT_RULE_DEFAULTS,
  categoryRules: {},
  packRules: {},
};

function mergeConfig(raw: unknown): RecallConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_RECALL_CONFIG;
  const p = raw as Partial<RecallConfig> & { trendRules?: unknown };
  const methods = (p.methods?.length ? p.methods : DEFAULT_METHODS).map((m) => ({
    ...DEFAULT_METHODS.find((d) => d.id === m.id),
    ...m,
  })) as RecallMethod[];
  return {
    unlockThreshold: p.unlockThreshold ?? DEFAULT_RECALL_CONFIG.unlockThreshold,
    unlockBehavior: p.unlockBehavior ?? DEFAULT_RECALL_CONFIG.unlockBehavior,
    unlockBanner: p.unlockBanner ?? DEFAULT_RECALL_CONFIG.unlockBanner,
    heroCopy: p.heroCopy ?? DEFAULT_RECALL_CONFIG.heroCopy,
    emptyStateTitle: p.emptyStateTitle ?? DEFAULT_RECALL_CONFIG.emptyStateTitle,
    emptyStateCopy: p.emptyStateCopy ?? DEFAULT_RECALL_CONFIG.emptyStateCopy,
    methods,
    defaults: { ...DEFAULT_RULE_DEFAULTS, ...(p.defaults ?? {}) },
    categoryRules: (p.categoryRules ?? {}) as Record<string, RecallRule>,
    packRules: (p.packRules ?? {}) as Record<string, RecallRule>,
  };
}

function memoryAgeDays(memory: Memory): number {
  if (typeof memory.ageDays === "number") return memory.ageDays;
  const stamp = memory.id.match(/^m-(\d+)/)?.[1];
  if (!stamp) return 0;
  return Math.max(0, Math.floor((Date.now() - Number(stamp)) / 86_400_000));
}

function todayKey() { return new Date().toISOString().slice(0, 10); }

function updateStreak(state: RecallState): Pick<RecallState, "streakDays" | "lastActionDay"> {
  const today = todayKey();
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  if (state.lastActionDay === today) return { streakDays: state.streakDays, lastActionDay: today };
  if (state.lastActionDay === yesterday) return { streakDays: state.streakDays + 1, lastActionDay: today };
  return { streakDays: 1, lastActionDay: today };
}

function fill(text: string, name: string, n?: number) {
  return text.replaceAll("{name}", name).replaceAll("{n}", n == null ? "" : String(n));
}

/** Default emotion suggestion by category / pack name — used when admin hasn't set one. */
const DEFAULT_EMOTION_MAP: Record<string, string> = {
  idea: "💡 Spark",
  task: "✅ On it",
  reminder: "⏰ Don't miss",
  parking: "🅿️ Relief",
  bill: "💸 Peace of mind",
  medication: "🩺 Care",
  person: "❤️ Belonging",
  gift: "🎁 Warmth",
  work: "💼 Focus",
  shopping: "🛒 Ready",
  travel: "✈️ Excitement",
  study: "📚 Growth",
  food: "🍲 Comfort",
  health: "🌿 Care",
  family: "🏠 Home",
  festival: "🎉 Joy",
  money: "💰 Control",
  meeting: "🤝 Prepared",
};

function guessEmotion(sourceName: string, fallback: string): string {
  const key = sourceName.trim().toLowerCase();
  return DEFAULT_EMOTION_MAP[key] ?? fallback;
}

/** Build the effective rule for a category or pack (defaults + unique auto content + admin override). */
function effectiveRule(
  kind: RecallRuleKind,
  key: string,
  sourceName: string,
  sourceEmoji: string | undefined,
  defaults: RecallDefaults,
  override: RecallRule | undefined,
): EffectiveRule {
  // Auto-generate unique content for THIS source (category or pack).
  const auto = generateRecallContent(sourceName);

  const base: RecallRule = override ?? {
    enabled: true,
    threshold: defaults.threshold,
    windowDays: defaults.windowDays,
    methodIds: defaults.methodIds,
    premium: defaults.premium,
    title: auto.title,
    patternCopy: auto.patternCopy,
    whyCopy: auto.whyCopy,
    nextTimeCopy: auto.nextTimeCopy,
    benefit: auto.benefit,
    emotion: auto.emotion,
    methodExamples: auto.methodExamples,
    customized: false,
  };

  // Not customized → always use fresh auto content (so a rename or edit in
  // the generator flows through). Customized → keep the admin's text but
  // still fill any missing method examples from the auto library.
  const customized = Boolean(base.customized);
  const mergedExamples: Partial<Record<RecallMethodId, MethodExample>> = {
    ...auto.methodExamples,
    ...(base.methodExamples ?? {}),
  };

  return {
    ...base,
    title: customized ? base.title : auto.title,
    patternCopy: customized ? base.patternCopy : auto.patternCopy,
    whyCopy: customized ? base.whyCopy : auto.whyCopy,
    nextTimeCopy: customized ? base.nextTimeCopy : auto.nextTimeCopy,
    benefit: customized ? base.benefit : auto.benefit,
    emotion: customized && base.emotion ? base.emotion : auto.emotion,
    methodExamples: mergedExamples,
    id: `${kind}:${key}`,
    key,
    kind,
    sourceName,
    sourceEmoji,
  };
}

export function useRecallConfig() {
  const [config, setConfig] = useState<RecallConfig>(DEFAULT_RECALL_CONFIG);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const read = () => {
      try {
        const raw = window.localStorage.getItem(KEY);
        setConfig(raw ? mergeConfig(JSON.parse(raw)) : DEFAULT_RECALL_CONFIG);
      } catch { setConfig(DEFAULT_RECALL_CONFIG); }
    };
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) read(); };
    const onLocal = () => read();
    window.addEventListener("storage", onStorage);
    window.addEventListener(CONFIG_EVENT, onLocal);
    setHydrated(true);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CONFIG_EVENT, onLocal);
    };
  }, []);

  const save = (next: RecallConfig) => {
    const merged = mergeConfig(next);
    setConfig(merged);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event(CONFIG_EVENT));
    } catch {}
  };

  const reset = () => {
    try { window.localStorage.removeItem(KEY); window.dispatchEvent(new Event(CONFIG_EVENT)); } catch {}
    setConfig(DEFAULT_RECALL_CONFIG);
  };

  return { config, save, reset, hydrated };
}

export function useRecallState() {
  const [state, setState] = useState<RecallState>(STATE_DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const read = () => {
      try {
        const raw = window.localStorage.getItem(STATE_KEY);
        setState(raw ? { ...STATE_DEFAULT, ...JSON.parse(raw) } : STATE_DEFAULT);
      } catch {}
    };
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === STATE_KEY) read(); };
    const onLocal = () => read();
    window.addEventListener("storage", onStorage);
    window.addEventListener(STATE_EVENT, onLocal);
    setHydrated(true);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(STATE_EVENT, onLocal);
    };
  }, []);

  const persist = (next: RecallState) => {
    setState(next);
    try {
      window.localStorage.setItem(STATE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(STATE_EVENT));
    } catch {}
  };

  const acceptSuggestion = (suggestionId: string, ruleId: string, methodId: RecallMethodId) => {
    const streak = updateStreak(state);
    persist({
      ...state,
      ...streak,
      accepted: [
        { suggestionId, ruleId, methodId, acceptedAt: Date.now() },
        ...state.accepted.filter((a) => a.suggestionId !== suggestionId),
      ].slice(0, 40),
      preferredMethodIds: [methodId, ...state.preferredMethodIds.filter((m) => m !== methodId)].slice(0, 12),
    });
  };

  const dismissRule = (ruleId: string) => {
    persist({ ...state, dismissedRuleIds: Array.from(new Set([ruleId, ...state.dismissedRuleIds])).slice(0, 40) });
  };

  const resetDismissed = () => persist({ ...state, dismissedRuleIds: [] });

  const setUserThreshold = (value: number | null) => {
    if (value == null) return persist({ ...state, userThreshold: null });
    const clamped = Math.max(USER_THRESHOLD_MIN, Math.min(USER_THRESHOLD_MAX, Math.round(value)));
    persist({ ...state, userThreshold: clamped });
  };

  return { state, acceptSuggestion, dismissRule, resetDismissed, setUserThreshold, hydrated };
}

export function useRecallUnlock() {
  const { config } = useRecallConfig();
  const { state } = useRecallState();
  const { list } = useMemoriesForRecall();
  const captures = list.filter((m) => (!m.source || m.source.kind === "capture") && !m.archivedAt && !m.deletedAt).length;
  const threshold = state.userThreshold ?? config.unlockThreshold;
  const remaining = Math.max(0, threshold - captures);
  return {
    unlocked: captures >= threshold,
    progress: Math.min(captures, threshold),
    threshold,
    behavior: config.unlockBehavior,
    bannerCopy: config.unlockBanner.replace("{n}", String(remaining)),
  };
}

// direct import — no cycle: store does not import recall.
function useMemoriesForRecall() { return useMemories(); }

/** All effective rules (category + pack) that should be evaluated. */
export function useEffectiveRules(): EffectiveRule[] {
  const { config } = useRecallConfig();
  const { list: categories } = useCategories();
  const { list: packs } = usePacks();

  return useMemo(() => {
    const rules: EffectiveRule[] = [];
    categories.forEach((c: Category) =>
      rules.push(effectiveRule("category", c.id, c.label, c.emoji, config.defaults, config.categoryRules[c.id])),
    );
    packs.forEach((p: Pack) =>
      rules.push(effectiveRule("pack", p.id, p.name, p.emoji, config.defaults, config.packRules[p.id])),
    );
    return rules;
  }, [config.defaults, config.categoryRules, config.packRules, categories, packs]);
}

function matchMemories(rule: EffectiveRule, memories: Memory[]): Memory[] {
  // Only actively-triggered thoughts count. Voice notes, archived, and erased
  // (soft-deleted) thoughts never contribute to recall patterns.
  const eligible = memories.filter(
    (m) => !m.audioUrl && m.source?.kind !== "recording" && !m.archivedAt && !m.deletedAt,
  );
  if (rule.kind === "category") {
    const key = rule.sourceName.toLowerCase();
    return eligible.filter((m) => (m.category || "").toLowerCase() === key && memoryAgeDays(m) <= rule.windowDays);
  }
  return eligible.filter(
    (m) => m.source?.kind === "pack" && !isPersonalMemory(m) && m.source.packId === rule.key && memoryAgeDays(m) <= rule.windowDays,
  );
}

export function useRecallSuggestions(): RecallSuggestion[] {
  const { config } = useRecallConfig();
  const { state } = useRecallState();
  const { list: memories } = useMemoriesForRecall();
  const rules = useEffectiveRules();

  return useMemo(() => {
    const methodById = new Map(config.methods.filter((m) => m.enabled).map((m) => [m.id, m]));
    const preferred = state.preferredMethodIds;
    const userThreshold = state.userThreshold;

    return rules
      .filter((r) => r.enabled && !state.dismissedRuleIds.includes(r.id))
      .map((rule) => {
        const effectiveThreshold = userThreshold ?? rule.threshold;
        const matches = matchMemories(rule, memories);
        if (matches.length < effectiveThreshold) return null;
        // Base order from the rule, filtered to enabled methods
        const base = rule.methodIds.map((id) => methodById.get(id)).filter(Boolean) as RecallMethod[];
        // Reorder: preferred methods first (in user's recency order), rest keep base order
        const preferredHits = preferred
          .map((id) => base.find((m) => m.id === id))
          .filter(Boolean) as RecallMethod[];
        const rest = base.filter((m) => !preferred.includes(m.id));
        const methods = [...preferredHits, ...rest];
        const primary = methods[0] ?? Array.from(methodById.values())[0];
        if (!primary) return null;
        const named: EffectiveRule = {
          ...rule,
          threshold: effectiveThreshold,
          title: fill(rule.title, rule.sourceName, matches.length),
          patternCopy: fill(rule.patternCopy, rule.sourceName, matches.length),
          whyCopy: fill(rule.whyCopy, rule.sourceName, matches.length),
          nextTimeCopy: fill(rule.nextTimeCopy, rule.sourceName, matches.length),
          benefit: fill(rule.benefit, rule.sourceName, matches.length),
        };
        return {
          id: `${rule.id}-${matches.length}`,
          rule: named,
          memories: matches,
          count: matches.length,
          sampleText: matches[0]?.text || "",
          primaryMethod: primary,
          methods,
        } satisfies RecallSuggestion;
      })
      .filter((s): s is RecallSuggestion => Boolean(s))
      .sort((a, b) => b.count - a.count);
  }, [rules, config.methods, memories, state.dismissedRuleIds, state.preferredMethodIds, state.userThreshold]);
}

/** Rules that have activity but haven't crossed the threshold — used for the "one more capture" hint. */
export function useRecallNearMisses(): RecallNearMiss[] {
  const { state } = useRecallState();
  const { list: memories } = useMemoriesForRecall();
  const rules = useEffectiveRules();
  return useMemo(() => {
    return rules
      .filter((r) => r.enabled && !state.dismissedRuleIds.includes(r.id))
      .map((rule) => {
        const effectiveThreshold = state.userThreshold ?? rule.threshold;
        const count = matchMemories(rule, memories).length;
        if (count === 0 || count >= effectiveThreshold) return null;
        return { ruleId: rule.id, name: rule.sourceName, count, threshold: effectiveThreshold };
      })
      .filter((x): x is RecallNearMiss => Boolean(x))
      .sort((a, b) => b.count - a.count);
  }, [rules, memories, state.dismissedRuleIds, state.userThreshold]);
}

export function useRecallInsights() {
  const { config } = useRecallConfig();
  const { state } = useRecallState();
  const { list } = useMemoriesForRecall();
  const suggestions = useRecallSuggestions();
  const nearMisses = useRecallNearMisses();
  const rules = useEffectiveRules();
  const captures = list.filter(isPersonalMemory);
  const categoryCounts = captures.reduce<Record<string, number>>((acc, m: Memory) => {
    const key = m.category || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0] || null;
  return {
    config,
    state,
    suggestions,
    nearMisses,
    capturesCount: captures.length,
    activeRuleCount: rules.filter((r) => r.enabled).length,
    topCategory: top ? { category: top[0], count: top[1] } : null,
  };
}
