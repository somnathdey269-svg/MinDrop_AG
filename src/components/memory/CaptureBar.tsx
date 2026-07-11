import { useState } from "react";
import { motion } from "framer-motion";
import { CaptureWizard, type CaptureSubmit } from "./CaptureWizard";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

interface Props {
  plan?: "free" | "premium" | null;
  onCapture?: (data: CaptureSubmit) => void;
  onUpgrade?: () => void;
}

/**
 * Primary action pill — floats above the bottom tabs on every "Do it Later"
 * surface. Ink-on-canvas with a warm-paper shadow and a spring-scaled press.
 */
export function CaptureBar({ plan, onCapture, onUpgrade }: Props) {
  const [open, setOpen] = useState(false);
  const { accent1 } = useCountryTheme();

  return (
    <>
      <CaptureWizard
        open={open}
        onClose={() => setOpen(false)}
        plan={plan}
        onUpgrade={onUpgrade}
        onSubmit={(d) => onCapture?.(d)}
      />

      <motion.button
        onClick={() => setOpen(true)}
        data-testid="capture-trigger"
        data-tour="capture-btn"

        whileTap={{ scale: 0.94 }}
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        aria-label="Capture a thought"
        className="t-button fixed bottom-24 left-1/2 -translate-x-1/2 z-30 group inline-flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full bg-ink text-canvas"
        style={{
          boxShadow: "0 10px 30px -8px rgba(26,26,26,0.4), 0 2px 6px rgba(26,26,26,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* live pulse dot */}
        <span className="relative grid place-items-center size-4">
          <span
            className="absolute inset-0 rounded-full opacity-60 animate-ping"
            style={{ background: accent1, animationDuration: "2.5s" }}
          />
          <span
            className="relative size-2 rounded-full"
            style={{ background: accent1 }}
          />
        </span>
        Capture a thought
      </motion.button>
    </>
  );
}
