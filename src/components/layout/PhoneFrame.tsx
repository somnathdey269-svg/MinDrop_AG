import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { AlarmBlockedToast } from "@/components/alarms/AlarmBlockedToast";

const TAGLINES = [
  "Remember less. Live more.",
  "Offload the small stuff.",
  "Your second brain, always on.",
  "Think less. Do more.",
  "Memory that never forgets.",
];

/**
 * Consumer wrapper: full-bleed on mobile, centred phone-shaped frame on tablet/desktop.
 * Refined chrome — ink brand bar with a soft hair-shadow bleed into the canvas.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-[100dvh] md:min-h-screen md:h-auto bg-canvas text-ink md:bg-[radial-gradient(ellipse_at_top,_#f1ede4,_#e8e4db)] overflow-hidden md:overflow-visible">
      <div className="mx-auto h-full w-full max-w-full md:my-6 md:h-[calc(100vh-3rem)] md:max-w-[440px] md:rounded-[2.5rem] md:border md:border-hairline md:shadow-2xl md:shadow-ink/10 md:overflow-hidden bg-canvas relative flex flex-col">
        <header className="shrink-0 relative">
          <BrandMark />
          {/* soft warm-paper bleed under the top bar */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-full h-4"
            style={{ background: "linear-gradient(to bottom, rgba(26,26,26,0.06), transparent)" }}
          />
        </header>
        <main id="main-content" className="flex-1 min-h-0 min-w-0 overflow-y-auto" tabIndex={-1}>
          {children}
        </main>
        <AlarmBlockedToast />
      </div>
    </div>
  );
}

function BrandMark() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <Link
      to="/home"
      aria-label={`MinDrop — ${TAGLINES[index]}`}
      className="sticky top-0 z-30 flex items-center justify-center gap-2 bg-ink text-canvas px-4 py-2.5"
    >
      {/* logo pip with concentric ring */}
      <span className="relative grid place-items-center size-[18px] rounded-full" style={{ background: "var(--brand)" }}>
        <span className="absolute inset-0 rounded-full ring-1 ring-white/15" />
        <span className="size-1.5 rounded-full bg-ink" />
      </span>
      <span className="t-body">MinDrop</span>
      <span className="text-canvas/25 leading-none">·</span>
      <span className="relative h-[1.2em] overflow-hidden min-w-0 flex items-center t-eyebrow">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-canvas/65 whitespace-nowrap"
          >
            {TAGLINES[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </Link>
  );
}
