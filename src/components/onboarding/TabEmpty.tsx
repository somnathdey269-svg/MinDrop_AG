import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Card = { icon: LucideIcon; title: string; body: string };

export function TabEmpty({
  accent,
  eyebrow,
  title,
  body,
  Icon,
  cards,
  cta,
}: {
  accent: string;
  eyebrow: string;
  title: string;
  body: string;
  Icon?: LucideIcon;
  cards?: Card[];
  cta?: { label: string; onClick: () => void };
}) {
  const tint = (pct: number) => `color-mix(in srgb, ${accent} ${pct}%, transparent)`;
  return (
    <div className="pt-2 pb-6 space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border p-5"
        style={{
          background: `linear-gradient(135deg, ${tint(18)} 0%, ${tint(6)} 55%, var(--canvas) 100%)`,
          borderColor: tint(28),
        }}
      >
        <div
          className="absolute -top-8 -right-8 size-32 rounded-full blur-2xl"
          style={{ background: tint(20) }}
          aria-hidden="true"
        />
        {Icon && (
          <div
            className="relative size-10 rounded-2xl grid place-items-center mb-3"
            style={{ background: "rgba(255,255,255,0.7)" }}
          >
            <Icon className="size-4" style={{ color: accent }} aria-hidden="true" />
          </div>
        )}
        <p
          className="t-eyebrow relative mb-2"
          style={{ color: accent }}
        >
          {eyebrow}
        </p>
        <p className="t-display relative text-ink mb-2">{title}</p>
        <p className="t-body relative text-ink/70">{body}</p>
      </motion.div>

      {cards && cards.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {cards.map((c) => {
            const CardIcon = c.icon;
            return (
              <div
                key={c.title}
                className="text-left p-3 rounded-2xl border"
                style={{ background: tint(6), borderColor: tint(20) }}
              >
                <CardIcon className="mb-1.5 size-5" strokeWidth={1.8} style={{ color: accent }} aria-hidden="true" />
                <p className="t-meta text-ink">{c.title}</p>
                <p className="t-meta text-ink/60 mt-0.5">{c.body}</p>
              </div>
            );
          })}
        </div>
      )}

      {cta && (
        <button
          onClick={cta.onClick}
          className="t-button w-full mt-1 py-3 rounded-2xl text-canvas transition"
          style={{ background: accent }}
        >
          {cta.label}
        </button>
      )}
    </div>
  );
}
