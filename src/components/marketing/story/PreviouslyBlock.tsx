import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { useEffect } from "react";
import type { Chapter } from "@/lib/marketing/chapters";
import { recapChapters } from "@/lib/marketing/chapters";
import { renderRichText } from "@/lib/marketing/richText";


interface Props {
  chapter: Chapter;
  open: boolean;
  onClose: () => void;
}

/**
 * "Previously…" recap — overlay sheet opened from chrome, so it
 * never steals vertical space in the fixed-viewport layout.
 */
export function PreviouslyBlock({ chapter, open, onClose }: Props) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (chapter.number === 1) return null;
  const recaps = recapChapters(chapter);
  if (recaps.length === 0) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Previously in the book"
          className="fixed inset-0 z-[55] bg-canvas/95 backdrop-blur-xl"
          initial={reduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? {} : { opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            initial={reduce ? {} : { y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? {} : { y: -12, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl px-5 md:px-8 pt-8 pb-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-eyebrow text-ink/50 tracking-[0.2em]">Previously</p>
                <p className="t-title text-xl md:text-2xl mt-1">In the book so far…</p>
              </div>
              <button
                onClick={onClose}
                className="grid place-items-center size-9 rounded-full border border-ink/25 hover:bg-ink/5 transition"
                aria-label="Close recap"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <ol className="mt-6 space-y-4 border-l border-ink/20 pl-5">
              {recaps.map((r) => (
                <li key={r.slug} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[27px] top-2 size-2 rounded-full bg-ink"
                  />
                  <p className="t-eyebrow tabular-nums text-ink/45 tracking-[0.15em] mb-1">
                    Ch. {String(r.number).padStart(2, "0")} · {r.title}
                  </p>
                  <p className="t-body text-ink/85 leading-snug">{renderRichText(r.recap)}</p>
                  <Link
                    to={r.path}
                    onClick={onClose}
                    className="t-eyebrow text-ink/60 hover:text-ink underline underline-offset-4 mt-1 inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="size-3" aria-hidden="true" /> re-read
                  </Link>
                </li>
              ))}
            </ol>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
