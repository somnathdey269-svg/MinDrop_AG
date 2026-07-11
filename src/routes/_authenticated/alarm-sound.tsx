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
  const [pickerOpen, setPickerOpen] = useState(false);
  const { limits } = useTier();

  useEffect(() => {
    setTone(getDefaultTone());
    setVibrate(getVibrationEnabled());
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
              <button
                onClick={onToggleVibrate}
                role="switch"
                aria-checked={vibrate}
                aria-label="Toggle vibration"
                className={`relative h-6 w-11 rounded-full transition-colors ${vibrate ? "bg-ink" : "bg-ink/20"}`}
              >
                <span className={`absolute top-0.5 size-5 rounded-full bg-canvas transition-transform ${vibrate ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>

            <div className="h-px bg-ink/8 mx-4" />

            <div className="flex items-center gap-3 px-4 py-4">
              <span className="size-10 rounded-full bg-canvas grid place-items-center text-ink/70">
                <AlarmClock className="size-4" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block t-body text-ink">Snooze quota</span>
                <span className="block t-meta text-ink/55">
                  {limits.snoozePerDay === Infinity ? "Unlimited" : `${limits.snoozePerDay} snoozes / day`}
                </span>
              </span>
            </div>
          </section>

          <p className="t-meta text-ink/50 mt-4 leading-relaxed">
            Snooze options — 5 min, 30 min, 1 hour or a custom time — appear when an alarm rings. Alarms use the phone's alarm volume, not notification volume.
          </p>

          <button
            onClick={async () => {
              const at = Date.now() + 30_000;
              const res = await AlarmsBridge.scheduleAlarm({
                id: `selftest-${Date.now()}`,
                at,
                title: "MinDrop self-test",
                body: "This is a test alarm — it should ring in 30 seconds.",
                delivery: "alarm",
                toneId: tone,
                extra: { kind: "selftest" },
              });
              if (res.reason && res.reason !== "ok") {
                toast.error("Test blocked", {
                  description:
                    res.reason === "no_notif_permission" ? "Notifications are off." :
                    res.reason === "no_exact_permission" ? "Exact alarms are disabled." :
                    "Battery optimisation is on. Alarm may be delayed.",
                });
              } else {
                toast.success("Test scheduled", {
                  description: "Lock your phone. It should ring in 30 seconds.",
                });
              }
            }}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 t-button bg-ink text-canvas py-3 rounded-2xl"
          >
            <Zap className="size-4" /> Test alarm in 30 seconds
          </button>
          <p className="t-meta text-ink/45 mt-2 text-center">
            Use this after changing sound or permission settings.
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
