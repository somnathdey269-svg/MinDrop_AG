import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "@/lib/notify/summary/onboarding";

export function FaqAccordion({ accent }: { accent: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="rounded-2xl border border-ink/10 bg-canvas overflow-hidden">
      {FAQ.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={i > 0 ? "border-t border-ink/10" : ""}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
              aria-expanded={isOpen}
            >
              <span className="t-body-sm text-ink">{f.q}</span>
              <ChevronDown
                className="size-4 shrink-0 transition-transform"
                style={{ color: accent, transform: isOpen ? "rotate(180deg)" : "none" }}
                aria-hidden="true"
              />
            </button>
            {isOpen && <p className="px-4 pb-4 t-body-sm text-ink/70">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
