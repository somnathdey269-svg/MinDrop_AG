// Rules engine — plain-English If/Then automations that quietly pre-fill
// the capture wizard. Admin authors a catalog of rules; the user just
// toggles them On / Off and can revert any tweak with Back-to-default.

import { useEffect, useMemo, useState } from "react";
import type { PersonalityId } from "./quiz";
import { useOnboarding } from "./store";

export type RuleTriggerKind =
  | "category-is"        // when user picks a specific category
  | "text-contains"      // when capture text contains keyword
  | "after-hour"         // when capture time is after HH
  | "weekday";           // when day matches

export interface RuleEffect {
  setNotify?: "notification" | "alarm";
  setCategory?: string;          // category id
  setRemindOffsetHours?: number; // negative = ahead
  preferredWhen?: "hours" | "tomorrow" | "pick" | "schedule";
  quietBeforeHour?: number;      // do not nudge before
}

export interface RuleDef {
  id: string;
  sentence: string;            // single-line plain English shown to user
  trigger: { kind: RuleTriggerKind; value: string };
  effect: RuleEffect;
  defaultOn: boolean;
  suggestedFor?: PersonalityId[];
  shipsWithPack?: string[];    // pack IDs that auto-enable this rule
  category?: "Timing" | "Quiet hours" | "Smart tags" | "Routines";
}

export interface RulesConfig {
  catalog: RuleDef[];
}

export const SEED_RULES: RuleDef[] = [
  {
    id: "bills-alarm",
    sentence: "When I capture a Bill, remind me 2 days early with an alarm.",
    trigger: { kind: "category-is", value: "bill" },
    effect: { setNotify: "alarm", setRemindOffsetHours: -48 },
    defaultOn: true,
    suggestedFor: ["planner", "juggler"],
    category: "Smart tags",
  },
  {
    id: "call-people",
    sentence: "When my thought contains 'call', tag it as a Call.",
    trigger: { kind: "text-contains", value: "call" },
    effect: { setCategory: "call", setNotify: "notification" },
    defaultOn: true,
    suggestedFor: ["storyteller", "juggler"],
    category: "Smart tags",
  },
  {
    id: "late-night-quiet",
    sentence: "If I capture after 10pm, don't ping me before 8am.",
    trigger: { kind: "after-hour", value: "22" },
    effect: { quietBeforeHour: 8 },
    defaultOn: true,
    category: "Quiet hours",
  },
  {
    id: "sunday-plan",
    sentence: "Every Sunday 7pm, nudge me to plan the week.",
    trigger: { kind: "weekday", value: "sun-19" },
    effect: { preferredWhen: "schedule" },
    defaultOn: false,
    suggestedFor: ["planner"],
    category: "Routines",
  },
  {
    id: "med-alarm",
    sentence: "When I capture Medication, use an alarm (not a gentle ping).",
    trigger: { kind: "category-is", value: "meds" },
    effect: { setNotify: "alarm" },
    defaultOn: true,
    category: "Smart tags",
  },
  {
    id: "gift-tomorrow",
    sentence: "When I capture a Gift, default the timing to a future date.",
    trigger: { kind: "category-is", value: "gift" },
    effect: { preferredWhen: "pick" },
    defaultOn: false,
    suggestedFor: ["storyteller", "planner"],
    category: "Timing",
  },
  {
    id: "idea-notify",
    sentence: "When I capture an Idea, keep it a gentle ping (no alarm).",
    trigger: { kind: "category-is", value: "idea" },
    effect: { setNotify: "notification" },
    defaultOn: true,
    suggestedFor: ["freespirit", "storyteller"],
    category: "Smart tags",
  },
  {
    id: "promise-alarm",
    sentence: "When I capture a Promise, use an alarm so I don't drop it.",
    trigger: { kind: "category-is", value: "promise" },
    effect: { setNotify: "alarm" },
    defaultOn: false,
    suggestedFor: ["juggler", "storyteller"],
    category: "Smart tags",
  },
];

const KEY = "memoryos.rules.v2";
const STATE_KEY = "memoryos.rules.state.v1";

export function useRulesCatalog() {
  const [catalog, setCatalog] = useState<RuleDef[]>(SEED_RULES);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setCatalog(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  const save = (next: RuleDef[]) => {
    setCatalog(next);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };
  const reset = () => {
    try { window.localStorage.removeItem(KEY); } catch {}
    setCatalog(SEED_RULES);
  };
  return { catalog, save, reset, hydrated };
}

// Per-user enabled state + any local overrides. "Back to default" wipes
// the user override so the rule reverts to the admin catalog version.
interface UserRuleState {
  enabled: Record<string, boolean>;       // ruleId → on/off
  overrides: Record<string, Partial<RuleEffect>>; // ruleId → tweaks
}

const USER_DEFAULT: UserRuleState = { enabled: {}, overrides: {} };

export function useUserRules() {
  const [state, setState] = useState<UserRuleState>(USER_DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STATE_KEY);
      if (raw) setState({ ...USER_DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);
  const persist = (next: UserRuleState) => {
    setState(next);
    try { window.localStorage.setItem(STATE_KEY, JSON.stringify(next)); } catch {}
  };
  const isOn = (rule: RuleDef) => state.enabled[rule.id] ?? rule.defaultOn;
  const toggle = (rule: RuleDef) =>
    persist({ ...state, enabled: { ...state.enabled, [rule.id]: !isOn(rule) } });
  const setOn = (ruleId: string, on: boolean) =>
    persist({ ...state, enabled: { ...state.enabled, [ruleId]: on } });
  const resetRule = (ruleId: string) => {
    const enabled = { ...state.enabled }; delete enabled[ruleId];
    const overrides = { ...state.overrides }; delete overrides[ruleId];
    persist({ enabled, overrides });
  };
  return { state, isOn, toggle, setOn, resetRule, hydrated };
}

export function useSuggestedRules() {
  const { state } = useOnboarding();
  const { catalog } = useRulesCatalog();
  const { isOn } = useUserRules();
  return useMemo(() => {
    if (!state.personality) return [] as RuleDef[];
    return catalog.filter((r) =>
      r.suggestedFor?.includes(state.personality!) && !isOn(r)
    ).slice(0, 4);
  }, [catalog, state.personality, isOn]);
}
