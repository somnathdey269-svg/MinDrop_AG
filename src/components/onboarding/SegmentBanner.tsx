import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SegmentSlide = {
  kicker: string;
  title: string;
  body: string;
};

const ROTATE_MS = 15000;

/**
 * Rotating 3-slide intro banner used for segment onboarding
 * (Notify, Places). Mirrors the size + interaction of the
 * reminder `WelcomeBanner` — accent color is themed per segment.
 */
export function SegmentBanner({
  slides,
  accent,
}: {
  slides: SegmentSlide[];
  accent: string;
}) {
  const [i, setI] = useState(0);
  const active = slides[i];

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [slides.length]);

  const paginate = (dir: number) =>
    setI((v) => (v + dir + slides.length) % slides.length);

  const tint = (pct: number) => `color-mix(in oklab, ${accent} ${pct}%, transparent)`;

  return (
    <div className="mb-6 mt-4">
      <div className="flex items-stretch gap-1">
        <button
          onClick={() => paginate(-1)}
          className="shrink-0 w-5 flex items-center justify-center rounded-l-2xl bg-transparent hover:bg-ink/[0.03] transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-3" style={{ color: accent, opacity: 0.55 }} />
        </button>

        <motion.div
          className="flex-1 relative p-6 rounded-2xl border overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
          style={{
            background: `linear-gradient(135deg, ${tint(22)} 0%, ${tint(10)} 55%, var(--canvas) 100%)`,
            borderColor: tint(28),
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50 || info.velocity.x < -300) paginate(1);
            else if (info.offset.x > 50 || info.velocity.x > 300) paginate(-1);
          }}
        >
          <motion.div
            key={`bg-${i}`}
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 0.14, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-8 -right-8 size-36 rounded-full border-[18px] pointer-events-none select-none"
            style={{ borderColor: accent, background: tint(8) }}
            aria-hidden="true"
          />

          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            layout
          >
            <p
              className="t-eyebrow mb-3"
              style={{ color: accent }}
            >
              {active.kicker}
            </p>
            <h2 className="t-display text-ink mb-3 pr-6">
              {active.title}
            </h2>
            <p className="t-body text-ink/70">{active.body}</p>
          </motion.div>

          {/* Dots */}
          <div className="mt-4 flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className="h-1 rounded-full transition-all"
                style={{
                  width: idx === i ? 16 : 6,
                  background: idx === i ? accent : tint(25),
                }}
              />
            ))}
          </div>
        </motion.div>

        <button
          onClick={() => paginate(1)}
          className="shrink-0 w-5 flex items-center justify-center rounded-r-2xl bg-transparent hover:bg-ink/[0.03] transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="size-3" style={{ color: accent, opacity: 0.55 }} />
        </button>
      </div>
    </div>
  );
}
