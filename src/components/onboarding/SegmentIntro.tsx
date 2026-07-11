import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

type Benefit = {
  icon: string;
  title: string;
  body: string;
};

export function SegmentIntro({
  accent,
  howItWorks,
  startHere,
  benefits,
  premium,
}: {
  accent: string;
  howItWorks: { kicker: string; title: string; body: string; emoji: string };
  startHere: { kicker: string; text: React.ReactNode };
  benefits: [Benefit, Benefit, Benefit];
  premium: { label: string; body: string; to: string };
}) {
  const tint = (pct: number) => `color-mix(in srgb, ${accent} ${pct}%, transparent)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 mt-4"
    >
      {/* How it works */}
      <div
        className="relative p-6 rounded-2xl border overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tint(18)} 0%, ${tint(6)} 55%, var(--canvas) 100%)`,
          borderColor: tint(28),
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
          animate={{ opacity: 0.14, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="t-title absolute -top-4 -right-6 pointer-events-none select-none"
          aria-hidden="true"
        >
          {howItWorks.emoji}
        </motion.div>
        <p
          className="t-eyebrow mb-3"
          style={{ color: accent }}
        >
          {howItWorks.kicker}
        </p>
        <h2 className="t-display text-ink mb-3 pr-6">
          {howItWorks.title}
        </h2>
        <p className="t-body text-ink/70">{howItWorks.body}</p>
      </div>

      {/* Start here */}
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

      {/* Benefit tiles */}
      <div className="grid grid-cols-3 gap-2">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="text-left p-3 rounded-2xl border"
            style={{
              background: tint(6),
              borderColor: tint(20),
            }}
          >
            <span className="t-title block mb-1.5" aria-hidden="true">
              {b.icon}
            </span>
            <p className="t-meta text-ink">{b.title}</p>
            <p className="t-meta text-ink/60 mt-0.5">{b.body}</p>
          </div>
        ))}
      </div>

      {/* Go Premium */}
      <Link
        to={premium.to}
        className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition"
        style={{
          background: tint(6),
          borderColor: tint(30),
        }}
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
        <span className="t-body shrink-0" style={{ color: accent }}>
          →
        </span>
      </Link>
    </motion.div>
  );
}
