import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mic, Bell, MapPin, Layers, X } from "lucide-react";

const KEY = "memoryos.tour.seen.v1";

const STEPS = [
  { icon: Sparkles, title: "Welcome to MinDrop", body: "Capture a thought in seconds. It waits for you — never the other way around." },
  { icon: Mic, title: "Type or speak", body: "Tap the capture bar at the bottom. Voice notes are transcribed on-device." },
  { icon: Bell, title: "Do it Later", body: "Set a time and forget it. We'll nudge you exactly when it matters." },
  { icon: MapPin, title: "Places (Premium)", body: "Get reminded when you arrive somewhere — grocery list at the store." },
  { icon: Layers, title: "Memory Packs", body: "Grab a starter pack — Movies, Books, Groceries — or make your own." },
];

export function hasSeenTour(): boolean {
  if (typeof window === "undefined") return true;
  try { return window.localStorage.getItem(KEY) === "1"; } catch { return true; }
}

export function markTourSeen() {
  try { window.localStorage.setItem(KEY, "1"); } catch {}
}

export function WelcomeTour({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const Icon = step.icon;
  const last = i === STEPS.length - 1;

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const close = () => { markTourSeen(); onClose(); };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-[60] bg-ink/60 backdrop-blur-sm grid place-items-center px-6"
      >
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-3xl bg-canvas p-6 relative"
        >
          <button
            onClick={close}
            aria-label="Skip walkthrough"
            className="absolute top-3 right-3 size-8 rounded-full grid place-items-center hover:bg-ink/5"
          >
            <X className="size-4" />
          </button>
          <div className="size-14 rounded-2xl bg-brand/15 grid place-items-center mb-4">
            <Icon className="size-7 text-brand" aria-hidden="true" />
          </div>
          <p className="t-eyebrow text-ink/50 mb-1">Step {i + 1} of {STEPS.length}</p>
          <h2 className="t-display mb-2">{step.title}</h2>
          <p className="t-body-sm text-ink/70 mb-6">{step.body}</p>

          <div className="flex items-center justify-center gap-1.5 mb-5">
            {STEPS.map((_, k) => (
              <span
                key={k}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-ink" : "w-1.5 bg-ink/20"}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {i > 0 && (
              <button onClick={() => setI(i - 1)} className="flex-1 py-3 rounded-2xl border border-ink/15 t-button">
                Back
              </button>
            )}
            <button
              onClick={() => (last ? close() : setI(i + 1))}
              className="flex-1 py-3 rounded-2xl bg-ink text-canvas t-button"
            >
              {last ? "Start capturing" : "Next"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
