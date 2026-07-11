import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { useOnboarding } from "@/lib/memoryos/store";

export const Route = createFileRoute("/splash")({
  head: () => ({
    meta: [
      { title: "Welcome to MinDrop" },
      { name: "description", content: "A quiet second memory for the small things you'd rather not carry." },
      { property: "og:title", content: "Welcome to MinDrop" },
      { property: "og:description", content: "A quiet second memory for the small things you'd rather not carry." },
    ],
  }),
  component: Splash,
});

export const SPLASH_SHOWN_KEY = "mindrop.splash.shown.v1";

type Slide = {
  eyebrow: string;
  title: string;
  body: string;
  benefit?: string;
  accent: string;
  visual: "logo" | "later" | "notify" | "places" | "privacy" | "quote";
};

const slides: Slide[] = [
  {
    eyebrow: "MinDrop",
    title: "A quiet second memory.",
    body: "Built for the chargers, the parking spots, the birthdays, the bills — every small thing your brain shouldn't have to carry.",
    accent: "#4a5d4e",
    visual: "logo",
  },
  {
    eyebrow: "Later",
    title: "Say it now. Do it later.",
    body: "Whisper, type, or snap a thought — MinDrop rings it back at the exact minute you asked. Even after your phone reboots.",
    benefit: "Get back the 20 minutes of sleep you lose to midnight admin.",
    accent: "#7BAE7F",
    visual: "later",
  },
  {
    eyebrow: "Notify",
    title: "Your phone's noise, filtered to what matters.",
    body: "Set plain-English rules — \"UPI debit above ₹5,000 → ring\", \"boss's name on Slack → alarm\". MinDrop watches so you don't have to scroll.",
    benefit: "Stop checking your phone. The ones that matter will find you.",
    accent: "#E29A78",
    visual: "notify",
  },
  {
    eyebrow: "Places",
    title: "Remind me when I get there.",
    body: "\"At the pharmacy → dad's meds.\" \"Leaving office → call mom.\" MinDrop taps you on the shoulder at the exact spot — never before.",
    benefit: "The right thought at the right place. Zero mental load.",
    accent: "#B79BCB",
    visual: "places",
  },
  {
    eyebrow: "Your data",
    title: "Yours. Only yours.",
    body: "Free: everything stays on your device — memories, notifications, places. We only see your login and the country you installed from.\n\nPaid: same, plus optional backup to your own Google Drive — never our servers.",
    benefit: "No ads. No tracking. No exceptions.",
    accent: "#4a5d4e",
    visual: "privacy",
  },
  {
    eyebrow: "One last thing",
    title: "The palest ink is better than the sharpest memory.",
    body: "You've carried enough. Let MinDrop carry the rest.",
    accent: "#c19a6b",
    visual: "quote",
  },
];

function Visual({ kind, accent }: { kind: Slide["visual"]; accent: string }) {
  if (kind === "logo")
    return (
      <div
        className="mx-auto size-32 rounded-full grid place-items-center relative"
        style={{ backgroundColor: accent + "22", border: `1px solid ${accent}44` }}
      >
        <div className="absolute inset-3 rounded-full border" style={{ borderColor: accent + "55" }} />
        <span className="t-display" style={{ color: accent }}>m</span>
      </div>
    );
  if (kind === "later")
    return (
      <div className="mx-auto w-44 h-32 relative grid place-items-center">
        <div className="absolute inset-0 rounded-3xl" style={{ background: accent + "1a", border: `1px solid ${accent}44` }} />
        <div className="relative flex items-center gap-3">
          <div className="size-14 rounded-full grid place-items-center" style={{ background: accent + "33" }}>
            <span style={{ color: accent, fontSize: 24 }}>⏰</span>
          </div>
          <div>
            <p className="t-eyebrow" style={{ color: accent }}>Tomorrow</p>
            <p className="t-body-sm text-ink">08:30 · pay rent</p>
          </div>
        </div>
      </div>
    );
  if (kind === "notify")
    return (
      <div className="mx-auto w-48 h-32 relative">
        <div className="absolute inset-0 rounded-3xl" style={{ background: accent + "1a", border: `1px solid ${accent}44` }} />
        <div className="absolute inset-x-4 top-3 h-6 rounded-lg flex items-center px-2 gap-2" style={{ background: "white", border: `1px solid ${accent}33` }}>
          <div className="size-3 rounded-full" style={{ background: accent + "88" }} />
          <div className="h-1.5 rounded-full flex-1" style={{ background: accent + "44" }} />
        </div>
        <div className="absolute inset-x-6 top-11 h-6 rounded-lg flex items-center px-2 gap-2 opacity-40" style={{ background: "white", border: `1px solid ${accent}22` }}>
          <div className="size-3 rounded-full" style={{ background: accent + "44" }} />
          <div className="h-1.5 rounded-full flex-1" style={{ background: accent + "22" }} />
        </div>
        <div className="absolute inset-x-4 bottom-3 h-8 rounded-xl grid place-items-center" style={{ background: accent, color: "white" }}>
          <span className="t-eyebrow" style={{ color: "white" }}>1 that matters</span>
        </div>
      </div>
    );
  if (kind === "places")
    return (
      <div className="mx-auto w-44 h-32 relative grid place-items-center">
        <div className="absolute inset-0 rounded-3xl" style={{ background: accent + "1a", border: `1px solid ${accent}44` }} />
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="relative">
          <circle cx="40" cy="40" r="30" stroke={accent + "55"} strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="40" cy="40" r="18" stroke={accent + "88"} strokeWidth="1" />
          <circle cx="40" cy="40" r="5" fill={accent} />
        </svg>
      </div>
    );
  if (kind === "privacy")
    return (
      <div className="mx-auto size-32 rounded-full grid place-items-center relative" style={{ background: accent + "22", border: `1px solid ${accent}44` }}>
        <div className="absolute inset-3 rounded-full border" style={{ borderColor: accent + "55" }} />
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
    );
  // quote
  return (
    <div className="mx-auto w-48 h-32 relative grid place-items-center">
      <div className="absolute inset-0 rounded-2xl" style={{ background: accent + "1a", border: `1px solid ${accent}44` }} />
      <span className="relative" style={{ color: accent, fontSize: 52, lineHeight: 1 }}>&ldquo;</span>
    </div>
  );
}

function markSplashShown() {
  try { window.localStorage.setItem(SPLASH_SHOWN_KEY, "1"); } catch {}
}

function Splash() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const { update } = useOnboarding();
  const last = i === slides.length - 1;
  const s = slides[i];

  // Allow explicit "replay" via ?intro=1 — clear the seen flag on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("intro") === "1") {
      try { window.localStorage.removeItem(SPLASH_SHOWN_KEY); } catch {}
    }
  }, []);

  const finish = () => {
    markSplashShown();
    update({ onboarded: true });
    navigate({ to: "/dashboard" });
  };
  const next = () => { if (last) finish(); else setI(i + 1); };
  const back = () => i > 0 && setI(i - 1);
  const skip = () => finish();

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full p-5 sm:p-6 md:p-8 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1.5 flex-1">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all ${idx === i ? "w-10 bg-ink" : "w-3 bg-ink/15"}`}
              />
            ))}
          </div>
          {i > 0 && !last && (
            <button
              onClick={skip}
              className="t-eyebrow text-ink/50 px-2 py-1"
              aria-label="Skip intro"
            >
              Skip
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-sm mx-auto"
            >
              <div className="mb-5 sm:mb-7 scale-90 sm:scale-100"><Visual kind={s.visual} accent={s.accent} /></div>
              <p className="t-eyebrow text-ink/70 mb-2">{s.eyebrow}</p>
              <h1 className="t-display mb-3">{s.title}</h1>
              <p className="t-body-sm md:t-body text-ink/65 whitespace-pre-line">{s.body}</p>
              {s.benefit && (
                <p className="t-eyebrow mt-4" style={{ color: s.accent }}>{s.benefit}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-3 shrink-0 pt-3">
          {i > 0 && (
            <button
              onClick={back}
              className="t-button px-6 bg-white border border-ink/15 rounded-2xl text-ink/70"
            >
              Back
            </button>
          )}
          <button
            onClick={next}
            className="t-button flex-1 bg-ink text-canvas py-4 rounded-2xl hover:bg-ink/90 transition-colors"
          >
            {last ? "Begin" : "Next"}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
