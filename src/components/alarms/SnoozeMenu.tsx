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
            className="w-full max-w-md bg-canvas rounded-t-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <p className="t-eyebrow text-ink/60">Snooze</p>
              <button
                onClick={() => { setCustom(false); onClose(); }}
                aria-label="Close snooze menu"
                className="size-8 grid place-items-center rounded-full hover:bg-ink/5"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mx-5 mb-2 h-px bg-ink/10" />

            {!custom ? (
              <div className="px-4 pb-5 pt-1 space-y-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.minutes}
                    onClick={() => pickPreset(p.minutes)}
                    className="w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-ink/[0.04] active:bg-ink/[0.06]"
                  >
                    <Clock className="size-4 text-ink/60" />
                    <span className="t-body text-ink">{p.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => setCustom(true)}
                  className="w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-ink/[0.04] active:bg-ink/[0.06]"
                >
                  <Clock className="size-4 text-ink/60" />
                  <span className="t-body text-ink">Custom…</span>
                </button>
              </div>
            ) : (
              <div className="px-5 pb-5 pt-1 space-y-3">
                <label className="block">
                  <span className="t-meta text-ink/60">Ring again at</span>
                  <input
                    type="datetime-local"
                    value={when}
                    min={toLocalInput(new Date(Date.now() + 60_000))}
                    onChange={(e) => setWhen(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-ink/15 bg-canvas px-4 py-3 t-body text-ink outline-none focus:border-ink"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setCustom(false)}
                    className="t-button bg-canvas border border-ink/15 text-ink py-3 rounded-2xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={pickCustom}
                    className="t-button bg-ink text-canvas py-3 rounded-2xl"
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
