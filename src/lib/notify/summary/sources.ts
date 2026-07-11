import { useCallback, useEffect, useState } from "react";
import type { SummaryPreset, SummarySources } from "./types";

const PRESETS_KEY = "mindrop.summary.presets.v1";
const ACTIVE_KEY = "mindrop.summary.activePreset.v1";
const CAT_OVR_KEY = "mindrop.summary.categoryOverrides.v1";

export type CategoryId = "social" | "chat" | "work" | "shopping" | "news" | "finance" | "system" | "other";

// Rough heuristics — user can override per package.
const CATEGORY_HINTS: Array<{ cat: CategoryId; match: RegExp }> = [
  { cat: "chat", match: /whatsapp|telegram|signal|messenger|imess|slack|discord|teams|gmail/i },
  { cat: "social", match: /instagram|facebook|snap|tiktok|twitter|x\.corp|reddit|threads|linkedin/i },
  { cat: "work", match: /outlook|office|zoom|meet|jira|asana|notion|figma|drive|dropbox|calendar/i },
  { cat: "shopping", match: /amazon|flipkart|myntra|zepto|blinkit|swiggy|zomato|meesho|nykaa|ajio/i },
  { cat: "news", match: /news|inshorts|dailyhunt|toi|bbc|hindustan|ndtv|indianexpress/i },
  { cat: "finance", match: /paytm|phonepe|gpay|googlepay|hdfc|icici|sbi|axis|kotak|cred|upi|zerodha|groww/i },
  { cat: "system", match: /android|samsung|xiaomi|oneplus|vivo|oppo|realme|system|updater|foreground/i },
];

export function categoryFor(pkg: string, appName: string): CategoryId {
  const overrides = readOverrides();
  if (overrides[pkg]) return overrides[pkg] as CategoryId;
  const hay = `${pkg} ${appName}`;
  for (const { cat, match } of CATEGORY_HINTS) if (match.test(hay)) return cat;
  return "other";
}

function readOverrides(): Record<string, CategoryId> {
  try {
    const raw = window.localStorage.getItem(CAT_OVR_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
export function setCategoryOverride(pkg: string, cat: CategoryId) {
  const o = readOverrides();
  o[pkg] = cat;
  try { window.localStorage.setItem(CAT_OVR_KEY, JSON.stringify(o)); } catch {}
}

export const DEFAULT_SOURCES: SummarySources = {
  scope: "all",
  filters: {
    timeWindow: "all",
    minCount: 1,
    includeChatBodies: false,
    includeTransactional: false,
  },
};

const STARTER_PRESETS: SummaryPreset[] = [
  { id: "p_all", name: "All apps", sources: DEFAULT_SOURCES },
  {
    id: "p_work", name: "Work only",
    sources: { ...DEFAULT_SOURCES, scope: "categories", categoryIds: ["work", "chat"] },
  },
  {
    id: "p_social", name: "Social detox",
    sources: { ...DEFAULT_SOURCES, scope: "categories", categoryIds: ["social"] },
  },
];

function readPresets(): SummaryPreset[] {
  try {
    const raw = window.localStorage.getItem(PRESETS_KEY);
    if (!raw) return STARTER_PRESETS;
    const parsed = JSON.parse(raw) as SummaryPreset[];
    return parsed.length ? parsed : STARTER_PRESETS;
  } catch { return STARTER_PRESETS; }
}
function writePresets(list: SummaryPreset[]) {
  try { window.localStorage.setItem(PRESETS_KEY, JSON.stringify(list)); } catch {}
}

export function getActivePresetId(): string {
  try { return window.localStorage.getItem(ACTIVE_KEY) || "p_all"; } catch { return "p_all"; }
}
export function setActivePresetId(id: string) {
  try { window.localStorage.setItem(ACTIVE_KEY, id); } catch {}
}

export function usePresets() {
  const [list, setList] = useState<SummaryPreset[]>([]);
  const [activeId, setActiveId] = useState<string>("p_all");

  useEffect(() => {
    setList(readPresets());
    setActiveId(getActivePresetId());
  }, []);

  const save = useCallback((p: SummaryPreset) => {
    const cur = readPresets();
    const idx = cur.findIndex((x) => x.id === p.id);
    const next = idx >= 0 ? cur.map((x, i) => (i === idx ? p : x)) : [...cur, p];
    writePresets(next);
    setList(next);
  }, []);

  const remove = useCallback((id: string) => {
    if (id.startsWith("p_")) return; // don't remove starters
    const next = readPresets().filter((x) => x.id !== id);
    writePresets(next);
    setList(next);
    if (getActivePresetId() === id) {
      setActivePresetId("p_all");
      setActiveId("p_all");
    }
  }, []);

  const activate = useCallback((id: string) => {
    setActivePresetId(id);
    setActiveId(id);
  }, []);

  return { list, activeId, save, remove, activate };
}
