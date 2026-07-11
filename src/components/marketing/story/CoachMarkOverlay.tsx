import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronLeft, X } from "lucide-react";
import type { BeatWalkthrough } from "@/lib/marketing/walkthroughs";
import {
  TOUR_SRC,
  TOUR_VIEWPORT_H,
  TOUR_VIEWPORT_W,
  type TourFromIframe,
  type TourRect,
} from "@/lib/marketing/tourBridge";

interface Props {
  open: boolean;
  beat: BeatWalkthrough | null;
  chapterEyebrow: string;
  onClose: () => void;
}

/**
 * Full-page coach-mark overlay:
 * - Loads the beat's screen inside a phone-sized iframe (?embed=1&tour=1).
 * - Talks to the iframe over postMessage to get the live rect of the
 *   step's target selector.
 * - Draws a spotlight ring on top of the phone card and floats a
 *   tooltip adjacent to it (auto-flipped to whichever side has room),
 *   with a small pointer/arrow.
 * - If a step has no target (or it can't be found), the tooltip
 *   centers below the phone.
 */
export function CoachMarkOverlay({ open, beat, chapterEyebrow, onClose }: Props) {
  const reduce = !!useReducedMotion();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<TourRect | null>(null);
  const [ready, setReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState({ w: 0, h: 0 });
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  const total = beat?.steps.length ?? 0;
  const current = beat?.steps[Math.min(step, Math.max(0, total - 1))] ?? null;
  const currentTarget = current?.target ?? null;
  const activeScreen = current?.screen ?? beat?.screen ?? "";

  // Reset step when opening a new beat.
  useEffect(() => {
    if (open) setStep(0);
  }, [open, beat?.screen]);

  // Reset ready/rect whenever the iframe URL is about to change.
  useEffect(() => {
    setReady(false);
    setRect(null);
  }, [activeScreen]);




  // Listen for iframe messages.
  useEffect(() => {
    if (!open) return;
    const onMsg = (ev: MessageEvent) => {
      const d = ev.data as TourFromIframe | undefined;
      if (!d || d.source !== TOUR_SRC) return;
      if (d.type === "ready") {
        setReady(true);
      } else if (d.type === "rect") {
        setRect(d.rect);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [open]);

  // Watch selector for current step.
  useEffect(() => {
    if (!open) return;
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    setRect(null);
    const send = () =>
      win.postMessage(
        { source: TOUR_SRC, type: "watch", selector: currentTarget },
        "*",
      );
    if (ready) send();
    // Retry once after 400ms in case the app just hydrated.
    const t = window.setTimeout(send, 400);
    return () => window.clearTimeout(t);
  }, [open, currentTarget, ready]);

  // Measure phone card.
  useEffect(() => {
    if (!open) return;
    const el = cardRef.current;
    if (!el) return;
    const apply = () => {
      const r = el.getBoundingClientRect();
      setCardSize({ w: r.width, h: r.height });
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  // Keep all overlay maths responsive to viewport changes.
  useEffect(() => {
    if (!open) return;
    const apply = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, [open]);

  // Keyboard navigation.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setStep((s) => Math.min(total - 1, s + 1)); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); setStep((s) => Math.max(0, s - 1)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total, onClose]);

  // Convert iframe rect → phone-card coords.
  const highlight = useMemo(() => {
    if (!rect || !cardSize.w || !cardSize.h) return null;
    const scaleX = cardSize.w / (rect.vw || TOUR_VIEWPORT_W);
    const scaleY = cardSize.h / (rect.vh || TOUR_VIEWPORT_H);
    const pad = 6;
    return {
      x: rect.x * scaleX - pad,
      y: rect.y * scaleY - pad,
      w: rect.w * scaleX + pad * 2,
      h: rect.h * scaleY + pad * 2,
    };
  }, [rect, cardSize]);




  if (!beat) return null;

  const iframeSrc = `${activeScreen}${activeScreen.includes("?") ? "&" : "?"}embed=1&tour=1`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="App walkthrough"
          className="fixed inset-0 z-[70]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Dim + blurred backdrop */}
          <div
            className="absolute inset-0 bg-ink/55 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="fixed top-4 right-4 md:top-6 md:right-6 z-[80] grid place-items-center size-11 rounded-full border border-canvas/30 bg-canvas text-ink hover:bg-canvas/95 transition-colors shadow-lg"
            aria-label="Close walkthrough"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          {/* Stack: tooltip on top, phone below — tooltip is always OUTSIDE the phone */}
          <div className="absolute inset-0 flex flex-col items-center justify-start gap-4 px-4 pt-16 pb-6 sm:pt-20 overflow-y-auto">
            {/* Tooltip card — above the phone */}
            <TooltipCard
              key={step}
              reduce={reduce}
              title={current?.title ?? ""}
              body={current?.body ?? ""}
              eyebrow={`${chapterEyebrow} · ${beat.label} · Step ${step + 1} / ${total}`}
              step={step}
              total={total}
              onPrev={() => setStep((s) => Math.max(0, s - 1))}
              onNext={() => setStep((s) => Math.min(total - 1, s + 1))}
            />

            {/* Phone card */}
            <div
              ref={cardRef}
              className="relative pointer-events-auto rounded-[2rem] border border-canvas/25 bg-canvas p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] shrink-0"
              style={{
                width: "min(78vw, 300px, calc((100dvh - 20rem) * 390 / 844))",
                aspectRatio: `${TOUR_VIEWPORT_W} / ${TOUR_VIEWPORT_H}`,
              }}
            >
              <div className="relative w-full h-full rounded-[1.55rem] overflow-hidden bg-canvas">
                <iframe
                  ref={iframeRef}
                  src={iframeSrc}
                  title="App walkthrough"
                  className="absolute left-0 top-0 border-0 origin-top-left pointer-events-none"
                  style={{
                    width: TOUR_VIEWPORT_W,
                    height: TOUR_VIEWPORT_H,
                    transform: `scale(${cardSize.w ? cardSize.w / TOUR_VIEWPORT_W : 1})`,
                  }}
                  scrolling="no"
                  tabIndex={-1}
                />

                {/* Spotlight ring — stays inside phone */}
                <AnimatePresence>
                  {highlight && (
                    <motion.div
                      key={currentTarget ?? "no-target"}
                      className="pointer-events-none absolute rounded-[0.85rem]"
                      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                      style={{
                        left: highlight.x,
                        top: highlight.y,
                        width: highlight.w,
                        height: highlight.h,
                        boxShadow:
                          "0 0 0 3px var(--brand, #4a5d4e), 0 0 0 9999px rgba(26,26,26,0.45)",
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function TooltipCard({
  reduce,
  title,
  body,
  eyebrow,
  step,
  total,
  onPrev,
  onNext,
}: {
  reduce: boolean;
  title: string;
  body: string;
  eyebrow: string;
  step: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      role="group"
      aria-label="Walkthrough step"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="z-[85] w-full max-w-[420px] pointer-events-auto shrink-0"
    >
      <div className="relative rounded-2xl bg-canvas text-ink border border-ink/15 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] px-5 py-4">
        <p
          className="text-ink/55"
          style={{ letterSpacing: "0.2em", fontSize: "0.66rem", fontWeight: 600, textTransform: "uppercase" }}
        >
          {eyebrow}
        </p>
        <h3 className="t-title mt-1.5 text-ink" style={{ fontSize: "1.15rem", lineHeight: 1.2 }}>
          {title}
        </h3>
        <p className="t-body mt-2 text-ink/72 leading-relaxed" style={{ fontSize: "0.92rem" }}>
          {body}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1" aria-hidden="true">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className="block h-[3px] w-4 rounded-full transition-all"
                style={{ background: "var(--ink)", opacity: i === step ? 1 : 0.22 }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={step === 0}
              className="grid place-items-center size-9 rounded-full border border-ink/25 disabled:opacity-30"
              aria-label="Previous step"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={step === total - 1}
              className="t-button rounded-full bg-ink px-4 py-2 text-canvas disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

