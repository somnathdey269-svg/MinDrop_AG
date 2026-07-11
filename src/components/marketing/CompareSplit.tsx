import { motion, useReducedMotion } from "framer-motion";
import compareUsual from "@/assets/marketing/compare-usual.png";
import compareMindrop from "@/assets/marketing/compare-mindrop.png";

export type CompareBlock = {
  headline: string;
  usualCaption: string;
  mindropCaption: string;
};

export function CompareSplit({ block, index }: { block: CompareBlock; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={reduce ? {} : { opacity: 0, y: 30 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-canvas"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20">
        <p className="t-eyebrow text-brand text-center">0{index + 1} — Different because</p>
        <h3 className="t-display mt-3 text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight text-center max-w-3xl mx-auto">
          {block.headline}
        </h3>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <motion.div
            initial={reduce ? {} : { opacity: 0, x: -20 }}
            whileInView={reduce ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="rounded-[2rem] border border-hairline bg-secondary p-6 md:p-8 flex flex-col"
          >
            <p className="t-eyebrow text-ink/50">The usual way</p>
            <div className="mt-4 rounded-2xl bg-canvas overflow-hidden aspect-square grid place-items-center">
              <img src={compareUsual} alt="" width={1024} height={1024} loading="lazy" className="w-[85%] h-auto opacity-80" draggable={false} />
            </div>
            <p className="t-body mt-5 text-ink/70">{block.usualCaption}</p>
          </motion.div>
          <motion.div
            initial={reduce ? {} : { opacity: 0, x: 20 }}
            whileInView={reduce ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-[2rem] border border-brand/30 bg-paper-raised p-6 md:p-8 flex flex-col shadow-[var(--shadow-lift)]"
          >
            <p className="t-eyebrow text-brand">The MinDrop way</p>
            <div className="mt-4 rounded-2xl bg-secondary overflow-hidden aspect-square grid place-items-center">
              <motion.img
                src={compareMindrop}
                alt=""
                width={1024}
                height={1024}
                loading="lazy"
                className="w-[85%] h-auto"
                draggable={false}
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <p className="t-body mt-5 text-ink/85">{block.mindropCaption}</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
