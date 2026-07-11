import { useMemo } from "react";
import { useStory } from "@/lib/marketing/useStory";
import { PinnedScene, type Beat } from "./PinnedScene";
import { PhoneLive } from "./PhoneStages";
import { assetUrl } from "@/lib/marketing/assetRegistry";
import { chapterFor, CHAPTERS, type ChapterSlug, type Chapter } from "@/lib/marketing/chapters";
import { renderRichText } from "@/lib/marketing/richText";

/**
 * CMS-backed chapter scene. Everything (headline, caption, hero, backdrop,
 * phone screens, variant) is pulled from the story CMS. While loading —
 * or if the chapter is not yet published — renders a quiet skeleton so
 * the layout still fills the viewport.
 */
export function CMSChapter({ slug }: { slug: ChapterSlug }) {
  const { data, isLoading } = useStory();

  const chapter = useMemo<Chapter | undefined>(() => {
    // Chrome + prev/next still use the static chapters table; also drives
    // sky colors when the DB row hasn't been loaded yet.
    return CHAPTERS.find((c) => c.slug === slug) ?? chapterFor("/" + slug);
  }, [slug]);

  const dbChapter = data?.find((c) => c.slug === slug);

  const heroUrl =
    assetUrl(dbChapter?.hero_key) ??
    assetUrl(chapter?.slug === "overwhelm" ? "ch1-hero-chaos" : undefined) ??
    "";

  const variant = (dbChapter?.variant as "immersive" | "editorial") ?? "immersive";
  const screens =
    (dbChapter?.phone_screens && dbChapter.phone_screens.length > 0
      ? dbChapter.phone_screens
      : ["/splash"]) as string[];

  const beats: Beat[] = useMemo(() => {
    if (!dbChapter) return [];
    return dbChapter.subchapters.map((sc) => ({
      eyebrow: sc.eyebrow || sc.tab_label,
      tabLabel: sc.tab_label || sc.title,
      line: renderHeadline(sc.headline || sc.title || ""),
      sub: renderRichText(sc.caption),
      hero: assetUrl(sc.hero_key) ?? heroUrl,
      heroAlt: sc.hero_alt || sc.title,
      backdrop: assetUrl(sc.backdrop_key) ?? assetUrl(dbChapter.backdrop_key) ?? undefined,
      heroOpacity: typeof sc.hero_opacity === "number" ? sc.hero_opacity : undefined,
      backdropOpacity: typeof sc.backdrop_opacity === "number" ? sc.backdrop_opacity : undefined,
      mobileImage: (sc.mobile_image as "hero" | "backdrop" | "both") ?? "backdrop",
    }));
  }, [dbChapter, heroUrl]);

  if (!chapter) {
    return <ChapterSkeleton />;
  }

  if (isLoading || !dbChapter || beats.length === 0) {
    return <ChapterSkeleton chapter={chapter} />;
  }

  return (
    <PinnedScene
      variant={variant}
      chapter={chapter}
      hero={heroUrl}
      heroAlt={dbChapter.hero_alt || chapter.title}
      screens={screens}
      phone={(p) => <PhoneLive progress={p} screens={screens} />}
      beats={beats}
    />
  );
}

/** Split headline into visual lines. Admin can use "\n" or the app splits on
 *  sentence boundaries when nothing else is supplied. Each line is passed
 *  through the rich-text renderer so bold/italic/underline/colour markers work. */
function renderHeadline(text: string) {
  const parts = text.split(/\n|(?<=[.?!])\s+/).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {renderRichText(p)}
          {i < parts.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}


function ChapterSkeleton({ chapter }: { chapter?: Chapter }) {
  return (
    <section
      className="flex-1 min-h-0 flex items-center justify-center"
      style={
        chapter
          ? {
              background: `linear-gradient(180deg, ${chapter.skyTop} 0%, ${chapter.skyBottom} 100%)`,
              color: chapter.ink,
            }
          : undefined
      }
    >
      <div className="text-center opacity-60">
        <p className="t-eyebrow">Loading…</p>
        {chapter && <p className="t-title mt-2">{chapter.title}</p>}
      </div>
    </section>
  );
}
