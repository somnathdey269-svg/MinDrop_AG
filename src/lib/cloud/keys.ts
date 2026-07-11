// Keys mirrored to the cloud per signed-in user. Device-only prefs
// (sidebar collapse, permission grants, transient nav state) are excluded.
export const SYNCED_KEYS = [
  "memoryos.memories.v1",
  "memoryos.state.v4",
  "memoryos.admin.v1",
  "memoryos.categories.v3",
  "memoryos.quizconfig.v3",
  "memoryos.greetings.v2",
  "memoryos.personality.v1",
  "memoryos.rechallenge.v1",
  "memoryos.rules.v2",
  "memoryos.rules.state.v1",
  "memoryos.recall.trends.v2",
  "memoryos.recall.trendstate.v1",
  "memoryos.changelog.seen.v1",
  "memoryos.tour.seen.v1",
  "gmd:packs.v1",
  "gmd:packInstalls.v1",
  "mindrop.places.v1",
  "mindrop.places.runtime.v1",
  "mindrop.places.events.v1",
  "mindrop.notify.rules.v1",
  "mindrop.notify.inbox.v1",
  "mindrop.book.read.v1",
  "mindrop.dashboard.welcome.v1",
  "mindrop.theme.country.override.v1",
  "mindrop.theme.country.v1",
] as const;

export type SyncedKey = (typeof SYNCED_KEYS)[number];

export type Snapshot = Record<string, { v: string; t: number }>;
