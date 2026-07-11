import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Benefit = { icon: LucideIcon; title: string; body: string };

/**
 * Renders below `SegmentBanner` on a fresh segment (Notify / Places).
 * Mirrors the reminder empty state: "Start here" band + 3 benefit tiles + Go Premium row.
 */
export function SegmentStarter({
  accent,
  startHere,
  benefits,
  premium,
}: {
  accent: string;
  startHere: { kicker: string; text: React.ReactNode };
  benefits: [Benefit, Benefit, Benefit];
  premium: { label: string; body: string; to: string };
}) {
  const tint = (pct: number) => `color-mix(in srgb, ${accent} ${pct}%, transparent)`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div
        className="p-4 rounded-2xl border"
        style={{
          background: `linear-gradient(135deg, ${tint(15)} 0%, ${tint(6)} 60%, var(--canvas) 100%)`,
          borderColor: tint(25),
        }}
      >
        <p
          className="t-eyebrow mb-1.5"
          style={{ color: accent }}
        >
          {startHere.kicker}
        </p>
        <p className="t-body text-ink">
          {startHere.text}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.title}
              className="text-left p-3 rounded-2xl border"
              style={{ background: tint(6), borderColor: tint(20) }}
            >
              <Icon className="mb-1.5 size-5" strokeWidth={1.8} style={{ color: accent }} aria-hidden="true" />
              <p className="t-meta text-ink">{b.title}</p>
              <p className="t-meta text-ink/60 mt-0.5">{b.body}</p>
            </div>
          );
        })}
      </div>

      <Link
        to={premium.to}
        className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition"
        style={{ background: tint(6), borderColor: tint(30) }}
      >
        <div className="min-w-0">
          <p
            className="t-eyebrow"
            style={{ color: accent }}
          >
            {premium.label}
          </p>
          <p className="t-meta text-ink/75 mt-0.5">{premium.body}</p>
        </div>
        <span className="t-body shrink-0" style={{ color: accent }}>→</span>
      </Link>
    </motion.div>
  );
}
