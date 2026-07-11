import { useCallback, useEffect, useState } from "react";
import type { PlaceRule } from "./types";

const RULES_KEY = "mindrop.places.rules.v1";

function read(): PlaceRule[] {
  try {
    const raw = window.localStorage.getItem(RULES_KEY);
    return raw ? (JSON.parse(raw) as PlaceRule[]) : [];
  } catch { return []; }
}
function write(next: PlaceRule[]) {
  try {
    window.localStorage.setItem(RULES_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent("storage", { key: RULES_KEY }));
  } catch {}
}

export function readPlaceRules(): PlaceRule[] { return read(); }
export function persistPlaceRules(next: PlaceRule[]) { write(next); }

export function usePlaceRules() {
  const [list, setList] = useState<PlaceRule[]>([]);
  useEffect(() => {
    setList(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === RULES_KEY || e.key === null) setList(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const upsert = useCallback((rule: PlaceRule) => {
    const cur = read();
    const idx = cur.findIndex((r) => r.id === rule.id);
    const next = idx >= 0 ? cur.map((r, i) => (i === idx ? rule : r)) : [rule, ...cur];
    write(next);
  }, []);
  const remove = useCallback((id: string) => {
    write(read().filter((r) => r.id !== id));
  }, []);
  const patch = useCallback((id: string, p: Partial<PlaceRule>) => {
    write(read().map((r) => (r.id === id ? { ...r, ...p } : r)));
  }, []);
  const removeForPlace = useCallback((placeId: string) => {
    write(read().filter((r) => r.placeId !== placeId));
  }, []);

  return { list, upsert, remove, patch, removeForPlace };
}
