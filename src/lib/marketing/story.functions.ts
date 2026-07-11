import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

/* ---------- shared helpers ---------- */

async function ensureSuperadmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "superadmin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

function publicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

/* ---------- Types returned to the client ---------- */

export type StoryStep = {
  id: string;
  title: string;
  body: string;
  target: string | null;
  screen: string | null;
  status: string;
  sort_order: number;
};

export type StoryBeat = {
  id: string;
  label: string;
  default_screen: string;
  status: string;
  sort_order: number;
  steps: StoryStep[];
};

export type StoryPill = {
  id: string;
  kind: string;
  label: string;
  target_key: string | null;
  status: string;
  sort_order: number;
};

export type StorySubchapter = {
  id: string;
  key: string;
  eyebrow: string;
  title: string;
  caption: string;
  headline: string;
  tab_label: string;
  hero_key: string;
  hero_alt: string;
  backdrop_key: string;
  layout: string;
  poster_url: string | null;
  status: string;
  sort_order: number;
  hero_opacity: number;
  backdrop_opacity: number;
  mobile_image: "hero" | "backdrop" | "both";
  beats: StoryBeat[];
  pills: StoryPill[];
};

export type StoryChapter = {
  id: string;
  slug: string;
  number: number;
  path: string;
  roman_numeral: string;
  title: string;
  teaser: string;
  recap: string;
  time_of_day: string;
  sky_top: string;
  sky_bottom: string;
  ink: string;
  tab_label: string;
  hero_key: string;
  hero_alt: string;
  backdrop_key: string;
  phone_screens: string[];
  variant: string;
  status: string;
  sort_order: number;
  subchapters: StorySubchapter[];
};

async function buildTree(sb: any, onlyPublished: boolean): Promise<StoryChapter[]> {
  const eqPublished = (q: any) => (onlyPublished ? q.eq("status", "published") : q);

  const [chRes, scRes, wbRes, wsRes, plRes] = await Promise.all([
    eqPublished(sb.from("story_chapters").select("*")).order("sort_order"),
    eqPublished(sb.from("story_subchapters").select("*")).order("sort_order"),
    eqPublished(sb.from("story_walk_beats").select("*")).order("sort_order"),
    eqPublished(sb.from("story_walk_steps").select("*")).order("sort_order"),
    eqPublished(sb.from("story_pills").select("*")).order("sort_order"),
  ]);

  if (chRes.error) throw new Error(chRes.error.message);

  const chapters: StoryChapter[] = (chRes.data ?? []).map((c: any) => ({ ...c, subchapters: [] }));
  const chById = new Map(chapters.map((c) => [c.id, c]));

  const scMap = new Map<string, StorySubchapter>();
  for (const sc of scRes.data ?? []) {
    const ch = chById.get(sc.chapter_id);
    if (!ch) continue;
    const sub: StorySubchapter = { ...sc, beats: [], pills: [] };
    ch.subchapters.push(sub);
    scMap.set(sc.id, sub);
  }

  const beatMap = new Map<string, StoryBeat>();
  for (const wb of wbRes.data ?? []) {
    const sc = scMap.get(wb.subchapter_id);
    if (!sc) continue;
    const beat: StoryBeat = { ...wb, steps: [] };
    sc.beats.push(beat);
    beatMap.set(wb.id, beat);
  }

  for (const ws of wsRes.data ?? []) {
    const beat = beatMap.get(ws.beat_id);
    if (!beat) continue;
    beat.steps.push(ws);
  }

  for (const pl of plRes.data ?? []) {
    const sc = scMap.get(pl.subchapter_id);
    if (!sc) continue;
    sc.pills.push(pl);
  }

  return chapters;
}

/* ---------- public reads ---------- */

export const getPublishedChapters = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("story_chapters")
    .select("*")
    .eq("status", "published")
    .order("sort_order");
  return { chapters: data ?? [] };
});

export const getPublishedStory = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const chapters = await buildTree(publicClient(), true);
    return { chapters };
  } catch {
    return { chapters: [] as StoryChapter[] };
  }
});

export const getPublishedChapterBySlug = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => z.object({ slug: z.string().min(1).max(60) }).parse(raw))
  .handler(async ({ data }) => {
    try {
      const chapters = await buildTree(publicClient(), true);
      return { chapter: chapters.find((c) => c.slug === data.slug) ?? null };
    } catch {
      return { chapter: null as StoryChapter | null };
    }
  });

/* ---------- superadmin reads ---------- */

export const getAllChapters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("story_chapters")
      .select("*")
      .order("sort_order");
    if (error) throw new Error(error.message);
    return { chapters: data ?? [] };
  });

export const getAllStory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const chapters = await buildTree(context.supabase, false);
    return { chapters };
  });

/* ---------- chapter mutations ---------- */

const chapterSchema = z.object({
  id: z.string().uuid().nullable(),
  slug: z.string().min(1).max(60),
  number: z.number().int().min(1).max(999),
  path: z.string().min(1).max(200),
  roman_numeral: z.string().min(1).max(10),
  title: z.string().min(1).max(200),
  teaser: z.string().max(400).default(""),
  recap: z.string().max(600).default(""),
  time_of_day: z.string().max(20).default("morning"),
  sky_top: z.string().max(20).default("#ffffff"),
  sky_bottom: z.string().max(20).default("#ffffff"),
  ink: z.string().max(20).default("#000000"),
  tab_label: z.string().max(200).default(""),
  hero_key: z.string().max(120).default(""),
  hero_alt: z.string().max(400).default(""),
  backdrop_key: z.string().max(120).default(""),
  phone_screens: z.array(z.string().max(200)).default([]),
  variant: z.enum(["immersive", "editorial"]).default("immersive"),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.number().int().default(0),
});

export const upsertChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => chapterSchema.parse(raw))
  .handler(async ({ data, context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const { id, ...values } = data;
    if (id) {
      const { error } = await context.supabase.from("story_chapters").update(values).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true, id };
    }
    const { data: inserted, error } = await context.supabase
      .from("story_chapters")
      .insert(values)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: inserted.id };
  });

export const deleteChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("story_chapters").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setChapterStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["draft", "published"]) }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("story_chapters")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- generic child mutations ---------- */

const CHILD_TABLES = {
  subchapter: "story_subchapters",
  beat: "story_walk_beats",
  step: "story_walk_steps",
  pill: "story_pills",
} as const;
type ChildKind = keyof typeof CHILD_TABLES;

const subchapterSchema = z.object({
  id: z.string().uuid().nullable(),
  chapter_id: z.string().uuid(),
  key: z.string().min(1).max(60),
  eyebrow: z.string().max(120).default(""),
  title: z.string().max(200).default(""),
  caption: z.string().max(400).default(""),
  headline: z.string().max(400).default(""),
  tab_label: z.string().max(200).default(""),
  hero_key: z.string().max(120).default(""),
  hero_alt: z.string().max(400).default(""),
  backdrop_key: z.string().max(120).default(""),
  layout: z.enum(["immersive", "editorial"]).default("immersive"),
  poster_url: z.string().max(500).nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.number().int().default(0),
  hero_opacity: z.number().min(0).max(1).default(0.9),
  backdrop_opacity: z.number().min(0).max(1).default(0.85),
  mobile_image: z.enum(["hero", "backdrop", "both"]).default("backdrop"),
});

const beatSchema = z.object({
  id: z.string().uuid().nullable(),
  subchapter_id: z.string().uuid(),
  label: z.string().max(120).default(""),
  default_screen: z.string().max(200).default("/home"),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.number().int().default(0),
});

const stepSchema = z.object({
  id: z.string().uuid().nullable(),
  beat_id: z.string().uuid(),
  title: z.string().max(200).default(""),
  body: z.string().max(600).default(""),
  target: z.string().max(200).nullable().optional(),
  screen: z.string().max(200).nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.number().int().default(0),
});

const pillSchema = z.object({
  id: z.string().uuid().nullable(),
  subchapter_id: z.string().uuid(),
  kind: z.enum(["prev", "next", "custom"]).default("custom"),
  label: z.string().max(120).default(""),
  target_key: z.string().max(120).nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.number().int().default(0),
});

async function upsertRow(sb: any, table: string, row: any) {
  const { id, ...values } = row;
  if (id) {
    const { error } = await sb.from(table).update(values).eq("id", id);
    if (error) throw new Error(error.message);
    return id;
  }
  const { data, error } = await sb.from(table).insert(values).select("id").single();
  if (error) throw new Error(error.message);
  return data.id;
}

export const upsertSubchapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => subchapterSchema.parse(raw))
  .handler(async ({ data, context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const id = await upsertRow(context.supabase, CHILD_TABLES.subchapter, data);
    return { ok: true, id };
  });

export const upsertBeat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => beatSchema.parse(raw))
  .handler(async ({ data, context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const id = await upsertRow(context.supabase, CHILD_TABLES.beat, data);
    return { ok: true, id };
  });

export const upsertStep = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => stepSchema.parse(raw))
  .handler(async ({ data, context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const id = await upsertRow(context.supabase, CHILD_TABLES.step, data);
    return { ok: true, id };
  });

export const upsertPill = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => pillSchema.parse(raw))
  .handler(async ({ data, context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const id = await upsertRow(context.supabase, CHILD_TABLES.pill, data);
    return { ok: true, id };
  });

export const deleteNode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        kind: z.enum(["subchapter", "beat", "step", "pill"]),
        id: z.string().uuid(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const table = CHILD_TABLES[data.kind as ChildKind];
    const { error } = await context.supabase.from(table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setNodeStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        kind: z.enum(["subchapter", "beat", "step", "pill"]),
        id: z.string().uuid(),
        status: z.enum(["draft", "published"]),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    await ensureSuperadmin(context.supabase, context.userId);
    const table = CHILD_TABLES[data.kind as ChildKind];
    const { error } = await context.supabase.from(table).update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
