import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { StoryChrome, BookMenu } from "./StoryChrome";
import { PreviouslyBlock } from "./PreviouslyBlock";
import { chapterFor, markChapterRead, nextOf, prevOf } from "@/lib/marketing/chapters";

/**
 * Fixed-viewport storybook shell on both mobile and desktop.
 * The entire chapter fits in one screen — no page scrolling.
 * PreviouslyBlock renders as an overlay drawer opened from chrome.
 */
export function StoryLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const chapter = chapterFor(pathname);
  const [bookOpen, setBookOpen] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);

  useEffect(() => {
    setBookOpen(false);
    setRecapOpen(false);
    if (chapter) markChapterRead(chapter.slug);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, [pathname, chapter]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!chapter) return;
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "[") {
        const p = prevOf(chapter);
        if (p) window.location.assign(p.path);
      } else if (e.key === "]") {
        const n = nextOf(chapter);
        if (n) window.location.assign(n.path);
      } else if (e.key === "?" || e.key.toLowerCase() === "b") {
        setBookOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chapter]);

  return (
    <div className="fixed inset-0 h-[100svh] overflow-hidden bg-canvas text-ink flex flex-col">
      <StoryChrome onOpenBook={() => setBookOpen(true)} onOpenRecap={() => setRecapOpen(true)} />
      <BookMenu open={bookOpen} onClose={() => setBookOpen(false)} />
      {chapter && (
        <PreviouslyBlock chapter={chapter} open={recapOpen} onClose={() => setRecapOpen(false)} />
      )}
      <main className="flex-1 min-h-0 flex flex-col">{children}</main>
    </div>
  );
}
