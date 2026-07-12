/**
 * SnoozeMenu — bottom-sheet with 5m / 30m / 1h presets plus a Custom
 * date+time picker. Emits the target epoch-ms via onPick.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Called with the absolute epoch-ms the reminder should re-fire at. */
  onPick: (targetMs: number, minutes: number) => void;
}

const PRESETS: Array<{ label: string; minutes: number }> = [
  { label: "5 minutes",  minutes: 5 },
  { label: "30 minutes", minutes: 30 },
  { label: "1 hour",     minutes: 60 },
];

function toLocalInput(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function SnoozeMenu({ open, onClose, onPick }: Props) {
  const [custom, setCustom] = useState(false);
  const [when, setWhen] = useState(() => toLocalInput(new Date(Date.now() + 60 * 60_000)));

  // Read saved snooze intervals from localStorage
  const savedIntervals = (() => {
    try {
      const raw = window.localStorage.getItem("mindrop.alarm.snoozeIntervals");
      if (raw) return JSON.parse(raw) as string[];
    } catch {}
    return ["5", "15", "30"]; // default fallback
  })();

  const enabledPresets = savedIntervals
    .filter((id) => id !== "custom")
    .map((id) => {
      const mins = parseInt(id, 10);
      const label = () => {
        if (mins >= 180 && mins % 60 === 0) return `${mins / 60} hours`;
        if (mins >= 60 && mins % 60 === 0) return `${mins / 60} hour`;
        return `${mins} minutes`;
      };
      return { label: label(), minutes: mins };
    });

  const customEnabled = savedIntervals.includes("custom");

  function pickPreset(minutes: number) {
    onPick(Date.now() + minutes * 60_000, minutes);
    setCustom(false);
    onClose();
  }
  
  function pickCustom() {
    const ms = new Date(when).getTime();
    if (!Number.isFinite(ms) || ms <= Date.now()) return;
    onPick(ms, Math.round((ms - Date.now()) / 60_000));
    setCustom(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-end justify-center bg-ink/50 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => { setCustom(false); onClose(); }}
          role="dialog" aria-modal="true" aria-label="Snooze options"
        >
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-md bg-canvas rounded-t-3xl shadow-2xl overflow-hidden border-t border-ink/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="size-4.5 text-brand" />
                <p className="t-eyebrow text-ink font-semibold">Snooze reminder</p>
              </div>
              <button
                onClick={() => { setCustom(false); onClose(); }}
                aria-label="Close snooze menu"
                className="size-8 grid place-items-center rounded-full hover:bg-ink/5 transition-colors duration-150"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mx-5 mb-3 h-px bg-ink/10" />

            {!custom ? (
              <div className="px-5 pb-6 pt-1 space-y-2">
                {enabledPresets.map((p) => (
                  <button
                    key={p.minutes}
                    onClick={() => pickPreset(p.minutes)}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-ink/8 bg-white hover:bg-ink/[0.02] active:scale-[0.99] transition-all duration-150 shadow-sm cursor-pointer"
                  >
                    <span className="t-body font-medium text-ink">{p.label}</span>
                    <span className="t-meta text-ink/40">+{p.minutes}m</span>
                  </button>
                ))}
                
                {customEnabled && (
                  <button
                    onClick={() => setCustom(true)}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-ink/8 bg-white hover:bg-ink/[0.02] active:scale-[0.99] transition-all duration-150 shadow-sm cursor-pointer"
                  >
                    <span className="t-body font-medium text-ink">Custom time…</span>
                    <Clock className="size-4 text-ink/40" />
                  </button>
                )}
              </div>
            ) : (
              <div className="px-5 pb-6 pt-1 space-y-4">
                <label className="block">
                  <span className="t-meta text-ink/65 font-medium">Choose date and time to notify again</span>
                  <input
                    type="datetime-local"
                    value={when}
                    min={toLocalInput(new Date(Date.now() + 60_000))}
                    onChange={(e) => setWhen(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3.5 t-body text-ink outline-none focus:border-brand transition-colors shadow-sm"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setCustom(false)}
                    className="t-button bg-white border border-ink/15 text-ink py-3.5 rounded-2xl active:bg-ink/[0.02] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={pickCustom}
                    className="t-button bg-ink text-canvas py-3.5 rounded-2xl active:opacity-90 transition-opacity"
                  >
                    Snooze
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
