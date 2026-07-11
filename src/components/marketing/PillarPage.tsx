import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { MarketingLayout } from "./MarketingLayout";
import { CtaBand } from "./CtaBand";
import { ArrowRight, Check } from "lucide-react";

export type PillarBeat = { title: string; body: string; emoji: string };
export type PillarCapability = { icon: string; label: string };
export type PillarPricingRow = { label: string; free: string; premium: string };
export type PillarCrossLink = { to: string; label: string; eyebrow: string };

export function PillarPage({
  eyebrow,
  headline,
  promise,
  heroImage,
  heroAlt,
  itchTitle,
  itchBody,
  beats,
  capabilities,
  dayImage,
  dayAlt,
  dayMoments,
  pricingRows,
  crossLinks,
}: {
  eyebrow: string;
  headline: ReactNode;
  promise: string;
  heroImage: string;
  heroAlt: string;
  itchTitle: ReactNode;
  itchBody: string;
  beats: PillarBeat[]; // 3
  capabilities: PillarCapability[]; // 4-6
  dayImage: string;
  dayAlt: string;
  dayMoments: [string, string, string];
  pricingRows: PillarPricingRow[];
  crossLinks: PillarCrossLink[]; // 2
}) {
  return (
    <MarketingLayout>
      <PillarHero eyebrow={eyebrow} headline={headline} promise={promise} image={heroImage} alt={heroAlt} />
      <ItchScene title={itchTitle} body={itchBody} />
      <ThreeBeat beats={beats} />
      <Capabilities items={capabilities} />
      <DayTimeline image={dayImage} alt={dayAlt} moments={dayMoments} />
      <PricingSlice rows={pricingRows} />
      <CrossLinks links={crossLinks} />
      <CtaBand />
    </MarketingLayout>
  );
}

function PillarHero({ eyebrow, headline, promise, image, alt }: { eyebrow: string; headline: ReactNode; promise: string; image: string; alt: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -6]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-canvas">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-brand/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 size-[520px] rounded-full bg-[#E07A3C]/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-14 pb-16 md:pt-24 md:pb-24 grid gap-10 md:grid-cols-2 items-center">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="t-eyebrow inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-ink/70">
            <span className="size-1.5 rounded-full bg-brand" /> {eyebrow}
          </span>
          <h1 className="t-display mt-5 text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight">{headline}</h1>
          <p className="t-body mt-6 text-lg md:text-xl text-ink/75 leading-relaxed">{promise}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/download" className="t-button inline-flex items-center rounded-full bg-ink text-canvas px-6 py-3.5 hover:opacity-90 transition">
              Get the app
            </Link>
            <Link to="/how-it-works" className="t-button inline-flex items-center rounded-full border border-hairline-strong bg-canvas px-6 py-3.5 hover:bg-secondary transition">
              How it works
            </Link>
          </div>
        </motion.div>
        <motion.div style={{ y, rotate: rot }} className="flex justify-center">
          <motion.img
            src={image}
            alt={alt}
            width={1024}
            height={1024}
            draggable={false}
            className="w-full max-w-[420px] md:max-w-[520px] h-auto"
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={reduce ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function ItchScene({ title, body }: { title: ReactNode; body: string }) {
  const reduce = useReducedMotion();
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-4xl px-5 md:px-8 py-16 md:py-24 text-center">
        <motion.h2
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="t-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={reduce ? {} : { opacity: 0 }}
          whileInView={reduce ? {} : { opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="t-body mt-5 text-lg md:text-xl text-ink/70"
        >
          {body}
        </motion.p>
      </div>
    </section>
  );
}

function ThreeBeat({ beats }: { beats: PillarBeat[] }) {
  const reduce = useReducedMotion();
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
        <p className="t-eyebrow text-brand text-center">How it works</p>
        <h2 className="t-display mt-3 text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-center max-w-3xl mx-auto">
          Three beats. That's it.
        </h2>
        <div className="mt-12 md:mt-16 grid gap-5 md:grid-cols-3">
          {beats.map((b, i) => (
            <motion.div
              key={b.title}
              initial={reduce ? {} : { opacity: 0, y: 30 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[2rem] border border-hairline bg-paper-raised p-7 md:p-8 shadow-[var(--shadow-lift)]"
            >
              <span className="t-eyebrow absolute top-4 right-5 text-ink/40">0{i + 1}</span>
              <motion.div
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={reduce ? undefined : { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl md:text-6xl"
                aria-hidden="true"
              >
                {b.emoji}
              </motion.div>
              <h3 className="t-title text-2xl mt-5">{b.title}</h3>
              <p className="t-body mt-2 text-ink/75">{b.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities({ items }: { items: PillarCapability[] }) {
  const reduce = useReducedMotion();
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
        <p className="t-eyebrow text-brand">What you actually get</p>
        <h2 className="t-display mt-3 text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-3xl">
          No fluff. Just the real bits.
        </h2>
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-10 grid gap-3 sm:grid-cols-2"
        >
          {items.map((it) => (
            <motion.li
              key={it.label}
              variants={reduce ? {} : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              className="rounded-2xl bg-canvas border border-hairline px-5 py-4 flex items-start gap-3"
            >
              <span className="text-2xl shrink-0" aria-hidden="true">{it.icon}</span>
              <span className="t-body text-ink/85">{it.label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function DayTimeline({ image, alt, moments }: { image: string; alt: string; moments: [string, string, string] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section ref={ref} className="bg-canvas">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
        <p className="t-eyebrow text-brand text-center">A day with it</p>
        <h2 className="t-display mt-3 text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-center max-w-3xl mx-auto">
          Morning, noon, evening — quietly working.
        </h2>
        <div className="mt-10 rounded-[2rem] bg-secondary p-4 md:p-6 border border-hairline overflow-hidden">
          <img src={image} alt={alt} width={1536} height={864} loading="lazy" draggable={false} className="w-full h-auto rounded-2xl" />
        </div>
        <div className="mt-8 relative">
          <svg className="absolute left-0 right-0 top-6 h-4 w-full" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d="M 2 2 L 98 2"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeDasharray="1.5 2"
              strokeLinecap="round"
              className="text-brand/50"
              fill="none"
              style={reduce ? { pathLength: 1 } : { pathLength }}
            />
          </svg>
          <ol className="relative grid gap-4 md:grid-cols-3">
            {moments.map((m, i) => (
              <motion.li
                key={m}
                initial={reduce ? {} : { opacity: 0, y: 16 }}
                whileInView={reduce ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="mx-auto size-4 rounded-full bg-brand shadow-[0_0_0_6px_var(--canvas)]" aria-hidden="true" />
                <p className="t-body mt-4 text-ink/80">{m}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function PricingSlice({ rows }: { rows: PillarPricingRow[] }) {
  const reduce = useReducedMotion();
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-4xl px-5 md:px-8 py-16 md:py-24">
        <p className="t-eyebrow text-brand text-center">Free vs Premium</p>
        <h2 className="t-display mt-3 text-4xl md:text-5xl leading-[1.05] tracking-tight text-center">
          Free is genuinely free.
        </h2>
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-10 rounded-[2rem] bg-canvas border border-hairline overflow-hidden shadow-[var(--shadow-lift)]"
        >
          <div className="grid grid-cols-3 t-eyebrow text-ink/60 border-b border-hairline">
            <div className="p-4 md:p-5" />
            <div className="p-4 md:p-5 border-l border-hairline text-center">Free</div>
            <div className="p-4 md:p-5 border-l border-hairline text-center bg-brand/5 text-brand">Premium</div>
          </div>
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-3 border-b last:border-b-0 border-hairline">
              <div className="p-4 md:p-5 t-body text-ink/85">{r.label}</div>
              <div className="p-4 md:p-5 border-l border-hairline t-body text-center text-ink/70">{r.free}</div>
              <div className="p-4 md:p-5 border-l border-hairline t-body text-center bg-brand/5 text-ink font-semibold">{r.premium}</div>
            </div>
          ))}
        </motion.div>
        <p className="t-meta mt-4 text-center text-ink/60">Premium is brewing. Free tier stays free.</p>
      </div>
    </section>
  );
}

function CrossLinks({ links }: { links: PillarCrossLink[] }) {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20">
        <p className="t-eyebrow text-brand text-center">Explore the others</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group rounded-3xl border border-hairline bg-paper-raised p-6 md:p-7 shadow-[var(--shadow-lift)] flex items-center justify-between hover:bg-secondary transition-colors"
            >
              <div>
                <p className="t-eyebrow text-brand">{l.eyebrow}</p>
                <p className="t-title text-2xl mt-1">{l.label}</p>
              </div>
              <ArrowRight className="size-6 text-ink/40 group-hover:text-ink group-hover:translate-x-1 transition" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Check };
