import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { FeatureDef } from "@/lib/features";

export function FeatureComingSoon({ feature }: { feature: FeatureDef }) {
  const Icon = feature.icon;
  return (
    <div className="min-h-[70vh] grid place-items-center px-6 py-16 bg-canvas text-ink">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-sm text-center"
      >
        <div className="mx-auto size-14 rounded-full bg-brand/10 text-brand grid place-items-center mb-6">
          <Icon className="size-6" />
        </div>
        <p className="t-eyebrow text-ink/50 mb-3">Coming soon</p>
        <h1 className="font-serif text-3xl mb-3">{feature.label}</h1>
        <p className="t-body text-ink/70 mb-8">{feature.tagline}</p>
        <Link
          to="/notify-feature"
          className="inline-block rounded-full bg-ink text-canvas px-5 py-2.5 text-sm font-medium hover:bg-brand transition-colors"
        >
          Notify me when it's live
        </Link>
        <div className="mt-6">
          <Link to="/" className="t-meta text-ink/50 hover:text-brand">
            ← Back home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
