import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";

const free = [
  "5 Do-It-Later drops per day",
  "3 Notify rules (one-off nudges)",
  "3 Places on the map",
  "Voice capture, categories & Recall",
  "Recovery vault for anything you delete",
];

const premium = [
  "Unlimited memories",
  "Pick any future date & time",
  "All Memory Packs included",
  "Recovery vault — forever",
  "Photo attachments on every memory",
  "Recurring Notify rules (daily, date, range)",
];

export function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
      <div className="rounded-3xl border border-hairline bg-paper-raised p-7 md:p-9 shadow-[var(--shadow-raised)]">
        <p className="t-eyebrow text-ink/50">Keeper Starter</p>
        <p className="t-display text-4xl mt-2">Free</p>
        <p className="t-body-sm text-ink/70 mt-2">Everything you need for the day-to-day.</p>
        <ul className="mt-6 space-y-3">
          {free.map((p) => (
            <li key={p} className="t-body-sm flex items-start gap-2.5">
              <Check className="size-4 mt-1 text-brand shrink-0" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/download"
          className="t-button mt-7 inline-flex w-full justify-center rounded-full border border-hairline-strong px-5 py-3.5 hover:bg-secondary transition"
        >
          Get the app
        </Link>
      </div>

      <div className="rounded-3xl bg-ink text-canvas p-7 md:p-9 shadow-[var(--shadow-float)] relative overflow-hidden">
        <span className="absolute top-5 right-5 t-eyebrow rounded-full bg-canvas/10 px-2.5 py-1">Coming soon</span>
        <p className="t-eyebrow text-canvas/60">MinDrop Premium</p>
        <p className="t-display text-4xl mt-2">A calmer mind, for the price of a coffee.</p>
        <ul className="mt-6 space-y-3">
          {premium.map((p) => (
            <li key={p} className="t-body-sm flex items-start gap-2.5">
              <Check className="size-4 mt-1 text-canvas shrink-0" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <button
          disabled
          className="t-button mt-7 inline-flex w-full justify-center rounded-full bg-canvas/25 text-canvas/70 px-5 py-3.5 cursor-not-allowed"
        >
          Unlocks with v1
        </button>
      </div>
    </div>
  );
}
