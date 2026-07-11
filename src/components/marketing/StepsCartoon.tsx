import { motion, useReducedMotion } from "framer-motion";
import drop from "@/assets/marketing/drop.png";
import shelf from "@/assets/marketing/shelf.png";
import clockbirds from "@/assets/marketing/clockbirds.png";
import recall from "@/assets/marketing/recall.png";

const steps = [
  { n: 1, title: "Drop it", body: "A thought lands. Type it or say it. Done.", img: drop, alt: "Hands cupping a glowing drop" },
  { n: 2, title: "Tag it", body: "Errand, Promise, Meds, Call, Pet — pick one. Or skip.", img: shelf, alt: "Shelf of memory drops" },
  { n: 3, title: "We nudge you", body: "At the right time. At the right place. Never nagging.", img: clockbirds, alt: "Three clockwork nudging birds" },
  { n: 4, title: "Recall together", body: "It comes back when you need it — with the story intact.", img: recall, alt: "Elder character with a memory card" },
];

export function StepsCartoon() {
  const reduce = useReducedMotion();
  return (
    <div className="grid gap-8 md:gap-6 md:grid-cols-2 max-w-5xl mx-auto">
      {steps.map((s, i) => (
        <motion.div
          key={s.n}
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: i * 0.05 }}
          className="rounded-3xl border border-hairline bg-paper-raised p-6 md:p-8 shadow-[var(--shadow-lift)] flex flex-col"
        >
          <div className="flex items-center gap-3">
            <span className="grid place-items-center size-9 rounded-full bg-brand text-canvas t-button">{s.n}</span>
            <h3 className="t-title text-xl md:text-2xl">{s.title}</h3>
          </div>
          <div className="mt-4 flex justify-center">
            <img src={s.img} alt={s.alt} width={1024} height={1024} loading="lazy" className="w-full max-w-[260px] h-auto" draggable={false} />
          </div>
          <p className="t-body mt-4 text-ink/75">{s.body}</p>
        </motion.div>
      ))}
    </div>
  );
}
