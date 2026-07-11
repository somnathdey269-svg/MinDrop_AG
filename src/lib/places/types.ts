export type Trigger = "enter" | "exit" | "both";
export type Frequency = "once" | "always";
export type PlaceDelivery = "alarm" | "notification";

export interface PlaceWindow {
  startHHMM: string; // "07:00"
  endHHMM: string;   // "22:00"
  weekdays: number[]; // 0=Sun..6=Sat
}

/**
 * A saved location — pure address book entry. Reminder behaviour lives in
 * PlaceRule. Legacy `radiusM/message/trigger/frequency/window/expiresAt`
 * remain optional so old backups still restore.
 */
export interface Place {
  id: string;
  name: string;
  emoji?: string;
  address: string;
  lat: number;
  lng: number;
  paused: boolean;
  createdAt: string;
  archivedAt?: string;
  deletedAt?: string;
  lastFiredAt?: string;
  // Legacy fields — kept for backup compatibility; defaults filled at save time.
  radiusM?: number;
  message?: string;
  exitMessage?: string;
  trigger?: Trigger;
  frequency?: Frequency;
  window?: PlaceWindow;
  expiresAt?: string;
}

/** A location-triggered reminder attached to one saved Place. */
export interface PlaceRule {
  id: string;
  placeId: string;
  radiusM: number;
  message: string;
  exitMessage?: string;
  trigger: Trigger;
  frequency: Frequency;
  /** "alarm" = loud ring + full-screen; "notification" = silent heads-up. Default "notification". */
  delivery?: PlaceDelivery;
  /** Custom reminder text shown on trigger. Falls back to `message` when empty. */
  remindNote?: string;
  window?: PlaceWindow;
  expiresAt?: string;
  paused: boolean;
  createdAt: string;
  lastFiredAt?: string;
}

export interface PlaceEvent {
  id: string;
  placeId: string;
  ruleId?: string;
  kind: "enter" | "exit";
  at: string;
  lat: number;
  lng: number;
  delivered: boolean;
}
