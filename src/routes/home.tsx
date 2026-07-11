import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2, Pencil, Bell, AlarmClock, Sparkles, Clock, Mic } from "lucide-react";
import { CategoryChip } from "@/components/memory/CategoryChip";
import { VoicePlayer } from "@/components/memory/VoicePlayer";

import { CaptureBar } from "@/components/memory/CaptureBar";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { DoItLaterTabs } from "@/components/layout/DoItLaterTabs";
import { useDoItLaterSwipe } from "@/components/layout/useDoItLaterSwipe";
import { WelcomeBanner } from "@/components/memory/WelcomeBanner";
import { WelcomeTour, hasSeenTour } from "@/components/onboarding/WelcomeTour";
import { PageHeader } from "@/components/layout/PageHeader";
import { EditMemorySheet } from "@/components/memory/EditMemorySheet";
import { CaptureWizard, type CaptureSubmit } from "@/components/memory/CaptureWizard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
 AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
 AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { isPackOwnedMemory, isPersonalMemory, type Memory } from "@/lib/memoryos/types";
import { useOnboarding, useCategories, useMemories } from "@/lib/memoryos/store";
import { usePacks, usePackInstalls, type PackTemplate } from "@/lib/memoryos/packs";
import { useCustomPacks } from "@/lib/memoryos/customPacks";
import { PackTabs } from "@/components/memory/PackTabs";
import { AddPackThoughtSheet } from "@/components/packs/AddPackThoughtSheet";
import type { TemplateEditValue } from "@/components/packs/TemplateEditSheet";
import { Plus } from "lucide-react";
import { useCurrentGreeting } from "@/lib/memoryos/greetings";
import { RechallengeBanner } from "@/components/memory/RechallengeBanner";
import { useRecallUnlock, useRecallSuggestions, type RecallSuggestion } from "@/lib/memoryos/recall";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

export const Route = createFileRoute("/home")({ component: Home });

function packLabel(packs: ReturnType<typeof usePacks>["list"], id: string) {
 return packs.find((p) => p.id === id)?.name ?? "this pack";
}

function Home() {
 const navigate = useNavigate();
 const { accent1 } = useCountryTheme();
 const swipe = useDoItLaterSwipe();
 const { state, update, hydrated } = useOnboarding();
 const { list: categories } = useCategories();
 const { list: memoriesAll, add: addMemory, softDelete, update: updateMemory, persist: persistMemories } = useMemories();
 const { list: packs, addTemplate } = usePacks();
 const { list: customPacks, addSection } = useCustomPacks();
 const { installs, install, uninstall } = usePackInstalls();
 const [addingToPack, setAddingToPack] = useState<string | null>(null);
 
 const [viewing, setViewing] = useState<Memory | null>(null);
 const [tourOpen, setTourOpen] = useState(false);
 useEffect(() => { if (hydrated && state.onboarded && !hasSeenTour()) setTourOpen(true); }, [hydrated, state.onboarded]);
 const [editing, setEditing] = useState<Memory | null>(null);
 const [deleting, setDeleting] = useState<Memory | null>(null);
 const [removingPack, setRemovingPack] = useState<string | null>(null);
 
 const [filter, setFilter] = useState<string | null>(null);
 const [packTab, setPackTab] = useState<string>("all");
 const greeting = useCurrentGreeting();
 const { unlocked: recallUnlocked } = useRecallUnlock();
 const recallSuggestions = useRecallSuggestions();
 const recallKeySet = useMemo(() => {
 const s = new Set<string>();
 recallSuggestions.forEach((sug: RecallSuggestion) => {
 if (sug.rule.kind === "category") s.add(`cat:${sug.rule.sourceName.toLowerCase()}`);
 else s.add(`pack:${sug.rule.key}`);
 });
 return s;
 }, [recallSuggestions]);
 const hasRecallFor = (m: Memory) => {
 if (m.audioUrl || m.source?.kind === "recording") return false;
 if (m.source?.kind === "pack" && !isPersonalMemory(m)) return recallKeySet.has(`pack:${m.source.packId}`);
 return recallKeySet.has(`cat:${(m.category || "").toLowerCase()}`);
 };

 // Auto-archive expired reminders every 30s
 useEffect(() => {
 const tick = () => {
 const now = Date.now();
 let changed = false;
 const next = memoriesAll.map((m) => {
 if (m.archivedAt || m.deletedAt || !m.dueAt) return m;
 if (new Date(m.dueAt).getTime() > now) return m;
 if (m.recurrence === "daily") {
 const d = new Date(m.dueAt); d.setDate(d.getDate() + 1);
 changed = true;
 return { ...m, dueAt: d.toISOString() };
 }
 changed = true;
 return { ...m, archivedAt: new Date().toISOString() };
 });
 if (changed) persistMemories(next);
 };
 tick();
 const id = window.setInterval(tick, 30_000);
 return () => window.clearInterval(id);
 }, [memoriesAll, persistMemories]);

 // Only active (not archived / deleted) show in Later
 const memories = memoriesAll.filter((m) => !m.archivedAt && !m.deletedAt);

 const catByLabel = new Map(categories.map((c) => [c.label, c]));
 const catById = new Map(categories.map((c) => [c.id, c]));
 const installedPacks = packs.filter((p) => installs.some((i) => i.packId === p.id));
 const installedPackTabs = installedPacks;
 const originalTemplateIdsByPack = useMemo(
 () => new Map(packs.map((p) => [p.id, new Set(p.templates.map((t) => t.id))])),
 [packs]
 );
 const customPackIds = useMemo(() => new Set(customPacks.map((p) => p.id)), [customPacks]);
 const matchesPackMemory = (m: Memory, packId: string) => {
 if (customPackIds.has(packId)) return false;
 return isPackOwnedMemory(m, packId, originalTemplateIdsByPack.get(packId));
 };
 const countsByPack: Record<string, number> = Object.fromEntries(
 installedPackTabs.map((p) => [p.id, memories.filter((m) => matchesPackMemory(m, p.id)).length])
 );
 const capturesCount = memories.filter(isPersonalMemory).length;

 let scoped = memories;
 if (packTab === "captures") scoped = memories.filter(isPersonalMemory);
 else if (packTab !== "all") scoped = memories.filter((m) => matchesPackMemory(m, packTab));
 const usedCats = Array.from(new Set(scoped.map((m) => m.category).filter(Boolean))) as string[];
 const visibleMemories = filter ? scoped.filter((m) => m.category === filter) : scoped;

 // Splash is now decoupled from onboarding — it fires once per install from
 // the native boot path (src/routes/index.tsx). Home no longer auto-redirects.

 const limit = state.plan === "free" ? 5 : Infinity;
 const onCapture = (d: CaptureSubmit) => {
 if (capturesCount >= limit) { navigate({ to: "/paywall" }); return; }
 const now = new Date();
 const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
 addMemory({
 id: `m-${Date.now()}`,
 time,
 date: d.when,
 text: d.text,
 tags: ["Actionable"],
 category: d.category,
 notify: d.notify,
 imageUrl: d.imageUrl,
 audioUrl: d.audioUrl,
 audioDuration: d.audioDuration,
 dueAt: d.dueAt,
 recurrence: d.recurrence,
 until: d.until,
 source: d.kind === "recording" ? { kind: "recording" } : { kind: "capture" },
 });
 };
 const confirmDelete = () => {
 if (!deleting) return;
 softDelete(deleting.id);
 setDeleting(null);
 };
 const confirmRemovePack = () => {
 if (!removingPack) return;
 persistMemories(memoriesAll.filter((m) => !matchesPackMemory(m, removingPack)));
 uninstall(removingPack);
 if (packTab === removingPack) setPackTab("all");
 setRemovingPack(null);
 };

 const customPackForAdd = customPacks.find((p) => p.id === addingToPack) ?? null;
 const customWizardPack = customPackForAdd ? {
 id: customPackForAdd.id,
 name: customPackForAdd.name,
 emoji: customPackForAdd.emoji,
 shortDesc: customPackForAdd.shortDesc,
 longDesc: customPackForAdd.shortDesc,
 primaryCategoryId: customPackForAdd.name,
 benefitBullets: [],
 howItWorks: [],
 recoveryBenefit: "",
 gradient: customPackForAdd.gradient,
 visibility: "published" as const,
 tags: [],
 templates: [],
 } : null;
 const timeFromSubmit = (d: CaptureSubmit) => {
 if (!d.dueAt) return "09:00";
 const dt = new Date(d.dueAt);
 return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
 };


 

 return (
 <PhoneFrame>
 <div {...swipe} className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
      <div className="flex-1 px-6 pt-8 pb-32 relative">
        <PageHeader
          eyebrow="Do it Later"
          title="Drop it now. Get it back later."
          lede="Capture a thought, we'll bring it back on time."
          accent={accent1}
        />
        <DoItLaterTabs />


 {/* MCQ commented out for now
 {!state.personality && (
 <Link
 to="/quiz"
 className="mb-4 flex items-center justify-between p-4 rounded-2xl border transition-colors"
 style={{
 background: `linear-gradient(90deg, color-mix(in oklab, ${accent1} 15%, var(--canvas)), color-mix(in oklab, ${accent1} 5%, var(--canvas)))`,
 borderColor: `color-mix(in oklab, ${accent1} 25%, transparent)`,
 }}
 >
 <div>
 <p className="t-eyebrow mb-1" style={{ color: accent1 }}>2-minute challenge</p>
 <p className="t-body text-ink">Discover your memory type →</p>
 </div>
 <Brain className="size-5" style={{ color: accent1 }} aria-hidden="true" />
 </Link>
 )}

 {state.personality && <RechallengeBanner />}
 */}

 {state.plan === "free" && (() => {
 const used = Math.min(capturesCount, 5);
 const pct = (used / 5) * 100;
 const remaining = Math.max(0, 5 - used);
 const full = remaining === 0;
 return (
 <Link
 to="/paywall"
 className="group mb-6 block relative overflow-hidden rounded-2xl border transition"
 style={{
 background: `linear-gradient(135deg, color-mix(in oklab, ${accent1} ${full ? 40 : 22}%, var(--canvas)), color-mix(in oklab, ${accent1} ${full ? 26 : 12}%, var(--canvas)))`,
 borderColor: `color-mix(in oklab, ${accent1} ${full ? 55 : 40}%, transparent)`,
 }}
 >
 {/* progress fill */}
 <div
 className="absolute inset-y-0 left-0"
 style={{ width: `${pct}%`, background: `color-mix(in oklab, ${accent1} ${full ? 38 : 28}%, transparent)` }}
 aria-hidden="true"
 />
 <div className="relative flex items-center justify-between gap-3 px-4 py-3">
 <div className="flex items-center gap-3 min-w-0">
 <span className="shrink-0 grid place-items-center size-9 rounded-xl" style={{ background: `color-mix(in oklab, ${accent1} 35%, var(--canvas))` }}>
 <Sparkles className="size-4" style={{ color: accent1 }} aria-hidden="true" />
 </span>
 <div className="min-w-0">
 <p className="t-body-sm text-ink">
 {full ? "You're on a roll!" : `${remaining} of 5 drops left today`}
 </p>
 <p className="t-meta text-ink/60 mt-0.5">
 {full ? "Unlock unlimited to keep capturing" : "Free plan · resets when you upgrade"}
 </p>
 </div>
 </div>
 <span className="t-eyebrow shrink-0 px-3 py-1.5 rounded-full text-canvas" style={{ background: accent1 }}>
 {full ? "Upgrade" : "Go Pro"}
 </span>
 </div>
 </Link>

 );
 })()}

 <WelcomeBanner compact={memories.length > 0} accent={accent1} />

 <section data-tour="home-list" className="space-y-8">
 {memories.length === 0 ? (
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 className="space-y-5"
 >
 <div
 className="p-4 rounded-2xl border"
 style={{
 background: `linear-gradient(145deg, color-mix(in oklab, ${accent1} 14%, var(--canvas)) 0%, color-mix(in oklab, ${accent1} 5%, var(--canvas)) 100%)`,
 borderColor: `color-mix(in oklab, ${accent1} 22%, transparent)`,
 }}
 >
 <p className="t-eyebrow mb-1.5" style={{ color: accent1 }}>Start here</p>
 <p className="t-body text-ink">
 Tap <span className="" style={{ color: accent1 }}>Capture a thought</span> below — one tiny thing on your mind.
 </p>
 </div>


 </motion.div>
 ) : (
 <div>
 <div className="flex items-center justify-between mb-3">
 <p className="t-eyebrow text-ink/70">Later</p>
 {filter && (
 <button
 onClick={() => setFilter(null)}
 className="t-eyebrow"
 style={{ color: accent1 }}
 >
 Clear filter
 </button>
 )}
 </div>

 <PackTabs
 packs={installedPackTabs}
 activeTab={packTab}
 onChange={(t) => { setPackTab(t); setFilter(null); }}
 countsByPack={countsByPack}
 allCount={memories.length}
 capturesCount={capturesCount}
 accent={accent1}
 />

 {installedPackTabs.some((p) => p.id === packTab) && (
 <div className="mb-3 -mt-1 flex items-center justify-between gap-2 px-1">
 <p className="t-eyebrow text-ink/50 truncate">
 Pack · <span className="text-ink/75">{installedPackTabs.find((p) => p.id === packTab)?.name ?? packLabel(packs, packTab)}</span>
 </p>
 <div className="flex items-center gap-1">
 <button
 onClick={() => setAddingToPack(packTab)}
 className="t-eyebrow inline-flex items-center gap-1 px-2 py-1 rounded-full text-ink/70 hover:text-ink hover:bg-ink/5 transition"
 >
 <Plus className="size-3" /> Add
 </button>
 <button
 onClick={() => setRemovingPack(packTab)}
 className="t-eyebrow inline-flex items-center gap-1 px-2 py-1 rounded-full text-ink/50 hover:bg-ink/5 transition"
 >
 <Trash2 className="size-3" /> Remove
 </button>
 </div>
 </div>
 )}





 {usedCats.length > 1 && (
 <div className="-mx-6 px-6 mb-4 overflow-x-auto no-scrollbar">
 <div className="flex gap-2 w-max">
 <button
 onClick={() => setFilter(null)}
 className={`px-3 py-1.5 rounded-full t-button border transition ${
 !filter ? "text-canvas" : "text-ink/75 hover:text-ink"
 }`}
 style={!filter ? { background: accent1, borderColor: accent1 } : { background: `color-mix(in oklab, ${accent1} 8%, var(--canvas))`, borderColor: `color-mix(in oklab, ${accent1} 18%, transparent)` }}
 >
 All · {scoped.length}
 </button>
 {usedCats.map((label) => {
 const c = catByLabel.get(label);
 const count = scoped.filter((m) => m.category === label).length;
 const active = filter === label;
 return (
 <button
 key={label}
 onClick={() => setFilter(active ? null : label)}
 className={`px-3 py-1.5 rounded-full t-button border inline-flex items-center gap-1.5 transition ${
 active ? "text-canvas" : "text-ink/70 hover:text-ink"
 }`}
 style={active ? { background: accent1, borderColor: accent1 } : { background: `color-mix(in oklab, ${accent1} 8%, var(--canvas))`, borderColor: `color-mix(in oklab, ${accent1} 18%, transparent)` }}
 >
 {c?.emoji && <span className="t-meta">{c.emoji}</span>}
 {label} · {count}
 </button>
 );
 })}
 </div>
 </div>
 )}

 <div className="space-y-2.5">
 {visibleMemories.map((m, i) => {
 const c = m.category ? catByLabel.get(m.category) : undefined;
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent1} ${pct}%, ${base})`;
 return (
 <motion.article
 key={m.id}
 initial={{ opacity: 0, y: 6 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.04, duration: 0.35 }}
 className="relative rounded-2xl border p-3"
 style={{
 borderColor: tint(28),
 background: `linear-gradient(135deg, ${tint(16, "var(--canvas)")} 0%, ${tint(6, "var(--canvas)")} 60%, var(--card) 100%)`,
 }}
 >
 {m.audioUrl ? (
 <div className="space-y-2">
 <div className="flex items-start justify-between gap-2">
 <div className="flex items-center gap-2 min-w-0">
 <div className="shrink-0 size-9 rounded-xl grid place-items-center border shadow-sm" style={{ background: tint(18, "var(--canvas)"), borderColor: tint(24) }} aria-hidden="true">
 <Mic className="size-4" style={{ color: accent1 }} />
 </div>
 <div className="min-w-0">
 <p className="t-title text-ink">Voice note</p>
 <div className="t-meta mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-ink/70">
 <span className="inline-flex items-center gap-1 text-ink/80">
 <Clock className="size-3" aria-hidden="true" />
 {m.date || m.time}
 </span>
 <span className="inline-flex items-center gap-1">
 {m.notify === "alarm"
 ? <><AlarmClock className="size-3" aria-hidden="true" /> Alarm</>
 : <><Bell className="size-3" aria-hidden="true" /> Notify</>}
 </span>
 </div>
 </div>
 </div>
 <div className="shrink-0 flex items-center gap-0.5">
 <button onClick={() => setViewing(m)} aria-label="View voice note"
 className="size-8 grid place-items-center rounded-full text-ink/70 hover:text-ink hover:bg-ink/5 transition">
 <Eye className="size-4" aria-hidden="true" />
 </button>
 <button onClick={() => setEditing(m)} aria-label="Edit voice note"
 className="size-8 grid place-items-center rounded-full text-ink/70 hover:text-ink hover:bg-ink/5 transition">
 <Pencil className="size-4" aria-hidden="true" />
 </button>
 <button onClick={() => setDeleting(m)} aria-label="Delete voice note"
 className="size-8 grid place-items-center rounded-full text-ink/60 hover:bg-ink/5 transition">
 <Trash2 className="size-4" aria-hidden="true" />
 </button>
 </div>
 </div>
 <VoicePlayer src={m.audioUrl} knownDuration={m.audioDuration} className="mt-0" />
 <CategoryChip
 value={m.category}
 accent={accent1}
 onChange={(label) => updateMemory(m.id, { category: label })}
 />
 </div>
 ) : (
 <div className="flex items-start gap-2.5">
 <div
 className="t-title shrink-0 size-9 rounded-xl grid place-items-center"
 style={{ background: tint(22, "var(--canvas)"), color: accent1 }}
 aria-hidden="true"
 >
 {c?.emoji || "✍️"}
 </div>
 <div className="flex-1 min-w-0">
 {(() => {
 const cleaned = m.category && m.text.toLowerCase().startsWith(`${m.category.toLowerCase()}:`)
 ? m.text.slice(m.category.length + 1).trim()
 : m.text;
 return (
 <p className="t-body text-ink break-words">
 {cleaned.length > 15 ? `${cleaned.slice(0, 15)}…` : cleaned}
 </p>
 );
 })()}
 <div className="t-meta mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-ink/70">
 <span className="inline-flex items-center gap-1 text-ink/80">
 <Clock className="size-3" aria-hidden="true" />
 {m.date || m.time}
 </span>
 <span className="inline-flex items-center gap-1">
 {m.notify === "alarm"
 ? <><AlarmClock className="size-3" aria-hidden="true" /> Alarm</>
 : <><Bell className="size-3" aria-hidden="true" /> Notify</>}
 </span>
 {m.recurrence === "daily" && (
 <span className="t-eyebrow" style={{ color: accent1 }}>· daily</span>
 )}
 </div>
 <div className="mt-2">
 <CategoryChip
 value={m.category}
 accent={accent1}
 onChange={(label) => updateMemory(m.id, { category: label })}
 />
 </div>
 </div>
 <div className="shrink-0 flex items-center gap-0.5">
 {recallUnlocked && hasRecallFor(m) && (
 <button
 onClick={() => navigate({ to: "/recall" })}
 aria-label="Open recall pattern for this thought"
 title="Recall pattern available"
 className="size-8 grid place-items-center rounded-full transition"
 style={{ color: accent1, background: `color-mix(in oklab, ${accent1} 8%, transparent)` }}
 >
 <Sparkles className="size-4" aria-hidden="true" />
 </button>
 )}
 <button onClick={() => setViewing(m)} aria-label="View thought"
 className="size-8 grid place-items-center rounded-full text-ink/70 hover:text-ink hover:bg-ink/5 transition">
 <Eye className="size-4" aria-hidden="true" />
 </button>
 <button onClick={() => setEditing(m)} aria-label="Edit thought"
 className="size-8 grid place-items-center rounded-full text-ink/70 hover:text-ink hover:bg-ink/5 transition">
 <Pencil className="size-4" aria-hidden="true" />
 </button>
 <button onClick={() => setDeleting(m)} aria-label="Delete thought"
 className="size-8 grid place-items-center rounded-full text-ink/60 hover:bg-ink/5 transition">
 <Trash2 className="size-4" aria-hidden="true" />
 </button>
 </div>
 </div>
 )}
 {m.imageUrl && (
 <img src={m.imageUrl} alt="" loading="lazy"
 className="mt-2 w-full aspect-[3/1] object-cover rounded-lg border border-ink/5" />
 )}
 </motion.article>
 );
 })}
 {visibleMemories.length === 0 && (
 <p className="t-meta text-center text-ink/70 py-8">
 Nothing in <span className="">{filter}</span> yet.
 </p>
 )}
 </div>

 </div>
 )}

 </section>
 </div>

 <CaptureBar plan={state.plan} onCapture={onCapture} onUpgrade={() => navigate({ to: "/paywall" })} />
 <div aria-hidden="true" className="h-40 shrink-0" />
 <BottomTabs />
 </div>

 {/* View thought */}
 <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
 <DialogContent>
 <DialogHeader>
 <p className="t-eyebrow text-ink/70">Your thought</p>
 <DialogTitle className="t-display text-ink">
 "{viewing?.text}"
 </DialogTitle>
 </DialogHeader>
 {viewing?.imageUrl && (
 <div className="rounded-xl overflow-hidden border border-ink/10 bg-ink/[0.03] mt-2">
 <img src={viewing.imageUrl} alt="attachment" className="w-full max-h-56 object-contain" />
 </div>
 )}
 <div className="grid grid-cols-2 gap-2 mt-2">
 {viewing?.category && (
 <div className="rounded-xl bg-ink/[0.04] border border-ink/10 p-3">
 <p className="t-eyebrow text-ink/70">Category</p>
 <p className="t-title text-ink mt-1">{viewing.category}</p>
 </div>
 )}
 <div className="rounded-xl bg-ink/[0.04] border border-ink/10 p-3">
 <p className="t-eyebrow text-ink/70">When</p>
 <p className="t-title text-ink mt-1">{viewing?.date || viewing?.time}</p>
 </div>
 <div className="rounded-xl bg-ink/[0.04] border border-ink/10 p-3">
 <p className="t-eyebrow text-ink/70">Saved at</p>
 <p className="t-title text-ink mt-1">{viewing?.time}</p>
 </div>
 <div className="rounded-xl bg-ink/[0.04] border border-ink/10 p-3">
 <p className="t-eyebrow text-ink/70">Nudge</p>
 <p className="t-title text-ink mt-1 inline-flex items-center gap-1 capitalize">
 {viewing?.notify === "alarm"
 ? <><AlarmClock className="size-3.5" /> Alarm</>
 : <><Bell className="size-3.5" /> Notification</>}
 </p>
 </div>
 </div>
 </DialogContent>
 </Dialog>

 {/* Edit thought */}
 <EditMemorySheet
 open={!!editing}
 memory={editing}
 onClose={() => setEditing(null)}
 onSave={(patch) => {
 if (editing) updateMemory(editing.id, patch);
 setEditing(null);
 }}
 />

 {/* Add custom thought to a pack */}
 <AddPackThoughtSheet
 open={!!addingToPack && !customPackForAdd}
 pack={packs.find((p) => p.id === addingToPack) ?? null}
 onClose={() => setAddingToPack(null)}
 onAdd={(tpl: PackTemplate, v: TemplateEditValue) => {
 const pack = packs.find((p) => p.id === addingToPack);
 if (!pack) return;
 addTemplate(pack.id, tpl);
 const now = new Date();
 const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
 const newMem: Memory = {
 id: `m-${Date.now()}-${tpl.id}`,
 time,
 date: `Today · ${v.timeOfDay}`,
 text: v.text,
 tags: ["Actionable"],
 category: tpl.categoryId ? (catById.get(tpl.categoryId)?.label ?? tpl.categoryId) : undefined,
 notify: v.notify,
 recurrence: v.recurrence,
 source: { kind: "capture" },
 };
 persistMemories([newMem, ...memoriesAll]);
 install(pack.id, [tpl.id]);
 setAddingToPack(null);
 }}
 />

 <CaptureWizard
 open={!!customPackForAdd}
 onClose={() => setAddingToPack(null)}
 mode="pack"
 pack={customWizardPack}
 submitLabel="Add"
 onSubmit={(d) => {
 if (!customPackForAdd) return;
 const timeOfDay = timeFromSubmit(d);
 const sectionId = addSection(customPackForAdd.id, { text: d.text, emoji: customPackForAdd.emoji || "💡", timeOfDay });
 const now = new Date();
 const newMem: Memory = {
 id: `m-${Date.now()}-${sectionId}`,
 time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
 date: d.when,
 text: d.text,
 tags: ["Actionable"],
 category: customPackForAdd.name,
 notify: d.notify,
 recurrence: d.recurrence,
 dueAt: d.dueAt,
 source: { kind: "capture" },
 };
 persistMemories([newMem, ...memoriesAll]);
 install(customPackForAdd.id, [sectionId]);
 setAddingToPack(null);
 }}
 />



 {/* Delete confirm */}
 <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle className="t-display">Let this one go? 🍃</AlertDialogTitle>
 <AlertDialogDescription className="t-body text-ink/70">
 Your brain is about to forget <span className="t-display">"{deleting?.text}"</span> on purpose this time. Bold move. We'll quietly remove it — no judgement, no recovery, no awkward "are you sure" round two.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Keep it, just in case</AlertDialogCancel>
 <AlertDialogAction onClick={confirmDelete} style={{ background: accent1 }}>
 Yes, free my mind
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>


 {/* Remove pack confirm */}
 <AlertDialog open={!!removingPack} onOpenChange={(o) => !o && setRemovingPack(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle className="t-display">
 Remove {removingPack ? (installedPackTabs.find((p) => p.id === removingPack)?.name ?? packLabel(packs, removingPack)) : "this pack"}?
 </AlertDialogTitle>
 <AlertDialogDescription className="t-body text-ink/70">
 We'll uninstall the pack and clear only the original pack-created thoughts. Your own captures and custom thoughts stay put.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Keep it</AlertDialogCancel>
 <AlertDialogAction onClick={confirmRemovePack} style={{ background: accent1 }}>
 Yes, remove pack
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 {tourOpen && <WelcomeTour onClose={() => setTourOpen(false)} />}
 </PhoneFrame>
 );
}
