import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function SummaryEmpty({ accent, onStart }: { accent: string; onStart: () => void }) {
  const tint = (pct: number, base = "transparent") =>
    `color-mix(in oklab, ${accent} ${pct}%, ${base})`;
  return (
    <div
      className="rounded-3xl p-6 border text-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${tint(30, "var(--canvas)")} 0%, ${tint(14, "var(--canvas)")} 58%, var(--canvas) 100%)`,
        borderColor: tint(45),
      }}
    >
      <div
        className="size-16 mx-auto rounded-full grid place-items-center mb-4"
        style={{ background: tint(22, "var(--canvas)") }}
      >
        <Sparkles className="size-7" style={{ color: accent }} aria-hidden="true" />
      </div>
      <p className="t-eyebrow mb-2" style={{ color: accent }}>
        AI SUMMARY
      </p>
      <p className="t-display text-ink mb-2">One PDF. Your whole day.</p>
      <p className="t-meta text-ink/75 mb-5">
        Securely summarize your notifications on-device using your own Gemini, OpenAI or Claude keys. Set up your integrations in settings to get started.
      </p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="t-button inline-flex items-center gap-2 px-5 py-3 rounded-full text-canvas"
        style={{ background: accent }}
      >
        Configure AI Keys <ArrowRight className="size-4" aria-hidden="true" />
      </motion.button>
    </div>
  );
}
