import { createFileRoute, redirect } from "@tanstack/react-router";
import { StoryLayout } from "@/components/marketing/story/StoryLayout";
import { CMSChapter } from "@/components/marketing/story/CMSChapter";
import { getPublishedChapterBySlug } from "@/lib/marketing/story.functions";
import { assetUrl } from "@/lib/marketing/assetRegistry";
import { isNativeApp } from "@/lib/platform";

const SITE = "https://getmindrop.lovable.app";
const SLUG = "overwhelm" as const;

const chapterQuery = () => ({
  queryKey: ["story-chapter", SLUG] as const,
  queryFn: async () => (await getPublishedChapterBySlug({ data: { slug: SLUG } })).chapter,
});

const SPLASH_SHOWN_KEY = "mindrop.splash.shown.v1";

export const Route = createFileRoute("/")({
  // Native (installed) app should never see the marketing site.
  // First launch → splash. After that → dashboard (center tab).
  beforeLoad: () => {
    if (!isNativeApp()) return;
    let seen = false;
    try { seen = typeof window !== "undefined" && window.localStorage.getItem(SPLASH_SHOWN_KEY) === "1"; } catch {}
    throw redirect({ to: seen ? "/dashboard" : "/splash" });
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(chapterQuery()),
  head: ({ loaderData }) => {
    const c = loaderData;
    const title = c ? `Ch. 0${c.number} · ${c.title} — MinDrop` : "MinDrop — a calmer head";
    const desc = c?.teaser || "A short book about a calmer head.";
    const heroUrl = assetUrl(c?.hero_key);
    const ogImage = heroUrl ? SITE + heroUrl : SITE + "/og-landing.jpg";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: SITE + "/" },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: SITE + "/" }],
    };
  },
  component: () => (
    <StoryLayout>
      <CMSChapter slug={SLUG} />
    </StoryLayout>
  ),
});
