import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlarmClock, Bell, Clock, X } from "lucide-react";
import { ALARM_EVENT, snoozeMemory, type AlarmDetail } from "@/lib/memoryos/scheduler";
import type { Memory } from "@/lib/memoryos/types";
import { incrementSnoozeCount, openPaywall, readSnoozeCountToday, useTier } from "@/lib/tier";
import { SnoozeMenu } from "@/components/alarms/SnoozeMenu";

import { AlarmsBridge } from "@/lib/alarms/bridge";

export function AlarmSheet() {
  const [queue, setQueue] = useState<Memory[]>([]);
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const [snoozeEnabled, setSnoozeEnabled] = useState(true);
  const current = queue[0];
  const isLoud = current?.notify === "alarm";
  const { tier, limits } = useTier();

  useEffect(() => {
    // 1. Listen for active alarms fired during runtime
    const onFire = (e: Event) => {
      const detail = (e as CustomEvent<AlarmDetail>).detail;
      if (!detail?.memory) return;
      setQueue((q) => (q.some((m) => m.id === detail.memory.id) ? q : [...q, detail.memory]));
    };
    window.addEventListener(ALARM_EVENT, onFire as EventListener);

    // 2. Check if an alarm is already ringing on app launch/resume
    const checkActiveAlarm = () => {
      try {
        const savedEnabled = window.localStorage.getItem("mindrop.alarm.snoozeEnabled");
        setSnoozeEnabled(savedEnabled !== "0");
      } catch {}
      AlarmsBridge.getActiveAlarm()
        .then((active) => {
          if (active && active.id) {
            let mem: Memory | undefined;
            try {
              const raw = window.localStorage.getItem("memoryos.memories.v1");
              const list: Memory[] = raw ? JSON.parse(raw) : [];
              mem = list.find((x) => x.id === active.id);
            } catch {}
            
            const targetMem: Memory = mem || {
              id: active.id,
              text: active.title || "Alarm",
              date: active.body || "",
              notify: "alarm",
            } as any;
            
            setQueue((q) => (q.some((m) => m.id === targetMem.id) ? q : [...q, targetMem]));
          }
        })
        .catch(() => {});
    };

    checkActiveAlarm();

    const onVis = () => {
      if (document.visibilityState === "visible") {
        checkActiveAlarm();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener(ALARM_EVENT, onFire as EventListener);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const dismiss = () => { setSnoozeOpen(false); setQueue((q) => q.slice(1)); };

  const handleStop = () => {
    if (!current) return;
    
    // Archive memory locally
    try {
      const raw = window.localStorage.getItem("memoryos.memories.v1");
      const list: Memory[] = raw ? JSON.parse(raw) : [];
      const updated = list.map((m) =>
        m.id === current.id ? { ...m, archivedAt: new Date().toISOString() } : m
      );
      window.localStorage.setItem("memoryos.memories.v1", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("memoryos:memories-changed"));
    } catch (e) {
      console.warn("Failed to archive memory on Stop", e);
    }
    
    // Stop native ringing/cancel the alarm
    AlarmsBridge.cancelAlarm(current.id).catch(() => {});
    
    dismiss();
  };

  function handleSnoozePick(_targetMs: number, minutes: number) {
    if (!current) return;
    const used = readSnoozeCountToday();
    if (used >= limits.snoozePerDay) {
      openPaywall({ reason: "snooze", tier, limit: limits.snoozePerDay });
      dismiss();
      return;
    }
    incrementSnoozeCount();
    AlarmsBridge.snoozeAlarm(current.id, minutes).catch(() => {});
    snoozeMemory(current.id, minutes);
    dismiss();
  }

  return (
    <>
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-ink/80 backdrop-blur-sm px-6"
            role="alertdialog"
            aria-modal="true"
            aria-label="Memory alarm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-canvas p-6 text-center shadow-2xl"
            >
              <motion.div
                animate={isLoud ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.8, repeat: isLoud ? Infinity : 0 }}
                className={`mx-auto mb-4 size-16 rounded-full grid place-items-center ${isLoud ? "bg-[#B8521B]/10 text-[#B8521B]" : "bg-brand/10 text-brand"}`}
              >
                {isLoud ? <AlarmClock className="size-8" /> : <Bell className="size-7" />}
              </motion.div>
              <p className="t-eyebrow text-ink/60 mb-1">
                {isLoud ? "Alarm" : "Reminder"}
              </p>
              <p className="t-display text-ink mb-2">{current.text}</p>
              {current.date && (
                <p className="t-meta text-ink/70 mb-6">{current.date}</p>
              )}
              <div className={snoozeEnabled ? "grid grid-cols-2 gap-2" : "flex w-full"}>
                {snoozeEnabled && (
                  <button
                    onClick={() => setSnoozeOpen(true)}
                    className="t-button bg-canvas border border-ink/15 text-ink py-3.5 rounded-2xl inline-flex items-center justify-center gap-2 active:bg-ink/[0.04]"
                    aria-label="Snooze alarm"
                  >
                    <Clock className="size-4" /> Snooze
                  </button>
                )}
                <button
                  onClick={handleStop}
                  className="t-button bg-ink text-canvas py-3.5 rounded-2xl inline-flex items-center justify-center gap-2 flex-1"
                  aria-label="Stop alarm"
                >
                  <X className="size-4" /> Stop
                </button>
              </div>
              {queue.length > 1 && (
                <p className="t-meta text-ink/50 mt-3">{queue.length - 1} more waiting</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SnoozeMenu open={snoozeOpen} onClose={() => setSnoozeOpen(false)} onPick={handleSnoozePick} />
    </>
  );
}
