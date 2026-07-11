import { useQuery } from "@tanstack/react-query";
import { getPublishedStory, type StoryChapter } from "./story.functions";
import { WALKTHROUGHS_BY_CHAPTER, type BeatWalkthrough } from "./walkthroughs";
import type { ChapterSlug } from "./chapters";

/**
 * useStory — TanStack Query subscription to the published story tree.
 * Falls back to an empty array while loading so callers can layer their own
 * hard-coded fallbacks.
 */
export function useStory() {
  return useQuery({
    queryKey: ["story", "published"],
    queryFn: async () => {
      const res = await getPublishedStory();
      return (res.chapters ?? []) as StoryChapter[];
    },
    staleTime: 60_000,
  });
}

/**
 * Walkthrough for a given chapter slug + beat index, from the DB when
 * available, otherwise falling back to the static walkthroughs.ts file so the
 * site keeps rendering during initial load or on read failure.
 */
export function useWalkthroughForBeat(
  slug: ChapterSlug,
  beatIndex: number,
): BeatWalkthrough | null {
  const { data } = useStory();
  const chapter = data?.find((c) => c.slug === slug);
  const sub = chapter?.subchapters[Math.min(beatIndex, (chapter?.subchapters.length ?? 1) - 1)];
  if (sub && sub.beats.length > 0) {
    const beat = sub.beats[0];
    return {
      screen: beat.default_screen,
      label: beat.label || sub.title,
      steps: beat.steps.map((s) => ({
        title: s.title,
        body: s.body,
        target: s.target ?? undefined,
        screen: s.screen ?? undefined,
      })),
    };
  }
  // Fallback to seed file
  const list = WALKTHROUGHS_BY_CHAPTER[slug];
  if (!list?.length) return null;
  return list[Math.min(beatIndex, list.length - 1)] ?? null;
}
