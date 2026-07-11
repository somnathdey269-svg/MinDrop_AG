import { createFileRoute } from "@tanstack/react-router";
import { StoryLayout } from "@/components/marketing/story/StoryLayout";
import { CMSChapter } from "@/components/marketing/story/CMSChapter";
import { Smartphone, Download as DownloadIcon } from "lucide-react";
import { getPublishedChapterBySlug } from "@/lib/marketing/story.functions";
import { assetUrl } from "@/lib/marketing/assetRegistry";

const SITE = "https://getmindrop.lovable.app";
const SLUG = "take-home" as const;

// When real links exist, wire them here.
const PLAY_STORE_URL: string | null = null;
const APK_URL: string | null = null;

const chapterQuery = () => ({
  queryKey: ["story-chapter", SLUG] as const,
  queryFn: async () => (await getPublishedChapterBySlug({ data: { slug: SLUG } })).chapter,
});

export const Route = createFileRoute("/download")({
  loader: ({ context }) => context.queryClient.ensureQueryData(chapterQuery()),
  head: ({ loaderData }) => {
    const c = loaderData;
    const title = c ? `Ch. 0${c.number} · ${c.title} — MinDrop` : "MinDrop";
    const desc = c?.teaser || "";
    const heroUrl = assetUrl(c?.hero_key);
    const ogImage = heroUrl ? SITE + heroUrl : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: SITE + "/download" },
        ...(ogImage ? [{ property: "og:image", content: ogImage }, { name: "twitter:image", content: ogImage }] : []),
      ],
      links: [{ rel: "canonical", href: SITE + "/download" }],
    };
  },
  component: Chapter8,
});

function Chapter8() {
  return (
    <StoryLayout>
      <CMSChapter slug={SLUG} />

      {/* Actual download strip lives at the end of the chapter, framed by the night sky. */}
      <section className="bg-ink text-canvas">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-16 md:py-20 text-center">
          <p className="t-eyebrow text-canvas/60">The last page</p>
          <h2 className="t-display text-3xl md:text-5xl mt-3">Take the Keeper home.</h2>
          <p className="t-body mt-4 text-canvas/70 max-w-lg mx-auto">
            Two ways in — pick one. Both give you the same app.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={PLAY_STORE_URL ?? undefined}
              aria-disabled={!PLAY_STORE_URL}
              onClick={(e) => { if (!PLAY_STORE_URL) e.preventDefault(); }}
              className={`t-button inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 transition ${
                PLAY_STORE_URL ? "bg-canvas text-ink hover:opacity-90" : "bg-canvas/15 text-canvas/50 cursor-not-allowed"
              }`}
            >
              <Smartphone className="size-5" aria-hidden="true" />
              {PLAY_STORE_URL ? "Get it on Play Store" : "Play Store — soon"}
            </a>
            <a
              href={APK_URL ?? undefined}
              aria-disabled={!APK_URL}
              onClick={(e) => { if (!APK_URL) e.preventDefault(); }}
              className={`t-button inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 transition ${
                APK_URL ? "bg-brand text-canvas hover:opacity-90" : "bg-canvas/15 text-canvas/50 cursor-not-allowed"
              }`}
            >
              <DownloadIcon className="size-5" aria-hidden="true" />
              {APK_URL ? "Download the APK" : "APK — soon"}
            </a>
          </div>
        </div>
      </section>
    </StoryLayout>
  );
}
