import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
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

function IndexComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isNativeApp()) {
      let seen = false;
      try {
        seen = typeof window !== "undefined" && window.localStorage.getItem(SPLASH_SHOWN_KEY) === "1";
      } catch {}
      console.log("[NATIVE REDIRECT] seen =", seen, "Navigating to:", seen ? "/dashboard" : "/splash");
      navigate({ to: seen ? "/dashboard" : "/splash", replace: true });
    }
  }, [navigate]);

  return (
    <StoryLayout>
      <CMSChapter slug={SLUG} />
    </StoryLayout>
  );
}

export const Route = createFileRoute("/")({
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
  component: IndexComponent,
});
