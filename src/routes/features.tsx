import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { StoryChrome, BookMenu } from "@/components/marketing/story/StoryChrome";
import drop from "@/assets/marketing/drop.png";
import shelf from "@/assets/marketing/shelf.png";
import clockbirds from "@/assets/marketing/clockbirds.png";
import placewalk from "@/assets/marketing/placewalk.png";
import recall from "@/assets/marketing/recall.png";
import packs from "@/assets/marketing/packs.png";
import keeper from "@/assets/marketing/keeper.png";
import { CHAPTERS } from "@/lib/marketing/chapters";

const SITE = "https://getmindrop.lovable.app";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Appendix · Every Feature — MinDrop" },
      { name: "description", content: "The appendix of the MinDrop book — every capability the app ships today, listed plainly." },
      { property: "og:title", content: "Appendix — every feature in MinDrop" },
      { property: "og:description", content: "Every capability, plainly listed." },
      { property: "og:url", content: SITE + "/features" },
    ],
    links: [{ rel: "canonical", href: SITE + "/features" }],
  }),
  component: Features,
});

const features = [
  { title: "Recall", chip: "Spaced re-surfacing", body: "Old memories float back before they slip.", img: recall },
  { title: "Memory Packs", chip: "Meds · Pets · Promises", body: "Ready-made packs that know the shape of your day.", img: packs },
  { title: "Quiz", chip: "Playful memory practice", body: "Tiny quizzes strengthen the memories that matter most.", img: keeper },
  { title: "Recovery vault", chip: "Nothing is truly lost", body: "Deleted or missed drops rest here, ready to bring back.", img: drop },
  { title: "Voice notes", chip: "Hands-free capture", body: "Hold to record. Transcript drops into the right bucket.", img: keeper },
  { title: "Personality & Themes", chip: "It sounds like you", body: "Tune the tone. Pick a country theme.", img: packs },
];

const pillars = [
  { title: "Do-It-Later", body: "A shelf for the small stuff. 5 free drops a day.", img: shelf, to: "/do-it-later" as const },
  { title: "Notify by rules", body: "Reminders that write themselves. 3 free rules.", img: clockbirds, to: "/notify-feature" as const },
  { title: "Places", body: "Nudges at the door. 3 free places, OS geofences.", img: placewalk, to: "/places-feature" as const },
];

function Features() {
  const reduce = useReducedMotion();
  const [book, setBook] = useState(false);
  return (
    <div className="min-h-[100dvh] bg-canvas text-ink">
      <StoryChrome onOpenBook={() => setBook(true)} />
      <BookMenu open={book} onClose={() => setBook(false)} />

      {/* Back-to-the-story strip */}
      <section className="border-b border-hairline/70 bg-canvas/60">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-3 flex items-center justify-between gap-3">
          <p className="t-body-sm text-ink/70">
            <span className="t-eyebrow text-brand mr-2">Appendix</span>
            You've stepped out of the book — this is the plain-list version.
          </p>
          <Link to="/" className="t-eyebrow inline-flex items-center gap-1 text-ink/60 hover:text-ink underline underline-offset-4">
            <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to Ch. 01
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8 pt-10 md:pt-16 pb-4">
        <p className="t-eyebrow text-brand">Every feature</p>
        <h1 className="t-display mt-3 text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight max-w-3xl">
          The appendix. <span className="text-brand">No story.</span>
        </h1>
        <p className="t-body mt-5 max-w-2xl text-lg text-ink/70">
          Three flagship chapters plus a shelf of smaller bits. Every line is a real thing shipped in the app.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8 py-8 md:py-10">
        <p className="t-eyebrow text-brand">The three flagship chapters</p>
        <div data-tour="features-list" className="mt-4 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to={p.to}
                className="group block h-full rounded-[1.5rem] border border-hairline bg-paper-raised p-5 md:p-6 shadow-[var(--shadow-lift)] hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img src={p.img} alt="" width={1024} height={1024} loading="lazy" className="size-16 md:size-20 shrink-0" draggable={false} />
                  <div className="min-w-0">
                    <h3 className="t-title text-lg md:text-xl">{p.title}</h3>
                    <p className="t-body-sm mt-1 text-ink/70">{p.body}</p>
                  </div>
                  <ArrowRight className="ml-auto size-5 text-ink/40 group-hover:text-ink group-hover:translate-x-1 transition shrink-0" aria-hidden="true" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14">
        <p className="t-eyebrow text-brand">Everything else</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              className="rounded-3xl border border-hairline bg-paper-raised p-6 md:p-7 shadow-[var(--shadow-lift)] flex flex-col"
            >
              <div className="h-40 grid place-items-center bg-secondary rounded-2xl overflow-hidden">
                <img src={f.img} alt="" width={1024} height={1024} loading="lazy" className="max-h-full w-auto object-contain" draggable={false} />
              </div>
              <span className="t-eyebrow mt-5 text-brand">{f.chip}</span>
              <h3 className="t-title text-2xl mt-1.5">{f.title}</h3>
              <p className="t-body mt-2 text-ink/75">{f.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Back to the book */}
      <section className="border-t border-hairline mt-10">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 grid gap-3 sm:grid-cols-2">
          <Link to="/" className="inline-flex items-center gap-2 rounded-2xl border border-hairline p-4 hover:bg-secondary transition">
            <BookOpen className="size-5 text-ink/60" aria-hidden="true" />
            <span>
              <span className="t-eyebrow text-ink/50 block">Start the book</span>
              <span className="t-title text-base">Ch. 01 · {CHAPTERS[0].title}</span>
            </span>
          </Link>
          <Link to="/download" className="inline-flex items-center gap-2 rounded-2xl bg-ink text-canvas p-4 hover:opacity-90 transition">
            <ArrowRight className="size-5 text-canvas/70" aria-hidden="true" />
            <span>
              <span className="t-eyebrow text-canvas/60 block">Skip to the end</span>
              <span className="t-title text-base">Ch. 08 · Take It Home</span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
