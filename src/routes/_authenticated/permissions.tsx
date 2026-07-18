import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AlarmClock, BatteryCharging, Bell, Ear, MapPin, Mic, ShieldAlert, Sparkles } from "lucide-react";
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
import { AnimatePresence, motion } from "framer-motion";
import {
  getUserEnabledPermissions,
  setUserPermissionEnabled,
  type UserEnabledMap,
  readPermissions
} from "@/lib/permissions/state";

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
      className="w-full text-left p-4 bg-white rounded-2xl border border-ink/10 active:bg-ink/[0.02] transition-colors animate-in fade-in duration-200"
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

interface RevokeModalInfo {
  key: keyof UserEnabledMap;
  title: string;
  body: string;
  redirect: () => Promise<void>;
}

const REVOKE_INFO: Record<keyof UserEnabledMap, { title: string; body: string; redirect: () => Promise<void> }> = {
  notifications: {
    title: "Keep Notifications Active?",
    body: "Without notifications, MinDrop cannot alert you when rules trigger or memories fade. Let's keep them active so you never miss a beat!",
    redirect: async () => { await AlarmsBridge.openNotificationSettings(); }
  },
  exactAlarm: {
    title: "Keep Precise Reminders?",
    body: "Exact alarms ensure MinDrop wakes up instantly and alerts you down to the exact second. Disabling this might lead to delayed reminders by Android's battery-saving system.",
    redirect: async () => { await AlarmsBridge.openExactAlarmSettings(); }
  },
  battery: {
    title: "Stay Always Connected?",
    body: "Ignoring battery restrictions allows MinDrop to reliably run background triggers so you stay on schedule. Disabling this could result in Android silencing the app.",
    redirect: async () => { await AlarmsBridge.openBatteryOptimizationSettings(); }
  },
  location: {
    title: "Keep Location Reminders?",
    body: "Location settings let MinDrop fire reminders exactly when you arrive at or leave saved places. Disabling this makes location-based triggers impossible.",
    redirect: async () => {
      if (isAndroid()) {
        await PlacesBridge.openPermissionSettings?.();
      } else {
        await AlarmsBridge.openAppDetails();
      }
    }
  },
  notificationAccess: {
    title: "Keep Intelligent Filters?",
    body: "Notification access is the heart of Notify — it converts incoming WhatsApp or system alerts into alarms. Disabling this shuts down your capture filters.",
    redirect: async () => { await NotifyBridge.openPermissionSettings(); }
  },
  mic: {
    title: "Keep Hands-Free Notes?",
    body: "Microphone permission powers your voice notes, allowing you to capture ideas effortlessly. Disabling this prevents voice recordings.",
    redirect: async () => { await AlarmsBridge.openAppDetails(); }
  }
};

function Permissions() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();
  const p = state.permissions;

  const [userEnabled, setUserEnabled] = useState<UserEnabledMap>({});
  const [notifStatus, setNotifStatus] = useState<Status>("unknown");
  const [micStatus, setMicStatus] = useState<Status>("unknown");
  const [exactAlarm, setExactAlarm] = useState<boolean>(false);
  const [battOk, setBattOk] = useState<boolean>(false);
  const [locFg, setLocFg] = useState<boolean>(false);
  const [locBg, setLocBg] = useState<boolean>(false);
  const [notifAccess, setNotifAccess] = useState<boolean>(false);

  const [revokeModal, setRevokeModal] = useState<RevokeModalInfo | null>(null);

  const refresh = useCallback(async () => {
    setUserEnabled(getUserEnabledPermissions());
    try {
      if (isNative()) {
        const r = await LocalNotifications.checkPermissions();
        const s = (r.display === "granted" ? "granted" : r.display === "denied" ? "denied" : "prompt") as Status;
        setNotifStatus(s);
        update(prev => {
          const isOk = s === "granted";
          if (prev.permissions.notifications === isOk) return prev;
          return { ...prev, permissions: { ...prev.permissions, notifications: isOk } };
        });
      } else if (typeof window !== "undefined" && "Notification" in window) {
        const perm = Notification.permission as Status;
        setNotifStatus(perm);
        const isOn = perm === "granted";
        update(prev => {
          if (prev.permissions.notifications === isOn) return prev;
          return { ...prev, permissions: { ...prev.permissions, notifications: isOn } };
        });
      }
    } catch {}
    try {
      if (isNative()) {
        const { VoiceRecorder } = await import("capacitor-voice-recorder");
        const has = await VoiceRecorder.hasAudioRecordingPermission();
        const ok = has.value;
        setMicStatus(ok ? "granted" : "prompt");
        update(prev => {
          if (prev.permissions.mic === ok) return prev;
          return { ...prev, permissions: { ...prev.permissions, mic: ok } };
        });
      } else {
        const q = await navigator.permissions?.query({ name: "microphone" as PermissionName });
        if (q) {
          setMicStatus(q.state as Status);
          const isOn = q.state === "granted";
          update(prev => {
            if (prev.permissions.mic === isOn) return prev;
            return { ...prev, permissions: { ...prev.permissions, mic: isOn } };
          });
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
      try {
        const q = await navigator.permissions?.query({ name: "geolocation" as PermissionName });
        if (q) setLocFg(q.state === "granted");
      } catch {}
    }
  }, [update]);

  // Polling helper to capture quick system settings changes
  const startPolling = () => {
    let count = 0;
    const interval = setInterval(() => {
      refresh();
      count++;
      if (count > 8) clearInterval(interval);
    }, 1000);
  };

  useEffect(() => {
    refresh();
    const onVis = () => {
      if (document.visibilityState === "visible") {
        refresh();
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
        update(prev => ({ ...prev, permissions: { ...prev.permissions, notifications: ok } }));
        if (!ok) await AlarmsBridge.openNotificationSettings();
        return;
      }
      if (isNative()) {
        const r = await LocalNotifications.requestPermissions();
        const ok = r.display === "granted";
        setNotifStatus(ok ? "granted" : "denied");
        update(prev => ({ ...prev, permissions: { ...prev.permissions, notifications: ok } }));
      } else if ("Notification" in window) {
        const res = await Notification.requestPermission();
        setNotifStatus(res as Status);
        update(prev => ({ ...prev, permissions: { ...prev.permissions, notifications: res === "granted" } }));
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
        update(prev => ({ ...prev, permissions: { ...prev.permissions, mic: ok } }));
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        setMicStatus("granted");
        update(prev => ({ ...prev, permissions: { ...prev.permissions, mic: true } }));
      }
    } catch { setMicStatus("denied"); update(prev => ({ ...prev, permissions: { ...prev.permissions, mic: false } })); }
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

  // Main Toggle Handler
  const handleToggle = async (key: keyof UserEnabledMap, isCurrentlyActive: boolean) => {
    if (isCurrentlyActive) {
      // Toggle OFF requested -> show positive revocation modal
      const info = REVOKE_INFO[key];
      setRevokeModal({
        key,
        title: info.title,
        body: info.body,
        redirect: info.redirect
      });
    } else {
      // Toggle ON requested -> enable preference, request OS permission, start polling
      setUserPermissionEnabled(key, true);
      setUserEnabled(getUserEnabledPermissions());
      
      if (key === "notifications") await grantNotif();
      else if (key === "mic") await grantMic();
      else if (key === "location") await grantLocation();
      else if (key === "exactAlarm") await AlarmsBridge.openExactAlarmSettings();
      else if (key === "battery") await AlarmsBridge.openBatteryOptimizationSettings();
      else if (key === "notificationAccess") await NotifyBridge.openPermissionSettings();

      startPolling();
    }
  };

  // Perform revocation after modal confirmation
  const confirmRevoke = async () => {
    if (!revokeModal) return;
    const { key, redirect } = revokeModal;
    
    setUserPermissionEnabled(key, false);
    setUserEnabled(getUserEnabledPermissions());
    setRevokeModal(null);
    
    try {
      await redirect();
    } catch {}
    
    startPolling();
  };

  // Allow All sequential triggers
  const handleAllowAll = async () => {
    const keys: Array<keyof UserEnabledMap> = ["notifications", "exactAlarm", "battery", "location", "notificationAccess", "mic"];
    keys.forEach((k) => setUserPermissionEnabled(k, true));
    setUserEnabled(getUserEnabledPermissions());

    try {
      if (notifStatus !== "granted") {
        if (isAndroid()) {
          const st = await AlarmsBridge.requestNotificationPermission();
          if (st.postNotifications) {
            setNotifStatus("granted");
            update(prev => ({ ...prev, permissions: { ...prev.permissions, notifications: true } }));
          } else {
            await AlarmsBridge.openNotificationSettings();
          }
        } else if (isNative()) {
          const r = await LocalNotifications.requestPermissions();
          if (r.display === "granted") setNotifStatus("granted");
        } else if ("Notification" in window) {
          await Notification.requestPermission();
        }
      }

      if (micStatus !== "granted") {
        if (isNative()) {
          const mod = await import("capacitor-voice-recorder");
          await mod.VoiceRecorder.requestAudioRecordingPermission();
        } else {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((t) => t.stop());
        }
      }

      if (!locFg || (isAndroid() && !locBg)) {
        if (isAndroid()) {
          await PlacesBridge.requestPermission?.();
        }
      }

      if (isAndroid() && !exactAlarm) {
        await AlarmsBridge.openExactAlarmSettings();
      }
      if (isAndroid() && !battOk) {
        await AlarmsBridge.openBatteryOptimizationSettings();
      }
      if (isAndroid() && !notifAccess) {
        await NotifyBridge.openPermissionSettings();
      }
    } catch (e) {
      console.warn("Allow All flow interrupted: ", e);
    }

    startPolling();
  };

  // Determine visual toggling states
  const showNotif = !!(userEnabled.notifications && notifStatus === "granted");
  const showMic = !!(userEnabled.mic && micStatus === "granted");
  const showExact = !!(userEnabled.exactAlarm && exactAlarm);
  const showBattery = !!(userEnabled.battery && battOk);
  const showLocation = !!(userEnabled.location && (isAndroid() ? (locFg && locBg) : locFg));
  const showAccess = !!(userEnabled.notificationAccess && notifAccess);

  return (
    <PhoneFrame>
      <div className="px-5 pt-5 pb-5 flex flex-col h-full overflow-y-auto relative">
        <BackHeader />
        <p className="t-eyebrow text-ink/70 mb-1">Permissions</p>
        <h1 className="t-display mb-1">Ring on time. Every time.</h1>
        <p className="t-meta text-ink/75 mb-4 leading-relaxed">
          🔒 <strong className="font-semibold text-[#FF671F]">100% Data Privacy</strong> — Your data stays securely on your own mobile or private Google Drive. We never collect or see it.
        </p>

        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleAllowAll}
            style={{ color: "#FF671F", borderColor: "rgba(255, 103, 31, 0.2)" }}
            className="px-3.5 py-1.5 rounded-xl border bg-white hover:bg-[#FF671F]/5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="size-3.5" /> Enable All Required
          </button>
        </div>

        <div data-tour="perm-list" className="space-y-2.5">
          <Row
            icon={Bell}
            title="Notifications"
            body="So MinDrop can post reminders and alarms."
            granted={showNotif}
            onAction={() => handleToggle("notifications", showNotif)}
          />

          {isAndroid() && (
            <Row
              icon={AlarmClock}
              title="Exact alarms"
              body="Fire at the exact minute — even in Doze."
              granted={showExact}
              onAction={() => handleToggle("exactAlarm", showExact)}
            />
          )}

          {isAndroid() && (
            <Row
              icon={BatteryCharging}
              title="Ignore battery optimization"
              body="Prevents Android from silencing reminders."
              granted={showBattery}
              onAction={() => handleToggle("battery", showBattery)}
            />
          )}

          {isAndroid() ? (
            <Row
              icon={MapPin}
              title="Location (Allow all the time)"
              body="Needed for place-based reminders while MinDrop is closed."
              granted={showLocation}
              onAction={() => handleToggle("location", showLocation)}
            />
          ) : (
            <Row
              icon={MapPin}
              title="Location"
              body="Fire reminders when you arrive at a saved place."
              granted={showLocation}
              onAction={() => handleToggle("location", showLocation)}
            />
          )}

          {isAndroid() && (
            <Row
              icon={Ear}
              title="Notification access"
              body="So MinDrop can read notifications from other apps and act on them."
              granted={showAccess}
              onAction={() => handleToggle("notificationAccess", showAccess)}
            />
          )}

          <Row
            icon={Mic}
            title="Microphone"
            body="Capture a thought hands-free with a voice note."
            granted={showMic}
            onAction={() => handleToggle("mic", showMic)}
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

        {/* Motivational Revocation Dialog */}
        <AnimatePresence>
          {revokeModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRevokeModal(null)}
                className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-canvas rounded-3xl border border-ink/10 max-w-sm w-full p-6 shadow-2xl z-10 text-center"
              >
                <div className="mx-auto mb-3.5 size-12 rounded-2xl bg-amber-50 grid place-items-center text-amber-600">
                  <ShieldAlert className="size-6" />
                </div>
                <h3 className="t-title mb-2 text-ink">{revokeModal.title}</h3>
                <p className="t-body-sm text-ink/70 mb-6 leading-relaxed">{revokeModal.body}</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setRevokeModal(null)}
                    style={{ backgroundColor: "#FF671F" }}
                    className="w-full text-white py-3.5 rounded-2xl t-button hover:opacity-95 font-semibold transition-all active:scale-[0.99]"
                  >
                    Keep Enabled
                  </button>
                  <button
                    onClick={confirmRevoke}
                    className="w-full text-ink/50 hover:text-red-500 py-2.5 text-xs font-semibold transition-colors"
                  >
                    Disable Anyway
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}
