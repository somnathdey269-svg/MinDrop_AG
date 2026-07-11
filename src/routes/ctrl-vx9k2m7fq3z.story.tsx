import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plus, Trash2, Save, Eye, EyeOff, RefreshCw, ChevronRight,
  Image as ImageIcon, ExternalLink, Check,
  Type, Palette, Smartphone, Tag as TagIcon, Settings2, type LucideIcon,
} from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagToggle } from "@/components/admin/FlagToggle";
import {
  getAllStory, upsertChapter, deleteChapter, setChapterStatus,
  upsertSubchapter, upsertBeat, upsertStep, upsertPill,
  deleteNode, setNodeStatus,
  type StoryChapter, type StorySubchapter, type StoryBeat, type StoryPill,
} from "@/lib/marketing/story.functions";
import { PHONE_SCREEN_REGISTRY } from "@/lib/marketing/phoneScreens";
import { ASSETS, assetUrl, assetsByKind, type AssetOption } from "@/lib/marketing/assetRegistry";
import { RichTextarea } from "@/components/admin/RichTextarea";
import { renderRichText } from "@/lib/marketing/richText";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/story")({ component: StoryAdmin });

/* =========================================================================
 * Story CMS — 3-pane editor
 *   Left:   Chapters list
 *   Middle: Sub-chapters of the active chapter
 *   Right:  Editor for whichever item is selected (chapter or sub-chapter)
 * ========================================================================= */

function StoryAdmin() {
  const [tree, setTree] = useState<StoryChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllStory();
      setTree(res.chapters);
      if (!activeChapterId && res.chapters.length) setActiveChapterId(res.chapters[0].id);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  const activeChapter = useMemo(() => tree.find((c) => c.id === activeChapterId) ?? null, [tree, activeChapterId]);
  const activeSub = useMemo(
    () => activeChapter?.subchapters.find((s) => s.id === activeSubId) ?? null,
    [activeChapter, activeSubId],
  );

  return (
    <AdminShell title="Story CMS">
      <FlagToggle slug="story" />

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-ink/60">
          Every headline, caption, image and walkthrough shown on the marketing site is edited here. Draft rows are hidden from the public site until published.
        </p>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-1.5 text-xs text-ink/60 hover:text-ink px-3 py-2 rounded-lg border border-ink/15"
        >
          <RefreshCw className="size-3" /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[240px_260px_1fr] gap-4 min-h-[70vh]">
          <ChapterList
            chapters={tree}
            activeId={activeChapterId}
            onSelect={(id) => { setActiveChapterId(id); setActiveSubId(null); }}
            onNewChapter={async () => {
              const created = await upsertChapter({
                data: {
                  id: null, slug: `chapter-${Date.now()}`, number: tree.length + 1, path: "/",
                  roman_numeral: "?", title: "New chapter", teaser: "", recap: "",
                  time_of_day: "morning", sky_top: "#ffffff", sky_bottom: "#ffffff", ink: "#000000",
                  tab_label: "", hero_key: "", hero_alt: "", backdrop_key: "",
                  phone_screens: [], variant: "immersive",
                  status: "draft", sort_order: tree.length + 1,
                },
              });
              setActiveChapterId(created.id);
              await refresh();
            }}
          />

          <SubchapterList
            chapter={activeChapter}
            activeId={activeSubId}
            onSelect={setActiveSubId}
            onNewSub={async () => {
              if (!activeChapter) return;
              await upsertSubchapter({
                data: {
                  id: null, chapter_id: activeChapter.id, key: `sub-${Date.now()}`,
                  eyebrow: "", title: "New sub-chapter", caption: "", headline: "",
                  tab_label: "", hero_key: "", hero_alt: "", backdrop_key: "",
                  layout: "immersive", poster_url: null, status: "draft",
                  sort_order: activeChapter.subchapters.length + 1,
                  hero_opacity: 0.9, backdrop_opacity: 0.85, mobile_image: "backdrop",
                },
              });
              await refresh();
            }}
          />

          <div className="bg-white border border-ink/10 rounded-2xl p-5 min-w-0">
            {activeSub ? (
              <SubchapterEditor sub={activeSub} chapter={activeChapter!} refresh={refresh} />
            ) : activeChapter ? (
              <ChapterEditor chapter={activeChapter} refresh={refresh} />
            ) : (
              <div className="text-ink/40 text-sm">Pick a chapter to start editing.</div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

/* ---------------- left column: chapters ---------------- */

function ChapterList({
  chapters, activeId, onSelect, onNewChapter,
}: {
  chapters: StoryChapter[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChapter: () => void;
}) {
  return (
    <aside className="bg-white border border-ink/10 rounded-2xl p-3 self-start sticky top-4">
      <div className="flex items-center justify-between mb-2 px-2">
        <p className="t-eyebrow text-ink/40">Chapters</p>
        <button onClick={onNewChapter} className="text-brand" aria-label="Add chapter">
          <Plus className="size-4" />
        </button>
      </div>
      <ul className="space-y-1">
        {chapters.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 ${
                activeId === c.id ? "bg-brand/10 text-brand" : "hover:bg-ink/5 text-ink/80"
              }`}
            >
              <span className="text-[10px] uppercase tracking-widest text-ink/40 w-6 shrink-0">{c.roman_numeral}</span>
              <span className="flex-1 truncate">{c.title || <em className="text-ink/30">Untitled</em>}</span>
              <StatusChip status={c.status} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ---------------- middle column: sub-chapters ---------------- */

function SubchapterList({
  chapter, activeId, onSelect, onNewSub,
}: {
  chapter: StoryChapter | null;
  activeId: string | null;
  onSelect: (id: string | null) => void;
  onNewSub: () => void;
}) {
  if (!chapter) {
    return <aside className="bg-white border border-ink/10 rounded-2xl p-3 text-ink/40 text-sm">Pick a chapter.</aside>;
  }
  return (
    <aside className="bg-white border border-ink/10 rounded-2xl p-3 self-start sticky top-4">
      <div className="flex items-center justify-between mb-2 px-2">
        <p className="t-eyebrow text-ink/40">{chapter.title}</p>
        <button onClick={onNewSub} className="text-brand" aria-label="Add sub-chapter">
          <Plus className="size-4" />
        </button>
      </div>
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-2 ${
          activeId === null ? "bg-brand/10 text-brand" : "hover:bg-ink/5 text-ink/70"
        }`}
      >
        ← Edit chapter metadata
      </button>
      <ul className="space-y-1">
        {chapter.subchapters.map((sc, i) => (
          <li key={sc.id}>
            <button
              onClick={() => onSelect(sc.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 ${
                activeId === sc.id ? "bg-brand/10 text-brand" : "hover:bg-ink/5 text-ink/80"
              }`}
            >
              <span className="text-[10px] font-mono text-ink/40 w-4 shrink-0">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate">{sc.title || <em className="text-ink/30">Untitled</em>}</span>
                {sc.headline && <span className="block truncate text-[10px] text-ink/40">{sc.headline}</span>}
              </span>
              <StatusChip status={sc.status} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ---------------- right column: chapter editor ---------------- */

function ChapterEditor({ chapter, refresh }: { chapter: StoryChapter; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState(chapter);
  useEffect(() => setDraft(chapter), [chapter]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(chapter);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await upsertChapter({
        data: {
          id: draft.id, slug: draft.slug, number: draft.number, path: draft.path,
          roman_numeral: draft.roman_numeral, title: draft.title, teaser: draft.teaser,
          recap: draft.recap, time_of_day: draft.time_of_day, sky_top: draft.sky_top,
          sky_bottom: draft.sky_bottom, ink: draft.ink,
          tab_label: draft.tab_label, hero_key: draft.hero_key, hero_alt: draft.hero_alt,
          backdrop_key: draft.backdrop_key, phone_screens: draft.phone_screens ?? [],
          variant: (draft.variant as "immersive" | "editorial") ?? "immersive",
          status: draft.status as "draft" | "published", sort_order: draft.sort_order,
        },
      });
      await refresh();
    } catch (e) { alert("Save failed: " + (e as Error).message); }
    finally { setSaving(false); }
  };

  const [tab, setTab] = useState<"content" | "design" | "walkthrough" | "advanced">("content");

  return (
    <div className="space-y-4 min-w-0">
      <Breadcrumb items={[{ label: `Chapter ${chapter.roman_numeral}`, kind: "chapter" }, { label: chapter.title }]} />

      <ChapterHeaderActions chapter={chapter} refresh={refresh} dirty={dirty} saving={saving} onSave={save} />

      <PreviewCard
        hero={assetUrl(draft.hero_key)}
        backdrop={assetUrl(draft.backdrop_key)}
        headline={draft.title}
        caption={draft.teaser}
        eyebrow={draft.tab_label}
        skyTop={draft.sky_top}
        skyBottom={draft.sky_bottom}
        ink={draft.ink}
      />

      <TabNav
        tabs={[
          { id: "content", label: "Content", hint: "Words readers see", icon: Type },
          { id: "design", label: "Design", hint: "Images & colours", icon: Palette },
          { id: "walkthrough", label: "Walkthrough", hint: "Phone screens", icon: Smartphone },
          { id: "advanced", label: "Advanced", hint: "URL & order", icon: Settings2 },
        ]}
        active={tab}
        onChange={(t) => setTab(t as typeof tab)}
      />

      {tab === "content" && (
        <TabPanel>
          <Row>
            <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <Field label="Tab label (nav pill)" value={draft.tab_label} onChange={(v) => setDraft({ ...draft, tab_label: v })} help="Short label shown in navigation and share cards." />
          </Row>
          <Row>
            <Field label="Roman numeral" value={draft.roman_numeral} onChange={(v) => setDraft({ ...draft, roman_numeral: v })} />
            <Field label="Time of day" value={draft.time_of_day} onChange={(v) => setDraft({ ...draft, time_of_day: v })} />
          </Row>
          <Textarea label="Teaser (SEO description — plain text, no formatting)" value={draft.teaser} onChange={(v) => setDraft({ ...draft, teaser: v })} />
          <RichTextarea label="Previously… (recap shown when a reader returns)" value={draft.recap} onChange={(v) => setDraft({ ...draft, recap: v })} />
        </TabPanel>
      )}

      {tab === "design" && (
        <TabPanel>
          <AssetPicker label="Hero image" kind="hero" value={draft.hero_key} onChange={(v) => setDraft({ ...draft, hero_key: v })} />
          <Field label="Hero alt-text" value={draft.hero_alt} onChange={(v) => setDraft({ ...draft, hero_alt: v })} help="Describe the image for screen-readers." />
          <AssetPicker label="Backdrop sketch" kind="backdrop" value={draft.backdrop_key} onChange={(v) => setDraft({ ...draft, backdrop_key: v })} />
          <Row>
            <ColorField label="Sky top" value={draft.sky_top} onChange={(v) => setDraft({ ...draft, sky_top: v })} />
            <ColorField label="Sky bottom" value={draft.sky_bottom} onChange={(v) => setDraft({ ...draft, sky_bottom: v })} />
            <ColorField label="Ink" value={draft.ink} onChange={(v) => setDraft({ ...draft, ink: v })} />
          </Row>
          <label className="block">
            <span className="text-xs font-medium text-ink/70">Layout</span>
            <select
              value={draft.variant || "immersive"}
              onChange={(e) => setDraft({ ...draft, variant: e.target.value })}
              className="mt-1.5 w-full bg-white border border-ink/15 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition"
            >
              <option value="immersive">Immersive (blurred hero backdrop)</option>
              <option value="editorial">Editorial (full-bleed poster)</option>
            </select>
          </label>
        </TabPanel>
      )}

      {tab === "walkthrough" && (
        <TabPanel>
          <p className="text-[11px] text-ink/50">Default phone screens shown when a sub-chapter doesn't override them.</p>
          <ScreenListEditor
            value={draft.phone_screens ?? []}
            onChange={(v) => setDraft({ ...draft, phone_screens: v })}
          />
        </TabPanel>
      )}

      {tab === "advanced" && (
        <TabPanel>
          <p className="text-[11px] text-ink/50">Rarely change these. They control URLs and where the chapter sits in the story.</p>
          <Row>
            <Field label="Slug" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} />
            <Field label="Path" value={draft.path} onChange={(v) => setDraft({ ...draft, path: v })} />
          </Row>
          <Row>
            <Field label="Number" type="number" value={String(draft.number)} onChange={(v) => setDraft({ ...draft, number: Number(v) || 1 })} />
            <Field label="Sort order" type="number" value={String(draft.sort_order)} onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })} />
          </Row>
        </TabPanel>
      )}
    </div>
  );
}


function ChapterHeaderActions({
  chapter, refresh, dirty, saving, onSave,
}: {
  chapter: StoryChapter;
  refresh: () => Promise<void>;
  dirty: boolean; saving: boolean; onSave: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 bg-canvas/60 border border-ink/10 rounded-xl px-3 py-2">
      <div className="flex items-center gap-2">
        <StatusChip status={chapter.status} large />
        <a
          href={chapter.path}
          target="_blank"
          rel="noreferrer"
          className="text-xs inline-flex items-center gap-1 text-ink/60 hover:text-ink"
        >
          <ExternalLink className="size-3" /> View live
        </a>
      </div>
      <div className="flex gap-2">
        <button
          onClick={async () => {
            await setChapterStatus({ data: { id: chapter.id, status: chapter.status === "published" ? "draft" : "published" } });
            await refresh();
          }}
          className="inline-flex items-center gap-1.5 text-xs text-ink/70 hover:text-ink px-3 py-1.5 rounded-lg border border-ink/15"
        >
          {chapter.status === "published" ? (<><EyeOff className="size-3" /> Unpublish</>) : (<><Eye className="size-3" /> Publish</>)}
        </button>
        <button
          onClick={async () => {
            if (!confirm("Delete chapter and everything under it?")) return;
            await deleteChapter({ data: { id: chapter.id } });
            await refresh();
          }}
          className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200"
        >
          <Trash2 className="size-3" /> Delete
        </button>
        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-1.5 text-xs bg-ink text-canvas px-4 py-1.5 rounded-lg disabled:opacity-40"
        >
          <Save className="size-3" /> {saving ? "Saving…" : dirty ? "Save chapter" : "Saved"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- right column: sub-chapter editor ---------------- */

function SubchapterEditor({
  sub, chapter, refresh,
}: {
  sub: StorySubchapter; chapter: StoryChapter; refresh: () => Promise<void>;
}) {
  const [draft, setDraft] = useState(sub);
  useEffect(() => setDraft(sub), [sub]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(sub);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await upsertSubchapter({
        data: {
          id: draft.id, chapter_id: (sub as any).chapter_id ?? chapter.id, key: draft.key,
          eyebrow: draft.eyebrow, title: draft.title, caption: draft.caption,
          headline: draft.headline, tab_label: draft.tab_label,
          hero_key: draft.hero_key, hero_alt: draft.hero_alt, backdrop_key: draft.backdrop_key,
          layout: draft.layout as "immersive" | "editorial",
          poster_url: draft.poster_url, status: draft.status as "draft" | "published",
          sort_order: draft.sort_order,
          hero_opacity: draft.hero_opacity ?? 0.9,
          backdrop_opacity: draft.backdrop_opacity ?? 0.85,
          mobile_image: (draft.mobile_image ?? "backdrop") as "hero" | "backdrop" | "both",
        } as any,
      });
      await refresh();
    } catch (e) { alert("Save failed: " + (e as Error).message); }
    finally { setSaving(false); }
  };

  const [tab, setTab] = useState<"content" | "design" | "walkthrough" | "pills" | "advanced">("content");

  return (
    <div className="space-y-4 min-w-0">
      <Breadcrumb items={[
        { label: `Chapter ${chapter.roman_numeral}` },
        { label: chapter.title },
        { label: sub.title || "Untitled" },
      ]} />

      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-canvas/95 backdrop-blur border border-ink/10 rounded-xl px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <StatusChip status={sub.status} large />
          <span className="text-[11px] text-ink/50 truncate">Sub-chapter #{sub.sort_order} · {sub.title || "Untitled"}</span>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={async () => {
              await setNodeStatus({ data: { kind: "subchapter", id: sub.id, status: sub.status === "published" ? "draft" : "published" } });
              await refresh();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-ink/70 hover:text-ink px-3 py-1.5 rounded-lg border border-ink/15"
          >
            {sub.status === "published" ? (<><EyeOff className="size-3" /> Unpublish</>) : (<><Eye className="size-3" /> Publish</>)}
          </button>
          <button
            onClick={async () => {
              if (!confirm("Delete this sub-chapter?")) return;
              await deleteNode({ data: { kind: "subchapter", id: sub.id } });
              await refresh();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200"
          >
            <Trash2 className="size-3" /> Delete
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 text-xs bg-ink text-canvas px-4 py-1.5 rounded-lg disabled:opacity-40"
          >
            <Save className="size-3" /> {saving ? "Saving…" : dirty ? "Save" : "Saved"}
          </button>
        </div>
      </div>

      <PreviewCard
        hero={assetUrl(draft.hero_key) ?? assetUrl(chapter.hero_key)}
        backdrop={assetUrl(draft.backdrop_key) ?? assetUrl(chapter.backdrop_key)}
        headline={draft.headline || draft.title}
        caption={draft.caption}
        eyebrow={draft.eyebrow || draft.tab_label}
        skyTop={chapter.sky_top}
        skyBottom={chapter.sky_bottom}
        ink={chapter.ink}
      />

      <TabNav
        tabs={[
          { id: "content", label: "Content", hint: "Headline & caption", icon: Type },
          { id: "design", label: "Design", hint: "Images & opacity", icon: Palette },
          { id: "walkthrough", label: "Walkthrough", hint: `${sub.beats.length} beat${sub.beats.length === 1 ? "" : "s"}`, icon: Smartphone },
          { id: "pills", label: "Pills", hint: `${sub.pills.length} pill${sub.pills.length === 1 ? "" : "s"}`, icon: TagIcon },
          { id: "advanced", label: "Advanced", hint: "Layout & order", icon: Settings2 },
        ]}
        active={tab}
        onChange={(t) => setTab(t as typeof tab)}
      />

      {tab === "content" && (
        <TabPanel>
          <Field label="Title (internal / sub-chapter name)" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} help="Shown in the admin list and menus." />
          <RichTextarea
            label="Headline (the big line on the scene)"
            value={draft.headline}
            onChange={(v) => setDraft({ ...draft, headline: v })}
            help="This is the giant sentence that overlays the hero. Use line-breaks to control wrapping and the toolbar to bold / italicise / colour parts."
            rows={3}
          />
          <RichTextarea
            label="Caption (sub-text under the headline)"
            value={draft.caption}
            onChange={(v) => setDraft({ ...draft, caption: v })}
            help="One or two sentences that expand the headline. Use the toolbar or Cmd/Ctrl+B / I / U to bold, italicise, or underline the selected text."
            rows={3}
          />
          <Row>
            <Field label="Eyebrow (small label above headline)" value={draft.eyebrow} onChange={(v) => setDraft({ ...draft, eyebrow: v })} />
            <Field label="Tab label (nav pill)" value={draft.tab_label} onChange={(v) => setDraft({ ...draft, tab_label: v })} help="Shown as the beat pill at the bottom of the scene." />
          </Row>
        </TabPanel>
      )}

      {tab === "design" && (
        <TabPanel>
          <SubSection title="Hero image" hint="Big illustration that anchors the scene.">
            <AssetPicker label="Hero image" kind="beat" value={draft.hero_key} onChange={(v) => setDraft({ ...draft, hero_key: v })} help="Falls back to the chapter hero if empty." />
            <Field label="Hero alt-text" value={draft.hero_alt} onChange={(v) => setDraft({ ...draft, hero_alt: v })} />
            <OpacitySlider
              label="Hero opacity"
              value={draft.hero_opacity ?? 0.9}
              onChange={(v) => setDraft({ ...draft, hero_opacity: v })}
              help="0 = hidden, 1 = fully opaque."
            />
          </SubSection>

          <SubSection title="Backdrop sketch" hint="Softer sketch shown behind the hero.">
            <AssetPicker label="Backdrop sketch" kind="backdrop" value={draft.backdrop_key} onChange={(v) => setDraft({ ...draft, backdrop_key: v })} help="Falls back to the chapter backdrop if empty." />
            <OpacitySlider
              label="Backdrop opacity"
              value={draft.backdrop_opacity ?? 0.85}
              onChange={(v) => setDraft({ ...draft, backdrop_opacity: v })}
              help="0 = hidden, 1 = fully opaque."
            />
          </SubSection>

          <SubSection title="Mobile behaviour" hint="Choose what appears on phones. Desktop always shows both.">
            <label className="block">
              <span className="text-xs font-medium text-ink/70">Mobile image</span>
              <select
                value={draft.mobile_image ?? "backdrop"}
                onChange={(e) => setDraft({ ...draft, mobile_image: e.target.value as "hero" | "backdrop" | "both" })}
                className="mt-1.5 w-full bg-white border border-ink/15 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition"
              >
                <option value="backdrop">Backdrop only (default)</option>
                <option value="hero">Hero only</option>
                <option value="both">Show both</option>
              </select>
            </label>
          </SubSection>
        </TabPanel>
      )}

      {tab === "walkthrough" && (
        <TabPanel>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-ink/50">Beats become the tap-through phone overlay steps.</p>
            <button
              onClick={async () => {
                await upsertBeat({
                  data: {
                    id: null, subchapter_id: sub.id, label: "New beat",
                    default_screen: "/home", status: "draft", sort_order: sub.beats.length + 1,
                  },
                });
                await refresh();
              }}
              className="text-brand text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-brand/30 hover:bg-brand/5"
            >
              <Plus className="size-3" /> Add beat
            </button>
          </div>
          {sub.beats.length === 0 && <p className="text-ink/40 text-xs">No beats yet. Add one to build the phone-walkthrough overlay.</p>}
          <div className="space-y-2">
            {sub.beats.map((b) => <BeatEditor key={b.id} beat={b} refresh={refresh} />)}
          </div>
        </TabPanel>
      )}

      {tab === "pills" && (
        <TabPanel>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-ink/50">Optional chips shown at the bottom of the scene (links, next-chapter, etc.).</p>
            <button
              onClick={async () => {
                await upsertPill({
                  data: {
                    id: null, subchapter_id: sub.id, kind: "custom",
                    label: "New pill", target_key: null, status: "draft",
                    sort_order: sub.pills.length + 1,
                  },
                });
                await refresh();
              }}
              className="text-brand text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-brand/30 hover:bg-brand/5"
            >
              <Plus className="size-3" /> Add pill
            </button>
          </div>
          {sub.pills.length === 0 && <p className="text-ink/40 text-xs">No pills yet.</p>}
          <div className="space-y-2">
            {sub.pills.map((p) => <PillEditor key={p.id} pill={p} refresh={refresh} />)}
          </div>
        </TabPanel>
      )}

      {tab === "advanced" && (
        <TabPanel>
          <p className="text-[11px] text-ink/50">Layout, ordering, and rarely-changed overrides.</p>
          <label className="block">
            <span className="text-xs font-medium text-ink/70">Layout</span>
            <select
              value={draft.layout}
              onChange={(e) => setDraft({ ...draft, layout: e.target.value })}
              className="mt-1.5 w-full bg-white border border-ink/15 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition"
            >
              <option value="immersive">Immersive</option>
              <option value="editorial">Editorial</option>
            </select>
          </label>
          <Field label="Poster URL (optional override)" value={draft.poster_url ?? ""} onChange={(v) => setDraft({ ...draft, poster_url: v || null })} />
          <Field label="Sort order" type="number" value={String(draft.sort_order)} onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })} />
        </TabPanel>
      )}
    </div>
  );
}


/* ---------------- beat + steps ---------------- */

function BeatEditor({ beat, refresh }: { beat: StoryBeat; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState(beat);
  useEffect(() => setDraft(beat), [beat]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(beat);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await upsertBeat({
        data: {
          id: draft.id, subchapter_id: (beat as any).subchapter_id ?? (draft as any).subchapter_id,
          label: draft.label, default_screen: draft.default_screen,
          status: draft.status as "draft" | "published", sort_order: draft.sort_order,
        } as any,
      });
      await refresh();
    } catch (e) { alert("Save failed: " + (e as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <div className="rounded-lg border border-ink/10 bg-canvas/40 p-2">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-2 text-left text-sm">
        <ChevronRight className={`size-3 transition ${open ? "rotate-90" : ""}`} />
        <span className="flex-1 truncate">{draft.label || "Untitled beat"}</span>
        <span className="text-[10px] text-ink/40">{beat.steps.length} step</span>
        <StatusChip status={beat.status} />
      </button>
      {open && (
        <div className="mt-2 pt-2 border-t border-ink/10 space-y-2">
          <Row>
            <Field label="Label" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} />
            <label className="block">
              <span className="text-xs font-medium text-ink/70">Default screen</span>
              <select
                value={draft.default_screen}
                onChange={(e) => setDraft({ ...draft, default_screen: e.target.value })}
                className="mt-1 w-full bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm"
              >
                {PHONE_SCREEN_REGISTRY.map((s) => <option key={s.path} value={s.path}>{s.label}</option>)}
              </select>
            </label>
          </Row>
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              <button
                onClick={async () => { await setNodeStatus({ data: { kind: "beat", id: beat.id, status: beat.status === "published" ? "draft" : "published" } }); await refresh(); }}
                className="text-xs text-ink/60 hover:text-ink px-2 py-1 rounded border border-ink/15"
              >{beat.status === "published" ? "Unpublish" : "Publish"}</button>
              <button
                onClick={async () => { if (!confirm("Delete this beat?")) return; await deleteNode({ data: { kind: "beat", id: beat.id } }); await refresh(); }}
                className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded border border-red-200 inline-flex items-center gap-1"
              ><Trash2 className="size-3" /> Delete</button>
            </div>
            <button onClick={save} disabled={!dirty || saving}
              className="inline-flex items-center gap-1 text-xs bg-brand text-canvas px-3 py-1 rounded-lg disabled:opacity-40">
              <Save className="size-3" /> {saving ? "Saving…" : dirty ? "Save" : "Saved"}
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <p className="t-eyebrow text-ink/40">Steps</p>
              <button
                onClick={async () => {
                  await upsertStep({
                    data: {
                      id: null, beat_id: beat.id, title: "New step", body: "",
                      target: null, screen: null, status: "draft", sort_order: beat.steps.length + 1,
                    },
                  });
                  await refresh();
                }}
                className="text-brand text-xs inline-flex items-center gap-1"
              ><Plus className="size-3" /> Step</button>
            </div>
            {beat.steps.map((s) => <StepEditor key={s.id} step={s} refresh={refresh} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function StepEditor({ step, refresh }: { step: any; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState(step);
  useEffect(() => setDraft(step), [step]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(step);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await upsertStep({
        data: {
          id: draft.id, beat_id: (step as any).beat_id ?? (draft as any).beat_id,
          title: draft.title, body: draft.body, target: draft.target, screen: draft.screen,
          status: draft.status, sort_order: draft.sort_order,
        } as any,
      });
      await refresh();
    } catch (e) { alert("Save failed: " + (e as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <div className="rounded-md border border-ink/10 bg-white p-2 mb-2 space-y-1.5">
      <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
      <Textarea label="Body" value={draft.body} onChange={(v) => setDraft({ ...draft, body: v })} rows={2} />
      <Row>
        <Field label="Target selector (optional)" value={draft.target ?? ""} onChange={(v) => setDraft({ ...draft, target: v || null })} />
        <label className="block">
          <span className="text-xs font-medium text-ink/70">Screen override</span>
          <select
            value={draft.screen ?? ""}
            onChange={(e) => setDraft({ ...draft, screen: e.target.value || null })}
            className="mt-1 w-full bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">(use beat default)</option>
            {PHONE_SCREEN_REGISTRY.map((s) => <option key={s.path} value={s.path}>{s.label}</option>)}
          </select>
        </label>
      </Row>
      <div className="flex justify-between gap-2">
        <button
          onClick={async () => { if (!confirm("Delete this step?")) return; await deleteNode({ data: { kind: "step", id: step.id } }); await refresh(); }}
          className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded"
        >Delete step</button>
        <button onClick={save} disabled={!dirty || saving}
          className="text-xs bg-brand text-canvas px-3 py-1 rounded disabled:opacity-40">
          {saving ? "Saving…" : dirty ? "Save step" : "Saved"}
        </button>
      </div>
    </div>
  );
}

function PillEditor({ pill, refresh }: { pill: StoryPill; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState(pill);
  useEffect(() => setDraft(pill), [pill]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(pill);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await upsertPill({
        data: {
          id: draft.id, subchapter_id: (pill as any).subchapter_id ?? (draft as any).subchapter_id,
          kind: draft.kind as "prev" | "next" | "custom", label: draft.label,
          target_key: draft.target_key, status: draft.status as "draft" | "published",
          sort_order: draft.sort_order,
        } as any,
      });
      await refresh();
    } catch (e) { alert("Save failed: " + (e as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <div className="rounded-md border border-ink/10 bg-canvas/40 p-2 space-y-1.5">
      <Row>
        <Field label="Label" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} />
        <label className="block">
          <span className="text-xs font-medium text-ink/70">Kind</span>
          <select
            value={draft.kind}
            onChange={(e) => setDraft({ ...draft, kind: e.target.value })}
            className="mt-1 w-full bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="custom">Custom</option>
            <option value="prev">Prev chapter</option>
            <option value="next">Next chapter</option>
          </select>
        </label>
      </Row>
      <Field label="Target key (optional)" value={draft.target_key ?? ""} onChange={(v) => setDraft({ ...draft, target_key: v || null })} />
      <div className="flex justify-between gap-2">
        <button
          onClick={async () => { if (!confirm("Delete this pill?")) return; await deleteNode({ data: { kind: "pill", id: pill.id } }); await refresh(); }}
          className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded"
        >Delete pill</button>
        <button onClick={save} disabled={!dirty || saving}
          className="text-xs bg-brand text-canvas px-3 py-1 rounded disabled:opacity-40">
          {saving ? "Saving…" : dirty ? "Save" : "Saved"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- shared bits ---------------- */

function Breadcrumb({ items }: { items: { label: string; kind?: string }[] }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-ink/50">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="size-3 opacity-40" />}
          <span className={i === items.length - 1 ? "text-ink" : ""}>{it.label}</span>
        </span>
      ))}
    </div>
  );
}

function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-xl border border-ink/10 bg-canvas/30">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2.5 flex items-center gap-2 text-left"
      >
        <ChevronRight className={`size-3 transition ${open ? "rotate-90" : ""}`} />
        <span className="t-body-sm font-medium">{title}</span>
      </button>
      {open && <div className="px-3 pb-3 space-y-3">{children}</div>}
    </div>
  );
}

type TabDef = { id: string; label: string; hint?: string; icon?: LucideIcon };
function TabNav({ tabs, active, onChange }: { tabs: TabDef[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="rounded-2xl bg-white/70 border border-ink/10 p-1.5 shadow-sm overflow-x-auto">
      <div className="flex items-stretch gap-1 min-w-max">
        {tabs.map((t) => {
          const isActive = t.id === active;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`group flex-1 min-w-[9rem] flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all ${
                isActive
                  ? "bg-ink text-canvas shadow-md"
                  : "text-ink/60 hover:text-ink hover:bg-ink/5"
              }`}
            >
              {Icon && (
                <span
                  className={`grid place-items-center rounded-lg size-8 shrink-0 transition-colors ${
                    isActive ? "bg-canvas/15 text-canvas" : "bg-ink/5 text-ink/60 group-hover:bg-ink/10"
                  }`}
                >
                  <Icon className="size-4" />
                </span>
              )}
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold leading-tight truncate">{t.label}</span>
                {t.hint && (
                  <span className={`block text-[10.5px] leading-tight truncate ${isActive ? "text-canvas/60" : "text-ink/45"}`}>
                    {t.hint}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TabPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white shadow-sm p-5 md:p-6 space-y-5">
      {children}
    </div>
  );
}

function SubSection({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-ink/10 bg-canvas/40 p-4 md:p-5 space-y-4">
      <header className="flex items-baseline justify-between gap-3 pb-3 border-b border-ink/8">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-ink truncate">{title}</h3>
          {hint && <p className="text-xs text-ink/55 mt-0.5">{hint}</p>}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}


function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label, value, onChange, type, help,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; help?: string;
}) {
  return (
    <label className="block group">
      <span className="text-xs font-medium text-ink/70">{label}</span>
      <input
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-white border border-ink/15 rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition"
      />
      {help && <span className="mt-1.5 block text-[11px] text-ink/50 leading-snug">{help}</span>}
    </label>
  );
}

function Textarea({
  label, value, onChange, rows, help,
}: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; help?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink/70">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows ?? 2}
        className="mt-1.5 w-full bg-white border border-ink/15 rounded-lg px-3.5 py-2.5 text-sm text-ink font-sans focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition resize-y"
      />
      {help && <span className="mt-1.5 block text-[11px] text-ink/50 leading-snug">{help}</span>}
    </label>
  );
}

function OpacitySlider({
  label, value, onChange, help,
}: {
  label: string; value: number; onChange: (v: number) => void; help?: string;
}) {
  const pct = Math.round((value ?? 0) * 100);
  return (
    <label className="block">
      <span className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink/70">{label}</span>
        <span className="tabular-nums text-xs font-semibold text-ink bg-ink/5 rounded-md px-2 py-0.5">{pct}%</span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pct}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="mt-3 w-full accent-brand h-1.5"
      />
      {help && <span className="mt-1.5 block text-[11px] text-ink/50 leading-snug">{help}</span>}
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink/70">{label}</span>
      <div className="mt-1.5 flex gap-2 items-center rounded-lg border border-ink/15 bg-white p-1 pr-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 transition">
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="size-9 rounded-md cursor-pointer border-0 bg-transparent p-0"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent px-1 py-2 text-sm font-mono outline-none"
        />
      </div>
    </label>
  );
}

function StatusChip({ status, large }: { status: string; large?: boolean }) {
  const cls =
    status === "published"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-amber-100 text-amber-800";
  return (
    <span className={`${large ? "text-[10px] px-2 py-0.5" : "text-[8px] px-1.5 py-0.5"} uppercase font-bold tracking-widest rounded-full ${cls}`}>
      {status === "published" ? "live" : "draft"}
    </span>
  );
}

/* ---------------- asset picker ---------------- */

function AssetPicker({
  label, kind, value, onChange, help,
}: {
  label: string;
  kind: AssetOption["kind"];
  value: string; onChange: (v: string) => void;
  help?: string;
}) {
  const [open, setOpen] = useState(false);
  const url = assetUrl(value);
  const options = assetsByKind(kind);
  const all = ASSETS; // allow cross-kind picks in the modal

  return (
    <div>
      <span className="text-xs font-medium text-ink/70">{label}</span>
      <div className="mt-1 flex items-center gap-3 bg-white border border-ink/10 rounded-lg p-2">
        <div className="size-16 rounded-md bg-canvas/60 border border-ink/10 flex items-center justify-center overflow-hidden shrink-0">
          {url ? (
            <img src={url} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="size-5 text-ink/30" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs truncate">{value || <span className="text-ink/40">(none)</span>}</p>
          <p className="text-[10px] text-ink/40 truncate">{options.find((o) => o.key === value)?.label ?? ""}</p>
        </div>
        <div className="flex gap-1">
          {value && (
            <button onClick={() => onChange("")} className="text-[10px] text-ink/50 hover:text-ink px-2 py-1 rounded border border-ink/10">Clear</button>
          )}
          <button onClick={() => setOpen(true)} className="text-[10px] bg-ink text-canvas px-2 py-1 rounded">Change</button>
        </div>
      </div>
      {help && <span className="mt-1 block text-[10px] text-ink/40">{help}</span>}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-ink/10 flex items-center justify-between">
              <p className="t-body-sm font-medium">Pick an image</p>
              <button onClick={() => setOpen(false)} className="text-sm text-ink/60">Close</button>
            </div>
            <div className="p-4 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {all.map((a) => (
                <button
                  key={a.key}
                  onClick={() => { onChange(a.key); setOpen(false); }}
                  className={`text-left border rounded-lg p-1.5 hover:border-brand transition ${
                    a.key === value ? "border-brand ring-2 ring-brand/30" : "border-ink/10"
                  }`}
                >
                  <div className="aspect-square rounded-md overflow-hidden bg-canvas/60">
                    <img src={a.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-1 text-[11px] truncate">{a.label}</p>
                  <p className="text-[10px] text-ink/40 truncate">{a.kind}</p>
                  {a.key === value && <span className="inline-flex items-center gap-0.5 text-[10px] text-brand"><Check className="size-3" /> selected</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- screen list editor ---------------- */

function ScreenListEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.length === 0 && <p className="text-ink/40 text-xs">No screens — the phone card will use the default splash.</p>}
      {value.map((s, i) => (
        <div key={i} className="flex gap-2 items-center">
          <span className="text-[10px] text-ink/40 w-4">{i + 1}</span>
          <select
            value={s}
            onChange={(e) => {
              const next = [...value]; next[i] = e.target.value; onChange(next);
            }}
            className="flex-1 bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm"
          >
            {PHONE_SCREEN_REGISTRY.map((p) => <option key={p.path} value={p.path}>{p.label}</option>)}
            {!PHONE_SCREEN_REGISTRY.some((p) => p.path === s) && s && <option value={s}>{s}</option>}
          </select>
          <button
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded border border-red-200"
          ><Trash2 className="size-3" /></button>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, PHONE_SCREEN_REGISTRY[0]?.path ?? "/home"])}
        className="text-brand text-xs inline-flex items-center gap-1"
      >
        <Plus className="size-3" /> Add screen
      </button>
    </div>
  );
}

/* ---------------- preview card ---------------- */

function PreviewCard({
  hero, backdrop, headline, caption, eyebrow, skyTop, skyBottom, ink,
}: {
  hero: string | null; backdrop: string | null;
  headline: string; caption: string; eyebrow: string;
  skyTop: string; skyBottom: string; ink: string;
}) {
  return (
    <div
      className="relative rounded-xl overflow-hidden border border-ink/10 aspect-[16/9] w-full"
      style={{ background: `linear-gradient(180deg, ${skyTop} 0%, ${skyBottom} 100%)`, color: ink }}
    >
      {backdrop && (
        <img src={backdrop} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      )}
      {hero && (
        <img src={hero} alt="" className="absolute inset-0 w-full h-full object-contain p-6" />
      )}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white/80 to-transparent">
        {eyebrow && <p className="text-[9px] uppercase tracking-widest opacity-70">{eyebrow}</p>}
        <p className="text-lg md:text-2xl font-black leading-tight mt-0.5">{headline || <span className="opacity-40">(headline)</span>}</p>
        {caption && <p className="text-xs md:text-sm opacity-70 mt-1 line-clamp-2">{renderRichText(caption)}</p>}
      </div>
    </div>
  );
}
