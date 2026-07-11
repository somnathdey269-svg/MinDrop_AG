import type { PresetId } from "./types";

export interface Preset {
  id: PresetId;
  label: string;
  emoji: string;
  packages: { pkg: string; appName: string }[];
  keywords: string[];      // suggested include list
  excludes?: string[];     // suggested excludes
}

export const PRESETS: Preset[] = [
  {
    id: "work",
    label: "Work",
    emoji: "💼",
    packages: [
      { pkg: "com.google.android.gm", appName: "Gmail" },
      { pkg: "com.microsoft.teams", appName: "Teams" },
      { pkg: "com.Slack", appName: "Slack" },
    ],
    keywords: ["meeting", "review", "urgent", "deadline"],
  },
  {
    id: "family",
    label: "Family",
    emoji: "👨‍👩‍👧",
    packages: [
      { pkg: "com.whatsapp", appName: "WhatsApp" },
      { pkg: "com.google.android.apps.messaging", appName: "Messages" },
    ],
    keywords: ["mom", "dad", "home", "dinner"],
  },
  {
    id: "news",
    label: "News",
    emoji: "📰",
    packages: [
      { pkg: "com.google.android.googlequicksearchbox", appName: "Google News" },
    ],
    keywords: ["breaking", "alert"],
  },
  {
    id: "promos",
    label: "Promotions",
    emoji: "🏷️",
    packages: [
      { pkg: "com.whatsapp", appName: "WhatsApp" },
      { pkg: "com.google.android.gm", appName: "Gmail" },
    ],
    keywords: ["sale", "discount", "offer", "deal", "off"],
    excludes: [],
  },
  {
    id: "otp",
    label: "OTP / Codes",
    emoji: "🔐",
    packages: [
      { pkg: "com.google.android.apps.messaging", appName: "Messages" },
    ],
    keywords: ["otp", "code", "verification", "verify"],
  },
];

export function getPreset(id?: PresetId | null): Preset | undefined {
  if (!id) return undefined;
  return PRESETS.find((p) => p.id === id);
}
