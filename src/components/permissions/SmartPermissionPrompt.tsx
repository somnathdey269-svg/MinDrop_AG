/**
 * SmartPermissionPrompt — a lightweight modal we open the moment a user tries
 * to do something that needs a permission we don't yet have. Explains *why*
 * in one sentence, then either requests inline (web) or deep-links to the
 * matching Android settings screen. On resolve we re-read the permission
 * snapshot so the Permissions page and Settings tile hint refresh live.
 */
import { useEffect, useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { PlacesBridge } from "@/lib/places/bridge";
import { NotifyBridge } from "@/lib/notify/bridge";
import { AlarmsBridge } from "@/lib/alarms/bridge";
import { isAndroid, isNative, markPrompted, readPermissions } from "@/lib/permissions/state";
import { useOnboarding } from "@/lib/memoryos/store";

export type PromptKind = "notifications" | "location" | "notification-access";

const COPY: Record<PromptKind, { title: string; body: string; cta: string }> = {
  notifications: {
    title: "Ring on time.",
    body: "Reminders can only fire when Android is allowed to post notifications. Nothing leaves your phone.",
    cta: "Allow notifications",
  },
  location: {
    title: "Fire at the right place.",
    body: "MinDrop needs your location to check when you arrive at a saved spot. We don't track your movement or store your path.",
    cta: "Allow location",
  },
  "notification-access": {
    title: "Filter what matters.",
    body: "Notify rules match the notifications on your phone. Matching happens on-device; nothing is uploaded.",
    cta: "Open Settings",
  },
};

export function SmartPermissionPrompt({
  kind, open, onResolved,
}: {
  kind: PromptKind;
  open: boolean;
  onResolved: (granted: boolean) => void;
}) {
  const { state, update } = useOnboarding();
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(open); }, [open]);
  if (!mounted) return null;
  const c = COPY[kind];

  async function grant() {
    setBusy(true);
    markPrompted(kind);
    let granted = false;
    try {
      if (kind === "notifications") {
        if (isAndroid()) {
          const r = await AlarmsBridge.requestNotificationPermission();
          granted = !!r.postNotifications;
          if (!granted) await AlarmsBridge.openNotificationSettings();
        } else if (isNative()) {
          const r = await LocalNotifications.requestPermissions();
          granted = r.display === "granted";
        } else if ("Notification" in window) {
          const res = await Notification.requestPermission();
          granted = res === "granted";
        }
      } else if (kind === "location") {
        if (isAndroid()) {
          const r = await PlacesBridge.requestPermission();
          granted = !!r.foreground;
          if (!r.background) await PlacesBridge.openPermissionSettings();
        } else if ("geolocation" in navigator) {
          granted = await new Promise<boolean>((resolve) => {
            navigator.geolocation.getCurrentPosition(() => resolve(true), () => resolve(false),
              { enableHighAccuracy: true, timeout: 10_000 });
          });
        }
      } else if (kind === "notification-access") {
        // Notification-listener has no runtime request API — deep-link only.
        await NotifyBridge.openPermissionSettings();
        granted = await NotifyBridge.hasPermission();
      }
    } catch { /* swallow — treat as not granted */ }

    // Refresh onboarding perm cache so Settings tile updates without reload.
    try {
      const snap = await readPermissions();
      update({
        permissions: {
          ...state.permissions,
          notifications: snap.notifications === "granted",
          mic: snap.mic === "granted",
        },
      });
    } catch { /* ignore */ }

    setBusy(false);
    onResolved(granted);
  }

  function dismiss() {
    markPrompted(kind);
    onResolved(false);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-5" role="dialog" aria-modal="true">
      <div className="bg-canvas rounded-3xl border border-ink/10 max-w-sm w-full p-6 shadow-xl">
        <p className="t-eyebrow text-ink/50 mb-2">Permission needed</p>
        <h2 className="t-title mb-3">{c.title}</h2>
        <p className="t-body-sm text-ink/75 mb-6">{c.body}</p>
        <div className="flex gap-2">
          <button
            onClick={dismiss}
            disabled={busy}
            className="t-button flex-1 py-3 rounded-2xl bg-white border border-ink/15 text-ink/70 disabled:opacity-50"
          >
            Not now
          </button>
          <button
            onClick={grant}
            disabled={busy}
            className="t-button flex-1 py-3 rounded-2xl bg-ink text-canvas disabled:opacity-50"
          >
            {busy ? "Please wait…" : c.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
