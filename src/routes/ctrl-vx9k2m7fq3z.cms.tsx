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
  ChevronDown,
  ChevronUp,
  Columns,
  Plus,
  Palette,
  Sliders,
} from "lucide-react";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/cms")({
  component: SuperAdminCMSView,
});

const MARKETING_PAGES_LIST = [
  { slug: "home", name: "Home Page" },
  { slug: "about", name: "About Page" },
  { slug: "pricing", name: "Pricing & Plans" },
  { slug: "faq", name: "FAQ & Help Center" },
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

const PRESET_COLORS = [
  { label: "Ink Dark", hex: "#0F172A" },
  { label: "Brand Blue", hex: "#2563EB" },
  { label: "Emerald", hex: "#059669" },
  { label: "Amber", hex: "#D97706" },
  { label: "Rose", hex: "#E11D48" },
  { label: "Purple", hex: "#7C3AED" },
  { label: "Pink", hex: "#DB2777" },
];

const FONT_SIZE_PRESETS = ["18px", "24px", "36px", "48px", "64px"];

function SuperAdminCMSView() {
  const [selectedSlug, setSelectedSlug] = useState<string>("pricing");
  const [pageName, setPageName] = useState<string>("Pricing & Plans");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [blocks, setBlocks] = useState<CMSBlock[]>([]);
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"editor" | "split" | "preview">("split");

  useEffect(() => {
    loadPageData(selectedSlug);
  }, [selectedSlug]);

  const loadPageData = async (slug: string) => {
    setLoading(true);
    setSavedMsg(null);
    try {
      const res = await getMarketingPageFn({ data: { slug } });
      const meta = MARKETING_PAGES_LIST.find((p) => p.slug === slug);
      if (res.page && res.page.blocks && res.page.blocks.length > 0) {
        setPageName(res.page.page_name || meta?.name || slug);
        setMetaTitle(res.page.meta_title || "");
        setMetaDescription(res.page.meta_description || "");
        setBlocks(res.page.blocks);
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

  /**
   * 100% VERBATIM LINE-BY-LINE APP COPY FROM THE SOURCE ROUTE TEMPLATES
   */
  const getInitialDefaultBlocks = (slug: string): CMSBlock[] => {
    switch (slug) {
      case "pricing":
        return [
          {
            id: "pricing-hero",
            type: "heading",
            tag: "h1",
            eyebrowText: "💎 PREMIUM PLANS",
            text: "Keep it free, or unlock limits.",
            style: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#831843" },
          },
          {
            id: "pricing-plans-grid",
            type: "card_grid",
            sectionTitle: "Clear pricing. Simple structure.",
            layoutConfig: { columns: "2", minCardWidth: "280px", gap: "24px" },
            cards: [
              {
                id: "free-plan-card",
                title: "Free Tier — Free Forever",
                description:
                  "Up to 3 active alarms · Up to 3 notification filter rules · Up to 3 saved places / locations · Voice capture & offline photo storage.",
                badgeText: "FREE TIER",
                badgeColor: "#F3F4F6",
              },
              {
                id: "premium-plan-card",
                title: "Premium Plan — Yearly Plan",
                description:
                  "Infinite active alarms · Infinite notification filter rules · Infinite saved places / locations · Private Google Drive cloud backup sync.",
                badgeText: "PREMIUM",
                badgeColor: "#FCE7F3",
              },
            ],
          },
          {
            id: "pricing-flow-grid",
            type: "card_grid",
            sectionTitle: "How your upgrade works",
            layoutConfig: { columns: "3", minCardWidth: "240px", gap: "20px" },
            cards: [
              {
                id: "step-1",
                title: "01 / Download — Get Free App",
                description:
                  "Runs offline. Set up to 3 alarms, filters, & locations.",
                badgeText: "STEP 1",
              },
              {
                id: "step-2",
                title: "02 / Subscribe — Yearly Plan",
                description:
                  "Unlock settings securely via in-app dashboard.",
                badgeText: "STEP 2",
              },
              {
                id: "step-3",
                title: "03 / Enjoy — Unlimited Slots",
                description:
                  "Enjoy geofences and cloud sync instantly.",
                badgeText: "STEP 3",
              },
            ],
          },
          {
            id: "pricing-specs-grid",
            type: "card_grid",
            sectionTitle: "An engine built to last.",
            layoutConfig: { columns: "3", minCardWidth: "240px", gap: "20px" },
            cards: [
              {
                id: "spec-1",
                title: "Subscription Simplicity",
                description:
                  "Clearly visible terms with zero hidden fees. Complete control of plan adjustments.",
                badgeText: "TRANSPARENT",
              },
              {
                id: "spec-2",
                title: "Offline Verification",
                description:
                  "Settings checks are stored locally on-device. No query delays or server locks.",
                badgeText: "OFFLINE FIRST",
              },
              {
                id: "spec-3",
                title: "Privacy Sync",
                description:
                  "Backup loops directly through your Google Drive. We never see your data.",
                badgeText: "DATA SOVEREIGNTY",
              },
            ],
          },
          {
            id: "pricing-cta",
            type: "cta_band",
            title: "Take MinDrop Home",
            subtitle: "App subscriptions are tiring. MinDrop is built as a utility. Pay once, use forever.",
            buttonText: "Take MinDrop Home",
            buttonLink: "/download",
          },
        ];

      case "about":
        return [
          {
            id: "about-hero",
            type: "heading",
            tag: "h1",
            eyebrowText: "📖 INDEX · ABOUT THE APP",
            text: "Your mind is for having ideas, not holding them. MinDrop is your second brain.",
            style: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#0F172A" },
          },
          {
            id: "about-problem-heading",
            type: "heading",
            tag: "h2",
            eyebrowText: "THE PROBLEM WITH EVERYDAY MICRO-THOUGHTS",
            text: "Small tasks create big mental fatigue. MinDrop unburdens your mind.",
            style: { fontSize: "36px", fontWeight: "bold", textAlign: "left", color: "#0284C7" },
          },
          {
            id: "about-features-grid",
            type: "card_grid",
            sectionTitle: "Zero setup friction. Pure execution.",
            layoutConfig: { columns: "3", minCardWidth: "260px", gap: "20px" },
            cards: [
              {
                id: "af1",
                title: "Lightning Fast",
                description:
                  "No bloated project boards or complex date pickers. Type or drop a note and carry on with your day.",
                badgeText: "CH. 01",
              },
              {
                id: "af2",
                title: "Instant Focus",
                description:
                  "Keeps your attention anchored on what you are doing right now, knowing MinDrop won't let you forget.",
                badgeText: "CH. 02",
              },
              {
                id: "af3",
                title: "Pure Reliability",
                description:
                  "Built for instant launch on Android so you can drop micro-tasks the second inspiration strikes.",
                badgeText: "CH. 03",
              },
            ],
          },
          {
            id: "about-arch-heading",
            type: "heading",
            tag: "h2",
            eyebrowText: "HARDWARE-NATIVE ARCHITECTURE",
            text: "Built directly on Android's native APIs. WorkManager, local SQLite databases, and continuous audio channels.",
            style: { fontSize: "32px", fontWeight: "bold", textAlign: "left", color: "#0F172A" },
          },
          {
            id: "about-cta-bridge",
            type: "cta_band",
            title: "Ready to see how MinDrop silences noise?",
            subtitle: "Now that you know what MinDrop is, discover how smart keyword rules convert essential notifications into un-missable alarms.",
            buttonText: "Silence Noise & Catch Emergencies",
            buttonLink: "/notify-feature",
          },
        ];

      case "faq":
        return [
          {
            id: "faq-hero",
            type: "heading",
            tag: "h1",
            eyebrowText: "🛡️ HELP CENTER",
            text: "Have questions about MinDrop? Get answers instantly.",
            style: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#064E3B" },
          },
          {
            id: "faq-accordion-block",
            type: "faq_list",
            title: "Frequently Asked Questions",
            items: [
              {
                id: "fq1",
                question: "Is my task data private and secure?",
                answer:
                  "Yes. MinDrop uses a zero-knowledge local model. Your notes, voice recordings, and pictures sit inside a secure SQLite database on your phone. We have no servers, no ads, and zero access to your information.",
              },
              {
                id: "fq2",
                question: "How does the private Google Drive sync work?",
                answer:
                  "If you purchase Premium, backups sync straight to your private Google Drive space. The connection is direct between your phone and Google. We cannot see your files or credentials.",
              },
              {
                id: "fq3",
                question: "Will background tracking drain my phone battery?",
                answer:
                  "No. Standard tracking keeps GPS running continuously, draining battery quickly. MinDrop registers geofences with the operating system, allowing the OS to wake the app up only when cell towers note movement.",
              },
              {
                id: "fq4",
                question: "How does location geofencing work offline?",
                answer:
                  "MinDrop integrates with native OS Geofencing. We register boundaries (e.g., home or market) locally. The phone monitors these boundaries offline without uploading your coordinates to any web services.",
              },
              {
                id: "fq5",
                question: "How do Notify filters read incoming notifications?",
                answer:
                  "MinDrop uses Android's Notification Listener Service. This runs locally on your phone to scan incoming alerts. If it matches your custom word rules, it triggers the alarm. No data is collected.",
              },
              {
                id: "fq6",
                question: "What happens to my scheduled alarms on phone reboot?",
                answer:
                  "MinDrop listens for device startup handshakes. When your phone restarts, a local background sweep automatically schedules your alarms so they remain active.",
              },
            ],
          },
        ];

      case "download":
        return [
          {
            id: "download-hero",
            type: "heading",
            tag: "h1",
            eyebrowText: "🤖 ANDROID FIRST · CHAPTER 08",
            text: "Sorry iPhone Friends. Your Notch Isn't Ready.",
            style: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#2563EB" },
          },
          {
            id: "download-intro",
            type: "heading",
            tag: "p",
            eyebrowText: "RAW LOCAL POWER",
            text: "We love sleek glass phones and dynamic islands, but MinDrop needs raw local power without background task throttles. Android gives us background geofence sweeps, continuous looping alarms, and instant local SQLite access.",
            style: { fontSize: "20px", fontWeight: "normal", textAlign: "center", color: "#0F172A" },
          },
          {
            id: "download-sovereignty-grid",
            type: "card_grid",
            sectionTitle: "100% Local Data Sovereignty",
            layoutConfig: { columns: "3", minCardWidth: "240px", gap: "20px" },
            cards: [
              {
                id: "dl1",
                title: "No Cloud DB",
                description: "No database servers collecting your personal drops or notes.",
                badgeText: "NO TELEMETRY",
              },
              {
                id: "dl2",
                title: "DPDP Compliant",
                description: "Built from day one to respect user data sovereignty completely.",
                badgeText: "PRIVACY SOVEREIGNTY",
              },
              {
                id: "dl3",
                title: "Instant Access",
                description: "No login delays or server outage dependencies ever.",
                badgeText: "ALWAYS AVAILABLE",
              },
            ],
          },
          {
            id: "download-cta",
            type: "cta_band",
            title: "Your Mind Deserves a Second Brain.",
            subtitle: "We are fine-tuning the ultimate zero-cloud, instant-action companion. Zero cloud tracking, zero subscription traps—just pure mental peace in your pocket.",
            buttonText: "Coming Soon to Google Play",
            buttonLink: "/download",
          },
        ];

      case "home":
      default:
        return [
          {
            id: `${slug}-hero`,
            type: "heading",
            tag: "h1",
            eyebrowText: "🤖 ANDROID FIRST · A KIND SECOND BRAIN",
            text: "Carry the small things your brain shouldn't have to.",
            style: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#0F172A" },
          },
          {
            id: `${slug}-grid`,
            type: "card_grid",
            sectionTitle: "Built For Peace Of Mind",
            layoutConfig: { columns: "3", minCardWidth: "260px", gap: "20px" },
            cards: [
              {
                id: "h1",
                title: "Offline-First Architecture",
                description:
                  "Zero cloud tracking. Your memories stay strictly on your device encrypted with SQLite.",
                badgeText: "PRIVACY SOVEREIGNTY",
              },
              {
                id: "h2",
                title: "Smart Geofences",
                description:
                  "Automatic triggers at home, grocery store, or office based on passive location.",
                badgeText: "LOCATION AWARE",
              },
              {
                id: "h3",
                title: "Notification Filters",
                description:
                  "Never miss urgent reminders while keeping noise filtered out automatically.",
                badgeText: "CALM TECH",
              },
            ],
          },
          {
            id: `${slug}-cta`,
            type: "cta_band",
            title: "Build Your Offline Second Brain",
            subtitle: "Download MinDrop today and start capturing thoughts effortlessly.",
            buttonText: "Take MinDrop Home",
            buttonLink: "/download",
          },
        ];
    }
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

  const toggleCollapse = (id: string) => {
    setCollapsedBlocks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addHeadingBlock = () => {
    const id = `heading-${Date.now()}`;
    const newBlock: HeadingBlock = {
      id,
      type: "heading",
      tag: "h2",
      eyebrowText: "SECTION HEADER",
      text: "New Headline Text",
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
    const id = `grid-${Date.now()}`;
    const newBlock: CardGridBlock = {
      id,
      type: "card_grid",
      sectionTitle: "Card Grid Section",
      layoutConfig: { columns: "3", minCardWidth: "280px", gap: "24px" },
      cards: [
        {
          id: `c-${Date.now()}`,
          title: "New Feature Card",
          description: "Add card body text here...",
        },
      ],
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const addCtaBlock = () => {
    const id = `cta-${Date.now()}`;
    const newBlock: CtaBandBlock = {
      id,
      type: "cta_band",
      title: "Ready to Get Started?",
      subtitle: "Experience the simplest way to manage your tasks.",
      buttonText: "Get MinDrop App",
      buttonLink: "/download",
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const addFaqBlock = () => {
    const id = `faq-${Date.now()}`;
    const newBlock: FaqBlock = {
      id,
      type: "faq_list",
      title: "Frequently Asked Questions",
      items: [
        {
          id: `faq-1-${Date.now()}`,
          question: "How does local storage work?",
          answer: "MinDrop stores data directly on your device with zero cloud tracking.",
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
    <AdminShell title="CMS & Page Builder">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Top Floating Action Bar */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-4 z-40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Editing Page:
            </span>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 transition"
            >
              {MARKETING_PAGES_LIST.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} (/{p.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setViewMode("editor")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                  viewMode === "editor"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Sliders className="size-3.5" /> Editor Only
              </button>
              <button
                onClick={() => setViewMode("split")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                  viewMode === "split"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Columns className="size-3.5" /> Split View
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                  viewMode === "preview"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Eye className="size-3.5" /> Live Preview
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
              Publish Changes
            </button>
          </div>
        </div>

        {savedMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" /> {savedMsg}
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center text-slate-500 font-bold flex flex-col items-center gap-3 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <RefreshCw className="size-8 animate-spin text-brand" />
            Loading content for /{selectedSlug}...
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "split"
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {/* Editor Workspace */}
            {(viewMode === "editor" || viewMode === "split") && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Add Content Block:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={addHeadingBlock}
                      className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-brand hover:text-white border border-slate-200 text-slate-700 font-bold text-xs transition inline-flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Type className="size-4 text-brand group-hover:text-white" /> + Headline / Text
                    </button>
                    <button
                      onClick={addGridBlock}
                      className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-brand hover:text-white border border-slate-200 text-slate-700 font-bold text-xs transition inline-flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Grid className="size-4 text-sky-500" /> + Card Grid
                    </button>
                    <button
                      onClick={addCtaBlock}
                      className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-brand hover:text-white border border-slate-200 text-slate-700 font-bold text-xs transition inline-flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="size-4 text-amber-500" /> + CTA Banner
                    </button>
                    <button
                      onClick={addFaqBlock}
                      className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-brand hover:text-white border border-slate-200 text-slate-700 font-bold text-xs transition inline-flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <HelpCircle className="size-4 text-purple-500" /> + FAQ Accordion
                    </button>
                  </div>
                </div>

                {blocks.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500 font-semibold shadow-sm">
                    No content blocks added yet. Click an "Add" button above to start editing.
                  </div>
                ) : (
                  blocks.map((block, idx) => {
                    const isCollapsed = collapsedBlocks[block.id];

                    if (block.type === "heading") {
                      const hBlock = block as HeadingBlock;
                      return (
                        <div
                          key={hBlock.id}
                          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all"
                        >
                          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="size-7 rounded-lg bg-brand/10 text-brand font-black text-xs grid place-items-center">
                                #{idx + 1}
                              </span>
                              <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                <Type className="size-4 text-brand" /> Headline Block
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveBlock(idx, -1)}
                                disabled={idx === 0}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <MoveUp className="size-4" />
                              </button>
                              <button
                                onClick={() => moveBlock(idx, 1)}
                                disabled={idx === blocks.length - 1}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <MoveDown className="size-4" />
                              </button>
                              <button
                                onClick={() => toggleCollapse(hBlock.id)}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 cursor-pointer"
                              >
                                {isCollapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
                              </button>
                              <button
                                onClick={() => deleteBlock(hBlock.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer ml-1"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>

                          {!isCollapsed && (
                            <div className="p-5 space-y-5">
                              <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                                  Headline Content:
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
                                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                                  placeholder="Enter headline text..."
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                                    HTML Tag:
                                  </label>
                                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                                    {(["h1", "h2", "h3", "h4", "p"] as HeadingTag[]).map((t) => (
                                      <button
                                        key={t}
                                        onClick={() => {
                                          setBlocks((prev) =>
                                            prev.map((b) => (b.id === hBlock.id ? { ...b, tag: t } : b))
                                          );
                                        }}
                                        className={`flex-1 py-1.5 rounded-lg font-black text-xs uppercase transition ${
                                          hBlock.tag === t
                                            ? "bg-white text-brand shadow-xs"
                                            : "text-slate-500 hover:text-slate-900"
                                        }`}
                                      >
                                        {t}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                                    Eyebrow Badge Text:
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
                                    placeholder="e.g. OVERVIEW"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-xs text-slate-800"
                                  />
                                </div>
                              </div>

                              <div className="pt-3 border-t border-slate-100 space-y-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                                  Typography & Color Styling:
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">
                                      Font Size:
                                    </label>
                                    <select
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
                                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs"
                                    >
                                      {FONT_SIZE_PRESETS.map((sz) => (
                                        <option key={sz} value={sz}>
                                          {sz}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">
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
                                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs"
                                    >
                                      <option value="normal">Normal</option>
                                      <option value="medium">Medium</option>
                                      <option value="semibold">Semibold</option>
                                      <option value="bold">Bold</option>
                                      <option value="800">Extra Bold</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">
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
                                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs"
                                    >
                                      <option value="normal">Regular</option>
                                      <option value="italic">Italic</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs font-bold text-slate-600 block mb-1.5">
                                    Text Color Preset:
                                  </label>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {PRESET_COLORS.map((c) => (
                                      <button
                                        key={c.hex}
                                        onClick={() => {
                                          setBlocks((prev) =>
                                            prev.map((b) =>
                                              b.id === hBlock.id
                                                ? { ...b, style: { ...(b as HeadingBlock).style, color: c.hex } }
                                                : b
                                            )
                                          );
                                        }}
                                        className={`size-7 rounded-full border-2 transition ${
                                          hBlock.style?.color === c.hex
                                            ? "border-brand scale-110 shadow-xs"
                                            : "border-transparent"
                                        }`}
                                        style={{ backgroundColor: c.hex }}
                                        title={c.label}
                                      />
                                    ))}
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
                                      className="size-7 rounded-full border border-slate-300 bg-transparent cursor-pointer p-0 overflow-hidden"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (block.type === "card_grid") {
                      const gBlock = block as CardGridBlock;
                      return (
                        <div
                          key={gBlock.id}
                          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all"
                        >
                          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="size-7 rounded-lg bg-sky-500/10 text-sky-600 font-black text-xs grid place-items-center">
                                #{idx + 1}
                              </span>
                              <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                <Grid className="size-4 text-sky-500" /> Card Grid Block ({gBlock.cards.length} Cards)
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveBlock(idx, -1)}
                                disabled={idx === 0}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <MoveUp className="size-4" />
                              </button>
                              <button
                                onClick={() => moveBlock(idx, 1)}
                                disabled={idx === blocks.length - 1}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <MoveDown className="size-4" />
                              </button>
                              <button
                                onClick={() => toggleCollapse(gBlock.id)}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 cursor-pointer"
                              >
                                {isCollapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
                              </button>
                              <button
                                onClick={() => deleteBlock(gBlock.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer ml-1"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>

                          {!isCollapsed && (
                            <div className="p-5 space-y-5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
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
                                    placeholder="e.g. Core Features"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Responsive Layout Rule:
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
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs"
                                  >
                                    <option value="auto-fit">Auto-Fit (Smart Dynamic Grid)</option>
                                    <option value="1">1 Column</option>
                                    <option value="2">2 Columns</option>
                                    <option value="3">3 Columns</option>
                                    <option value="4">4 Columns</option>
                                  </select>
                                </div>
                              </div>

                              <div className="space-y-3 pt-3 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Card Items:
                                  </span>
                                  <button
                                    onClick={() => {
                                      const newCard: CardItem = {
                                        id: `c-${Date.now()}`,
                                        title: "New Feature Card",
                                        description: "Add card body text here...",
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
                                    className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                                  >
                                    <Plus className="size-3.5" /> Add Card Box
                                  </button>
                                </div>

                                {gBlock.cards.map((card, cIdx) => (
                                  <div
                                    key={card.id || cIdx}
                                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-sky-600">
                                        Box #{cIdx + 1}
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
                                        className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                                      >
                                        Delete Box
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
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs"
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
                                        placeholder="Badge Tag (e.g. FREE TIER)"
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs"
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
                                        className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (block.type === "cta_band") {
                      const cBlock = block as CtaBandBlock;
                      return (
                        <div
                          key={cBlock.id}
                          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all"
                        >
                          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="size-7 rounded-lg bg-amber-500/10 text-amber-600 font-black text-xs grid place-items-center">
                                #{idx + 1}
                              </span>
                              <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                <Sparkles className="size-4 text-amber-500" /> Call To Action Band
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveBlock(idx, -1)}
                                disabled={idx === 0}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <MoveUp className="size-4" />
                              </button>
                              <button
                                onClick={() => moveBlock(idx, 1)}
                                disabled={idx === blocks.length - 1}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <MoveDown className="size-4" />
                              </button>
                              <button
                                onClick={() => toggleCollapse(cBlock.id)}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 cursor-pointer"
                              >
                                {isCollapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
                              </button>
                              <button
                                onClick={() => deleteBlock(cBlock.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer ml-1"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>

                          {!isCollapsed && (
                            <div className="p-5 space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
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
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-sm"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Subtitle:
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
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Button Label:
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
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Button Destination URL:
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
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (block.type === "faq_list") {
                      const fBlock = block as FaqBlock;
                      return (
                        <div
                          key={fBlock.id}
                          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all"
                        >
                          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="size-7 rounded-lg bg-purple-500/10 text-purple-600 font-black text-xs grid place-items-center">
                                #{idx + 1}
                              </span>
                              <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                <HelpCircle className="size-4 text-purple-500" /> FAQ Accordion Block ({fBlock.items.length} Questions)
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveBlock(idx, -1)}
                                disabled={idx === 0}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <MoveUp className="size-4" />
                              </button>
                              <button
                                onClick={() => moveBlock(idx, 1)}
                                disabled={idx === blocks.length - 1}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <MoveDown className="size-4" />
                              </button>
                              <button
                                onClick={() => toggleCollapse(fBlock.id)}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-500 cursor-pointer"
                              >
                                {isCollapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
                              </button>
                              <button
                                onClick={() => deleteBlock(fBlock.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer ml-1"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>

                          {!isCollapsed && (
                            <div className="p-5 space-y-4">
                              <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                  Section Title:
                                </label>
                                <input
                                  type="text"
                                  value={fBlock.title || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setBlocks((prev) =>
                                      prev.map((b) => (b.id === fBlock.id ? { ...b, title: val } : b))
                                    );
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-xs"
                                />
                              </div>

                              <div className="space-y-3 pt-2 border-t border-slate-100">
                                {fBlock.items.map((item, itemIdx) => (
                                  <div
                                    key={item.id || itemIdx}
                                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2"
                                  >
                                    <span className="text-xs font-bold text-purple-600 block">
                                      FAQ Item #{itemIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={item.question}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setBlocks((prev) =>
                                          prev.map((b) =>
                                            b.id === fBlock.id
                                              ? {
                                                  ...b,
                                                  items: (b as FaqBlock).items.map((it) =>
                                                    it.id === item.id ? { ...it, question: val } : it
                                                  ),
                                                }
                                              : b
                                          )
                                        );
                                      }}
                                      placeholder="Question"
                                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs"
                                    />
                                    <textarea
                                      rows={2}
                                      value={item.answer}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setBlocks((prev) =>
                                          prev.map((b) =>
                                            b.id === fBlock.id
                                              ? {
                                                  ...b,
                                                  items: (b as FaqBlock).items.map((it) =>
                                                    it.id === item.id ? { ...it, answer: val } : it
                                                  ),
                                                }
                                              : b
                                          )
                                        );
                                      }}
                                      placeholder="Answer"
                                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return null;
                  })
                )}
              </div>
            )}

            {/* Live Preview Panel */}
            {(viewMode === "preview" || viewMode === "split") && (
              <div className="bg-canvas border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[600px] flex flex-col">
                <div className="mb-6 pb-4 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-brand flex items-center gap-2">
                    <Eye className="size-4" /> Live Preview · /{selectedSlug}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {blocks.length} Active Block(s)
                  </span>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                  <DynamicBlockRenderer blocks={blocks} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
