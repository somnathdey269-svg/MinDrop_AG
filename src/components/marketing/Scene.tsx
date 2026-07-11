import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type SceneProps = {
  eyebrow?: string;
  headline: ReactNode;
  sub?: ReactNode;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  tone?: "canvas" | "warm" | "ink";
  children?: ReactNode;
  imageWidth?: number;
  imageHeight?: number;
};

const toneClass = {
  canvas: "bg-canvas text-ink",
  warm: "bg-secondary text-ink",
  ink: "bg-ink text-canvas",
};

export function Scene({
  eyebrow,
  headline,
  sub,
  image,
  imageAlt,
  reverse = false,
  tone = "canvas",
  children,
  imageWidth = 1024,
  imageHeight = 1024,
}: SceneProps) {
  const reduce = useReducedMotion();
  const initial = reduce ? {} : { opacity: 0, y: 24 };
  const whileInView = reduce ? {} : { opacity: 1, y: 0 };
  const imgInitial = reduce ? {} : { opacity: 0, scale: 0.92, y: 16 };
  const imgIn = reduce ? {} : { opacity: 1, scale: 1, y: 0 };

  return (
    <section className={`${toneClass[tone]} relative overflow-hidden`}>
      <div
        className={`mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <motion.div
          initial={imgInitial}
          whileInView={imgIn}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <motion.img
            src={image}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            loading="lazy"
            className="w-full max-w-[420px] md:max-w-[520px] h-auto select-none"
            draggable={false}
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          initial={initial}
          whileInView={whileInView}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          {eyebrow && <p className="t-eyebrow text-brand mb-3">{eyebrow}</p>}
          <h2 className="t-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            {headline}
          </h2>
          {sub && <p className="t-body mt-5 text-lg md:text-xl leading-relaxed opacity-80">{sub}</p>}
          {children && <div className="mt-6">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
