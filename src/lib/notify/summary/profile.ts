import type { SummaryProfile } from "./types";

const KEY = "mindrop.summary.profile.v1";

const DEFAULT: SummaryProfile = {
  brevity: "balanced",
  tone: "coach",
  topAppsLast7d: [],
  ignoreApps: [],
  updatedAt: Date.now(),
};

export function readProfile(): SummaryProfile {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...(JSON.parse(raw) as SummaryProfile) };
  } catch { return DEFAULT; }
}

export function writeProfile(p: SummaryProfile) {
  try { window.localStorage.setItem(KEY, JSON.stringify({ ...p, updatedAt: Date.now() })); } catch {}
}

export function patchProfile(patch: Partial<SummaryProfile>) {
  writeProfile({ ...readProfile(), ...patch });
}

export function resetProfile() {
  try { window.localStorage.removeItem(KEY); } catch {}
}

export function markIgnoreApp(pkg: string) {
  const p = readProfile();
  if (p.ignoreApps.includes(pkg)) return;
  writeProfile({ ...p, ignoreApps: [...p.ignoreApps, pkg] });
}
