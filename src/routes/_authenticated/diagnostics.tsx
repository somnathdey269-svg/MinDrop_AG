import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, Bell, HardDrive, Mic, MapPin, Wifi, RefreshCw, AlarmClock, ShieldCheck, BatteryCharging } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BackHeader } from "@/components/layout/BackHeader";
import { AlarmsBridge, type FiredLogEntry } from "@/lib/alarms/bridge";

export const Route = createFileRoute("/_authenticated/diagnostics")({
  head: () => ({
    meta: [
      { title: "Diagnostics — MinDrop" },
      { name: "description", content: "Check MinDrop permissions, storage and connectivity." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Diagnostics,
});

type Check = { label: string; value: string; ok: boolean; icon: typeof Bell };

function Diagnostics() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [tick, setTick] = useState(0);
  const [alarmChecks, setAlarmChecks] = useState<Check[]>([]);
  const [fired, setFired] = useState<FiredLogEntry[]>([]);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const run = async () => {
      const out: Check[] = [];
      // Platform
      const native = Capacitor?.isNativePlatform?.() === true;
      out.push({
        label: "Platform",
        value: native ? `Native (${Capacitor.getPlatform()})` : "Web",
        ok: true,
        icon: Activity,
      });
      // Notifications
      const notif = typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unavailable";
      out.push({ label: "Notifications", value: String(notif), ok: notif === "granted", icon: Bell });
      // Microphone
      let mic = "unknown";
      try {
        const p = await (navigator as any).permissions?.query?.({ name: "microphone" as PermissionName });
        if (p) mic = p.state;
      } catch {}
      out.push({ label: "Microphone", value: mic, ok: mic === "granted", icon: Mic });
      // Location
      let geo = "unknown";
      try {
        const p = await (navigator as any).permissions?.query?.({ name: "geolocation" as PermissionName });
        if (p) geo = p.state;
      } catch {}
      out.push({ label: "Location", value: geo, ok: geo === "granted", icon: MapPin });
      // Storage
      let used = "?";
      try {
        const est = await (navigator as any).storage?.estimate?.();
        if (est) used = `${Math.round((est.usage ?? 0) / 1024)} KB used`;
      } catch {}
      let keys = 0;
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k?.startsWith("memoryos")) keys++;
        }
      } catch {}
      out.push({ label: "Local storage", value: `${keys} keys · ${used}`, ok: true, icon: HardDrive });
      // Connectivity
      out.push({
        label: "Connectivity",
        value: typeof navigator !== "undefined" && navigator.onLine ? "Online" : "Offline",
        ok: typeof navigator !== "undefined" ? navigator.onLine : true,
        icon: Wifi,
      });
      setChecks(out);

      // Alarms sub-panel — local-only, no network.
      try {
        const status = await AlarmsBridge.getStatus();
        setAlarmChecks([
          { label: "Notifications allowed", value: status.postNotifications ? "granted" : "denied", ok: status.postNotifications, icon: Bell },
          { label: "Exact alarms allowed", value: status.canScheduleExactAlarms ? "granted" : "denied", ok: status.canScheduleExactAlarms, icon: ShieldCheck },
          { label: "Battery unrestricted", value: status.ignoringBatteryOptimizations ? "yes" : "restricted", ok: status.ignoringBatteryOptimizations, icon: BatteryCharging },
        ]);
        setPending((await AlarmsBridge.getPending()).length);
        setFired((await AlarmsBridge.getFiredLog()).slice(0, 5));
      } catch {}
    };
    run();
  }, [tick]);

  return (
    <PhoneFrame>
      <div className="min-h-screen md:min-h-[calc(100vh-3rem)] flex flex-col">
        <div className="px-5 pt-6">
          <BackHeader label="Settings" to="/settings" from="settings" />
          <h1 className="t-display mb-1">Diagnostics.</h1>
        </div>
        <div className="flex-1 px-5 pt-2 pb-24">
          <p className="t-body-sm text-ink/65 mb-5">
            A quick look under the hood. If something looks off, tap the item to fix it.
          </p>
          <div data-tour="diag-status" className="rounded-3xl bg-white border border-ink/10 divide-y divide-ink/5">
            {checks.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="flex items-center gap-3 px-4 py-3">
                  <div className={`size-9 rounded-xl grid place-items-center ${c.ok ? "bg-brand/15 text-brand" : "bg-ink/5 text-ink/70"}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="t-body">{c.label}</p>
                    <p className="t-meta text-ink/60">{c.value}</p>
                  </div>
                  <span className={`t-eyebrow ${c.ok ? "text-brand" : "text-ink/50"}`}>{c.ok ? "OK" : "Check"}</span>
                </div>
              );
            })}
          </div>

          {alarmChecks.length > 0 && (
            <>
              <h2 className="t-eyebrow text-ink/60 mt-8 mb-2 px-1 flex items-center gap-1.5">
                <AlarmClock className="size-3.5" /> Alarms
              </h2>
              <div className="rounded-3xl bg-white border border-ink/10 divide-y divide-ink/5">
                {alarmChecks.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.label} className="flex items-center gap-3 px-4 py-3">
                      <div className={`size-9 rounded-xl grid place-items-center ${c.ok ? "bg-brand/15 text-brand" : "bg-amber-100 text-amber-700"}`}>
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="t-body">{c.label}</p>
                        <p className="t-meta text-ink/60">{c.value}</p>
                      </div>
                      <span className={`t-eyebrow ${c.ok ? "text-brand" : "text-amber-700"}`}>{c.ok ? "OK" : "Fix"}</span>
                    </div>
                  );
                })}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="size-9 rounded-xl grid place-items-center bg-ink/5 text-ink/60">
                    <AlarmClock className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="t-body">Pending alarms</p>
                    <p className="t-meta text-ink/60">{pending} scheduled</p>
                  </div>
                </div>
              </div>

              {fired.length > 0 && (
                <>
                  <p className="t-eyebrow text-ink/50 mt-4 mb-2 px-1">Last alarms fired</p>
                  <div className="rounded-2xl bg-white border border-ink/8 divide-y divide-ink/5">
                    {fired.map((f) => (
                      <div key={`${f.id}-${f.at}`} className="px-4 py-2.5">
                        <p className="t-body-sm truncate">{f.title || f.id}</p>
                        <p className="t-meta text-ink/55">
                          {new Date(f.at).toLocaleString()} · {f.delivery}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          <button
            onClick={() => setTick((t) => t + 1)}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 t-button bg-ink text-canvas py-3 rounded-2xl"
          >
            <RefreshCw className="size-4" /> Re-run checks
          </button>
          <p className="t-meta text-ink/40 text-center mt-4">
            Everything above is read locally on this device. Nothing is sent to our servers.
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
