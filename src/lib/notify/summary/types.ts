export type ProviderId = "openai" | "anthropic" | "gemini";

export interface ModelInfo {
  id: string;
  label: string;
  inPerM: number;   // USD per 1M input tokens
  outPerM: number;  // USD per 1M output tokens
  recommended?: boolean;
}

export interface StoredKey {
  provider: ProviderId;
  key: string;
  model: string;
  savedAt: number;
  tested?: boolean;
  testedAt?: number;
}

export interface SummarySources {
  scope: "all" | "selected" | "categories" | "exclude";
  appIds?: string[];        // packageName list
  categoryIds?: string[];   // category ids
  excludeIds?: string[];    // packageName list
  filters: {
    timeWindow: "all" | "work" | "evening" | "custom";
    customFrom?: string;    // "HH:MM"
    customTo?: string;
    minCount: number;       // default 1
    includeChatBodies: boolean;
    includeTransactional: boolean;
  };
}

export interface SummaryPreset {
  id: string;
  name: string;
  sources: SummarySources;
}

export interface SummaryProfile {
  brevity: "terse" | "balanced" | "detailed";
  tone: "neutral" | "coach";
  topAppsLast7d: string[];
  ignoreApps: string[];
  updatedAt: number;
}

export interface ReminderRecap {
  activeTotal: number;
  triggeredToday: number;
  missedToday: number;
  createdToday: number;
  upcoming7d: number;
  onTimeRate: number; // 0..1
}

export interface SuggestedReminder {
  title: string;
  when: string;
  why: string;
  kind: "time" | "location" | "rule";
}

export interface SummaryJson {
  headline: string;
  highlights: { title: string; detail: string }[];
  byApp: { app: string; insight: string }[];
  attentionSignals?: { peakHour?: string; quietWindow?: string; distractionScore?: number };
  actionItems: { text: string; priority: "low" | "med" | "high" }[];
  moodNote: string;
  conclusion: {
    reminderRecap: ReminderRecap;
    wins: string[];
    misses: string[];
    suggestedReminders: SuggestedReminder[];
    closingLine: string;
  };
}

export interface ReportRecord {
  id: string;
  date: string;         // YYYY-MM-DD
  createdAt: number;
  provider: ProviderId;
  model: string;
  sizeKB: number;
  filename: string;
}
