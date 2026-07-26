import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import {
  getMarketingPageFn,
  saveMarketingPageFn,
} from "@/lib/cms/cms.functions";
import type {
  MarketingPageData,
  CMSBlock,
  HeadingBlock,
  CardGridBlock,
  CtaBandBlock,
  FaqBlock,
  HeadingTag,
  CardItem,
} from "@/lib/cms/cms.types";
import { DynamicBlockRenderer } from "@/components/cms/DynamicBlockRenderer";
import {
  Save,
  Trash2,
  MoveUp,
  MoveDown,
  Layout,
  Type,
  Grid,
  HelpCircle,
  Sparkles,
  Eye,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/cms")({
  component: SuperAdminCMSView,
});

const MARKETING_PAGES_LIST = [
  { slug: "home", name: "Home Page" },
  { slug: "about", name: "About Page" },
  { slug: "pricing", name: "Pricing & Plans" },
  { slug: "faq", name: "FAQ Page" },
  { slug: "features", name: "Every Feature (Appendix)" },
  { slug: "vision", name: "Vision Page" },
  { slug: "download", name: "Get App / Download Page" },
  { slug: "contact", name: "Contact Support" },
  { slug: "terms", name: "Terms & Conditions" },
  { slug: "privacy", name: "Privacy Policy" },
  { slug: "refunds", name: "Refund Policy" },
  { slug: "places-feature", name: "Places Feature Page" },
  { slug: "notify-feature", name: "Notify Feature Page" },
  { slug: "settings-feature", name: "Settings Feature Page" },
  { slug: "future-feature", name: "Future R&D Feature Page" },
  { slug: "later-feature", name: "Do-It-Later Feature Page" },
];

function SuperAdminCMSView() {
  const [selectedSlug, setSelectedSlug] = useState<string>("home");
  const [pageName, setPageName] = useState<string>("Home Page");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [blocks, setBlocks] = useState<CMSBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder");

  useEffect(() => {
    loadPageData(selectedSlug);
  }, [selectedSlug]);

  const loadPageData = async (slug: string) => {
    setLoading(true);
    setSavedMsg(null);
    try {
      const res = await getMarketingPageFn({ data: { slug } });
      const meta = MARKETING_PAGES_LIST.find((p) => p.slug === slug);
      if (res.page) {
        setPageName(res.page.page_name || meta?.name || slug);
        setMetaTitle(res.page.meta_title || "");
        setMetaDescription(res.page.meta_description || "");
        setBlocks(res.page.blocks || []);
      } else {
        setPageName(meta?.name || slug);
        setMetaTitle("");
        setMetaDescription("");
        setBlocks(getInitialDefaultBlocks(slug));
      }
    } catch (e) {
      console.error("Failed loading CMS page", e);
    } finally {
      setLoading(false);
    }
  };

  const getInitialDefaultBlocks = (slug: string): CMSBlock[] => {
    return [
      {
        id: `heading-${Date.now()}`,
        type: "heading",
        tag: "h1",
        eyebrowText: "WELCOME TO MINDROP",
        text: `Dynamic Content for ${slug.toUpperCase()}`,
        style: {
          fontSize: "48px",
          fontWeight: "bold",
          textAlign: "center",
          color: "#0F172A",
        },
      },
      {
        id: `grid-${Date.now()}`,
        type: "card_grid",
        sectionTitle: "Key Features & Cards",
        sectionTitleTag: "h2",
        layoutConfig: { columns: "auto-fit", minCardWidth: "280px", gap: "24px" },
        cards: [
          {
            id: `c1-${Date.now()}`,
            title: "Dynamic Feature 1",
            description: "Super Admin editable card content rendering live on front-end.",
            badgeText: "NEW",
            badgeColor: "#DBEAFE",
          },
          {
            id: `c2-${Date.now()}`,
            title: "Dynamic Feature 2",
            description: "Auto-rebalancing box layout re-adjusts when cards are added or removed.",
            badgeText: "LIVE",
            badgeColor: "#D1FAE5",
          },
        ],
      },
    ];
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg(null);
    try {
      await saveMarketingPageFn({
        data: {
          slug: selectedSlug,
          page_name: pageName,
          meta_title: metaTitle,
          meta_description: metaDescription,
          blocks,
          is_published: true,
        },
      });
      setSavedMsg(`Successfully published changes to ${pageName}!`);
      setTimeout(() => setSavedMsg(null), 4000);
    } catch (err: any) {
      alert(`Save error: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const addHeadingBlock = () => {
    const newBlock: HeadingBlock = {
      id: `heading-${Date.now()}`,
      type: "heading",
      tag: "h2",
      eyebrowText: "EYEBROW BADGE",
      text: "New Editable Headline",
      style: {
        fontSize: "36px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#0F172A",
      },
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const addGridBlock = () => {
    const newBlock: CardGridBlock = {
      id: `grid-${Date.now()}`,
      type: "card_grid",
      sectionTitle: "Card Grid Section",
      layoutConfig: { columns: "auto-fit", minCardWidth: "280px", gap: "24px" },
      cards: [
        {
          id: `c-${Date.now()}`,
          title: "New Card Title",
          description: "Card description text editable in Super Admin.",
        },
      ],
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const addCtaBlock = () => {
    const newBlock: CtaBandBlock = {
      id: `cta-${Date.now()}`,
      type: "cta_band",
      title: "Ready to Take Action?",
      subtitle: "Join thousands of users building an offline second brain today.",
      buttonText: "Get MinDrop App",
      buttonLink: "/download",
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const addFaqBlock = () => {
    const newBlock: FaqBlock = {
      id: `faq-${Date.now()}`,
      type: "faq_list",
      title: "Frequently Asked Questions",
      items: [
        {
          id: `faq-1-${Date.now()}`,
          question: "How does local storage work?",
          answer: "MinDrop stores everything directly on your local device with zero cloud tracking.",
        },
      ],
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const copy = [...blocks];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setBlocks(copy);
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <AdminShell title="CMS & Marketing Page Builder">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Top Control Bar */}
        <div className="bg-white border-3 border-ink rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <label className="text-xs font-black uppercase tracking-wider text-ink/70 shrink-0">
              Select Page:
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-2xl border-2 border-ink bg-canvas font-black text-sm text-ink focus:outline-none"
            >
              {MARKETING_PAGES_LIST.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} ({p.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex bg-canvas border-2 border-ink rounded-2xl p-1 shrink-0">
              <button
                onClick={() => setActiveTab("builder")}
                className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${
                  activeTab === "builder" ? "bg-brand text-white shadow-sm" : "text-ink/70"
                }`}
              >
                <Layout className="size-3.5 inline mr-1" /> Editor
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${
                  activeTab === "preview" ? "bg-brand text-white shadow-sm" : "text-ink/70"
                }`}
              >
                <Eye className="size-3.5 inline mr-1" /> Live Preview
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-emerald-700 transition active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 cursor-pointer shrink-0"
            >
              {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
              Publish Changes
            </button>
          </div>
        </div>

        {savedMsg && (
          <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-800 font-bold text-sm flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-600" /> {savedMsg}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-ink/60 font-bold flex flex-col items-center gap-3">
            <RefreshCw className="size-8 animate-spin text-brand" />
            Loading CMS content for {selectedSlug}...
          </div>
        ) : activeTab === "preview" ? (
          /* Live Preview Mode */
          <div className="bg-canvas border-3 border-ink rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[600px]">
            <div className="mb-6 pb-4 border-b border-ink/10 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-brand">
                LIVE FRONTEND PREVIEW · /{selectedSlug}
              </span>
              <span className="text-xs font-semibold text-ink/60">
                {blocks.length} Block(s) Active
              </span>
            </div>
            <DynamicBlockRenderer blocks={blocks} />
          </div>
        ) : (
          /* Editor Mode */
          <div className="space-y-6">
            {/* Add Block Toolbar */}
            <div className="bg-white border-2 border-ink rounded-2xl p-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-ink/60 mr-2">
                Add Block:
              </span>
              <button
                onClick={addHeadingBlock}
                className="px-3.5 py-2 rounded-xl bg-canvas border border-ink text-ink font-bold text-xs hover:bg-brand hover:text-white transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Type className="size-3.5" /> Heading / Text
              </button>
              <button
                onClick={addGridBlock}
                className="px-3.5 py-2 rounded-xl bg-canvas border border-ink text-ink font-bold text-xs hover:bg-brand hover:text-white transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Grid className="size-3.5" /> Card Grid
              </button>
              <button
                onClick={addCtaBlock}
                className="px-3.5 py-2 rounded-xl bg-canvas border border-ink text-ink font-bold text-xs hover:bg-brand hover:text-white transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="size-3.5" /> CTA Band
              </button>
              <button
                onClick={addFaqBlock}
                className="px-3.5 py-2 rounded-xl bg-canvas border border-ink text-ink font-bold text-xs hover:bg-brand hover:text-white transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="size-3.5" /> FAQ Accordion
              </button>
            </div>

            {/* Blocks Inspector List */}
            {blocks.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-ink/30 rounded-3xl p-10 text-center text-ink/60 font-semibold">
                No content blocks on this page yet. Click "Add Block" above to begin.
              </div>
            ) : (
              blocks.map((block, idx) => {
                if (block.type === "heading") {
                  const hBlock = block as HeadingBlock;
                  return (
                    <div
                      key={hBlock.id}
                      className="bg-white border-3 border-ink rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4 relative"
                    >
                      <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                        <span className="text-xs font-black uppercase tracking-widest text-brand inline-flex items-center gap-2">
                          <span className="size-6 rounded-full bg-brand/10 text-brand grid place-items-center text-xs font-black">
                            {idx + 1}
                          </span>
                          HEADING BLOCK
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveBlock(idx, -1)}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg border border-ink/20 hover:bg-canvas disabled:opacity-30 cursor-pointer"
                          >
                            <MoveUp className="size-3.5" />
                          </button>
                          <button
                            onClick={() => moveBlock(idx, 1)}
                            disabled={idx === blocks.length - 1}
                            className="p-1.5 rounded-lg border border-ink/20 hover:bg-canvas disabled:opacity-30 cursor-pointer"
                          >
                            <MoveDown className="size-3.5" />
                          </button>
                          <button
                            onClick={() => deleteBlock(hBlock.id)}
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer ml-2"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            Heading Tag:
                          </label>
                          <select
                            value={hBlock.tag}
                            onChange={(e) => {
                              const val = e.target.value as HeadingTag;
                              setBlocks((prev) =>
                                prev.map((b) => (b.id === hBlock.id ? { ...b, tag: val } : b))
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-xs"
                          >
                            <option value="h1">H1 (Main Hero Heading)</option>
                            <option value="h2">H2 (Section Heading)</option>
                            <option value="h3">H3 (Sub-heading)</option>
                            <option value="h4">H4</option>
                            <option value="h5">H5</option>
                            <option value="p">Paragraph</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            Eyebrow Tag / Badge:
                          </label>
                          <input
                            type="text"
                            value={hBlock.eyebrowText || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks((prev) =>
                                prev.map((b) => (b.id === hBlock.id ? { ...b, eyebrowText: val } : b))
                              );
                            }}
                            placeholder="e.g. INDEX · ABOUT THE APP"
                            className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            Font Size (px):
                          </label>
                          <input
                            type="text"
                            value={hBlock.style?.fontSize || "36px"}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks((prev) =>
                                prev.map((b) =>
                                  b.id === hBlock.id
                                    ? { ...b, style: { ...(b as HeadingBlock).style, fontSize: val } }
                                    : b
                                )
                              );
                            }}
                            placeholder="36px"
                            className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-xs"
                          />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            Headline Text:
                          </label>
                          <textarea
                            rows={2}
                            value={hBlock.text}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks((prev) =>
                                prev.map((b) => (b.id === hBlock.id ? { ...b, text: val } : b))
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            Font Weight:
                          </label>
                          <select
                            value={hBlock.style?.fontWeight || "bold"}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setBlocks((prev) =>
                                prev.map((b) =>
                                  b.id === hBlock.id
                                    ? { ...b, style: { ...(b as HeadingBlock).style, fontWeight: val } }
                                    : b
                                )
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-xs"
                          >
                            <option value="normal">Normal</option>
                            <option value="medium">Medium</option>
                            <option value="semibold">Semibold</option>
                            <option value="bold">Bold</option>
                            <option value="800">Extra Bold (800)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            Font Style:
                          </label>
                          <select
                            value={hBlock.style?.fontStyle || "normal"}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setBlocks((prev) =>
                                prev.map((b) =>
                                  b.id === hBlock.id
                                    ? { ...b, style: { ...(b as HeadingBlock).style, fontStyle: val } }
                                    : b
                                )
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-xs"
                          >
                            <option value="normal">Normal</option>
                            <option value="italic">Italic</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            Text Color:
                          </label>
                          <input
                            type="color"
                            value={hBlock.style?.color || "#0F172A"}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks((prev) =>
                                prev.map((b) =>
                                  b.id === hBlock.id
                                    ? { ...b, style: { ...(b as HeadingBlock).style, color: val } }
                                    : b
                                )
                              );
                            }}
                            className="w-full h-9 rounded-xl border border-ink bg-canvas cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                if (block.type === "card_grid") {
                  const gBlock = block as CardGridBlock;
                  return (
                    <div
                      key={gBlock.id}
                      className="bg-white border-3 border-ink rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4 relative"
                    >
                      <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                        <span className="text-xs font-black uppercase tracking-widest text-brand inline-flex items-center gap-2">
                          <span className="size-6 rounded-full bg-brand/10 text-brand grid place-items-center text-xs font-black">
                            {idx + 1}
                          </span>
                          CARD GRID BLOCK
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveBlock(idx, -1)}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg border border-ink/20 hover:bg-canvas disabled:opacity-30 cursor-pointer"
                          >
                            <MoveUp className="size-3.5" />
                          </button>
                          <button
                            onClick={() => moveBlock(idx, 1)}
                            disabled={idx === blocks.length - 1}
                            className="p-1.5 rounded-lg border border-ink/20 hover:bg-canvas disabled:opacity-30 cursor-pointer"
                          >
                            <MoveDown className="size-3.5" />
                          </button>
                          <button
                            onClick={() => deleteBlock(gBlock.id)}
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer ml-2"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-ink/70 block mb-1">
                              Section Title:
                            </label>
                            <input
                              type="text"
                              value={gBlock.sectionTitle || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBlocks((prev) =>
                                  prev.map((b) =>
                                    b.id === gBlock.id ? { ...b, sectionTitle: val } : b
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-ink/70 block mb-1">
                              Grid Columns Rule:
                            </label>
                            <select
                              value={gBlock.layoutConfig.columns}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setBlocks((prev) =>
                                  prev.map((b) =>
                                    b.id === gBlock.id
                                      ? {
                                          ...b,
                                          layoutConfig: {
                                            ...(b as CardGridBlock).layoutConfig,
                                            columns: val,
                                          },
                                        }
                                      : b
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-xs"
                            >
                              <option value="auto-fit">Auto-Fit (Responsive Auto-Layout)</option>
                              <option value="1">1 Column</option>
                              <option value="2">2 Columns</option>
                              <option value="3">3 Columns</option>
                              <option value="4">4 Columns</option>
                            </select>
                          </div>
                        </div>

                        {/* Cards List */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink/70">
                              Cards ({gBlock.cards.length}):
                            </span>
                            <button
                              onClick={() => {
                                const newCard: CardItem = {
                                  id: `c-${Date.now()}`,
                                  title: "New Card Title",
                                  description: "Description for this new dynamic box.",
                                };
                                setBlocks((prev) =>
                                  prev.map((b) =>
                                    b.id === gBlock.id
                                      ? {
                                          ...b,
                                          cards: [...(b as CardGridBlock).cards, newCard],
                                        }
                                      : b
                                  )
                                );
                              }}
                              className="px-3 py-1 rounded-lg bg-canvas border border-ink text-xs font-bold hover:bg-brand hover:text-white transition cursor-pointer"
                            >
                              + Add Card
                            </button>
                          </div>

                          {gBlock.cards.map((card, cIdx) => (
                            <div
                              key={card.id || cIdx}
                              className="p-3.5 rounded-2xl bg-canvas border border-ink/30 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-brand">
                                  Card #{cIdx + 1}
                                </span>
                                <button
                                  onClick={() => {
                                    setBlocks((prev) =>
                                      prev.map((b) =>
                                        b.id === gBlock.id
                                          ? {
                                              ...b,
                                              cards: (b as CardGridBlock).cards.filter(
                                                (c) => c.id !== card.id
                                              ),
                                            }
                                          : b
                                      )
                                    );
                                  }}
                                  className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                                >
                                  Delete Card
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={card.title}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setBlocks((prev) =>
                                      prev.map((b) =>
                                        b.id === gBlock.id
                                          ? {
                                              ...b,
                                              cards: (b as CardGridBlock).cards.map((c) =>
                                                c.id === card.id ? { ...c, title: val } : c
                                              ),
                                            }
                                          : b
                                      )
                                    );
                                  }}
                                  placeholder="Card Title"
                                  className="px-3 py-1.5 rounded-xl border border-ink bg-white font-bold text-xs"
                                />

                                <input
                                  type="text"
                                  value={card.badgeText || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setBlocks((prev) =>
                                      prev.map((b) =>
                                        b.id === gBlock.id
                                          ? {
                                              ...b,
                                              cards: (b as CardGridBlock).cards.map((c) =>
                                                c.id === card.id ? { ...c, badgeText: val } : c
                                              ),
                                            }
                                          : b
                                      )
                                    );
                                  }}
                                  placeholder="Badge Tag (e.g. NEW)"
                                  className="px-3 py-1.5 rounded-xl border border-ink bg-white font-bold text-xs"
                                />

                                <textarea
                                  rows={2}
                                  value={card.description}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setBlocks((prev) =>
                                      prev.map((b) =>
                                        b.id === gBlock.id
                                          ? {
                                              ...b,
                                              cards: (b as CardGridBlock).cards.map((c) =>
                                                c.id === card.id ? { ...c, description: val } : c
                                              ),
                                            }
                                          : b
                                      )
                                    );
                                  }}
                                  placeholder="Card Body Description"
                                  className="sm:col-span-2 px-3 py-1.5 rounded-xl border border-ink bg-white font-bold text-xs"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (block.type === "cta_band") {
                  const cBlock = block as CtaBandBlock;
                  return (
                    <div
                      key={cBlock.id}
                      className="bg-white border-3 border-ink rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4 relative"
                    >
                      <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                        <span className="text-xs font-black uppercase tracking-widest text-brand inline-flex items-center gap-2">
                          <span className="size-6 rounded-full bg-brand/10 text-brand grid place-items-center text-xs font-black">
                            {idx + 1}
                          </span>
                          CTA BAND BLOCK
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveBlock(idx, -1)}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg border border-ink/20 hover:bg-canvas disabled:opacity-30 cursor-pointer"
                          >
                            <MoveUp className="size-3.5" />
                          </button>
                          <button
                            onClick={() => moveBlock(idx, 1)}
                            disabled={idx === blocks.length - 1}
                            className="p-1.5 rounded-lg border border-ink/20 hover:bg-canvas disabled:opacity-30 cursor-pointer"
                          >
                            <MoveDown className="size-3.5" />
                          </button>
                          <button
                            onClick={() => deleteBlock(cBlock.id)}
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer ml-2"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            CTA Title:
                          </label>
                          <input
                            type="text"
                            value={cBlock.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks((prev) =>
                                prev.map((b) => (b.id === cBlock.id ? { ...b, title: val } : b))
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-sm"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            CTA Subtitle:
                          </label>
                          <input
                            type="text"
                            value={cBlock.subtitle || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks((prev) =>
                                prev.map((b) => (b.id === cBlock.id ? { ...b, subtitle: val } : b))
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            Button Text:
                          </label>
                          <input
                            type="text"
                            value={cBlock.buttonText}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks((prev) =>
                                prev.map((b) =>
                                  b.id === cBlock.id ? { ...b, buttonText: val } : b
                                )
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-ink/70 block mb-1">
                            Button Link URL:
                          </label>
                          <input
                            type="text"
                            value={cBlock.buttonLink}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks((prev) =>
                                prev.map((b) =>
                                  b.id === cBlock.id ? { ...b, buttonLink: val } : b
                                )
                              );
                            }}
                            placeholder="/download"
                            className="w-full px-3 py-2 rounded-xl border border-ink bg-canvas font-bold text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
