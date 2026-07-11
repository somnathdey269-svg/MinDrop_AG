/**
 * Shared alarm-tone registry — single source of truth for JS (web preview
 * + Capacitor WebView) and Kotlin (AlarmsBridge / AlarmRingService).
 *
 * Web / preview: files live at `/alarms/<id>.ogg` (public/alarms/).
 * Android: same files bundled as `res/raw/tone_<id>.ogg`. The Kotlin bridge
 * builds the channel sound URI from `androidRes`.
 *
 * When adding a tone:
 *   1. Drop `<id>.ogg` into public/alarms/  AND  `tone_<id>.ogg` into
 *      android/app/src/main/res/raw/  (lowercase, digits and underscores only).
 *   2. Add an entry below.
 */
export type ToneId =
  | "classic" | "chime" | "birds" | "beep" | "zen" | "marimba"
  | "uplift" | "warmpulse" | "retro" | "cosmic" | "drop" | "silent";

export interface ToneDef {
  id: ToneId;
  label: string;
  /** One-line description for the picker */
  hint: string;
  /** URL served in the browser & Capacitor WebView */
  webUrl: string;
  /** Resource name inside android/app/src/main/res/raw/ (no extension) */
  androidRes: string;
  /** Vibration-only tone — no audio, just haptics */
  silentOnly?: boolean;
}

export const TONES: ToneDef[] = [
  { id: "classic",   label: "Classic Bell",     hint: "Warm ringing tone",     webUrl: "/alarms/classic.ogg",   androidRes: "tone_classic" },
  { id: "chime",     label: "Gentle Chime",     hint: "Soft two-note chord",   webUrl: "/alarms/chime.ogg",     androidRes: "tone_chime" },
  { id: "birds",     label: "Morning Birds",    hint: "Chirping sweep",        webUrl: "/alarms/birds.ogg",     androidRes: "tone_birds" },
  { id: "beep",      label: "Digital Beep",     hint: "Sharp square pulse",    webUrl: "/alarms/beep.ogg",      androidRes: "tone_beep" },
  { id: "zen",       label: "Zen Bowl",         hint: "Low meditative hum",    webUrl: "/alarms/zen.ogg",       androidRes: "tone_zen" },
  { id: "marimba",   label: "Marimba",          hint: "Bright two-note stab",  webUrl: "/alarms/marimba.ogg",   androidRes: "tone_marimba" },
  { id: "uplift",    label: "Uplift",           hint: "Ascending arpeggio",    webUrl: "/alarms/uplift.ogg",    androidRes: "tone_uplift" },
  { id: "warmpulse", label: "Warm Pulse",       hint: "Breathing 440 Hz",      webUrl: "/alarms/warmpulse.ogg", androidRes: "tone_warmpulse" },
  { id: "retro",     label: "Retro Alarm",      hint: "Alternating two-tone",  webUrl: "/alarms/retro.ogg",     androidRes: "tone_retro" },
  { id: "cosmic",    label: "Cosmic Ping",      hint: "High crystal ping",     webUrl: "/alarms/cosmic.ogg",    androidRes: "tone_cosmic" },
  { id: "drop",      label: "Drop",             hint: "Signature MinDrop tone",webUrl: "/alarms/drop.ogg",      androidRes: "tone_drop" },
  { id: "silent",    label: "Vibrate only",     hint: "No sound, haptics only",webUrl: "/alarms/silent.ogg",    androidRes: "tone_silent", silentOnly: true },
];

export const DEFAULT_TONE_ID: ToneId = "classic";

export function toneById(id?: string | null): ToneDef {
  const found = TONES.find((t) => t.id === id);
  return found ?? TONES[0];
}
