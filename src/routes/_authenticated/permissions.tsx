import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AlarmClock, BatteryCharging, Bell, Ear, MapPin, Mic } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BackHeader } from "@/components/layout/BackHeader";
import { useOnboarding } from "@/lib/memoryos/store";
import { isNative as isNativeRec } from "@/lib/memoryos/recorder";
import { AlarmsBridge } from "@/lib/alarms/bridge";
import { PlacesBridge } from "@/lib/places/bridge";
import { NotifyBridge } from "@/lib/notify/bridge";
import { Switch } from "@/components/ui/switch";


export const Route = createFileRoute("/_authenticated/permissions")({
  head: () => ({
    meta: [
      { title: "Permissions — MinDrop" },
      { name: "description", content: "Grant the permissions MinDrop needs to remind you at the right moment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Permissions,
});

type Status = "granted" | "denied" | "prompt" | "unknown";

const isNative = () => Capacitor?.isNativePlatform?.() === true;
const isAndroid = () => Capacitor?.getPlatform?.() === "android";

function Row({
  icon: Icon, title, body, granted, onAction,
}: {
  icon: typeof Bell; title: string; body: string;
  granted: boolean;
  onAction: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      onClick={onAction}
      className="w-full text-left p-4 bg-white rounded-2xl border border-ink/10 active:bg-ink/[0.02] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div 
          style={{ backgroundColor: "rgba(255, 103, 31, 0.1)", color: "#FF671F" }}
          className="size-9 rounded-xl grid place-items-center shrink-0" 
          aria-hidden="true"
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="t-body-sm">{title}</p>
          <p className="t-meta text-ink/70 mt-0.5">{body}</p>
        </div>
        <div className="shrink-0 pointer-events-none">
          <Switch checked={granted} style={{ "--switch-accent": "color-mix(in oklab, #FF671F 70%, #fff)" } as React.CSSProperties} />
        </div>
      </div>
    </button>
  );
}

function Permissions() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();
  const p = state.permissions;

  const [notifStatus, setNotifStatus] = useState<Status>("unknown");
  const [micStatus, setMicStatus] = useState<Status>("unknown");
  const [exactAlarm, setExactAlarm] = useState<boolean>(false);
  const [battOk, setBattOk] = useState<boolean>(false);
  const [locFg, setLocFg] = useState<boolean>(false);
  const [locBg, setLocBg] = useState<boolean>(false);
  const [notifAccess, setNotifAccess] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    try {
      if (isNative()) {
        const r = await LocalNotifications.checkPermissions();
        const s = (r.display === "granted" ? "granted" : r.display === "denied" ? "denied" : "prompt") as Status;
        setNotifStatus(s);
        if ((s === "granted") !== p.notifications) update({ permissions: { ...p, notifications: s === "granted" } });
      } else if (typeof window !== "undefined" && "Notification" in window) {
        const perm = Notification.permission as Status;
        setNotifStatus(perm);
        const isOn = perm === "granted";
        if (isOn !== p.notifications) update({ permissions: { ...p, notifications: isOn } });
      }
    } catch {}
    try {
      if (isNative()) {
        const { VoiceRecorder } = await import("capacitor-voice-recorder");
        const has = await VoiceRecorder.hasAudioRecordingPermission();
        const ok = has.value;
        setMicStatus(ok ? "granted" : "prompt");
        if (ok !== p.mic) update({ permissions: { ...p, mic: ok } });
      } else {
        const q = await navigator.permissions?.query({ name: "microphone" as PermissionName });
        if (q) {
          setMicStatus(q.state as Status);
          const isOn = q.state === "granted";
          if (isOn !== p.mic) update({ permissions: { ...p, mic: isOn } });
        }
      }
    } catch {}
    if (isAndroid()) {
      try {
        const st = await AlarmsBridge.getStatus();
        setExactAlarm(st.canScheduleExactAlarms);
        setBattOk(st.ignoringBatteryOptimizations);
      } catch {}
      try {
        const loc = await PlacesBridge.hasPermission?.();
        if (loc) { setLocFg(!!loc.foreground); setLocBg(!!loc.background); }
      } catch {}
      try { setNotifAccess(await NotifyBridge.hasPermission()); } catch {}
    } else {
      // Web: query geolocation permission (no background on web).
      try {
        const q = await navigator.permissions?.query({ name: "geolocation" as PermissionName });
        if (q) setLocFg(q.state === "granted");
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refresh();
    const onVis = () => {
      if (document.visibilityState === "visible") {
        refresh();
        // Query again after 600ms to handle Android OS setting updates latency
        setTimeout(refresh, 600);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [refresh]);

  const grantNotif = async () => {
    try {
      if (isAndroid()) {
        const st = await AlarmsBridge.requestNotificationPermission();
        const ok = st.postNotifications;
        setNotifStatus(ok ? "granted" : "denied");
        update({ permissions: { ...p, notifications: ok } });
        if (!ok) await AlarmsBridge.openNotificationSettings();
        return;
      }
      if (isNative()) {
        const r = await LocalNotifications.requestPermissions();
        const ok = r.display === "granted";
        setNotifStatus(ok ? "granted" : "denied");
        update({ permissions: { ...p, notifications: ok } });
      } else if ("Notification" in window) {
        const res = await Notification.requestPermission();
        setNotifStatus(res as Status);
        update({ permissions: { ...p, notifications: res === "granted" } });
      }
    } catch { setNotifStatus("denied"); }
  };

  const grantMic = async () => {
    try {
      if (isNativeRec()) {
        const mod = await import("capacitor-voice-recorder");
        const has = await mod.VoiceRecorder.hasAudioRecordingPermission();
        const ok = has.value || (await mod.VoiceRecorder.requestAudioRecordingPermission()).value;
        setMicStatus(ok ? "granted" : "denied");
        update({ permissions: { ...p, mic: ok } });
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        setMicStatus("granted");
        update({ permissions: { ...p, mic: true } });
      }
    } catch { setMicStatus("denied"); update({ permissions: { ...p, mic: false } }); }
  };

  const grantLocation = async () => {
    try {
      if (isAndroid()) {
        const r = await PlacesBridge.requestPermission?.();
        if (r) { setLocFg(!!r.foreground); setLocBg(!!r.background); }
        if (!r?.background) await PlacesBridge.openPermissionSettings?.();
        return;
      }
      if ("geolocation" in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => { setLocFg(true); resolve(); },
            () => { setLocFg(false); resolve(); },
            { enableHighAccuracy: true, timeout: 10_000 },
          );
        });
      }
    } catch {}
  };

  return (
    <PhoneFrame>
      <div className="px-5 pt-5 pb-5 flex flex-col h-full overflow-y-auto">
        <BackHeader />
        <p className="t-eyebrow text-ink/70 mb-1">Permissions</p>
        <h1 className="t-display mb-1">Ring on time. Every time.</h1>
        <p className="t-meta text-ink/75 mb-4 leading-relaxed">
          🔒 <strong className="font-semibold text-[#FF671F]">100% Data Privacy</strong> — Your data stays securely on your own mobile or private Google Drive. We never collect or see it.
        </p>

        <div data-tour="perm-list" className="space-y-2.5">
          <Row
            icon={Bell}
            title="Notifications"
            body="So MinDrop can post reminders and alarms."
            granted={p.notifications}
            onAction={grantNotif}
          />


          {isAndroid() && (
            <Row
              icon={AlarmClock}
              title="Exact alarms"
              body="Fire at the exact minute — even in Doze."
              granted={exactAlarm}
              onAction={async () => { await AlarmsBridge.openExactAlarmSettings(); }}
            />
          )}

          {isAndroid() && (
            <Row
              icon={BatteryCharging}
              title="Ignore battery optimization"
              body="Prevents Android from silencing reminders."
              granted={battOk}
              onAction={async () => { await AlarmsBridge.openBatteryOptimizationSettings(); }}
            />
          )}

          {isAndroid() ? (
            <Row
              icon={MapPin}
              title="Location (Allow all the time)"
              body="Needed for place-based reminders while MinDrop is closed."
              granted={locFg && locBg}
              onAction={grantLocation}
            />
          ) : (
            <Row
              icon={MapPin}
              title="Location"
              body="Fire reminders when you arrive at a saved place."
              granted={locFg}
              onAction={grantLocation}
            />
          )}

          {isAndroid() && (
            <Row
              icon={Ear}
              title="Notification access"
              body="So MinDrop can read notifications from other apps and act on them."
              granted={notifAccess}
              onAction={async () => { await NotifyBridge.openPermissionSettings(); }}
            />
          )}

          <Row
            icon={Mic}
            title="Microphone"
            body="Capture a thought hands-free with a voice note."
            granted={p.mic}
            onAction={grantMic}
          />
        </div>

        <p className="t-meta mt-3 text-ink/60">
          {isNative()
            ? "Reminders are scheduled by Android itself — they fire even when MinDrop isn't running or after a reboot."
            : "In the web preview, alarms only ring while MinDrop is open. Install the APK for background alarms."}
        </p>
        <div className="flex-1 min-h-2" />
        <button
          onClick={() => navigate({ to: "/home" })}
          data-tour="perm-cta"
          style={{
            backgroundColor: "color-mix(in oklab, #FF671F 10%, #fff)",
            color: "#FF671F",
            borderColor: "rgba(255, 103, 31, 0.2)"
          }}
          className="t-button w-full border py-3.5 rounded-2xl mt-4 active:bg-ink/[0.04] transition-colors"
        >
          Continue
        </button>
      </div>
    </PhoneFrame>
  );
}
