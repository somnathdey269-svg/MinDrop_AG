import { useEffect, useState } from "react";
import type { PackGradient } from "./packs";

export interface CustomSection {
  id: string;
  text: string;
  emoji: string;
  timeOfDay: string; // HH:MM
}

export interface CustomPack {
  id: string;
  name: string;
  emoji: string;
  shortDesc: string;
  gradient: PackGradient;
  createdAt: number;
  sections: CustomSection[];
}

const KEY = "gmd:customPacks.v1";

export function useCustomPacks() {
  const [list, setList] = useState<CustomPack[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setList(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  const save = (next: CustomPack[]) => {
    setList(next);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const createPack = (p: Omit<CustomPack, "id" | "createdAt" | "sections">) => {
    const pack: CustomPack = {
      ...p,
      id: `cp_${Date.now().toString(36)}`,
      createdAt: Date.now(),
      sections: [],
    };
    save([pack, ...list]);
    return pack.id;
  };

  const removePack = (id: string) => save(list.filter((p) => p.id !== id));

  const addSection = (packId: string, s: Omit<CustomSection, "id">) => {
    const section: CustomSection = { ...s, id: `cs_${Date.now().toString(36)}` };
    save(list.map((p) => p.id === packId ? { ...p, sections: [...p.sections, section] } : p));
    return section.id;
  };

  const removeSection = (packId: string, sectionId: string) => {
    save(list.map((p) => p.id === packId
      ? { ...p, sections: p.sections.filter((s) => s.id !== sectionId) }
      : p));
  };

  const updateSection = (packId: string, sectionId: string, patch: Partial<Omit<CustomSection, "id">>) => {
    save(list.map((p) => p.id === packId
      ? { ...p, sections: p.sections.map((s) => s.id === sectionId ? { ...s, ...patch } : s) }
      : p));
  };

  return { list, hydrated, createPack, removePack, addSection, removeSection, updateSection };
}
