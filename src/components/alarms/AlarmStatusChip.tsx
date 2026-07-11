/**
 * Live status chip for a reminder card. Reads permission state locally
 * (no network) and reflects whether an Alarm-mode reminder will actually
 * ring on this device.
 */
import { useEffect, useState } from "react";
import { AlarmClock, Bell, AlertTriangle } from "lucide-react";
import { AlarmsBridge, type AlarmsStatus } from "@/lib/alarms/bridge";

type Notify = "alarm" | "notification" | undefined;

let cached: AlarmsStatus | null = null;
let cachedAt = 0;

async function getStatus(): Promise<AlarmsStatus> {
  if (cached && Date.now() - cachedAt < 15_000) return cached;
  cached = await AlarmsBridge.getStatus();
  cachedAt = Date.now();
  return cached;
}

export function AlarmStatusChip({ notify }: { notify: Notify }) {
  const [status, setStatus] = useState<AlarmsStatus | null>(cached);

  useEffect(() => {
    if (notify !== "alarm") return;
    let alive = true;
    getStatus().then((s) => { if (alive) setStatus(s); });
    return () => { alive = false; };
  }, [notify]);

  if (!notify) return null;

  if (notify === "notification") {
    return (
      <span className="t-eyebrow inline-flex items-center gap-1 text-ink/55 ml-auto">
        <Bell className="size-3" aria-hidden="true" /> Notify
      </span>
    );
  }

  const blocked = status && !(status.postNotifications && status.canScheduleExactAlarms && status.ignoringBatteryOptimizations);

  if (blocked) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!status?.postNotifications) void AlarmsBridge.openNotificationSettings();
          else if (!status?.canScheduleExactAlarms) void AlarmsBridge.openExactAlarmSettings();
          else void AlarmsBridge.openBatteryOptimizationSettings();
        }}
        className="t-eyebrow inline-flex items-center gap-1 text-amber-700 ml-auto hover:underline"
        aria-label="Alarm blocked — tap to fix"
      >
        <AlertTriangle className="size-3" aria-hidden="true" /> Alarm · fix
      </button>
    );
  }

  return (
    <span className="t-eyebrow inline-flex items-center gap-1 text-ink/55 ml-auto">
      <AlarmClock className="size-3" aria-hidden="true" /> Alarm
    </span>
  );
}
