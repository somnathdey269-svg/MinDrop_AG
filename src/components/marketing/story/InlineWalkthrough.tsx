import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { BeatWalkthrough } from "@/lib/marketing/walkthroughs";
import {
  TOUR_SRC,
  TOUR_VIEWPORT_H,
  TOUR_VIEWPORT_W,
  type TourFromIframe,
  type TourRect,
} from "@/lib/marketing/tourBridge";

interface Props {
  beat: BeatWalkthrough;
  /** Auto-advance interval in ms. Set 0 to disable. */
  autoMs?: number;
  eyebrow?: string;
  /** `auto` = stacks on mobile, row on md+. `row` = always side-by-side. */
  orientation?: "auto" | "row";
  /** Optional CSS width override for the phone card. */
  phoneWidth?: string;
}

/**
 * Inline (non-modal) walkthrough. Renders a phone-sized iframe running
 * the beat's screen, an animated spotlight ring on the current target,
 * and a compact caption below with prev/next + auto-play controls.
 */
export function InlineWalkthrough({ beat, autoMs = 4200, eyebrow, orientation = "auto", phoneWidth }: Props) {
  const reduce = !!useReducedMotion();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<TourRect | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState({ w: 0, h: 0 });

  const total = beat.steps.length;
  const current = beat.steps[Math.min(step, total - 1)] ?? null;
  const currentTarget = current?.target ?? null;
  const activeScreen = current?.screen ?? beat.screen ?? "";

  // Reset step whenever the beat changes.
  useEffect(() => {
    setStep(0);
    setReady(false);
    setRect(null);
  }, [beat]);

  // iframe URL rebuilds → reset ready
  useEffect(() => {
    setReady(false);
    setRect(null);
  }, [activeScreen]);

  // postMessage listener
  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      const d = ev.data as TourFromIframe | undefined;
      if (!d || d.source !== TOUR_SRC) return;
      if (d.type === "ready") setReady(true);
      else if (d.type === "rect") setRect(d.rect);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Ask iframe to watch selector for current step.
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    setRect(null);
    const send = () =>
      win.postMessage({ source: TOUR_SRC, type: "watch", selector: currentTarget }, "*");
    if (ready) send();
    const t = window.setTimeout(send, 400);
    return () => window.clearTimeout(t);
  }, [currentTarget, ready]);

  // Measure phone card.
  useEffect(() => {
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
  }, []);

  // Auto-advance
  useEffect(() => {
    if (!playing || autoMs <= 0 || reduce) return;
    const id = window.setTimeout(() => {
      setStep((s) => (s + 1) % total);
    }, autoMs);
    return () => window.clearTimeout(id);
  }, [playing, step, autoMs, total, reduce]);

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

  const iframeSrc = `${activeScreen}${activeScreen.includes("?") ? "&" : "?"}embed=1&tour=1`;

  const rootClass =
    orientation === "row"
      ? "flex flex-row items-start gap-3 w-full"
      : "flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 w-full";
  const phoneWidthStyle =
    phoneWidth ?? "min(100%, 300px, calc((100dvh - 12rem) * 390 / 844))";

  return (
    <div className={rootClass}>
      {/* Phone card */}
      <div
        ref={cardRef}
        className="relative shrink-0 rounded-[2rem] border border-ink/20 bg-canvas p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]"
        style={{
          width: phoneWidthStyle,
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
                    "0 0 0 3px var(--brand, #4a5d4e), 0 0 0 9999px rgba(26,26,26,0.42)",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Caption — to the right of the phone on desktop */}
      <div className={orientation === "row" ? "flex-1 min-w-0" : "w-full max-w-[300px] md:max-w-[260px] md:flex-1"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={
              (orientation === "row"
                ? "rounded-xl bg-canvas/85 backdrop-blur-md border border-ink/15 px-3 py-3 shadow-[0_10px_28px_-14px_rgba(0,0,0,0.35)]"
                : "rounded-2xl bg-canvas/85 backdrop-blur-md border border-ink/15 px-4 py-3 shadow-[0_10px_28px_-14px_rgba(0,0,0,0.35)]")
            }
          >
            {eyebrow && (
              <p
                className="text-ink/55"
                style={{
                  letterSpacing: orientation === "row" ? "0.18em" : "0.2em",
                  fontSize: orientation === "row" ? "0.6rem" : "0.6rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {eyebrow} · {beat.label} · {step + 1}/{total}
              </p>
            )}
            <h4
              className="t-title mt-1.5 text-ink"
              style={{ fontSize: orientation === "row" ? "1rem" : "0.98rem", lineHeight: 1.2 }}
            >
              {current?.title}
            </h4>
            <p
              className="t-body mt-1.5 text-ink/80 leading-snug"
              style={{ fontSize: orientation === "row" ? "0.85rem" : "0.82rem" }}
            >
              {current?.body}
            </p>


            <div className={"mt-2 flex items-center justify-between " + (orientation === "row" ? "gap-1" : "gap-2")}>
              <div className="flex items-center gap-1" aria-hidden="true">
                {Array.from({ length: total }).map((_, i) => (
                  <span
                    key={i}
                    className={"block h-[3px] rounded-full transition-all " + (orientation === "row" ? "w-2.5" : "w-4")}
                    style={{ background: "var(--ink)", opacity: i === step ? 1 : 0.22 }}
                  />
                ))}
              </div>
              <div className={"flex items-center " + (orientation === "row" ? "gap-1" : "gap-1.5")}>
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className={"grid place-items-center rounded-full border border-ink/25 text-ink/70 hover:bg-ink/5 " + (orientation === "row" ? "size-6" : "size-8")}
                  aria-label={playing ? "Pause auto-play" : "Play auto-play"}
                >
                  {playing ? <Pause className={orientation === "row" ? "size-3" : "size-3.5"} /> : <Play className={orientation === "row" ? "size-3" : "size-3.5"} />}
                </button>
                <button
                  type="button"
                  onClick={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)); }}
                  disabled={step === 0}
                  className={"grid place-items-center rounded-full border border-ink/25 disabled:opacity-30 " + (orientation === "row" ? "size-6" : "size-8")}
                  aria-label="Previous step"
                >
                  <ChevronLeft className={orientation === "row" ? "size-3" : "size-3.5"} />
                </button>
                <button
                  type="button"
                  onClick={() => { setPlaying(false); setStep((s) => Math.min(total - 1, s + 1)); }}
                  disabled={step === total - 1}
                  className={"grid place-items-center rounded-full border border-ink bg-ink text-canvas disabled:opacity-30 " + (orientation === "row" ? "size-6" : "size-8")}
                  aria-label="Next step"
                >
                  <ChevronRight className={orientation === "row" ? "size-3" : "size-3.5"} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
