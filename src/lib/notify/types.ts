export interface CapturedNotification {
  id: string;              // stable id from native (pkg + posted key), or synthetic
  pkg: string;             // e.g. "com.whatsapp"
  appName: string;         // "WhatsApp"
  title: string;           // sender / subject
  text: string;            // message body
  bigText?: string;        // expanded body if available
  timestamp: number;       // ms since epoch
  priority?: number;       // OS-reported priority; >=1 = high (native only)
  isMessaging?: boolean;   // Indicates a MessagingStyle grouped notification
  isAlarmActive?: boolean; // Blocks duplicate alarm triggers if one is active/snoozed
}

export type ConditionField = 
  | "sender"       // Matches title (sender name)
  | "text"         // Matches body text
  | "otp"          // Matches OTP/verification patterns
  | "transaction"  // Matches money transaction patterns
  | "link"         // Matches messages containing URLs
  | "priority";    // Matches high-priority notifications

export type ConditionOperator = 
  | "contains" 
  | "doesNotContain" // Represents "NOT"
  | "equals" 
  | "isTrue";        // True/False triggers

export interface RuleCondition {
  id: string;
  field: ConditionField;
  operator: ConditionOperator;
  value: string;
}

export interface NotifyRule {
  id: string;
  pkg: string;
  appName: string;
  logicalOperator: "AND" | "OR";
  conditions: RuleCondition[];

  // Fallbacks for backward compatibility
  matchMode?: MatchMode;
  senderMatch: string;
  includeAny?: string[];
  excludeAny?: string[];
  priorityOnly?: boolean;

  presetId?: PresetId;
  remindMode: RemindMode;
  afterHours?: number;
  afterMinutes?: number;
  frequency?: FrequencyMode;
  rangeStart?: string;
  rangeEnd?: string;
  remindNote?: string;
  delivery?: RuleDelivery;
  enabled: boolean;
  createdAt: number;
  status?: RuleStatus;
  statusAt?: number;
  lastFiredAt?: number;
}

export type MatchMode = "all" | "any" | "sender" | "topic";
export type PresetId = string;
export type RemindMode = "relative" | "timeWindow" | "immediate" | "off" | "after";
export type FrequencyMode = "once" | "daily" | "always";
export type RuleDelivery = "alarm" | "persistent" | "badge" | "silent" | "notification";
export type RuleStatus = "active" | "snoozed" | "dismissed" | "expired" | "archived" | "erased";

export interface KnownApp {
  pkg: string;
  appName: string;
  category?: "chat" | "finance" | "social" | "system" | "other";
}
