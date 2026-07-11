import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, History, X } from "lucide-react";
import { CHAPTERS, chapterFor, readChaptersFromStorage, type ChapterSlug } from "@/lib/marketing/chapters";
import { subscribeBeatEyebrow, getCurrentBeatEyebrow } from "@/lib/marketing/beatSignal";

interface Props {
  onOpenBook: () => void;
  onOpenRecap?: () => void;
}

/**
 * Minimal top chrome for the fixed-viewport storybook.
 * Chapter tag on the left, recap + book buttons on the right.
 * A thin ink progress bar sits at the very top.
 */
export function StoryChrome({ onOpenBook, onOpenRecap }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const chapter = chapterFor(pathname);
  const [read, setRead] = useState<Set<ChapterSlug>>(new Set());
  useEffect(() => setRead(readChaptersFromStorage()), [pathname]);

  const subChapter = useSyncExternalStore(
    subscribeBeatEyebrow,
    getCurrentBeatEyebrow,
    () => null,
  );

  if (!chapter) return null;

  // Strip any "Chapter X · " / "CH. X · " prefix from the beat eyebrow so
  // the header shows just the sub-chapter name.
  const cleanSub = (subChapter ?? "")
    .replace(/^\s*(ch(apter)?\.?\s*[ivxlcdm\d]+\s*[·•\-–—]\s*)/i, "")
    .replace(/^[^·•\-–—]+[·•\-–—]\s*/, (m) =>
      /noon|morning|evening|night|dawn|afternoon/i.test(m) ? "" : m,
    )
    .trim();

  return (
    <header
      className="relative z-40 shrink-0 bg-canvas/85 backdrop-blur-md h-16 sm:h-[4.5rem] flex items-center"
      style={{ borderBottom: "1px solid rgba(26,26,26,0.15)" }}
    >
      <div className="relative w-full px-4 md:px-8 lg:px-14 xl:px-20 flex items-center justify-between gap-3">
        {/* Left — brand, aligned with the left arrow below */}
        <Link to="/" className="relative z-10 flex items-center gap-2 min-w-0 shrink-0" aria-label="MinDrop — home">
          <AnimatedMWordmark />
        </Link>

        {/* Center — chapter · sub-chapter name */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 flex w-[min(70vw,36rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center min-w-0 text-center">
          <span
            className="block w-full text-ink/75 truncate"
            style={{ letterSpacing: "0.22em", fontSize: "clamp(0.6rem, 2.2vw, 0.75rem)", fontWeight: 600 }}
          >
            <span className="uppercase">{chapter.title}</span>
            {cleanSub ? <span className="text-ink/45"> — <span className="uppercase">{cleanSub}</span></span> : null}
          </span>
        </div>

        {/* Right — actions, aligned with the right arrow below */}
        <div className="relative z-10 flex shrink-0 items-center gap-1.5">
          {onOpenRecap && chapter.number > 1 && (
            <button
              type="button"
              onClick={onOpenRecap}
              className="grid place-items-center size-9 rounded-full border border-ink/30 hover:bg-ink/5 transition-colors"
              aria-label="Show recap"
            >
              <History className="size-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={onOpenBook}
            className="grid place-items-center size-9 rounded-full border border-ink/30 hover:bg-ink/5 transition-colors"
            aria-label="Open the book"
          >
            <BookOpen className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

/**
 * Animated brand mark. The circled "M" stays anchored; the trailing word
 * cycles between "Me" and "MinDrop" to hint that MinDrop = a mind for me.
 * Hidden on very narrow screens to keep the header uncluttered.
 */
function AnimatedMWordmark() {
  const reduce = useReducedMotion();
  const words = ["My", "MinDrop"] as const;
  const [i, setI] = useState(1);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setI((v) => (v + 1) % words.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  const word = words[i];

  return (
    <span className="flex items-center gap-2 min-w-0">
      <span
        aria-hidden="true"
        className="inline-grid place-items-center size-7 rounded-full border border-ink text-ink font-bold text-xs bg-canvas shrink-0"
      >
        M
      </span>
      <span
        aria-hidden="true"
        className="hidden sm:flex items-baseline gap-1.5 text-ink min-w-0"
        style={{ fontWeight: 700, letterSpacing: "-0.01em" }}
      >
        <span className="text-ink/40" style={{ fontSize: "0.85rem", fontWeight: 400 }}>
          for
        </span>
        <span className="relative inline-block h-[1.5em] overflow-hidden shrink-0 min-w-max">
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={word}
              initial={reduce ? false : { y: "70%", opacity: 0 }}
              animate={reduce ? {} : { y: 0, opacity: 1 }}
              exit={reduce ? {} : { y: "-70%", opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block whitespace-nowrap"
              style={{ fontSize: "0.95rem" }}
            >
              {word}
              <span
                className="ml-0.5 align-middle inline-block rounded-full bg-brand"
                style={{ width: 4, height: 4 }}
              />
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </span>
  );
}





interface BookMenuProps {
  open: boolean;
  onClose: () => void;
}

export function BookMenu({ open, onClose }: BookMenuProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [read, setRead] = useState<Set<ChapterSlug>>(new Set());
  useEffect(() => {
    if (open) setRead(readChaptersFromStorage());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Book — chapters"
      className="fixed inset-0 z-[60] bg-canvas/98 backdrop-blur-xl animate-fade-in overflow-y-auto"
    >
      <div className="mx-auto max-w-3xl px-5 md:px-8 pt-6 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <p className="t-eyebrow text-ink/50 tracking-[0.2em]">The Book</p>
            <p className="t-title text-2xl md:text-3xl mt-1">Pick a chapter.</p>
          </div>
          <button
            onClick={onClose}
            className="grid place-items-center size-10 rounded-full border border-ink/25 hover:bg-ink/5 transition"
            aria-label="Close the book"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <ol className="mt-8 space-y-1">
          {CHAPTERS.map((c) => {
            const active = pathname === c.path;
            const done = read.has(c.slug);
            return (
              <li key={c.slug}>
                <Link
                  to={c.path}
                  onClick={onClose}
                  className={`group flex items-baseline gap-4 md:gap-6 rounded-2xl px-4 py-4 md:py-5 border transition-colors ${
                    active ? "bg-ink/5 border-ink/30" : "border-transparent hover:bg-ink/5"
                  }`}
                >
                  <span
                    className="t-eyebrow tabular-nums shrink-0 w-10 text-ink/50 tracking-[0.15em]"
                    aria-hidden="true"
                  >
                    {c.romanNumeral}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="t-title text-lg md:text-xl block">{c.title}</span>
                    <span className="t-body-sm text-ink/65 block mt-0.5">{c.teaser}</span>
                  </span>
                  <span className="t-eyebrow shrink-0 text-ink/45">
                    {active ? "You are here" : done ? "✓ read" : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 pt-6 border-t border-ink/15">
          <p className="t-eyebrow text-ink/50 mb-3 tracking-[0.2em]">Appendix</p>
          <div className="flex flex-wrap gap-2">
            {[
              { to: "/features", label: "Every feature" },
              { to: "/faq", label: "Fair questions" },
              { to: "/privacy", label: "Privacy" },
              { to: "/terms", label: "Terms" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={onClose}
                className="t-body-sm rounded-full border border-ink/25 px-4 py-2 hover:bg-ink/5 transition"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-ink/15 t-meta text-ink/55 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} MinDrop. Made with care.</span>
          <span>Android · APK</span>
        </div>
      </div>
    </div>
  );
}
