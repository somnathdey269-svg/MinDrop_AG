/**
 * Global banner shown when a scheduled alarm can't ring because a permission
 * is blocking it. Listens for `mindrop:alarm-blocked` events from the scheduler.
 * Local-only — no network calls.
 */
import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { AlarmsBridge } from "@/lib/alarms/bridge";

export type BlockedReason =
  | "no_notif_permission"
  | "no_exact_permission"
  | "battery_optimized";

export interface AlarmBlockedDetail {
  title: string;
  reason: BlockedReason;
}

const COPY: Record<BlockedReason, { msg: string; cta: string; open: () => void }> = {
  no_notif_permission: {
    msg: "Notification permission is off.",
    cta: "Turn on",
    open: () => void AlarmsBridge.openNotificationSettings(),
  },
  no_exact_permission: {
    msg: "Exact alarms are disabled by Android.",
    cta: "Allow",
    open: () => void AlarmsBridge.openExactAlarmSettings(),
  },
  battery_optimized: {
    msg: "Battery optimisation is delaying alarms.",
    cta: "Unrestrict",
    open: () => void AlarmsBridge.openBatteryOptimizationSettings(),
  },
};

export function AlarmBlockedToast() {
  const [current, setCurrent] = useState<AlarmBlockedDetail | null>(null);

  useEffect(() => {
    const onBlocked = (e: Event) => {
      const detail = (e as CustomEvent<AlarmBlockedDetail>).detail;
      if (detail) setCurrent(detail);
    };
    window.addEventListener("mindrop:alarm-blocked", onBlocked as EventListener);
    return () => window.removeEventListener("mindrop:alarm-blocked", onBlocked as EventListener);
  }, []);

  if (!current) return null;
  const copy = COPY[current.reason];

  return (
    <div
      role="alert"
      className="fixed inset-x-3 top-3 z-50 rounded-2xl bg-red-600 text-white shadow-xl shadow-red-900/30 px-4 py-3 flex items-start gap-3"
    >
      <AlertTriangle className="size-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="t-body-sm font-medium truncate">
          "{current.title}" won't ring
        </p>
        <p className="t-meta text-white/85">{copy.msg}</p>
        <button
          type="button"
          onClick={() => { copy.open(); setCurrent(null); }}
          className="t-eyebrow mt-1.5 underline underline-offset-2"
        >
          {copy.cta} →
        </button>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setCurrent(null)}
        className="shrink-0 -m-1 p-1 text-white/80 hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
