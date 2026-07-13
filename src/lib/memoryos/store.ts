import { useEffect, useRef, useState } from "react";
import { defaultQuestions, defaultPersonalities, type QuizQuestion, type Personality, type PersonalityId } from "./quiz";
import { isUserAddedPackMemory, type Memory } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { upsertMemoryReminder, deleteMemoryReminder } from "@/lib/memoryReminderSync.functions";

const MEM_KEY = "memoryos.memories.v1";
const MEM_CHANGED_EVENT = "memoryos:memories-changed";

export function useMemories() {
  const [list, setList] = useState<Memory[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(MEM_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Memory[];
        const migrated = parsed.map((m) => (isUserAddedPackMemory(m) ? { ...m, source: { kind: "capture" as const } } : m));
        setList(migrated);
        if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
          window.localStorage.setItem(MEM_KEY, JSON.stringify(migrated));
        }
      }
    } catch {}
    setHydrated(true);
    const readLocal = () => {
      try {
        const raw = window.localStorage.getItem(MEM_KEY);
        setList(raw ? JSON.parse(raw) : []);
      } catch {}
    };
    const onStorage = (e: StorageEvent) => { if (e.key === MEM_KEY) readLocal(); };
    const onChanged = () => readLocal();
    window.addEventListener("storage", onStorage);
    window.addEventListener(MEM_CHANGED_EVENT, onChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(MEM_CHANGED_EVENT, onChanged);
    };
  }, []);
  const persist = (next: Memory[]) => {
    setList(next);
    try {
      window.localStorage.setItem(MEM_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(MEM_CHANGED_EVENT));
    } catch {}
  };
  const add = (m: Memory) => persist([m, ...list]);
  const remove = (id: string) => persist(list.filter((x) => x.id !== id));
  const update = (id: string, patch: Partial<Memory>) =>
    persist(list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const softDelete = (id: string) =>
    persist(list.map((x) => (x.id === id ? { ...x, deletedAt: new Date().toISOString() } : x)));
  const archive = (id: string) =>
    persist(list.map((x) => (x.id === id ? { ...x, archivedAt: new Date().toISOString() } : x)));
  const restore = (id: string) =>
    persist(list.map((x) => (x.id === id ? { ...x, archivedAt: undefined, deletedAt: undefined } : x)));
  const reschedule = (id: string, dueAt: string, when: string) =>
    persist(list.map((x) => (x.id === id ? { ...x, dueAt, date: when, archivedAt: undefined, deletedAt: undefined } : x)));

  // Mirror reminder-bearing memories to the DB so server-side push cron can fire.
  const syncedRef = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) return;
      const cur = syncedRef.current;
      const seen = new Set<string>();
      for (const m of list) {
        if (!m.id || m.deletedAt) continue;
        const key = `${m.dueAt || ""}|${m.text?.slice(0, 200) || ""}|${m.firedAt ? "1" : "0"}`;
        seen.add(m.id);
        if (!m.dueAt) continue; // only track reminder-bearing memories
        if (cur.get(m.id) === key) continue;
        try {
          await upsertMemoryReminder({
            data: {
              id: m.id,
              title: m.text || "Reminder",
              remindAt: m.dueAt,
              snoozedUntil: null,
              fired: m.firedAt ? true : false,
            },
          });
          cur.set(m.id, key);
        } catch { /* offline / auth expired — retry next change */ }
        if (cancelled) return;
      }
      // Delete rows for memories that were removed locally
      for (const id of Array.from(cur.keys())) {
        if (!seen.has(id)) {
          try { await deleteMemoryReminder({ data: { id } }); } catch {}
          cur.delete(id);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [list, hydrated]);

  return { list, add, remove, update, persist, softDelete, archive, restore, reschedule, hydrated };
}


export type Plan = "free" | "premium";

export type PersonalityToggleKey = "notify" | "timing" | "packs" | "copy";
export type PersonalityToggles = Record<PersonalityToggleKey, boolean>;

export const DEFAULT_PERSONALITY_TOGGLES: PersonalityToggles = {
  notify: true,
  timing: true,
  packs: true,
  copy: true,
};

export interface SetupChoice { optionId: string; enabled: boolean; }
export type SetupChoices = Record<string, SetupChoice>;

export interface OnboardingState {
  onboarded: boolean;
  plan: Plan | null;
  email: string | null;
  name: string | null;
  packs: string[];
  forgets: string[];
  permissions: { notifications: boolean; mic: boolean };
  personality: PersonalityId | null;
  quizSkipped: boolean;
  personalityToggles: PersonalityToggles;
  setupChoices: SetupChoices;
}

const KEY = "memoryos.state.v4";
const ADMIN_KEY = "memoryos.admin.v1";
const QUIZ_KEY = "memoryos.quizconfig.v3";
const CATS_KEY = "memoryos.categories.v3";

const DEFAULT: OnboardingState = {
  onboarded: false,
  plan: "free",
  email: null,
  name: null,
  packs: [],
  forgets: [],
  permissions: { notifications: false, mic: false },
  personality: null,
  quizSkipped: false,
  personalityToggles: DEFAULT_PERSONALITY_TOGGLES,
  setupChoices: {},
};


function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const loaded = readLS(KEY, DEFAULT);
    // Migrate legacy personalityToggles → setupChoices for the 4 canonical categories
    if ((!loaded.setupChoices || Object.keys(loaded.setupChoices).length === 0) && loaded.personalityToggles) {
      const t = loaded.personalityToggles;
      loaded.setupChoices = {
        nudge: { optionId: "", enabled: !!t.notify },
        timing: { optionId: "", enabled: !!t.timing },
        packs: { optionId: "", enabled: !!t.packs },
        copy: { optionId: "", enabled: !!t.copy },
      };
    }
    setState(loaded);
    setHydrated(true);
  }, []);

  const update = (patch: Partial<OnboardingState> | ((prev: OnboardingState) => OnboardingState)) =>
    setState((s) => {
      const next = typeof patch === "function" ? patch(s) : { ...s, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  const reset = () => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
    setState(DEFAULT);
  };
  return { state, update, reset, hydrated };
}

export interface AdminState {
  signedIn: boolean;
  workspace: "dev" | "staging" | "prod";
  twoFa: boolean;
}
const ADMIN_DEFAULT: AdminState = { signedIn: false, workspace: "prod", twoFa: false };

export function useAdmin() {
  const [state, setState] = useState<AdminState>(ADMIN_DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setState(readLS(ADMIN_KEY, ADMIN_DEFAULT));
    setHydrated(true);
  }, []);
  const update = (patch: Partial<AdminState>) =>
    setState((s) => {
      const next = { ...s, ...patch };
      try {
        window.localStorage.setItem(ADMIN_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  const signOut = () => {
    try {
      window.localStorage.removeItem(ADMIN_KEY);
    } catch {}
    setState(ADMIN_DEFAULT);
  };
  return { state, update, signOut, hydrated };
}

export interface QuizConfig {
  questions: QuizQuestion[];
  personalities: Personality[];
}
const QUIZ_DEFAULT: QuizConfig = {
  questions: defaultQuestions,
  personalities: defaultPersonalities,
};

export function useQuizConfig() {
  const [config, setConfig] = useState<QuizConfig>(QUIZ_DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(QUIZ_KEY);
      if (raw) setConfig(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  const save = (next: QuizConfig) => {
    setConfig(next);
    try {
      window.localStorage.setItem(QUIZ_KEY, JSON.stringify(next));
    } catch {}
  };
  const resetConfig = () => {
    try {
      window.localStorage.removeItem(QUIZ_KEY);
    } catch {}
    setConfig(QUIZ_DEFAULT);
  };
  return { config, save, resetConfig, hydrated };
}

export interface Category { id: string; label: string; emoji: string; template: string; color: string; benefit: string; }
const CATS_DEFAULT: Category[] = [
  { id: "errand",    label: "Errand",     emoji: "🛒", template: "Buy {item} from {place}",            color: "#FFD8B5", benefit: "Saved you a second trip — and the eye-roll that comes with it." },
  { id: "person",    label: "Person",     emoji: "👤", template: "Remember {name}'s {detail}",          color: "#FFC9DE", benefit: "Made someone feel seen because you remembered the small thing." },
  { id: "place",     label: "Place",      emoji: "📍", template: "{action} at {place}",                 color: "#B9E3FF", benefit: "No frantic 'where was that again?' moment. You just knew." },
  { id: "idea",      label: "Idea",       emoji: "💡", template: "Idea: {idea}",                        color: "#FFF1A8", benefit: "Caught a spark before it floated off forever." },
  { id: "promise",   label: "Promise",    emoji: "🤝", template: "Promised {person} to {action}",       color: "#D8C5FF", benefit: "Kept your word without anyone needing to chase you." },
  { id: "gift",      label: "Gift",       emoji: "🎁", template: "Get {gift} for {person}",             color: "#FFB8B8", benefit: "Avoided the 11pm panic-shopping spiral." },
  { id: "meds",      label: "Medication", emoji: "💊", template: "Take {medicine} ({dose})",            color: "#C5F0D8", benefit: "Stayed on track with what your body actually needs." },
  { id: "work",      label: "Work",       emoji: "💼", template: "Follow up on {task} with {person}",   color: "#D4D4C8", benefit: "Looked sharp by following up before they had to ask." },
  { id: "call",      label: "Call",       emoji: "📞", template: "Call {person} about {topic}",         color: "#B5E8E0", benefit: "Closed a loop instead of letting it linger." },
  { id: "email",     label: "Email",      emoji: "📧", template: "Email {person} about {topic}",        color: "#CCE0FF", benefit: "One less item rotting in your mental inbox." },
  { id: "bill",      label: "Bill",       emoji: "💳", template: "Pay {bill} bill ({amount})",          color: "#FFD9A8", benefit: "Dodged a late fee — your wallet says thanks." },
  { id: "birthday",  label: "Birthday",   emoji: "🎂", template: "{person}'s birthday — {detail}",      color: "#FFC2E2", benefit: "You were the first one to wish them. That's a flex." },
  { id: "parking",   label: "Parking",    emoji: "🅿️", template: "Parked at {location}",               color: "#C8D8FF", benefit: "Walked straight to your car. No level-4 wandering." },
  { id: "stuff",     label: "Stuff",      emoji: "🔑", template: "Put {item} at {location}",            color: "#E8D8B8", benefit: "Found it on the first try. Magic? No, just memory." },
  { id: "package",   label: "Package",    emoji: "📦", template: "Package from {sender} — {action}",    color: "#FFE0B5", benefit: "Caught it before it got returned to sender." },
  { id: "meal",      label: "Meal",       emoji: "🍽️", template: "{meal}: {detail}",                   color: "#FFCFA8", benefit: "Showed up hungry — and on time." },
  { id: "workout",   label: "Workout",    emoji: "🏋️", template: "{activity} at {time}",               color: "#C5E8B8", benefit: "Streak intact. Future-you appreciates it." },
  { id: "read",      label: "Read/Watch", emoji: "📚", template: "Check out {title} ({source})",        color: "#E0C8FF", benefit: "That 'I'll remember it' recommendation didn't vanish." },
  { id: "travel",    label: "Travel",     emoji: "✈️", template: "{detail} on {date}",                  color: "#B8E0FF", benefit: "Smooth trip — no detail dropped in the chaos." },
  { id: "event",     label: "Event",      emoji: "🎫", template: "{event} at {place}",                  color: "#FFD0E8", benefit: "Showed up. Right place, right time, right outfit." },
  { id: "pet",       label: "Pet",        emoji: "🐶", template: "{pet} needs {action}",                color: "#FFE8B5", benefit: "Tail-wag earned. They never had to remind you." },
  { id: "plant",     label: "Plant",      emoji: "🌱", template: "Water {plant}",                       color: "#C8E8C0", benefit: "Still alive. Quietly thriving. You're a plant person now." },
  { id: "code",      label: "Code/PIN",   emoji: "🔐", template: "{service} code: {code}",              color: "#D8E0E8", benefit: "Got in on the first try. No reset-password ritual." },
  { id: "other",     label: "Other",      emoji: "✍️", template: "{note}",                              color: "#E8E4DD", benefit: "One less thing renting space in your head." },
];

export function useCategories() {
  const [list, setList] = useState<Category[]>(CATS_DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(CATS_KEY);
      if (raw) setList(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  const save = (next: Category[]) => {
    setList(next);
    try { window.localStorage.setItem(CATS_KEY, JSON.stringify(next)); } catch {}
  };
  const resetList = () => {
    try { window.localStorage.removeItem(CATS_KEY); } catch {}
    setList(CATS_DEFAULT);
  };
  return { list, save, resetList, hydrated };
}

