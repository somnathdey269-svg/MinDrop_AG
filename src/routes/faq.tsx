import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useState } from "react";
import { StoryChrome, BookMenu } from "@/components/marketing/story/StoryChrome";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CHAPTERS } from "@/lib/marketing/chapters";

const SITE = "https://getmindrop.lovable.app";

const faqData = [
  { q: "Is my data private?", a: "Yes. MinDrop stays on your device by default. No accounts, no data farmed." },
  { q: "Do I need to sign in?", a: "No. Open the app and start dropping." },
  { q: "Does it work offline?", a: "Capture, nudges and recall work without internet. Places uses your phone's location." },
  { q: "What are Notify rules?", a: "Little rules that watch the pings you already get. Free plan gets 3 rules; recurring rules (daily, date, range) are Premium." },
  { q: "How do Places work?", a: "Attach a memory to a spot on the map. Free plan gets 3 places. On Android it uses OS-level geofences." },
  { q: "Will there be an iOS app?", a: "Not planned. MinDrop is Android — Play Store and direct APK." },
  { q: "Can I use it for medicine reminders?", a: "Yes — that's the Medication pack. Helpful nudge, not a medical device." },
  { q: "How do I upgrade to Premium?", a: "Premium unlocks inside the app. Coming with the first stable release." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Appendix · Fair Questions — MinDrop" },
      { name: "description", content: "Honest answers to the common questions about MinDrop — privacy, pricing, platforms and how it works." },
      { property: "og:title", content: "Appendix — fair questions about MinDrop" },
      { property: "og:description", content: "The common questions, answered honestly." },
      { property: "og:url", content: SITE + "/faq" },
    ],
    links: [{ rel: "canonical", href: SITE + "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqData.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  const [book, setBook] = useState(false);
  return (
    <div className="min-h-[100dvh] bg-canvas text-ink">
      <StoryChrome onOpenBook={() => setBook(true)} />
      <BookMenu open={book} onClose={() => setBook(false)} />

      <section className="border-b border-hairline/70 bg-canvas/60">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-3 flex items-center justify-between gap-3">
          <p className="t-body-sm text-ink/70">
            <span className="t-eyebrow text-brand mr-2">Appendix</span>
            Stepped out of the book for a quick Q&amp;A.
          </p>
          <Link to="/" className="t-eyebrow inline-flex items-center gap-1 text-ink/60 hover:text-ink underline underline-offset-4">
            <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to Ch. 01
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 md:px-8 pt-10 md:pt-16 pb-6 text-center">
        <p className="t-eyebrow text-brand">Fair questions</p>
        <h1 className="t-display mt-3 text-4xl md:text-6xl leading-[1.02] tracking-tight">
          Ask, and be <span className="text-brand">answered.</span>
        </h1>
      </section>
      <section className="mx-auto max-w-4xl px-5 md:px-8 py-6 md:py-12">
        <FaqAccordion />
      </section>

      <section data-tour="faq-list" className="border-t border-hairline mt-8">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 grid gap-3 sm:grid-cols-2">
          <Link to="/" className="inline-flex items-center gap-2 rounded-2xl border border-hairline p-4 hover:bg-secondary transition">
            <BookOpen className="size-5 text-ink/60" aria-hidden="true" />
            <span>
              <span className="t-eyebrow text-ink/50 block">Start the book</span>
              <span className="t-title text-base">Ch. 01 · {CHAPTERS[0].title}</span>
            </span>
          </Link>
          <Link to="/download" className="inline-flex items-center gap-2 rounded-2xl bg-ink text-canvas p-4 hover:opacity-90 transition">
            <span className="t-eyebrow text-canvas/60 block">Skip to the end</span>
            <span className="t-title text-base">Ch. 08 · Take It Home</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
