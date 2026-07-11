import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { CHANGELOG, markChangelogSeen } from "@/lib/changelog";

export function ChangelogSheet({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const latest = CHANGELOG[0]?.version;
    if (latest) markChangelogSeen(latest);
  }, []);
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 z-40"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-canvas border-t border-ink/10 max-h-[88%] overflow-y-auto"
      >
        <div className="sticky top-0 flex items-center justify-between px-5 py-3 bg-canvas border-b border-ink/5">
          <span className="t-eyebrow text-ink/70 inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> What's new
          </span>
          <button
            onClick={onClose}
            className="size-8 rounded-full grid place-items-center hover:bg-ink/5"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="px-6 py-6 space-y-6">
          {CHANGELOG.map((entry) => (
            <div key={entry.version}>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="t-title">v{entry.version}</p>
                <p className="t-meta text-ink/50">{entry.date}</p>
              </div>
              <ul className="space-y-1.5">
                {entry.notes.map((n, i) => (
                  <li key={i} className="t-body-sm text-ink/75 flex gap-2">
                    <span className="text-brand mt-1.5">•</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
