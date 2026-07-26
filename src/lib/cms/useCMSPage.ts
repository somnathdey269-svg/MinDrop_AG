import { useState, useEffect } from "react";
import { getMarketingPageFn } from "./cms.functions";
import type { MarketingPageData } from "./cms.types";

export function useCMSPage(slug: string) {
  const [page, setPage] = useState<MarketingPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMarketingPageFn({ data: { slug } });
        if (!cancelled && res.page) {
          setPage(res.page);
        }
      } catch (err) {
        console.error(`Failed loading CMS page for ${slug}`, err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Extract structured fields if available
  const structuredBlock = page?.blocks?.find((b: any) => b.type === "structured_fields") as any;
  const fields: Record<string, string> = structuredBlock?.fields || {};

  return { page, loading, fields, hasBlocks: !!page?.blocks?.length };
}
