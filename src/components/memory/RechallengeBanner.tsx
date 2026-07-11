import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useRechallenge } from "@/lib/memoryos/personality";

export function RechallengeBanner() {
  const { due, hydrated, dismissForDays, config, tier } = useRechallenge();
  if (!hydrated || !due) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="mb-4 rounded-2xl p-4 bg-gradient-to-r from-[#FFE7C2] via-[#FFD9E0] to-[#E8DCFF] border border-ink/10 relative overflow-hidden"
      >
        <button
          onClick={() => dismissForDays(tier === "active" ? 3 : 7)}
          className="absolute top-2 right-2 size-7 grid place-items-center rounded-full bg-white/60 hover:bg-white text-ink/75"
          aria-label="Dismiss"
        >
          <X className="size-3.5" />
        </button>
        <p className="t-eyebrow text-ink/75 mb-1 inline-flex items-center gap-1.5">
          <Sparkles className="size-3" /> 90-second re-tune
        </p>
        <p className="t-display text-ink pr-6">{config.bannerTitle}</p>
        <p className="t-meta text-ink/65 mt-0.5 pr-6">{config.bannerBody}</p>
        <Link
          to="/quiz"
          search={{ short: true } as any}
          className="t-eyebrow mt-3 inline-flex items-center gap-1.5 bg-ink text-canvas px-3.5 py-2 rounded-full"
        >
          Re-take · {config.shortQuestionCount} Qs
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
