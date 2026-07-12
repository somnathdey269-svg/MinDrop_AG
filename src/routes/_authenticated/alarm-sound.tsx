import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlarmClock, ArrowLeft, ChevronRight, Music, Vibrate, Zap } from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { AlarmToneSheet } from "@/components/alarms/AlarmToneSheet";
import { getDefaultTone, getVibrationEnabled, setDefaultTone, setVibrationEnabled } from "@/lib/alarms/prefs";
import { toneById, type ToneId } from "@/lib/alarms/tones";
import { useTier } from "@/lib/tier";
import { AlarmsBridge } from "@/lib/alarms/bridge";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/alarm-sound")({
  head: () => ({
    meta: [
      { title: "Alarm & Sound — MinDrop" },
      { name: "description", content: "Choose the ringtone, vibration and snooze behaviour for your MinDrop alarms." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AlarmSoundSettings,
});

function AlarmSoundSettings() {
  const [tone, setTone] = useState<ToneId>("classic");
  const [vibrate, setVibrate] = useState(true);
  const [snoozeIntervals, setSnoozeIntervals] = useState<string[]>(["5", "15", "30"]);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    setTone(getDefaultTone());
    setVibrate(getVibrationEnabled());
    try {
      const saved = window.localStorage.getItem("mindrop.alarm.snoozeIntervals");
      if (saved) {
        setSnoozeIntervals(JSON.parse(saved));
      }
    } catch {}
  }, []);

  function onPick(id: ToneId) {
    setTone(id);
    setDefaultTone(id);
  }
  function onToggleVibrate() {
    const next = !vibrate;
    setVibrate(next);
    setVibrationEnabled(next);
  }

  function handleToggleInterval(id: string) {
    let next: string[];
    if (snoozeIntervals.includes(id)) {
      if (snoozeIntervals.length <= 1) {
        toast.error("At least one snooze option must remain active.");
        return;
      }
      next = snoozeIntervals.filter((x) => x !== id);
    } else {
      next = [...snoozeIntervals, id];
    }
    setSnoozeIntervals(next);
    window.localStorage.setItem("mindrop.alarm.snoozeIntervals", JSON.stringify(next));
    AlarmsBridge.setSnoozeIntervals(next).catch(() => {});
  }

  const current = toneById(tone);

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
        <div className="flex-1 px-5 sm:px-6 pt-6 pb-36">
          <Link
            to="/settings"
            className="inline-flex items-center gap-1.5 t-eyebrow text-ink/60 mb-4 hover:text-ink"
          >
            <ArrowLeft className="size-3.5" /> Back to settings
          </Link>

          <p className="t-eyebrow text-ink/70 mb-1">Reminders</p>
          <h1 className="t-display mb-1">Alarm & sound.</h1>
          <p className="t-body-sm text-ink/60 mb-6">
            Choose how MinDrop rings for reminders set to <span className="text-ink">Alarm</span>. Reminders set to <span className="text-ink">Notify</span> stay silent.
          </p>

          <section className="rounded-3xl bg-white border border-ink/8 overflow-hidden shadow-sm">
            <button
              onClick={() => setPickerOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-4 hover:bg-ink/[0.03]"
              aria-label="Change default alarm tone"
            >
              <span className="size-10 rounded-full bg-canvas grid place-items-center text-ink/70">
                <Music className="size-4" />
              </span>
              <span className="flex-1 min-w-0 text-left">
                <span className="block t-body text-ink">Default alarm tone</span>
                <span className="block t-meta text-ink/55 truncate">{current.label}</span>
              </span>
              <ChevronRight className="size-4 text-ink/40" />
            </button>

            <div className="h-px bg-ink/8 mx-4" />

            <div className="flex items-center gap-3 px-4 py-4">
              <span className="size-10 rounded-full bg-canvas grid place-items-center text-ink/70">
                <Vibrate className="size-4" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block t-body text-ink">Vibration</span>
                <span className="block t-meta text-ink/55">Buzz along with the ringtone</span>
              </span>
              <Switch checked={vibrate} onCheckedChange={onToggleVibrate} style={{ "--switch-accent": "color-mix(in oklab, #06038D 65%, #fff)" } as React.CSSProperties} />
            </div>

            <div className="h-px bg-ink/8 mx-4" />

            <div className="flex flex-col gap-3 px-4 py-4 bg-canvas/30">
              <div className="flex items-center gap-3">
                <span className="size-10 rounded-full bg-canvas grid place-items-center text-ink/70">
                  <AlarmClock className="size-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <span className="block t-body text-ink font-semibold">Active Snooze Options</span>
                  <span className="block t-meta text-ink/55">Select options to show when your alarm rings</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { id: "5", label: "5 Min" },
                  { id: "15", label: "15 Min" },
                  { id: "30", label: "30 Min" },
                  { id: "60", label: "1 Hour" },
                  { id: "180", label: "3 Hours" },
                  { id: "custom", label: "Custom…" },
                ].map((opt) => {
                  const isActive = snoozeIntervals.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleToggleInterval(opt.id)}
                      style={{
                        backgroundColor: isActive ? "color-mix(in oklab, #06038D 12%, #fff)" : "rgba(0,0,0,0.03)",
                        color: isActive ? "#06038D" : "var(--ink)",
                        borderColor: isActive ? "rgba(6, 3, 141, 0.15)" : "rgba(0,0,0,0.08)"
                      }}
                      className="px-2 py-3.5 rounded-2xl border text-center t-meta font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <p className="t-meta text-ink/50 mt-4 leading-relaxed">
            Snooze options — 5 min, 30 min, 1 hour or a custom time — appear when an alarm rings. Alarms use the phone's alarm volume, not notification volume.
          </p>


        </div>
      </div>

      <AlarmToneSheet
        open={pickerOpen}
        selected={tone}
        onSelect={onPick}
        onClose={() => setPickerOpen(false)}
        title="Default alarm tone"
      />
    </PhoneFrame>
  );
}
