import type { ProviderId, StoredKey } from "./types";

const KEY = "mindrop.summary.keys.v1";
const ACTIVE = "mindrop.summary.activeProvider.v1";

// Very light obfuscation. NOT encryption — browsers can't hide from users.
function obf(s: string): string { return btoa(unescape(encodeURIComponent(s))).split("").reverse().join(""); }
function deobf(s: string): string { try { return decodeURIComponent(escape(atob(s.split("").reverse().join("")))); } catch { return ""; } }

type Store = Partial<Record<ProviderId, Omit<StoredKey, "provider"> & { key: string }>>;

function read(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    return parsed || {};
  } catch { return {}; }
}
function write(next: Store) {
  try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
}

export function getKey(provider: ProviderId): StoredKey | null {
  const s = read();
  const entry = s[provider];
  if (!entry) return null;
  return { provider, ...entry, key: deobf(entry.key) };
}

export function saveKey(provider: ProviderId, key: string, model: string) {
  const s = read();
  s[provider] = { key: obf(key), model, savedAt: Date.now() };
  write(s);
}

export function markTested(provider: ProviderId, tested: boolean) {
  const s = read();
  const e = s[provider];
  if (!e) return;
  s[provider] = { ...e, tested, testedAt: Date.now() };
  write(s);
}

export function updateModel(provider: ProviderId, model: string) {
  const s = read();
  const e = s[provider];
  if (!e) return;
  s[provider] = { ...e, model };
  write(s);
}

export function deleteKey(provider: ProviderId) {
  const s = read();
  delete s[provider];
  write(s);
  if (getActiveProvider() === provider) setActiveProvider(null);
}

export function listSaved(): ProviderId[] {
  return Object.keys(read()) as ProviderId[];
}

export function getActiveProvider(): ProviderId | null {
  try { return (window.localStorage.getItem(ACTIVE) as ProviderId | null) || null; } catch { return null; }
}
export function setActiveProvider(p: ProviderId | null) {
  try {
    if (p) window.localStorage.setItem(ACTIVE, p);
    else window.localStorage.removeItem(ACTIVE);
  } catch {}
}
