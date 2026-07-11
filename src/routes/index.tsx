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
  // Intercept native mobile startup during early route resolution
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      // WebView scheme or device agent detection
      const isLikelyWebView =
        (window.location.protocol === "https:" && window.location.hostname === "localhost") ||
        /capacitor|android|iphone|ipad|ipod/i.test(navigator.userAgent);
        
      if (isLikelyWebView) {
        // Wait 50ms for native Capacitor injection to complete
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    if (!isNativeApp()) return;
    let seen = false;
    try {
      seen = typeof window !== "undefined" && window.localStorage.getItem(SPLASH_SHOWN_KEY) === "1";
    } catch {}
    
    console.log("[INDEX beforeLoad] seen =", seen, "redirecting to:", seen ? "/dashboard" : "/splash");
    throw redirect({ to: seen ? "/dashboard" : "/splash" });
  },
  loader: async ({ context }) => {
    try {
      return await context.queryClient.ensureQueryData(chapterQuery());
    } catch (e) {
      console.warn("Loader failed to retrieve chapter data on startup:", e);
      return null;
    }
  },
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
