import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function PillarCard({
  eyebrow,
  title,
  sub,
  image,
  to,
  delay = 0,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  image: string;
  to: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group rounded-[2rem] bg-paper-raised border border-hairline shadow-[var(--shadow-lift)] p-6 md:p-7 flex flex-col"
    >
      <div className="rounded-[1.5rem] bg-secondary overflow-hidden aspect-square grid place-items-center">
        <motion.img
          src={image}
          alt=""
          width={1024}
          height={1024}
          loading="lazy"
          draggable={false}
          className="w-[85%] h-auto"
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <p className="t-eyebrow mt-5 text-brand">{eyebrow}</p>
      <h3 className="t-title text-2xl md:text-3xl mt-1.5">{title}</h3>
      <p className="t-body mt-2 text-ink/70">{sub}</p>
      <Link
        to={to}
        className="t-button mt-5 inline-flex items-center gap-1.5 text-ink group-hover:text-brand transition-colors"
      >
        See how <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}
