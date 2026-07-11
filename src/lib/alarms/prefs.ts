/**
 * Local user preferences for alarm behaviour. Small, synchronous,
 * localStorage-backed. Native bridge is notified whenever the default
 * tone changes so the OS-side channel is recreated.
 */
import { DEFAULT_TONE_ID, type ToneId } from "./tones";

const KEY_TONE = "mindrop.alarm.defaultTone";
const KEY_VIBRATION = "mindrop.alarm.vibration";

export function getDefaultTone(): ToneId {
  try {
    return (window.localStorage.getItem(KEY_TONE) as ToneId) || DEFAULT_TONE_ID;
  } catch {
    return DEFAULT_TONE_ID;
  }
}

export function setDefaultTone(id: ToneId) {
  try { window.localStorage.setItem(KEY_TONE, id); } catch {}
  // Notify native so the per-tone channel is created up-front.
  import("./bridge").then(({ AlarmsBridge }) => AlarmsBridge.setDefaultTone(id)).catch(() => {});
  try {
    window.dispatchEvent(new CustomEvent("mindrop:tone-changed", { detail: { id } }));
  } catch {}
}

export function getVibrationEnabled(): boolean {
  try {
    const v = window.localStorage.getItem(KEY_VIBRATION);
    return v === null ? true : v === "1";
  } catch { return true; }
}

export function setVibrationEnabled(on: boolean) {
  try { window.localStorage.setItem(KEY_VIBRATION, on ? "1" : "0"); } catch {}
}
