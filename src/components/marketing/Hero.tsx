import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import keeper from "@/assets/marketing/keeper.png";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-canvas">
      {/* soft blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-brand/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 size-[520px] rounded-full bg-[#E07A3C]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-14 pb-16 md:pt-24 md:pb-28 grid gap-10 md:grid-cols-2 items-center">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <span className="t-eyebrow inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-ink/70">
            <span className="size-1.5 rounded-full bg-brand" /> A calm second brain
          </span>
          <h1 className="t-display mt-5 text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
            Your brain,
            <br />
            <span className="text-brand">but kinder.</span>
          </h1>
          <p className="t-body mt-6 text-lg md:text-xl text-ink/75 leading-relaxed">
            Drop a thought. MinDrop remembers so you can breathe.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/download"
              className="t-button inline-flex items-center rounded-full bg-ink text-canvas px-6 py-3.5 hover:opacity-90 transition"
            >
              Get the app
            </Link>
            <Link
              to="/how-it-works"
              className="t-button inline-flex items-center rounded-full border border-hairline-strong bg-canvas px-6 py-3.5 hover:bg-secondary transition"
            >
              See how it works
            </Link>
          </div>
          <p className="t-meta mt-5 text-ink/60">Free forever · No sign-up needed · Android</p>
        </motion.div>

        <motion.div
          initial={reduce ? {} : { opacity: 0, scale: 0.9 }}
          animate={reduce ? {} : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative flex justify-center"
        >
          <motion.img
            src={keeper}
            alt="The Keeper, a friendly cartoon mascot holding a glowing drop"
            width={1024}
            height={1024}
            className="w-full max-w-[420px] md:max-w-[520px] h-auto"
            draggable={false}
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* floating chips */}
          <motion.div
            className="absolute left-0 top-8 rounded-2xl bg-paper-raised shadow-[var(--shadow-raised)] border border-hairline px-3 py-2 flex items-center gap-2"
            initial={reduce ? {} : { opacity: 0, x: -20 }}
            animate={reduce ? {} : { opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className="text-lg">💊</span>
            <span className="t-meta">Meds at 8:00</span>
          </motion.div>
          <motion.div
            className="absolute right-0 bottom-12 rounded-2xl bg-paper-raised shadow-[var(--shadow-raised)] border border-hairline px-3 py-2 flex items-center gap-2"
            initial={reduce ? {} : { opacity: 0, x: 20 }}
            animate={reduce ? {} : { opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span className="text-lg">🛒</span>
            <span className="t-meta">Bread from Miller's</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
