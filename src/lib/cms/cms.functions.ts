import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { MarketingPageData } from "./cms.types";

async function ensureSuperadmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "superadmin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: Superadmin access required");
}

function publicClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

/** Public fetcher for marketing page content by slug */
export const getMarketingPageFn = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }): Promise<{ page: MarketingPageData | null }> => {
    const supabase = publicClient();
    if (!supabase) return { page: null };

    const { data: row, error } = await (supabase as any)
      .from("marketing_pages")
      .select("id, slug, page_name, meta_title, meta_description, blocks, is_published, updated_at")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !row) return { page: null };
    return { page: row as MarketingPageData };
  });

/** Superadmin list all marketing pages for management dropdown */
export const listMarketingPagesFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ pages: MarketingPageData[] }> => {
    await ensureSuperadmin((context as any).supabase, (context as any).userId);

    const { data, error } = await ((context as any).supabase as any)
      .from("marketing_pages")
      .select("id, slug, page_name, meta_title, meta_description, blocks, is_published, updated_at")
      .order("page_name", { ascending: true });

    if (error) return { pages: [] };
    return { pages: (data || []) as MarketingPageData[] };
  });

/** Superadmin mutator to save/update marketing page blocks & metadata */
export const saveMarketingPageFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (raw: unknown) =>
      z
        .object({
          slug: z.string().min(1),
          page_name: z.string().min(1),
          meta_title: z.string().optional(),
          meta_description: z.string().optional(),
          blocks: z.array(z.any()),
          is_published: z.boolean().optional(),
        })
        .parse(raw)
  )
  .handler(async ({ data, context }): Promise<{ success: boolean; id?: string }> => {
    await ensureSuperadmin((context as any).supabase, (context as any).userId);

    const payload = {
      slug: data.slug,
      page_name: data.page_name,
      meta_title: data.meta_title ?? null,
      meta_description: data.meta_description ?? null,
      blocks: data.blocks,
      is_published: data.is_published ?? true,
      updated_at: new Date().toISOString(),
    };

    const { data: upserted, error } = await ((context as any).supabase as any)
      .from("marketing_pages")
      .upsert(payload, { onConflict: "slug" })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { success: true, id: upserted?.id };
  });
