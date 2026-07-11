import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const QUIPS = [
  "Wait — what was it again?",
  "Asking for a friend (you).",
  "Just between us.",
  "We won't tell a soul.",
];

export function NamePrompt({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: string | null;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [value, setValue] = useState(initial || "");
  const [quip] = useState(() => QUIPS[Math.floor(Math.random() * QUIPS.length)]);

  useEffect(() => { if (open) setValue(initial || ""); }, [open, initial]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-center bg-ink/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 bg-canvas border border-ink/10 shadow-2xl overflow-hidden mb-4 sm:mb-0"
            style={{ background: "linear-gradient(135deg,#FFF7EB 0%, #FFE7C2 60%, #FCD9F2 100%)" }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 size-8 rounded-full bg-white/60 hover:bg-white grid place-items-center"
              aria-label="Close"
            >
              <X className="size-4 text-ink/75" />
            </button>

            <div className="t-title mb-3">👋</div>
            <p className="t-eyebrow text-ink/70 mb-1">{quip}</p>
            <h2 className="t-display text-ink mb-2">
              What should we call you?
            </h2>
            <p className="t-body text-ink/65 mb-5">
              Pinky promise — this stays right here on your device. We just want to greet you properly
              (and bail you out the day you blank on your own name).
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = value.trim().slice(0, 40);
                if (trimmed) onSave(trimmed);
                onClose();
              }}
              className="space-y-3"
            >
              <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Your name, nickname, or alter ego"
                maxLength={40}
                className="t-body w-full px-4 py-3 rounded-xl bg-white/80 border border-ink/10 focus:border-brand outline-none text-ink placeholder:text-ink/35"
              />
              <button
                type="submit"
                className="t-button w-full py-3 rounded-xl bg-ink text-canvas hover:opacity-90 transition-opacity"
              >
                Lock it in
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
