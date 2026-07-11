import { useEffect, useState } from "react";
import type { Memory } from "@/lib/memoryos/types";
import type { NotifyRule } from "@/lib/notify/types";
import type { Place } from "@/lib/places/types";
import { readRules as readNotifyRules, setRuleStatus as setNotifyRuleStatus } from "@/lib/notify/store";
import { readPlaces, persistPlaces } from "@/lib/places/store";

const MEM_KEY = "memoryos.memories.v1";
const NOTIFY_KEY = "mindrop.notify.rules.v1";
const PLACES_KEY = "mindrop.places.v1";

export type HistoryOrigin = "later" | "notify" | "places";
export type HistoryStatus = "archived" | "erased";

export interface HistoryItem {
  id: string;
  origin: HistoryOrigin;
  status: HistoryStatus;
  title: string;
  subtitle: string;
  at: number;
}

function readMemories(): Memory[] {
  try {
    const raw = window.localStorage.getItem(MEM_KEY);
    return raw ? (JSON.parse(raw) as Memory[]) : [];
  } catch { return []; }
}
function persistMemories(next: Memory[]) {
  try {
    window.localStorage.setItem(MEM_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent("storage", { key: MEM_KEY }));
  } catch {}
}

function collect(): HistoryItem[] {
  const out: HistoryItem[] = [];

  // Later — memories with archivedAt or deletedAt
  for (const m of readMemories()) {
    if (m.deletedAt) {
      out.push({
        id: `mem-${m.id}`,
        origin: "later",
        status: "erased",
        title: m.text || "Untitled thought",
        subtitle: `Erased ${new Date(m.deletedAt).toLocaleDateString()}`,
        at: new Date(m.deletedAt).getTime(),
      });
    } else if (m.archivedAt) {
      out.push({
        id: `mem-${m.id}`,
        origin: "later",
        status: "archived",
        title: m.text || "Untitled thought",
        subtitle: m.firedAt ? `Triggered ${new Date(m.firedAt).toLocaleDateString()}` : `Archived ${new Date(m.archivedAt).toLocaleDateString()}`,
        at: new Date(m.archivedAt).getTime(),
      });
    }
  }

  // Notify — rules with status archived/erased
  for (const r of readNotifyRules() as NotifyRule[]) {
    if (r.status !== "archived" && r.status !== "erased") continue;
    out.push({
      id: `nrule-${r.id}`,
      origin: "notify",
      status: r.status,
      title: r.remindNote?.trim() || `${r.appName} · ${r.senderMatch || "anything"}`,
      subtitle: r.lastFiredAt
        ? `Triggered ${new Date(r.lastFiredAt).toLocaleDateString()}`
        : r.status === "archived" ? "Archived rule" : "Erased rule",
      at: r.statusAt ?? r.lastFiredAt ?? 0,
    });
  }

  // Places — archived places (rules follow their place)
  for (const p of readPlaces() as Place[]) {
    if (p.deletedAt) {
      out.push({
        id: `place-${p.id}`,
        origin: "places",
        status: "erased",
        title: `${p.emoji ?? "📍"} ${p.name}`,
        subtitle: `Erased ${new Date(p.deletedAt).toLocaleDateString()}`,
        at: new Date(p.deletedAt).getTime(),
      });
    } else if (p.archivedAt) {
      out.push({
        id: `place-${p.id}`,
        origin: "places",
        status: "archived",
        title: `${p.emoji ?? "📍"} ${p.name}`,
        subtitle: `Archived ${new Date(p.archivedAt).toLocaleDateString()}`,
        at: new Date(p.archivedAt).getTime(),
      });
    }
  }

  return out.sort((a, b) => b.at - a.at);
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const refresh = () => setItems(collect());
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === MEM_KEY || e.key === NOTIFY_KEY || e.key === PLACES_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const restore = (item: HistoryItem) => {
    if (item.origin === "later") {
      const id = item.id.replace(/^mem-/, "");
      persistMemories(readMemories().map((m) => m.id === id ? { ...m, archivedAt: undefined, deletedAt: undefined } : m));
    } else if (item.origin === "notify") {
      const id = item.id.replace(/^nrule-/, "");
      setNotifyRuleStatus(id, "active");
    } else if (item.origin === "places") {
      const id = item.id.replace(/^place-/, "");
      persistPlaces(readPlaces().map((p) => p.id === id ? { ...p, archivedAt: undefined, deletedAt: undefined } : p));
    }
    setItems(collect());
  };

  const purge = (item: HistoryItem) => {
    if (item.origin === "later") {
      const id = item.id.replace(/^mem-/, "");
      persistMemories(readMemories().filter((m) => m.id !== id));
    } else if (item.origin === "notify") {
      const id = item.id.replace(/^nrule-/, "");
      // hard-remove
      const next = readNotifyRules().filter((r) => r.id !== id);
      try {
        window.localStorage.setItem(NOTIFY_KEY, JSON.stringify(next));
        window.dispatchEvent(new StorageEvent("storage", { key: NOTIFY_KEY }));
      } catch {}
    } else if (item.origin === "places") {
      const id = item.id.replace(/^place-/, "");
      persistPlaces(readPlaces().filter((p) => p.id !== id));
    }
    setItems(collect());
  };

  return { items, restore, purge };
}
