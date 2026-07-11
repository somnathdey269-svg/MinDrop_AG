export type MemoryTag = "Actionable" | "Place" | "Person" | "Thought";

export interface Memory {
  id: string;
  time: string; // creation time "09:42"
  date: string; // human when-label, e.g. "Today at 6:00 PM"
  text: string;
  imageUrl?: string;
  audioUrl?: string;     // data URL for voice-note captures
  audioDuration?: number; // seconds
  highlight?: boolean;
  tags?: MemoryTag[];
  expiresAt?: string;
  category?: string;
  notify?: "notification" | "alarm";
  ageDays?: number;
  source?: { kind: "capture" } | { kind: "pack"; packId: string; templateId: string; userAdded?: boolean } | { kind: "recording" };
  recurrence?: "once" | "daily" | "weekly" | "monthly";
  dueAt?: string;        // ISO — when the reminder fires
  until?: string;        // ISO — final date for daily-range reminders
  archivedAt?: string;   // ISO — moved to archive (auto after due or manual)
  deletedAt?: string;    // ISO — soft-deleted, lives in "Deleted" tab
  firedAt?: string;      // ISO — scheduler already triggered this memory
}

export function isUserCreatedPackTemplateId(templateId?: string) {
  return !!templateId && (templateId.startsWith("tpl-custom") || templateId.startsWith("cs_"));
}

export function isUserAddedPackMemory(m: Memory) {
  return m.source?.kind === "pack" && (
    m.source.userAdded === true ||
    isUserCreatedPackTemplateId(m.source.templateId)
  );
}

export function isPackOwnedMemory(m: Memory, packId?: string, originalTemplateIds?: Set<string> | string[]) {
  if (m.source?.kind !== "pack" || isUserAddedPackMemory(m)) return false;
  if (originalTemplateIds) {
    const ids = Array.isArray(originalTemplateIds) ? new Set(originalTemplateIds) : originalTemplateIds;
    if (!ids.has(m.source.templateId)) return false;
  }
  return packId ? m.source.packId === packId : true;
}

export function isPersonalMemory(m: Memory) {
  return !m.source || m.source.kind === "capture" || m.source.kind === "recording" || isUserAddedPackMemory(m);
}

export type RuleStatus = "active" | "deprecated" | "draft";

export interface Rule {
  id: string;
  name: string;
  description: string;
  status: RuleStatus;
  priority: number;
  version: string;
  trigger: string;
  conditions: string[];
  action: string;
}

export interface MemoryPack {
  id: string;
  name: string;
  subtitle: string;
  imageUrl?: string;
  active?: boolean;
}

export interface ConfigEntry {
  key: string;
  label: string;
  type: "value" | "toggle";
  value: string | boolean;
}
