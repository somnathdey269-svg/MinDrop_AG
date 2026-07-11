import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Minimize2, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

export type WelcomeSlide = { kicker: string; title: string; body: string };

const DEFAULT_SLIDES: WelcomeSlide[] = [
  {
    kicker: "Start here",
    title: "Your mind wasn't built to store everything.",
    body: "Capture the small stuff — where you parked, what your friend said, the password you'll forget by Tuesday. We'll bring it back exactly when you need it.",
  },
  {
    kicker: "How it works",
    title: "Drop it in. Forget it. We hand it back.",
    body: "Type a thought, choose when it matters — in two hours, tonight, tomorrow morning, next Friday — and pick notification or alarm. MinDrop keeps it quiet until the exact moment you need it back.",
  },
  {
    kicker: "Private by design",
    title: "Your thoughts never leave your pocket.",
    body: "Free memories live on your device. Premium memories sync to your own personal cloud. No ads. No tracking. No human ever reads what you write — not us, not anyone.",
  },
];

const ROTATE_MS = 15000;

export function WelcomeBanner({ compact: compactProp, accent, slides }: { compact: boolean; accent: string; slides?: WelcomeSlide[] }) {
  const SLIDES = slides ?? DEFAULT_SLIDES;
  const [i, setI] = useState(0);
  const [forcedOpen, setForcedOpen] = useState(false);
  const compact = compactProp && !forcedOpen;
  const active = SLIDES[i];
  const tint = (pct: number) => `color-mix(in oklab, ${accent} ${pct}%, transparent)`;

  useEffect(() => {
    if (compact) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [compact, SLIDES.length]);

  if (compact) {
    return (
      <button
        onClick={() => setForcedOpen(true)}
        className="w-full mb-4 flex items-center justify-between gap-3 p-3 rounded-2xl border text-left overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${tint(28)} 0%, ${tint(14)} 60%, var(--canvas) 100%)`,
          borderColor: tint(45),
        }}
      >
        <div className="min-w-0">
          <p className="t-eyebrow mb-0.5" style={{ color: accent }}>{active.kicker}</p>
          <p className="t-meta text-ink truncate">{active.title}</p>
        </div>
        <span className="size-7 rounded-full backdrop-blur grid place-items-center shrink-0" style={{ background: tint(28) }}>
          <Maximize2 className="size-3.5" style={{ color: accent }} />
        </span>
      </button>
    );
  }


  const paginate = (dir: number) => setI((v) => (v + dir + SLIDES.length) % SLIDES.length);

  return (
    <div className="mb-6">
      <div className="flex items-stretch gap-1">
        {/* Left arrow */}
        <button
          onClick={() => paginate(-1)}
          className="shrink-0 w-5 flex items-center justify-center rounded-l-2xl bg-transparent hover:bg-ink/[0.03] transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-2.5 text-ink/25" />
        </button>

        <motion.div
          className="flex-1 relative p-6 rounded-2xl border overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
          style={{ background: `linear-gradient(135deg, ${tint(32)} 0%, ${tint(16)} 50%, var(--canvas) 100%)`, borderColor: tint(50) }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50 || info.velocity.x < -300) paginate(1);
            else if (info.offset.x > 50 || info.velocity.x > 300) paginate(-1);
          }}
        >
          {/* Floating single-color accent mark */}
          <motion.div
            key={`bg-${i}`}
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 0.35, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-8 -right-8 size-36 rounded-full border-[18px] pointer-events-none select-none"
            style={{ borderColor: accent, background: tint(20) }}
            aria-hidden="true"
          />


          {compactProp && (
            <button
              onClick={() => setForcedOpen(false)}
              className="absolute top-3 right-3 size-7 rounded-full backdrop-blur grid place-items-center z-10"
              style={{ background: tint(14) }}
              aria-label="Collapse"
            >
              <Minimize2 className="size-3.5" style={{ color: accent }} />
            </button>
          )}
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            layout
          >
            <p className="t-eyebrow mb-3" style={{ color: accent }}>{active.kicker}</p>
            <h2 className="t-display text-ink mb-3 pr-6">{active.title}</h2>
            <p className="t-body text-ink/70">{active.body}</p>
          </motion.div>
        </motion.div>

        {/* Right arrow */}
        <button
          onClick={() => paginate(1)}
          className="shrink-0 w-5 flex items-center justify-center rounded-r-2xl bg-transparent hover:bg-ink/[0.03] transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="size-2.5 text-ink/25" />
        </button>
      </div>
    </div>
  );
}
