export interface CapturedNotification {
  id: string;              // stable id from native (pkg + posted key), or synthetic
  pkg: string;             // e.g. "com.whatsapp"
  appName: string;         // "WhatsApp"
  title: string;           // sender / subject
  text: string;            // message body
  bigText?: string;        // expanded body if available
  timestamp: number;       // ms since epoch
  priority?: number;       // OS-reported priority; >=1 = high (native only)
}

export type RemindMode = "immediate" | "after";
export type FrequencyMode = "once" | "always";
export type MatchMode = "sender" | "topic";
export type PresetId = "work" | "family" | "news" | "promos" | "otp";
export type RuleStatus = "active" | "archived" | "erased";
export type RuleDelivery = "alarm" | "notification";

export interface NotifyRule {
  id: string;
  pkg: string;
  appName: string;
  matchMode?: MatchMode;       // default "sender" for backward compatibility
  senderMatch: string;         // used when matchMode = "sender"; blank = any
  includeAny?: string[];       // used when matchMode = "topic"; OR list
  excludeAny?: string[];       // used when matchMode = "topic"; skip if present
  priorityOnly?: boolean;      // require OS priority >= 1
  presetId?: PresetId;
  remindMode: RemindMode;
  afterHours?: number;         // when remindMode = "after"
  afterMinutes?: number;       // when remindMode = "after"
  frequency?: FrequencyMode;   // default "once"
  rangeStart?: string;         // ISO date (yyyy-mm-dd) when frequency = "range"
  rangeEnd?: string;           // ISO date (yyyy-mm-dd) when frequency = "range"
  remindNote?: string;         // optional: what to remind the user about
  delivery?: RuleDelivery;     // "alarm" = loud ring + full-screen; "notify" = silent heads-up. Default "notify".
  enabled: boolean;
  createdAt: number;
  status?: RuleStatus;         // default "active"
  statusAt?: number;           // ms since epoch of last status change
  lastFiredAt?: number;        // ms since epoch when rule most recently triggered
}

export interface KnownApp {
  pkg: string;
  appName: string;
}
