import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import type { Chapter } from "@/lib/marketing/chapters";
import { prevOf, nextOf } from "@/lib/marketing/chapters";

interface Props {
  chapter: Chapter;
}

export function ChapterNav({ chapter }: Props) {
  const prev = prevOf(chapter);
  const next = nextOf(chapter);

  return (
    <section className="border-t border-hairline mt-16">
      <div className="mx-auto max-w-5xl px-5 md:px-8 py-8 grid gap-3 md:grid-cols-3">
        {prev ? (
          <Link
            to={prev.path}
            className="group flex items-center gap-3 rounded-2xl border border-hairline p-4 hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="size-5 text-ink/50 group-hover:-translate-x-0.5 transition" aria-hidden="true" />
            <span className="min-w-0">
              <span className="t-eyebrow text-ink/50 block">Ch. {String(prev.number).padStart(2, "0")}</span>
              <span className="t-title text-base block truncate">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          to="/features"
          className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-hairline p-4 hover:bg-secondary transition-colors"
        >
          <BookOpen className="size-4 text-ink/50" aria-hidden="true" />
          <span className="t-body-sm text-ink/70">Appendix — every feature</span>
        </Link>

        {next ? (
          <Link
            to={next.path}
            className="group flex items-center gap-3 rounded-2xl bg-ink text-canvas p-4 hover:opacity-90 transition-opacity md:justify-end"
          >
            <span className="min-w-0 md:text-right">
              <span className="t-eyebrow text-canvas/60 block">Ch. {String(next.number).padStart(2, "0")}</span>
              <span className="t-title text-base block truncate">{next.title}</span>
            </span>
            <ArrowRight className="size-5 text-canvas/70 group-hover:translate-x-0.5 transition" aria-hidden="true" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}
