import { useState } from "react";
import { ChevronDown } from "lucide-react";

const items = [
  {
    q: "Is my data private?",
    a: "Yes. MinDrop stays on your device by default. No accounts to make, no data farmed.",
  },
  {
    q: "Do I need to sign in?",
    a: "No. You can open the app and start dropping right away.",
  },
  {
    q: "Does it work offline?",
    a: "The core capture, nudges and recall work without internet. Places uses your phone's location.",
  },
  {
    q: "What are Notify rules?",
    a: "Little automations that run on their own schedule — medicine at 8, walk at 6. Free plan gets 3 rules.",
  },
  {
    q: "How do Places work?",
    a: "Attach a memory to a spot on the map. When you're nearby, MinDrop gently taps you on the shoulder. Free plan gets 3 places.",
  },
  {
    q: "Will there be an iOS app?",
    a: "Not planned right now. MinDrop is built for Android — Play Store and direct APK.",
  },
  {
    q: "Can I use it for medicine reminders?",
    a: "Yes — that's exactly what the Medication pack is for. It's a helpful nudge, not a medical device.",
  },
  {
    q: "How do I upgrade to Premium?",
    a: "Premium unlocks inside the app. It's coming with the first stable release.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto divide-y divide-hairline rounded-3xl border border-hairline bg-paper-raised overflow-hidden">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 text-left px-5 md:px-7 py-5 hover:bg-secondary/50 transition"
              aria-expanded={isOpen}
            >
              <span className="t-title text-lg md:text-xl">{it.q}</span>
              <ChevronDown
                aria-hidden="true"
                className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="t-body text-ink/75 px-5 md:px-7 pb-5">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
