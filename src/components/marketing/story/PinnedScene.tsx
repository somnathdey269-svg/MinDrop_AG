import { AnimatePresence, motion, useMotionValue, useReducedMotion, type MotionValue } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import type { Chapter } from "@/lib/marketing/chapters";
import { nextOf, prevOf } from "@/lib/marketing/chapters";
import { useWalkthroughForBeat } from "@/lib/marketing/useStory";
import { setCurrentBeatEyebrow } from "@/lib/marketing/beatSignal";
import { CoachMarkOverlay } from "./CoachMarkOverlay";
import { InlineWalkthrough } from "./InlineWalkthrough";
import backdropScatter from "@/assets/marketing/backdrop-scatter.jpg";




export interface Beat {
  eyebrow?: string;
  /** Short descriptive label for the navigation pill (e.g. "Why your head feels full"). */
  tabLabel?: string;
  line: ReactNode;
  sub: ReactNode;
  hero?: string;
  heroAlt?: string;
  /** Optional companion backdrop sketch for the right-stage / mobile wash. */
  backdrop?: string;
  /** Admin-controlled opacity 0..1 for the hero image. Defaults to layout defaults. */
  heroOpacity?: number;
  /** Admin-controlled opacity 0..1 for the backdrop sketch. */
  backdropOpacity?: number;
  /** Which image to render on mobile immersive. Default: `backdrop`. */
  mobileImage?: "hero" | "backdrop" | "both";
}


interface Props {
  chapter: Chapter;
  hero: string;
  heroAlt: string;
  /** Legacy prop — accepted but unused in the monochrome layout. */
  props?: { src: string; alt: string; className?: string }[];
  beats: Beat[];
  phone?: (progress: MotionValue<number>) => ReactNode;
  /** In-app route paths shown in the phone preview, in order. */
  screens?: string[];
  /** Desktop layout variant. `immersive` = full-bleed blurred hero + inline walkthrough. */
  variant?: "editorial" | "immersive";
}

const SWIPE_KEY = "mindrop:chapterSwipeFrom";

// Inline SVG noise — tiny data-URI, tiled to fake film grain.
const GRAIN_URI =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")";

/**
 * Cinematic poster scene: full-bleed sketch + title-card headline overlay,
 * minimal chrome, reel-bar footer. Button-driven navigation only.
 */
export function PinnedScene({ chapter, hero, heroAlt, beats, phone, screens = [], variant = "editorial" }: Props) {

  const reduce = !!useReducedMotion();
  const navigate = useNavigate();

  const [beat, setBeat] = useState(0);
  const [beatDir, setBeatDir] = useState<1 | -1>(1);
  const [exitDir, setExitDir] = useState<null | "left" | "right">(null);
  const [enterFrom, setEnterFrom] = useState<null | "left" | "right">(null);
  const [phoneOpen, setPhoneOpen] = useState(false);


  const total = beats.length;
  const prevCh = prevOf(chapter);
  const nextCh = nextOf(chapter);

  useEffect(() => {
    setBeat(0);
    setBeatDir(1);
    setExitDir(null);
    if (typeof window !== "undefined") {
      const from = window.sessionStorage.getItem(SWIPE_KEY) as "left" | "right" | null;
      window.sessionStorage.removeItem(SWIPE_KEY);
      setEnterFrom(from);
    }
  }, [chapter.slug]);

  const goBeat = (dir: 1 | -1) => {
    setBeatDir(dir);
    setBeat((b) => Math.min(total - 1, Math.max(0, b + dir)));
  };

  const jumpToBeat = (target: number) => {
    if (target === beat || target < 0 || target >= total) return;
    setBeatDir(target > beat ? 1 : -1);
    setBeat(target);
  };

  const goChapter = (dir: "prev" | "next") => {
    const target = dir === "next" ? nextCh : prevCh;
    if (!target || exitDir) return;
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SWIPE_KEY, dir === "next" ? "right" : "left");
    }
    setExitDir(dir === "next" ? "left" : "right");
    const delay = reduce ? 0 : 560;
    window.setTimeout(() => navigate({ to: target.path }), delay);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (phoneOpen) return; // overlay owns keys while open
      if (e.key === "ArrowDown") { e.preventDefault(); goBeat(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); goBeat(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goChapter("next"); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goChapter("prev"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.slug, total, exitDir, phoneOpen]);

  const phoneMv = useMotionValue(0);
  useEffect(() => {
    phoneMv.set(total > 1 ? beat / (total - 1) : 0);
  }, [beat, total, phoneMv]);

  // Publish the current beat's sub-chapter name to the header.
  useEffect(() => {
    setCurrentBeatEyebrow(beats[beat]?.eyebrow ?? null);
    return () => setCurrentBeatEyebrow(null);
  }, [beat, beats]);


  const overlayWalkthrough = useWalkthroughForBeat(chapter.slug, beat);

  const openWalkthrough = () => {
    if (!overlayWalkthrough) return;
    setPhoneOpen(true);
  };





  const currentHero = beats[beat]?.hero ?? hero;
  const currentAlt = beats[beat]?.heroAlt ?? heroAlt;
  const currentBackdrop = beats[beat]?.backdrop ?? backdropScatter;
  const heroOpacity = beats[beat]?.heroOpacity;
  const backdropOpacity = beats[beat]?.backdropOpacity;
  const mobileImage = beats[beat]?.mobileImage ?? "backdrop";


  // Cinematic chapter page-turn: outgoing page rotates on Y, drifts sideways,
  // blurs and fades. Incoming enters mirrored. Feels like a physical page
  // pivoting on its leading edge.
  const PERSPECTIVE = 1400;
  const pageInitial =
    reduce || !enterFrom
      ? { opacity: 1, x: "0%", rotateY: 0, scale: 1, filter: "blur(0px)", transformPerspective: PERSPECTIVE }
      : enterFrom === "right"
        ? { opacity: 0, x: "18%", rotateY: -14, scale: 0.94, filter: "blur(10px)", transformPerspective: PERSPECTIVE }
        : { opacity: 0, x: "-18%", rotateY: 14, scale: 0.94, filter: "blur(10px)", transformPerspective: PERSPECTIVE };
  const pageAnimate = { opacity: 1, x: "0%", rotateY: 0, scale: 1, filter: "blur(0px)", transformPerspective: PERSPECTIVE };
  const pageExit = reduce
    ? pageAnimate
    : exitDir === "left"
      ? { opacity: 0, x: "-18%", rotateY: 14, scale: 0.94, filter: "blur(10px)", transformPerspective: PERSPECTIVE }
      : exitDir === "right"
        ? { opacity: 0, x: "18%", rotateY: -14, scale: 0.94, filter: "blur(10px)", transformPerspective: PERSPECTIVE }
        : pageAnimate;
  // Origin = the leading edge that stays anchored while the rest pivots away.
  const pageOrigin = exitDir === "left"
    ? "right center"
    : exitDir === "right"
      ? "left center"
      : enterFrom === "right"
        ? "left center"
        : enterFrom === "left"
          ? "right center"
          : "center";




  return (
    <section className="relative overflow-hidden select-none flex-1 min-h-0 bg-canvas" style={{ perspective: PERSPECTIVE }}>
      <motion.div
        initial={pageInitial}
        animate={exitDir ? pageExit : pageAnimate}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
        style={{ filter: phoneOpen ? "blur(10px)" : "none", transformOrigin: pageOrigin, transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
      >
        {/* ============ MOBILE: full-bleed poster (editorial variant / other chapters) ============ */}
        {variant === "editorial" && (
        <div className="md:hidden absolute inset-0">

          <div className="absolute inset-x-0 top-[5rem] bottom-[20rem] z-0 overflow-hidden sm:top-[4rem] sm:bottom-[18rem]">
            <AnimatePresence initial={false}>
              <motion.img
                key={"m-" + currentHero}
                src={currentHero}
                alt={currentAlt}
                draggable={false}
                loading="eager"
                initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                animate={reduce ? { opacity: heroOpacity ?? 1 } : { opacity: heroOpacity ?? 1, scale: 1.01 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
                transition={{
                  opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 14, ease: "linear" },
                }}

                className="absolute inset-0 h-full w-full object-contain px-5"
                style={{ filter: "blur(0.4px) contrast(1.08) brightness(0.98)", objectPosition: "center bottom" }}
              />
            </AnimatePresence>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.08] mix-blend-multiply"
            style={{ backgroundImage: GRAIN_URI, backgroundSize: "160px 160px" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, transparent 42%, rgba(249,247,242,0.55) 62%, rgba(249,247,242,0.92) 85%, rgba(249,247,242,0.98) 100%)",
            }}
          />

          <div className="absolute inset-x-0 bottom-4 z-20 px-3 flex flex-col items-center gap-3">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={"m-" + beat}
                initial={reduce ? false : { opacity: 0, y: 12 * beatDir, filter: "blur(4px)" }}
                animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? {} : { opacity: 0, y: -12 * beatDir, filter: "blur(4px)" }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-full max-w-[46rem] text-center"
              >
                <div
                  className="py-3 sm:py-4"
                  style={{
                    borderTop: "1px solid rgba(26,26,26,0.45)",
                    borderBottom: "1px solid rgba(26,26,26,0.45)",
                  }}
                >
                  <p
                    className="t-display leading-[0.98] text-ink font-black"
                    style={{
                      fontSize: "clamp(1.6rem, 7.8vw, 3.4rem)",
                      letterSpacing: 0,
                      textShadow:
                        "0 1px 0 rgba(249,247,242,0.85), 0 2px 22px rgba(249,247,242,0.65)",
                    }}
                  >
                    {beats[beat].line}
                  </p>
                </div>
                <motion.p
                  className="t-body mt-3 sm:mt-4 leading-snug text-ink mx-auto max-w-[38ch]"
                  style={{ fontSize: "clamp(0.85rem, 3.4vw, 1.05rem)", textShadow: "0 1px 0 rgba(249,247,242,0.9), 0 2px 14px rgba(249,247,242,0.65)" }}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={reduce ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  {beats[beat].sub}
                </motion.p>
              </motion.div>
            </AnimatePresence>
            <PlatePill
              total={total}
              current={beat}
              beats={beats}
              chapterRoman={chapter.romanNumeral}
              onJump={jumpToBeat}
              align="center"
              size="sm"
              nextChapter={nextCh ? { title: nextCh.title } : null}
              onGoNextChapter={() => goChapter("next")}
            />
          </div>


          {/* Mobile phone card — floating top-right, gentle vibrate every 5s */}
          {phone && (
            <motion.button
              type="button"
              onClick={openWalkthrough}
              className="absolute z-20 top-4 right-4 block cursor-zoom-in p-0 text-left"
              style={{ width: "clamp(50px, 14vw, 66px)", transformOrigin: "top right" }}
              aria-label="Open app walkthrough"
              animate={reduce ? undefined : { x: [0, -1.5, 1.5, -1.5, 1.5, 0], rotate: [-0.5, -2, 1.5, -2, 1.5, -0.5] }}
              transition={reduce ? undefined : { duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 4.4 }}
            >
              <div
                className="rounded-[1rem] border border-ink/25 bg-canvas p-1 shadow-[0_10px_28px_-12px_rgba(26,26,26,0.4)]"
              >
                <div className="relative rounded-[0.8rem] bg-canvas overflow-hidden aspect-[390/844]">
                  {phone(phoneMv)}
                </div>
              </div>
            </motion.button>
          )}
        </div>
        )}

        {/* ============ MOBILE: immersive variant (chapter 1) ============ */}
        {variant === "immersive" && (
          <div className="md:hidden absolute inset-0 overflow-hidden">
            {/* Backdrop sketch — faded, behind everything */}
            {mobileImage !== "hero" && (
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={"m-imm-bd-" + currentBackdrop}
                  src={currentBackdrop}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  loading="eager"
                  initial={reduce ? false : { opacity: 0, y: 24 * beatDir }}
                  animate={reduce ? { opacity: backdropOpacity ?? 0.85 } : { opacity: backdropOpacity ?? 0.85, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -24 * beatDir, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  style={{
                    objectPosition: "center",
                    filter: "saturate(0) brightness(1.32) contrast(1.1)",
                    mixBlendMode: "multiply",
                    WebkitMaskImage:
                      "radial-gradient(85% 75% at 50% 45%, #000 0%, #000 55%, transparent 92%)",
                    maskImage:
                      "radial-gradient(85% 75% at 50% 45%, #000 0%, #000 55%, transparent 92%)",
                  }}
                />
              </AnimatePresence>
            )}
            {mobileImage !== "backdrop" && (
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={"m-imm-hero-" + currentHero}
                  src={currentHero}
                  alt={currentAlt}
                  draggable={false}
                  loading="eager"
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={reduce ? { opacity: heroOpacity ?? 1 } : { opacity: heroOpacity ?? 1, scale: 1.01 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute inset-x-0 top-[5rem] bottom-[20rem] h-auto w-full object-contain px-5"
                  style={{ objectPosition: "center" }}
                />
              </AnimatePresence>
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
              style={{ backgroundImage: GRAIN_URI, backgroundSize: "160px 160px" }}
            />

            {/* Compact title strip at the top */}
            <div className="absolute inset-x-0 top-3 z-20 px-4">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={"m-imm-t-" + beat}
                  initial={reduce ? false : { opacity: 0, y: 12 * beatDir, filter: "blur(4px)" }}
                  animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? {} : { opacity: 0, y: -12 * beatDir, filter: "blur(4px)" }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto w-full max-w-[24rem] text-center"
                >
                  <div
                    className="py-2"
                    style={{
                      borderTop: "1px solid rgba(26,26,26,0.5)",
                      borderBottom: "1px solid rgba(26,26,26,0.5)",
                    }}
                  >
                    <p
                      className="t-display leading-[0.98] text-ink font-black"
                      style={{
                        fontSize: "clamp(1.6rem, 7.2vw, 2.4rem)",
                        letterSpacing: 0,
                        textShadow: "0 1px 0 rgba(249,247,242,0.85)",
                      }}
                    >
                      {beats[beat].line}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Walkthrough — phone (left) + step content (right), like desktop */}
            <div className="absolute inset-x-0 top-[7rem] bottom-[13rem] z-10 flex items-center px-3">
              {overlayWalkthrough ? (
                <InlineWalkthrough
                  key={"m-iw-" + chapter.slug + "-" + beat}
                  beat={overlayWalkthrough}
                  eyebrow={`Ch. ${chapter.romanNumeral}`}
                  orientation="row"
                  phoneWidth="min(46vw, 190px, calc((100dvh - 26rem) * 390 / 844))"
                />


              ) : (
                phone && (
                  <div
                    className="mx-auto shrink-0 rounded-[1rem] border border-ink/25 bg-canvas p-1 shadow-[0_18px_44px_-18px_rgba(26,26,26,0.4)]"
                    style={{ width: "min(60vw, 220px)" }}
                  >
                    <div className="relative rounded-[0.85rem] bg-canvas overflow-hidden aspect-[390/844]">
                      {phone(phoneMv)}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Caption card + nav pills at the bottom */}
            <div className="absolute inset-x-0 bottom-4 z-20 px-3 flex flex-col items-center gap-2.5">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={"m-imm-c-" + beat}
                  initial={reduce ? false : { opacity: 0, y: 12 * beatDir, filter: "blur(4px)" }}
                  animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? {} : { opacity: 0, y: -12 * beatDir, filter: "blur(4px)" }}
                  transition={{ duration: 0.34, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="w-[90vw] max-w-none"
                >
                  <div
                    className="rounded-[0.9rem] border border-ink/20 bg-canvas/90 backdrop-blur-sm px-4 py-3.5"
                    style={{ boxShadow: "0 10px 24px -14px rgba(26,26,26,0.28)" }}
                  >
                    <p
                      className="t-eyebrow text-ink/60"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.3em" }}
                    >
                      {beats[beat]?.eyebrow ?? ""}
                    </p>
                    <p
                      className="t-body-sm text-ink mt-1.5 leading-snug"
                      style={{ fontSize: "0.98rem", textShadow: "0 1px 0 rgba(249,247,242,0.9), 0 2px 10px rgba(249,247,242,0.6)" }}
                    >
                      {beats[beat].sub}
                    </p>
                  </div>

                </motion.div>
              </AnimatePresence>
              <PlatePill
                total={total}
                current={beat}
                beats={beats}
                chapterRoman={chapter.romanNumeral}
                onJump={jumpToBeat}
                align="center"
                size="sm"
                nextChapter={nextCh ? { title: nextCh.title } : null}
                onGoNextChapter={() => goChapter("next")}
              />
            </div>




          </div>
        )}

        {/* ============ DESKTOP: immersive full-bleed variant ============ */}

        {variant === "immersive" && (
          <div className="hidden md:block absolute inset-0">
            {/* Full-bleed blurred hero background */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Sketch panel — anchored to the left, fully contained,
                  fades out before the phone column so nothing overlaps it. */}
              <div
                className="absolute inset-y-0 left-0 w-[62%] lg:w-[58%]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(90deg, #000 0%, #000 78%, transparent 100%)",
                  maskImage:
                    "linear-gradient(90deg, #000 0%, #000 78%, transparent 100%)",
                }}
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={"imm-" + currentHero}
                    src={currentHero}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    loading="eager"
                    initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                    animate={reduce ? { opacity: heroOpacity ?? 0.9 } : { opacity: heroOpacity ?? 0.9, scale: 1.04 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.01, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                    transition={{ opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }, scale: { duration: 20, ease: "linear" } }}
                    className="absolute inset-0 h-full w-full object-contain"
                    style={{ objectPosition: "left center", filter: "contrast(1.05)" }}
                  />
                </AnimatePresence>
              </div>
              {/* ---- Right stage: the sketch continues ---- */}
              {/* Warm paper wash so the sketch echo has something to sit on */}
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-[50%]"
                style={{
                  background:
                    "linear-gradient(180deg, #f9f7f2 0%, #f9f7f2 100%)",

                  WebkitMaskImage:
                    "linear-gradient(90deg, transparent 0%, #000 18%, #000 100%)",
                  maskImage:
                    "linear-gradient(90deg, transparent 0%, #000 18%, #000 100%)",
                }}
              />
              {/* Per-beat companion sketch — swaps with an ink-crossfade when the beat changes. */}
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={"imm-bd-" + currentBackdrop}
                  src={currentBackdrop}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  loading="eager"
                  initial={reduce ? false : { opacity: 0, y: 22 * beatDir, filter: "saturate(0) brightness(1.32) contrast(1.1) blur(6px)" }}
                  animate={reduce ? { opacity: backdropOpacity ?? 0.92 } : { opacity: backdropOpacity ?? 0.92, y: 0, filter: "saturate(0) brightness(1.32) contrast(1.1) blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -22 * beatDir, filter: "saturate(0) brightness(1.32) contrast(1.1) blur(6px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute inset-y-0 right-0 w-[54%] h-full object-cover"
                  style={{
                    objectPosition: "center",
                    mixBlendMode: "multiply",
                    WebkitMaskImage:
                      "radial-gradient(75% 75% at 60% 50%, #000 0%, #000 55%, transparent 92%)",
                    maskImage:
                      "radial-gradient(75% 75% at 60% 50%, #000 0%, #000 55%, transparent 92%)",
                  }}
                />
              </AnimatePresence>






              {/* Light warm veil only under the headline column for readability */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(249,247,242,0.6) 0%, rgba(249,247,242,0.28) 32%, rgba(249,247,242,0) 55%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
                style={{ backgroundImage: GRAIN_URI, backgroundSize: "160px 160px" }}
              />

            </div>




            {/* Foreground content */}
            <div className="relative z-10 grid h-full grid-cols-[1fr_1.25fr] gap-8 lg:gap-12 px-8 lg:px-14 xl:px-20 pt-10 pb-10 items-center">
              {/* Left — title card + a small crisp inset of the hero sketch */}
              <div className="relative flex flex-col justify-center gap-8 max-w-[38rem]">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={"imm-t-" + beat}
                    initial={reduce ? false : { opacity: 0, y: 14 * beatDir, filter: "blur(4px)" }}
                    animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? {} : { opacity: 0, y: -14 * beatDir, filter: "blur(4px)" }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div
                      className="py-6 lg:py-8"
                      style={{
                        borderTop: "1px solid rgba(26,26,26,0.55)",
                        borderBottom: "1px solid rgba(26,26,26,0.55)",
                      }}
                    >
                      <p
                        className="t-display leading-[0.92] text-ink font-black"
                        style={{
                          fontSize: "clamp(2.8rem, 5.6vw, 4.75rem)",
                          letterSpacing: 0,
                          textShadow: "0 1px 0 rgba(249,247,242,0.9), 0 2px 24px rgba(249,247,242,0.7)",
                        }}
                      >
                        {beats[beat].line}
                      </p>
                    </div>
                    <motion.p
                      className="t-body mt-6 leading-relaxed text-ink max-w-[42ch]"
                      style={{ fontSize: "clamp(1rem, 1.25vw, 1.15rem)", textShadow: "0 1px 0 rgba(249,247,242,0.9), 0 2px 14px rgba(249,247,242,0.65)" }}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={reduce ? {} : { opacity: 1, y: 0 }}
                      transition={{ duration: 0.34, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {beats[beat].sub}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>

                <PlatePill
                  total={total}
                  current={beat}
                  beats={beats}
                  chapterRoman={chapter.romanNumeral}
                  onJump={jumpToBeat}
                  align="left"
                />
              </div>

              {/* Right — inline walkthrough (nudged right to reduce dead space on wide screens) */}
              <div className="relative flex items-center justify-end h-full pr-2 lg:pr-6 xl:pr-10">

                {overlayWalkthrough ? (
                  <InlineWalkthrough
                    key={"iw-" + chapter.slug + "-" + beat}
                    beat={overlayWalkthrough}
                    eyebrow={`Ch. ${chapter.romanNumeral}`}
                  />
                ) : (
                  phone && (
                    <div className="w-[300px]">
                      <div className="rounded-[1.2rem] border border-ink/25 bg-canvas p-1.5 shadow-[0_18px_44px_-18px_rgba(26,26,26,0.4)]">
                        <div className="relative rounded-[0.95rem] bg-canvas overflow-hidden aspect-[390/844]">
                          {phone(phoneMv)}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============ DESKTOP: editorial two-column ============ */}
        {variant === "editorial" && (
        <div className="hidden md:grid absolute inset-0 grid-cols-[1.05fr_1fr] gap-8 lg:gap-14 px-8 lg:px-16 xl:px-24 pt-8 pb-10 items-center">
          {/* Left — framed sketch panel */}
          <div className="relative h-full max-h-[78vh] w-full self-center">
            <div
              className="relative h-full w-full overflow-hidden rounded-[1.25rem]"
              style={{
                border: "1px solid rgba(26,26,26,0.18)",
                boxShadow:
                  "0 30px 60px -30px rgba(26,26,26,0.35), 0 4px 14px -6px rgba(26,26,26,0.12)",
                background: "var(--canvas)",
              }}
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={"d-" + currentHero}
                  src={currentHero}
                  alt={currentAlt}
                  draggable={false}
                  loading="eager"
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={reduce ? { opacity: heroOpacity ?? 1 } : { opacity: heroOpacity ?? 1, scale: 1.05 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
                  transition={{
                    opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 14, ease: "linear" },
                  }}

                  className="absolute inset-0 h-full w-full object-contain p-2 md:p-3"
                  style={{ filter: "contrast(1.05)" }}

                />
              </AnimatePresence>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
                style={{ backgroundImage: GRAIN_URI, backgroundSize: "160px 160px" }}
              />

              <span aria-hidden className="absolute top-3 left-3 size-3 border-t border-l border-ink/40" />
              <span aria-hidden className="absolute top-3 right-3 size-3 border-t border-r border-ink/40" />
              <span aria-hidden className="absolute bottom-3 left-3 size-3 border-b border-l border-ink/40" />
              <span aria-hidden className="absolute bottom-3 right-3 size-3 border-b border-r border-ink/40" />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <PlatePill
                  total={total}
                  current={beat}
                  beats={beats}
                  chapterRoman={chapter.romanNumeral}
                  onJump={jumpToBeat}
                  align="center"
                />
              </div>
            </div>
          </div>

          {/* Right — title card column */}
          <div className="relative flex flex-col justify-center gap-6 lg:gap-8 max-w-[34rem]">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={"d-" + beat}
                initial={reduce ? false : { opacity: 0, y: 14 * beatDir, filter: "blur(4px)" }}
                animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? {} : { opacity: 0, y: -14 * beatDir, filter: "blur(4px)" }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >

                <div
                  className="py-5 lg:py-7"
                  style={{
                    borderTop: "1px solid rgba(26,26,26,0.45)",
                    borderBottom: "1px solid rgba(26,26,26,0.45)",
                  }}
                >
                  <p
                    className="t-display leading-[0.95] text-ink font-black"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 4.25rem)", letterSpacing: 0 }}
                  >
                    {beats[beat].line}
                  </p>
                </div>

                <motion.p
                  className="t-body mt-5 lg:mt-6 leading-relaxed text-ink max-w-[40ch]"
                  style={{ fontSize: "clamp(1rem, 1.25vw, 1.15rem)", textShadow: "0 1px 0 rgba(249,247,242,0.9), 0 2px 14px rgba(249,247,242,0.65)" }}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={reduce ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  {beats[beat].sub}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {phone && (
              <div className="pt-2">
                <motion.button
                  type="button"
                  onClick={openWalkthrough}
                  className="block w-20 lg:w-24 cursor-zoom-in p-0 text-left"
                  aria-label="Open app walkthrough"
                  style={{ transformOrigin: "top left" }}
                  animate={reduce ? undefined : { x: [0, -2, 2, -2, 2, 0], rotate: [-1, -3, 0.5, -3, 0.5, -1] }}
                  transition={reduce ? undefined : { duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 4.4 }}
                >
                  <div
                    className="rounded-[1.2rem] border border-ink/25 bg-canvas p-1.5 shadow-[0_12px_36px_-14px_rgba(26,26,26,0.4),0_2px_8px_rgba(26,26,26,0.08)]"
                  >
                    <div className="relative rounded-[0.95rem] bg-canvas overflow-hidden aspect-[390/844]">
                      {phone(phoneMv)}
                    </div>
                  </div>
                </motion.button>
              </div>
            )}
          </div>
        </div>
        )}
      </motion.div>

      <CoachMarkOverlay
        open={phoneOpen}
        beat={overlayWalkthrough}
        chapterEyebrow={`Ch. ${chapter.romanNumeral}`}
        onClose={() => setPhoneOpen(false)}
      />


      {/* Chapter edge strips — subtle canvas gutters with vertical nav */}
      <EdgeStrip
        side="left"
        chapter={prevCh ?? null}
        onClick={() => goChapter("prev")}
        reduce={reduce}
      />
      <EdgeStrip
        side="right"
        chapter={nextCh ?? null}
        onClick={() => goChapter("next")}
        reduce={reduce}
        highlighted={beat === total - 1}
      />
    </section>
  );
}

function EdgeStrip({
  side,
  chapter,
  onClick,
  reduce,
  highlighted = false,
}: {
  side: "left" | "right";
  chapter: { title: string; path: string } | null;
  onClick: () => void;
  reduce: boolean;
  highlighted?: boolean;
}) {
  if (!chapter) return null;
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  const bg = highlighted ? "var(--ink)" : "var(--canvas)";
  const fg = highlighted ? "var(--canvas)" : "var(--ink)";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`${side === "left" ? "Previous" : "Next"} chapter: ${chapter.title}`}
      className={`group absolute top-0 bottom-0 z-30 hidden md:flex flex-col items-center justify-center gap-1 transition-colors duration-300 ${
        side === "left" ? "left-0" : "right-0"
      }`}
      style={{
        width: "2.5vw",
        minWidth: 36,
        maxWidth: 56,
        background: bg,
        color: highlighted ? "var(--canvas)" : "var(--ink)",
      }}
      initial={false}
      whileHover={reduce ? undefined : { x: side === "left" ? -3 : 3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {/* Chapter title */}
      <span
        className="whitespace-nowrap"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          fontSize: "clamp(0.95rem, 1.05vw, 1.15rem)",
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: fg,
        }}
      >
        {chapter.title}
      </span>

      {/* Arrow */}
      <motion.span
        className="inline-flex items-center justify-center"
        aria-hidden="true"
        animate={reduce ? undefined : { x: side === "left" ? [0, -3, 0] : [0, 3, 0] }}
        transition={reduce ? undefined : { duration: 1.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
      >
        <Icon className="size-6 lg:size-7" strokeWidth={2.2} style={{ color: fg }} />
      </motion.span>
    </motion.button>
  );
}

function PlatePill({
  total,
  current,
  beats,
  onJump,
  align = "left",
  size = "md",
  nextChapter = null,
  onGoNextChapter,
}: {
  total: number;
  current: number;
  beats: Beat[];
  chapterRoman: string;
  onJump: (i: number) => void;
  align?: "left" | "center";
  size?: "sm" | "md";
  nextChapter?: { title: string } | null;
  onGoNextChapter?: () => void;
}) {
  const labelFor = (i: number) => {
    const tab = beats[i]?.tabLabel;
    if (tab && tab.length > 0) return tab;
    const raw = beats[i]?.eyebrow ?? "";
    const tail = raw.split("·").pop()?.trim();
    return tail && tail.length > 0 ? tail : `Plate ${i + 1}`;
  };

  const prev = current > 0 ? current - 1 : null;
  const next = current < total - 1 ? current + 1 : null;
  const showNextChapter = next === null && !!nextChapter && !!onGoNextChapter;

  const tabs: { i: number; kind: "prev" | "next" }[] = [];
  if (prev !== null) tabs.push({ i: prev, kind: "prev" });
  if (next !== null) tabs.push({ i: next, kind: "next" });

  if (tabs.length === 0 && !showNextChapter) return null;

  const sm = size === "sm";
  const pillPad = sm ? "pl-1.5 pr-2.5 py-1" : "pl-2 pr-3 py-1.5";
  const chipSize = sm ? 18 : 22;
  const iconCls = sm ? "size-3" : "size-3.5";
  const labelFs = sm ? "0.7rem" : "0.78rem";

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-canvas/90 backdrop-blur-sm ${
        align === "left" ? "self-start" : ""
      }`}
      style={{ border: "1px solid rgba(26,26,26,0.2)", boxShadow: "0 4px 14px -8px rgba(26,26,26,0.25)" }}
      role="tablist"
      aria-label="Jump to a sub-chapter"
    >
      {tabs.map(({ i, kind }) => {
        const scheme =
          kind === "prev"
            ? { bg: "var(--canvas)", fg: "var(--ink)", border: "rgba(26,26,26,0.35)", chip: "rgba(26,26,26,0.08)" }
            : { bg: "var(--ink)", fg: "var(--canvas)", border: "var(--ink)", chip: "rgba(249,247,242,0.18)" };
        const Icon = kind === "prev" ? ChevronUp : ChevronDown;
        return (
          <motion.button
            key={kind}
            type="button"
            role="tab"
            aria-label={`${kind === "prev" ? "Previous" : "Next"} sub-chapter: ${labelFor(i)}`}
            onClick={() => onJump(i)}
            initial={false}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`group inline-flex items-center gap-1.5 rounded-full border ${pillPad}`}
            style={{
              background: scheme.bg,
              color: scheme.fg,
              borderColor: scheme.border,
            }}
          >
            <span
              className="grid place-items-center rounded-full shrink-0"
              style={{ width: chipSize, height: chipSize, background: scheme.chip }}
              aria-hidden="true"
            >
              <Icon className={iconCls} strokeWidth={2.4} />
            </span>
            <span
              className="whitespace-nowrap leading-none truncate max-w-[9rem]"
              style={{ fontSize: labelFs, fontWeight: 600, letterSpacing: "-0.005em" }}
            >
              {labelFor(i)}
            </span>
          </motion.button>
        );
      })}

      {showNextChapter && (
        <motion.button
          key="next-chapter"
          type="button"
          aria-label={`Next chapter: ${nextChapter!.title}`}
          onClick={onGoNextChapter}
          initial={false}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`group inline-flex items-center gap-1.5 rounded-full border ${pillPad}`}
          style={{
            background: "var(--brand, #4a5d4e)",
            color: "var(--canvas)",
            borderColor: "var(--brand, #4a5d4e)",
          }}
        >
          <span
            className="grid place-items-center rounded-full shrink-0"
            style={{ width: chipSize, height: chipSize, background: "rgba(249,247,242,0.2)" }}
            aria-hidden="true"
          >
            <ChevronRight className={iconCls} strokeWidth={2.4} />
          </span>
          <span
            className="whitespace-nowrap leading-none truncate max-w-[10rem]"
            style={{ fontSize: labelFs, fontWeight: 600, letterSpacing: "-0.005em" }}
          >
            {nextChapter!.title}
          </span>
        </motion.button>
      )}
    </div>
  );
}


