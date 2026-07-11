import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";

export function CtaBand({
  title = "Start dropping.",
  sub = "It's free. It's kind. It's yours.",
}: { title?: string; sub?: string }) {
  const reduce = useReducedMotion();
  return (
    <section className="bg-ink text-canvas">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24 text-center">
        <motion.h2
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="t-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight"
        >
          {title}
        </motion.h2>
        <p className="t-body mt-5 text-lg md:text-xl text-canvas/70">{sub}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/download"
            className="t-button inline-flex items-center rounded-full bg-canvas text-ink px-7 py-4 hover:opacity-90 transition"
          >
            Get the app
          </Link>
          <Link
            to="/pricing"
            className="t-button inline-flex items-center rounded-full border border-canvas/25 text-canvas px-7 py-4 hover:bg-canvas/10 transition"
          >
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
