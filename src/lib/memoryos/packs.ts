import { useEffect, useState } from "react";
import { packsSeed } from "./packs.seed";

export type PackGradient = "peach" | "mint" | "lilac" | "sky" | "rose" | "sand";

export const GRADIENTS: Record<PackGradient, { from: string; to: string; chip: string; ink: string }> = {
  peach: { from: "#FFE4CC", to: "#FFCBA4", chip: "#FFD8B5", ink: "#7A3A1A" },
  mint:  { from: "#DAF5E4", to: "#B8E8CA", chip: "#C5F0D8", ink: "#1F5A3A" },
  lilac: { from: "#EADCFF", to: "#D5C0FF", chip: "#D8C5FF", ink: "#4A2E80" },
  sky:   { from: "#DDEEFF", to: "#B9DCFF", chip: "#B9E3FF", ink: "#1F4870" },
  rose:  { from: "#FFE0EC", to: "#FFC2DA", chip: "#FFC9DE", ink: "#7A2E50" },
  sand:  { from: "#FBF1DC", to: "#F4E1B5", chip: "#FFE0B5", ink: "#6B4A1A" },
};

export type Recurrence = "once" | "daily" | "weekly" | "monthly";

export interface PackTemplate {
  id: string;
  text: string;
  emoji?: string;
  categoryId?: string;
  defaultTimeOfDay: string; // "HH:MM"
  defaultRecurrence: Recurrence;
  defaultNotify: "notification" | "alarm";
  benefit?: string;
}

export interface Pack {
  id: string;
  name: string;
  emoji: string;
  shortDesc: string;
  longDesc: string;
  primaryCategoryId: string;
  benefitBullets: string[];
  howItWorks: string[];
  recoveryBenefit: string;
  gradient: PackGradient;
  visibility: "draft" | "published";
  tags: string[];
  templates: PackTemplate[];
}

const PACKS_KEY = "gmd:packs.v1";
const INSTALLS_KEY = "gmd:packInstalls.v1";

export interface PackInstall {
  packId: string;
  installedAt: number;
  activeTemplateIds: string[]; // templates user activated
}

export function usePacks() {
  const [list, setList] = useState<Pack[]>(packsSeed);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(PACKS_KEY);
      if (raw) setList(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  const save = (next: Pack[]) => {
    setList(next);
    try { window.localStorage.setItem(PACKS_KEY, JSON.stringify(next)); } catch {}
  };
  const updatePack = (id: string, patch: Partial<Pack>) => {
    save(list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };
  const updateTemplate = (packId: string, tplId: string, patch: Partial<PackTemplate>) => {
    save(list.map((p) => p.id !== packId ? p : {
      ...p,
      templates: p.templates.map((t) => t.id === tplId ? { ...t, ...patch } : t),
    }));
  };
  const addTemplate = (packId: string, tpl: PackTemplate) => {
    save(list.map((p: Pack) => p.id !== packId ? p : { ...p, templates: [...p.templates, tpl] }));
  };
  const removeTemplate = (packId: string, tplId: string) => {
    save(list.map((p) => p.id !== packId ? p : { ...p, templates: p.templates.filter((t) => t.id !== tplId) }));
  };
  const resetPack = (packId: string) => {
    const seed = packsSeed.find((p) => p.id === packId);
    if (!seed) return;
    save(list.map((p) => p.id === packId ? seed : p));
  };
  const resetAll = () => {
    try { window.localStorage.removeItem(PACKS_KEY); } catch {}
    setList(packsSeed);
  };
  return { list, save, updatePack, updateTemplate, addTemplate, removeTemplate, resetPack, resetAll, hydrated };
}

export function usePackInstalls() {
  const [installs, setInstalls] = useState<PackInstall[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(INSTALLS_KEY);
      if (raw) setInstalls(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  const persist = (next: PackInstall[]) => {
    setInstalls(next);
    try { window.localStorage.setItem(INSTALLS_KEY, JSON.stringify(next)); } catch {}
  };
  const isInstalled = (packId: string) => installs.some((i) => i.packId === packId);
  const get = (packId: string) => installs.find((i) => i.packId === packId);
  const install = (packId: string, templateIds: string[]) => {
    const existing = installs.find((i) => i.packId === packId);
    if (existing) {
      persist(installs.map((i) => i.packId === packId
        ? { ...i, activeTemplateIds: Array.from(new Set([...i.activeTemplateIds, ...templateIds])) }
        : i));
    } else {
      persist([...installs, { packId, installedAt: Date.now(), activeTemplateIds: templateIds }]);
    }
  };
  const uninstall = (packId: string) => persist(installs.filter((i) => i.packId !== packId));
  return { installs, isInstalled, get, install, uninstall, hydrated };
}
