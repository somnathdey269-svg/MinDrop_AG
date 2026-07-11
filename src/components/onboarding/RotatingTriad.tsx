import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type TriadItem = { icon: LucideIcon; title: string; body: string };

/**
 * A single spotlight card that rotates through three items every 4s.
 * Tap the card or any dot to advance / jump. Reused across every empty
 * state so the "second box, three boxes" moment feels identical whether
 * the user is in Later, Notify or Places.
 */
export function RotatingTriad({
  accent,
  items,
  intervalMs = 4000,
}: {
  accent: string;
  items: [TriadItem, TriadItem, TriadItem];
  intervalMs?: number;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const tint = (pct: number, base = "transparent") =>
    `color-mix(in oklab, ${accent} ${pct}%, ${base})`;

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % items.length), intervalMs);
    return () => window.clearInterval(t);
  }, [paused, intervalMs, items.length]);

  const active = items[i];
  const Icon = active.icon;
  const advance = () => setI((v) => (v + 1) % items.length);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="select-none"
    >
      <button
        type="button"
        onClick={advance}
        className="w-full text-left rounded-2xl border p-4 press relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tint(14, "var(--canvas)")} 0%, ${tint(6, "var(--canvas)")} 100%)`,
          borderColor: tint(24),
        }}
        aria-label={`Highlight ${i + 1} of ${items.length}: ${active.title}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="flex items-start gap-3"
          >
            <span
              className="shrink-0 size-10 rounded-2xl grid place-items-center"
              style={{ background: tint(20, "var(--canvas)") }}
            >
              <Icon className="size-5" strokeWidth={1.8} style={{ color: accent }} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="t-body text-ink">{active.title}</p>
              <p className="t-meta text-ink/60 mt-0.5">{active.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </button>
      <div className="mt-2 flex items-center justify-center gap-1.5" role="tablist">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            role="tab"
            aria-selected={idx === i}
            aria-label={`Show highlight ${idx + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: idx === i ? 18 : 6,
              background: idx === i ? accent : tint(30),
            }}
          />
        ))}
      </div>
    </div>
  );
}
