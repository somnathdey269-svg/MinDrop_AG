import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { StepsCartoon } from "@/components/marketing/StepsCartoon";
import { CtaBand } from "@/components/marketing/CtaBand";

const SITE = "https://getmindrop.lovable.app";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — MinDrop" },
      { name: "description", content: "Four calm steps: drop it, tag it, we nudge you, recall together." },
      { property: "og:title", content: "How MinDrop works" },
      { property: "og:description", content: "Four calm steps: drop, tag, nudge, recall." },
      { property: "og:url", content: SITE + "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: SITE + "/how-it-works" }],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-5 md:px-8 pt-14 md:pt-20 pb-6 text-center">
        <p className="t-eyebrow text-brand">How it works</p>
        <h1 className="t-display mt-3 text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
          Four calm <span className="text-brand">steps.</span>
        </h1>
        <p className="t-body mt-5 max-w-xl mx-auto text-lg text-ink/70">
          No setup screens. No accounts. You're dropping in under a minute.
        </p>
      </section>

      <section data-tour="how-steps" className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14">
        <StepsCartoon />
      </section>

      <CtaBand />
    </MarketingLayout>
  );
}
