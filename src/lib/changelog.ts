export interface ChangelogEntry {
  version: string;
  date: string;
  notes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "0.4",
    date: "2026-07-06",
    notes: [
      "Free plan is fully offline — no sign-up required.",
      "New Diagnostics screen to check permissions and storage.",
      "Better sign-out cleanup on Premium.",
      "Improved SEO metadata across public pages.",
    ],
  },
  {
    version: "0.3",
    date: "2026-06-20",
    notes: [
      "Memory Packs library expanded.",
      "Places geofencing on Android (native build).",
      "Custom rules editor.",
    ],
  },
  {
    version: "0.2",
    date: "2026-05-10",
    notes: [
      "Voice capture and playback.",
      "Recall banner and rechallenge flow.",
      "Country themes and personality quiz.",
    ],
  },
];

const SEEN_KEY = "memoryos.changelog.seen.v1";

export function getLastSeenVersion(): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(SEEN_KEY); } catch { return null; }
}

export function markChangelogSeen(version: string) {
  try { window.localStorage.setItem(SEEN_KEY, version); } catch {}
}

export function hasUnseenChangelog(): boolean {
  const latest = CHANGELOG[0]?.version;
  if (!latest) return false;
  return getLastSeenVersion() !== latest;
}
