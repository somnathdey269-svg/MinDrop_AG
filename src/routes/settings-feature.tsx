import { createFileRoute } from "@tanstack/react-router";
import { StoryLayout } from "@/components/marketing/story/StoryLayout";
import { CMSChapter } from "@/components/marketing/story/CMSChapter";
import { getPublishedChapterBySlug } from "@/lib/marketing/story.functions";
import { assetUrl } from "@/lib/marketing/assetRegistry";

const SITE = "https://getmindrop.lovable.app";
const SLUG = "settings" as const;

const chapterQuery = () => ({
  queryKey: ["story-chapter", SLUG] as const,
  queryFn: async () => (await getPublishedChapterBySlug({ data: { slug: SLUG } })).chapter,
});

export const Route = createFileRoute("/settings-feature")({
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
        { property: "og:url", content: SITE + "/settings-feature" },
        ...(ogImage ? [{ property: "og:image", content: ogImage }, { name: "twitter:image", content: ogImage }] : []),
      ],
      links: [{ rel: "canonical", href: SITE + "/settings-feature" }],
    };
  },
  component: () => (
    <StoryLayout>
      <CMSChapter slug={SLUG} />
    </StoryLayout>
  ),
});
