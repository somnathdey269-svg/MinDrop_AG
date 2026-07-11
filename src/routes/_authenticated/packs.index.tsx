import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FeatureGate } from "@/components/consumer/FeatureGate";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { DoItLaterTabs } from "@/components/layout/DoItLaterTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDoItLaterSwipe } from "@/components/layout/useDoItLaterSwipe";
import { GlobalCaptureBar } from "@/components/memory/GlobalCaptureBar";
import { CaptureWizard, type CaptureSubmit } from "@/components/memory/CaptureWizard";

import { usePacks, usePackInstalls, GRADIENTS, type PackGradient, type Pack } from "@/lib/memoryos/packs";
import { useCustomPacks, type CustomPack, type CustomSection } from "@/lib/memoryos/customPacks";
import { useMemories } from "@/lib/memoryos/store";
import type { Memory } from "@/lib/memoryos/types";
import { PackCard } from "@/components/packs/PackCard";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";
import { Search, Plus, Sparkles, Send, X, Trash2, ChevronRight, ChevronLeft, Check, Eye, Pencil } from "lucide-react";
import {
 AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
 AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/packs/")({ component: () => <FeatureGate slug="packs"><Packs /></FeatureGate> });

type Tab = "all" | "installed" | "custom";

const GRADIENT_KEYS: PackGradient[] = ["peach", "mint", "lilac", "sky", "rose", "sand"];
const EMOJI_SUGGESTIONS = ["✨","💪","🧠","📚","🍎","☕","🌙","🎯","🌱","💡","🔥","🎨","🏃","🧘","💼","❤️"];
const SECTION_EMOJI_SUGGESTIONS = ["💡","📝","☎️","🥤","💊","🔑","📦","🎁","🧺","🍳","👟","🪥"];

function Packs() {
 const navigate = useNavigate();
 const swipe = useDoItLaterSwipe();
 const { accent1 } = useCountryTheme();
 const { list: packs } = usePacks();
 const { installs } = usePackInstalls();
 const { list: customPacks, createPack, removePack, addSection, removeSection, updateSection } = useCustomPacks();
 const { list: memories, persist: persistMemories } = useMemories();

 const [q, setQ] = useState("");
 const [tab, setTab] = useState<Tab>("all");
 const [creating, setCreating] = useState(false);
 const [managing, setManaging] = useState<CustomPack | null>(null);
 const [manageMode, setManageMode] = useState<"edit" | "install">("edit");
 const [chooser, setChooser] = useState<
 | { kind: "builtin"; pack: Pack }
 | { kind: "custom"; pack: CustomPack }
 | null
 >(null);
 const currentManaging = managing ? customPacks.find((p) => p.id === managing.id) ?? null : null;

 const installCountByPack: Record<string, number> = useMemo(
 () => Object.fromEntries(installs.map((i) => [i.packId, i.activeTemplateIds.length])),
 [installs]
 );

 const filtered = useMemo(() => {
 const list = packs.filter((p) => p.visibility === "published");
 const qs = list.filter((p) => {
 if (!q) return true;
 const s = q.toLowerCase();
 return p.name.toLowerCase().includes(s) || p.shortDesc.toLowerCase().includes(s) || p.tags.some((t) => t.includes(s));
 });
 if (tab === "installed") return qs.filter((p) => installCountByPack[p.id]);
 return qs;
 }, [packs, q, tab, installCountByPack]);

 const installedCustomIds = useMemo(() => new Set(installs.map((i) => i.packId)), [installs]);
 const filteredCustom = useMemo(() => {
 if (!q) return customPacks;
 const s = q.toLowerCase();
 return customPacks.filter((p) => p.name.toLowerCase().includes(s) || p.shortDesc.toLowerCase().includes(s));
 }, [customPacks, q]);
 const installedCustom = useMemo(
 () => filteredCustom.filter((p) => installedCustomIds.has(p.id)),
 [filteredCustom, installedCustomIds]
 );

 const sendSectionToLater = (pack: CustomPack, section: CustomSection) => {
 const now = new Date();
 const timeOfDay = section.timeOfDay;
 const [h, m] = timeOfDay.split(":").map(Number);
 const due = new Date(); due.setHours(h, m, 0, 0);
 if (due.getTime() <= now.getTime()) due.setDate(due.getDate() + 1);
 const label = `${due.getDate() === now.getDate() ? "Today" : "Tomorrow"} at ${(due.getHours()%12||12)}:${String(due.getMinutes()).padStart(2,"0")} ${due.getHours()>=12?"PM":"AM"}`;
 const newMemory: Memory = {
 id: `m_${Date.now().toString(36)}`,
 time: `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`,
 date: label,
 text: section.text,
 category: pack.name,
 notify: "notification",
 dueAt: due.toISOString(),
 recurrence: "once",
 source: { kind: "pack", packId: pack.id, templateId: section.id, userAdded: true },
 };
 persistMemories([newMemory, ...memories]);
 };

 return (
 <PhoneFrame>
 <div {...swipe} className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
 <div className="flex-1 px-6 pt-8 pb-32 relative">
 <PageHeader
 eyebrow="Do it Later · Library"
 title="Memory Packs."
 lede="Pre-built thought kits — or build your own."
 accent={accent1}
 />
 <DoItLaterTabs />



 <div className="flex items-center gap-2 mb-4">
 <div data-tour="packs-search" className="flex-1 relative">
 <Search className="size-4 text-ink/70 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
 <input
 value={q}
 onChange={(e) => setQ(e.target.value)}
 placeholder="Search packs"
 className="t-body w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-ink/40"
 />
 </div>
 </div>

 <div data-tour="packs-tabs" className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
 {([
 { id: "all", label: `All · ${packs.length}` },
 { id: "installed", label: `Installed · ${installs.filter((i) => packs.some((p) => p.id === i.packId) || customPacks.some((p) => p.id === i.packId)).length}` },
 { id: "custom", label: `Custom · ${customPacks.length}` },
 ] as { id: Tab; label: string }[]).map((t) => (
 <button
 key={t.id}
 onClick={() => setTab(t.id)}
 className={`shrink-0 px-3 py-1.5 rounded-full t-button border transition ${
 tab === t.id ? "bg-ink text-canvas border-ink" : "bg-white/60 text-ink/75 border-ink/10"
 }`}
 >
 {t.label}
 </button>
 ))}
 </div>

 {tab !== "custom" && (
 <>
 <div data-tour="packs-grid" className="grid grid-cols-2 gap-3">

 {filtered.map((p) => (
 <PackCard
 key={p.id}
 pack={p}
 installedCount={installCountByPack[p.id]}
 totalTemplates={p.templates.length}
 onClick={() => setChooser({ kind: "builtin", pack: p })}
 />
 ))}
 {tab === "installed" && installedCustom.map((p) => {
 const g = GRADIENTS[p.gradient];
 return (
 <button
 key={p.id}
 onClick={() => setChooser({ kind: "custom", pack: p })}
 className="group relative rounded-2xl overflow-hidden border border-ink/10 bg-white hover:border-ink/30 transition-all text-left w-full block"
 >
 <div className="h-24 flex items-end p-3 relative" style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}>
 <span className="t-title drop-shadow-sm" aria-hidden="true">{p.emoji}</span>
 <span className="t-eyebrow absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-full bg-white/85 text-ink/80">
 Custom
 </span>
 <span className="t-eyebrow absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/85 text-ink/80">
 <Check className="size-3" aria-hidden="true" /> {(installs.find((i) => i.packId === p.id)?.activeTemplateIds.length) ?? 0}/{p.sections.length}
 </span>
 </div>
 <div className="p-3">
 <div className="t-body text-ink truncate">{p.name}</div>
 <p className="t-meta text-ink/75 mt-0.5 line-clamp-2">{p.shortDesc || "Tap to manage"}</p>
 <p className="t-eyebrow text-ink/70 mt-2">{p.sections.length} thoughts</p>
 </div>
 </button>
 );
 })}
 </div>
 {filtered.length === 0 && (tab !== "installed" || installedCustom.length === 0) && (
 <p className="t-meta text-center text-ink/70 py-12">
 No packs match. Try a different search.
 </p>
 )}
 </>
 )}

 {tab === "custom" && (
 <CustomTab
 packs={filteredCustom}
 onCreate={() => setCreating(true)}
 onOpen={(p) => setChooser({ kind: "custom", pack: p })}
 onRemove={removePack}
 />
 )}
 </div>
 <GlobalCaptureBar />
 <div aria-hidden="true" className="h-40 shrink-0" />
 <BottomTabs />
 </div>

 <AnimatePresence>
 {chooser && (
 <PackActionChooser
 name={chooser.kind === "builtin" ? chooser.pack.name : chooser.pack.name}
 emoji={chooser.kind === "builtin" ? chooser.pack.emoji : chooser.pack.emoji}
 gradient={chooser.kind === "builtin" ? chooser.pack.gradient : chooser.pack.gradient}
 onClose={() => setChooser(null)}
 onView={() => {
 if (chooser.kind === "builtin") {
 navigate({ to: "/packs/$packId", params: { packId: chooser.pack.id }, search: { start: 0 } });
 } else {
 navigate({ to: "/packs/custom/$customId", params: { customId: chooser.pack.id } });
 }
 setChooser(null);
 }}
 onEdit={() => {
 if (chooser.kind === "builtin") {
 navigate({ to: "/packs/$packId", params: { packId: chooser.pack.id }, search: { start: 4 } });
 } else {
 navigate({ to: "/packs/custom/$customId", params: { customId: chooser.pack.id }, search: { start: 3 } });
 }
 setChooser(null);
 }}
 />
 )}
 {creating && (
 <CreatePackWizard
 onClose={() => setCreating(false)}
 onCreate={(p) => {
 const id = createPack(p);
 setCreating(false);
 const created = { ...p, id, createdAt: Date.now(), sections: [] } as CustomPack;
 setManaging(created);
 setManageMode("edit");
 }}
 />
 )}
 {currentManaging && (
 <ManagePackSheet
 pack={currentManaging}
 mode={manageMode}
 onClose={() => setManaging(null)}
 onAddSection={(s) => addSection(currentManaging.id, s)}
 onUpdateSection={(sid, s) => updateSection(currentManaging.id, sid, s)}
 onRemoveSection={(sid) => removeSection(currentManaging.id, sid)}
 onUseSection={(section) => sendSectionToLater(currentManaging, section)}
 onInstallAll={() => {
 const now = new Date();
 const newMemories: Memory[] = currentManaging.sections.map((section, i) => {
 const [h, m] = section.timeOfDay.split(":").map(Number);
 const due = new Date(); due.setHours(h, m, 0, 0);
 if (due.getTime() <= now.getTime()) due.setDate(due.getDate() + 1);
 const label = `${due.getDate() === now.getDate() ? "Today" : "Tomorrow"} at ${(due.getHours()%12||12)}:${String(due.getMinutes()).padStart(2,"0")} ${due.getHours()>=12?"PM":"AM"}`;
 return {
 id: `m_${Date.now().toString(36)}_${i}_${section.id}`,
 time: `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`,
 date: label,
 text: section.text,
 category: currentManaging.name,
 notify: "notification",
 dueAt: due.toISOString(),
 recurrence: "once",
 source: { kind: "pack", packId: currentManaging.id, templateId: section.id, userAdded: true },
 };
 });
 persistMemories([...newMemories, ...memories]);
 setManaging(null);
 }}
 />
 )}
 </AnimatePresence>
 </PhoneFrame>
 );
}

/* ─────────────────── Custom tab ─────────────────── */

function CustomTab({
 packs, onCreate, onOpen, onRemove,
}: {
 packs: CustomPack[];
 onCreate: () => void;
 onOpen: (p: CustomPack) => void;
 onRemove: (id: string) => void;
}) {
 const [pendingDelete, setPendingDelete] = useState<CustomPack | null>(null);
 if (packs.length === 0) {
 return (
 <div className="space-y-4">
 <motion.div
 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
 className="rounded-3xl p-5 border border-ink/10 bg-gradient-to-br from-[#FFF3E0] via-[#FFE9F0] to-canvas"
 >
 <div className="flex items-center gap-2 mb-3">
 <Sparkles className="size-4 text-ink" aria-hidden="true" />
 <p className="t-eyebrow text-ink">How custom packs work</p>
 </div>
 <ol className="space-y-3">
 {[
 { n: 1, t: "Name your pack", d: "Pick a title, an emoji and a vibe — e.g. \"Gym mornings\" 💪." },
 { n: 2, t: "Add sections", d: "Each section is a thought you want to remember, with a default time." },
 { n: 3, t: "Send to Later", d: "Tap Use on any section — it lands in Later so future-you gets nudged." },
 ].map((s) => (
 <li key={s.n} className="flex gap-3">
 <div className="t-meta shrink-0 size-7 rounded-full bg-white/80 border border-ink/10 grid place-items-center text-ink">{s.n}</div>
 <div>
 <p className="t-body text-ink">{s.t}</p>
 <p className="t-meta text-ink/70">{s.d}</p>
 </div>
 </li>
 ))}
 </ol>
 </motion.div>

 <button
 onClick={onCreate}
 className="t-button w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-ink text-canvas py-3.5 hover:bg-ink/90"
 >
 <Plus className="size-4" aria-hidden="true" /> Create your first pack
 </button>
 </div>
 );
 }

 return (
 <>
 <div className="space-y-4">
 <button
 onClick={onCreate}
 className="t-button w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/20 text-ink/75 py-3 hover:border-ink/40 hover:text-ink"
 >
 <Plus className="size-4" aria-hidden="true" /> New custom pack
 </button>
 <div className="grid grid-cols-2 gap-3">
 {packs.map((p) => {
 const g = GRADIENTS[p.gradient];
 return (
 <motion.div
 key={p.id}
 layout
 initial={{ opacity: 0, y: 6 }}
 animate={{ opacity: 1, y: 0 }}
 className="group relative rounded-2xl overflow-hidden border border-ink/10 bg-white hover:border-ink/30 transition-all"
 >
 <button onClick={() => onOpen(p)} className="w-full text-left block">
 <motion.div
 whileHover={{ y: -2 }}
 className="h-24 flex items-end p-3 relative"
 style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}
 >
 <span className="t-title drop-shadow-sm" aria-hidden="true">{p.emoji}</span>
 <span className="t-eyebrow absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/85 text-ink/80">
 Custom
 </span>
 </motion.div>
 <div className="p-3">
 <div className="t-body text-ink truncate">{p.name}</div>
 <p className="t-meta text-ink/75 mt-0.5 line-clamp-2">{p.shortDesc || "Tap to add sections"}</p>
 <p className="t-eyebrow text-ink/70 mt-2">
 {p.sections.length} {p.sections.length === 1 ? "thought" : "thoughts"}
 </p>
 </div>
 </button>
 <button
 onClick={(e) => { e.stopPropagation(); setPendingDelete(p); }}
 aria-label={`Delete ${p.name}`}
 className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition size-7 rounded-full bg-white/90 border border-ink/10 grid place-items-center text-[#B45A3A] hover:bg-white"
 >
 <Trash2 className="size-3.5" aria-hidden="true" />
 </button>
 </motion.div>
 );
 })}
 </div>
 </div>

 <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle className="t-display">
 Delete "{pendingDelete?.name}"? 🗑️
 </AlertDialogTitle>
 <AlertDialogDescription className="t-body text-ink/70">
 This pack and all its {pendingDelete?.sections.length ?? 0} section{pendingDelete?.sections.length === 1 ? "" : "s"} will be gone for good. No recovery, no undo.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Keep it</AlertDialogCancel>
 <AlertDialogAction
 onClick={() => { if (pendingDelete) onRemove(pendingDelete.id); setPendingDelete(null); }}
 className="bg-[#B45A3A] hover:bg-[#9a4a30]"
 >
 Yes, delete pack
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </>
 );
}

/* ─────────────────── Shared sheet chrome ─────────────────── */

function SheetShell({
 onClose, gradient, eyebrow, title, emoji, step, totalSteps, children, footer,
}: {
 onClose: () => void;
 gradient: PackGradient;
 eyebrow: string;
 title: string;
 emoji?: string;
 step: number;
 totalSteps: number;
 children: React.ReactNode;
 footer: React.ReactNode;
}) {
 const g = GRADIENTS[gradient];
 const kb = useKeyboardInset();
 return (
 <>
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={onClose} className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60]" />
 <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
 transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
 style={{ bottom: kb, transition: "bottom 240ms cubic-bezier(0.32, 0.72, 0, 1)", willChange: "bottom" }}
 className="fixed inset-x-0 sm:bottom-24 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[calc(100%-1.5rem)] sm:max-w-[440px] z-[70]">
 <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-ink/10 overflow-hidden max-h-[90dvh] flex flex-col">
 <div
 className="px-5 pt-5 pb-4"
 style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}
 >
 <div className="flex items-start justify-between gap-3">
 <div className="flex items-center gap-3 min-w-0">
 {emoji && <span className="t-title shrink-0" aria-hidden="true">{emoji}</span>}
 <div className="min-w-0">
 <p className="t-eyebrow text-ink/70 mb-0.5 truncate">{eyebrow}</p>
 <h3 className="t-display text-ink truncate">{title}</h3>
 </div>
 </div>
 <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-white/60 text-ink/75 shrink-0">
 <X className="size-4" aria-hidden="true" />
 </button>
 </div>
 <div className="mt-4 flex gap-1.5" aria-hidden="true">
 {Array.from({ length: totalSteps }).map((_, i) => (
 <div key={i} className={`h-1 flex-1 rounded-full transition ${i < step ? "bg-ink" : "bg-ink/15"}`} />
 ))}
 </div>
 </div>
 <div className="p-5 overflow-y-auto flex-1">{children}</div>
 <div className="p-4 border-t border-ink/10 bg-white">{footer}</div>
 </div>
 </motion.div>
 </>
 );
}

function WizardNav({
 onBack, onNext, nextLabel = "Next", canNext = true, backLabel = "Back",
}: {
 onBack?: () => void;
 onNext: () => void;
 nextLabel?: string;
 canNext?: boolean;
 backLabel?: string;
}) {
 return (
 <div className="flex gap-2">
 {onBack && (
 <button onClick={onBack} className="t-button rounded-xl border border-ink/15 px-4 py-2.5 text-ink/75 hover:bg-ink/5 inline-flex items-center gap-1">
 <ChevronLeft className="size-3.5" aria-hidden="true" /> {backLabel}
 </button>
 )}
 <button onClick={onNext} disabled={!canNext}
 className="t-button flex-1 rounded-xl bg-ink text-canvas py-2.5 hover:bg-ink/90 disabled:opacity-40 inline-flex items-center justify-center gap-1">
 {nextLabel} <ChevronRight className="size-3.5" aria-hidden="true" />
 </button>
 </div>
 );
}

function StepFrame({ children, k }: { children: React.ReactNode; k: string }) {
 return (
 <motion.div key={k}
 initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
 transition={{ duration: 0.22 }}
 className="space-y-4"
 >
 {children}
 </motion.div>
 );
}

/* ─────────────────── Create pack wizard ─────────────────── */

function CreatePackWizard({
 onClose, onCreate,
}: {
 onClose: () => void;
 onCreate: (p: { name: string; emoji: string; shortDesc: string; gradient: PackGradient }) => void;
}) {
 const [step, setStep] = useState(1); // 1 name, 2 emoji, 3 vibe, 4 desc
 const [name, setName] = useState("");
 const [emoji, setEmoji] = useState("✨");
 const [shortDesc, setShortDesc] = useState("");
 const [gradient, setGradient] = useState<PackGradient>("peach");

 const totalSteps = 4;
 const canNext =
 (step === 1 && name.trim().length > 0) ||
 (step === 2 && emoji.length > 0) ||
 step === 3 || step === 4;

 const eyebrows = ["Step 1 of 4", "Step 2 of 4", "Step 3 of 4", "Step 4 of 4"];
 const titles = ["What's this pack called?", "Pick an emoji.", "Choose a vibe.", "Short description?"];

 return (
 <SheetShell
 onClose={onClose}
 gradient={gradient}
 eyebrow={eyebrows[step - 1]}
 title={titles[step - 1]}
 emoji={step > 1 ? emoji : undefined}
 step={step}
 totalSteps={totalSteps}
 footer={
 <WizardNav
 onBack={step > 1 ? () => setStep(step - 1) : undefined}
 onNext={() => {
 if (step < totalSteps) setStep(step + 1);
 else onCreate({ name: name.trim(), emoji: emoji || "✨", shortDesc: shortDesc.trim(), gradient });
 }}
 canNext={canNext}
 nextLabel={step === totalSteps ? "Create pack" : "Next"}
 />
 }
 >
 <AnimatePresence mode="wait">
 {step === 1 && (
 <StepFrame k="1">
 <label className="t-eyebrow block text-ink/70">Pack name</label>
 <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Gym mornings" autoFocus
 className="t-body w-full bg-white rounded-xl px-4 py-3 outline-none border border-ink/15 focus:border-ink/40" />
 <p className="t-meta text-ink/60">Give it a name future-you will recognise.</p>
 </StepFrame>
 )}
 {step === 2 && (
 <StepFrame k="2">
 <div className="grid grid-cols-4 gap-2.5">
 {EMOJI_SUGGESTIONS.map((e) => (
 <button key={e} onClick={() => setEmoji(e)}
 aria-label={`Choose ${e}`}
 className={`aspect-square rounded-2xl text-[22px] transition ${emoji === e ? "bg-ink/10 ring-2 ring-ink" : "bg-canvas/60 hover:bg-ink/5"}`}>
 {e}
 </button>
 ))}
 </div>
 </StepFrame>
 )}
 {step === 3 && (
 <StepFrame k="3">
 <label className="t-eyebrow block text-ink/70">Vibe</label>
 <div className="grid grid-cols-3 gap-2.5">
 {GRADIENT_KEYS.map((k) => (
 <button key={k} onClick={() => setGradient(k)} aria-label={k}
 className={`h-20 rounded-2xl border-2 relative overflow-hidden transition ${gradient === k ? "border-ink" : "border-transparent"}`}
 style={{ background: `linear-gradient(135deg, ${GRADIENTS[k].from} 0%, ${GRADIENTS[k].to} 100%)` }}>
 {gradient === k && (
 <span className="absolute top-1.5 right-1.5 size-5 rounded-full bg-ink text-canvas grid place-items-center">
 <Check className="size-3" aria-hidden="true" />
 </span>
 )}
 <span className="t-eyebrow absolute bottom-1.5 left-2 text-ink/70">{k}</span>
 </button>
 ))}
 </div>
 </StepFrame>
 )}
 {step === 4 && (
 <StepFrame k="4">
 <label className="t-eyebrow block text-ink/70">Short description <span className="text-ink/40 normal-case tracking-normal">(optional)</span></label>
 <input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Everything I forget before 7 AM" autoFocus
 className="t-body w-full bg-white rounded-xl px-4 py-3 outline-none border border-ink/15 focus:border-ink/40" />
 <p className="t-meta text-ink/60">Shown under the pack name in your library.</p>
 </StepFrame>
 )}
 </AnimatePresence>
 </SheetShell>
 );
}

/* ─────────────────── Manage pack sheet ─────────────────── */

function ManagePackSheet({
 pack, mode, onClose, onAddSection, onUpdateSection, onRemoveSection, onUseSection, onInstallAll,
}: {
 pack: CustomPack;
 mode: "edit" | "install";
 onClose: () => void;
 onAddSection: (s: { text: string; emoji: string; timeOfDay: string }) => void;
 onUpdateSection: (id: string, s: { text: string; emoji: string; timeOfDay: string }) => void;
 onRemoveSection: (id: string) => void;
 onUseSection: (section: CustomSection) => void;
 onInstallAll: () => void;
}) {
 const g = GRADIENTS[pack.gradient];
 const [addingWizard, setAddingWizard] = useState(false);
 const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
 const [flash, setFlash] = useState<string | null>(null);
 const isInstall = mode === "install";
 const wizardPack: Pack = {
 id: pack.id,
 name: pack.name,
 emoji: pack.emoji,
 shortDesc: pack.shortDesc,
 longDesc: pack.shortDesc,
 primaryCategoryId: pack.name,
 benefitBullets: [],
 howItWorks: [],
 recoveryBenefit: "",
 gradient: pack.gradient,
 visibility: "published",
 tags: [],
 templates: [],
 };
 const timeFromSubmit = (d: CaptureSubmit, fallback: string) => {
 if (!d.dueAt) return fallback;
 const dt = new Date(d.dueAt);
 return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
 };
 const kb = useKeyboardInset();

 return (
 <>
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={onClose} className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40" />
 <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
 transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
 style={{ bottom: kb, transition: "bottom 240ms cubic-bezier(0.32, 0.72, 0, 1)", willChange: "bottom" }}
 className="fixed inset-x-0 sm:bottom-24 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[calc(100%-1.5rem)] sm:max-w-[440px] z-50">
 <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-ink/10 overflow-hidden max-h-[85dvh] flex flex-col">
 <div
 className="flex items-start justify-between px-5 pt-5 pb-3"
 style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}
 >
 <div className="flex gap-3 items-center min-w-0">
 <span className="t-title shrink-0" aria-hidden="true">{pack.emoji}</span>
 <div className="min-w-0">
 <p className="t-eyebrow text-ink/70 mb-0.5">
 {isInstall ? "Preview & install" : "Edit pack"} · {pack.sections.length} section{pack.sections.length === 1 ? "" : "s"}
 </p>
 <h3 className="t-display text-ink truncate">{pack.name}</h3>
 </div>
 </div>
 <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-white/60 text-ink/75 shrink-0">
 <X className="size-4" aria-hidden="true" />
 </button>
 </div>

 <div className="p-5 space-y-3 overflow-y-auto flex-1">
 {pack.sections.length === 0 && (
 <p className="t-meta text-ink/70 text-center py-4">
 {isInstall ? "This pack has no sections yet." : "No sections yet. Add your first thought below."}
 </p>
 )}

 {pack.sections.map((s) => (
 <div key={s.id} className="rounded-2xl border border-ink/10 p-3 bg-white">
 <div className="flex items-start gap-2.5">
 <div className="t-title size-9 rounded-xl grid place-items-center shrink-0"
 style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}>
 {s.emoji}
 </div>
 <div className="flex-1 min-w-0">
 <p className="t-body text-ink break-words">{s.text}</p>
 <p className="t-eyebrow text-ink/60 mt-1">
 Default {s.timeOfDay}
 </p>
 </div>
 </div>
 {!isInstall && (
 <div className="mt-2 flex justify-end gap-1.5">
 <button
 onClick={() => setEditingSection(s)}
 className="t-eyebrow inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-ink/70 hover:bg-ink/5 border border-ink/10"
 >
 <Pencil className="size-3" aria-hidden="true" /> Customise
 </button>
 <button
 onClick={() => onRemoveSection(s.id)}
 aria-label="Delete section"
 className="t-eyebrow inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[#B45A3A] hover:bg-[#E88D67]/10 border border-[#E88D67]/25"
 >
 <Trash2 className="size-3" aria-hidden="true" />
 </button>
 </div>
 )}
 {isInstall && (
 <div className="mt-2 flex justify-end">
 <span className="t-eyebrow text-ink/50">
 {flash === s.id ? "Queued" : "Included"}
 </span>
 </div>
 )}
 </div>
 ))}

 {!isInstall && (
 <button
 onClick={() => setAddingWizard(true)}
 className="t-button w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/20 text-ink/75 py-3 hover:border-ink/40 hover:text-ink"
 >
 <Plus className="size-4" aria-hidden="true" /> Add section
 </button>
 )}
 </div>

 <div className="p-4 border-t border-ink/10 bg-white">
 {isInstall ? (
 <button
 onClick={onInstallAll}
 disabled={pack.sections.length === 0}
 className="t-button w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink text-canvas py-3 hover:bg-ink/90 disabled:opacity-40"
 >
 <Send className="size-3.5" aria-hidden="true" />
 Send {pack.sections.length} to Later
 </button>
 ) : (
 <button
 onClick={onClose}
 className="t-button w-full rounded-xl border border-ink/15 py-3 text-ink/80 hover:bg-ink/5"
 >
 Done
 </button>
 )}
 </div>
 </div>
 </motion.div>

 <AnimatePresence>
 {addingWizard && (
 <CaptureWizard
 open={addingWizard}
 onClose={() => setAddingWizard(false)}
 mode="pack"
 pack={wizardPack}
 submitLabel="Add section"
 onSubmit={(d) => {
 onAddSection({ text: d.text, emoji: pack.emoji || "💡", timeOfDay: timeFromSubmit(d, "09:00") });
 setAddingWizard(false);
 }}
 />
 )}
 {editingSection && (
 <CaptureWizard
 open={!!editingSection}
 onClose={() => setEditingSection(null)}
 mode="pack"
 pack={wizardPack}
 initial={{ text: editingSection.text, timeOfDay: editingSection.timeOfDay, notify: "notification" }}
 title={`${editingSection.emoji} Edit thought`}
 submitLabel="Save"
 onSubmit={(d) => {
 onUpdateSection(editingSection.id, {
 text: d.text,
 emoji: editingSection.emoji || pack.emoji || "💡",
 timeOfDay: timeFromSubmit(d, editingSection.timeOfDay),
 });
 setEditingSection(null);
 }}
 />
 )}
 </AnimatePresence>
 </>
 );
}

/* ─────────────────── Pack action chooser ─────────────────── */

function PackActionChooser({
 name, emoji, gradient, onClose, onView, onEdit,
}: {
 name: string;
 emoji: string;
 gradient: PackGradient;
 onClose: () => void;
 onView: () => void;
 onEdit: () => void;
}) {
 const g = GRADIENTS[gradient];
 return (
 <>
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={onClose} className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[70]" />
 <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
 transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
 className="fixed inset-x-0 bottom-0 sm:bottom-24 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[calc(100%-1.5rem)] sm:max-w-[440px] z-[80]">
 <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-ink/10 overflow-hidden">
 <div
 className="px-5 pt-5 pb-4 flex items-center justify-between"
 style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}
 >
 <div className="flex items-center gap-3 min-w-0">
 <span className="t-title shrink-0" aria-hidden="true">{emoji}</span>
 <div className="min-w-0">
 <p className="t-eyebrow text-ink/70">What next?</p>
 <h3 className="t-display text-ink truncate">{name}</h3>
 </div>
 </div>
 <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-white/60 text-ink/75 shrink-0">
 <X className="size-4" aria-hidden="true" />
 </button>
 </div>

 <div className="p-5 space-y-3">
 <button
 onClick={onView}
 className="w-full text-left rounded-2xl border border-ink/10 p-4 hover:border-ink/30 transition flex items-start gap-3"
 >
 <span className="size-10 rounded-xl bg-ink/[0.05] grid place-items-center shrink-0">
 <Eye className="size-4 text-ink" aria-hidden="true" />
 </span>
 <div className="min-w-0 flex-1">
 <p className="t-title text-ink">View &amp; install</p>
 <p className="t-meta text-ink/70 mt-0.5">
 See how it works and send its thoughts to Later.
 </p>
 </div>
 <ChevronRight className="size-4 text-ink/40 shrink-0 mt-1" aria-hidden="true" />
 </button>

 <button
 onClick={onEdit}
 className="w-full text-left rounded-2xl border border-ink/10 p-4 hover:border-ink/30 transition flex items-start gap-3"
 >
 <span className="size-10 rounded-xl bg-ink/[0.05] grid place-items-center shrink-0">
 <Pencil className="size-4 text-ink" aria-hidden="true" />
 </span>
 <div className="min-w-0 flex-1">
 <p className="t-title text-ink">Edit pack</p>
 <p className="t-meta text-ink/70 mt-0.5">
 Tweak existing thoughts or add a new section.
 </p>
 </div>
 <ChevronRight className="size-4 text-ink/40 shrink-0 mt-1" aria-hidden="true" />
 </button>
 </div>
 </div>
 </motion.div>
 </>
 );
}


/* ─────────────────── Add section wizard ─────────────────── */

function AddSectionWizard({
 gradient, onClose, onSave,
}: {
 gradient: PackGradient;
 onClose: () => void;
 onSave: (s: { text: string; emoji: string; timeOfDay: string }) => void;
}) {
 const [step, setStep] = useState(1); // 1 text, 2 emoji, 3 time
 const [text, setText] = useState("");
 const [emoji, setEmoji] = useState("💡");
 const [timeOfDay, setTimeOfDay] = useState("09:00");

 const totalSteps = 3;
 const canNext =
 (step === 1 && text.trim().length > 0) ||
 (step === 2 && emoji.length > 0) ||
 step === 3;

 const eyebrows = ["Step 1 of 3", "Step 2 of 3", "Step 3 of 3"];
 const titles = ["What to remember?", "Pick an emoji.", "Default time?"];

 return (
 <SheetShell
 onClose={onClose}
 gradient={gradient}
 eyebrow={eyebrows[step - 1]}
 title={titles[step - 1]}
 emoji={step > 1 ? emoji : undefined}
 step={step}
 totalSteps={totalSteps}
 footer={
 <WizardNav
 onBack={step > 1 ? () => setStep(step - 1) : undefined}
 onNext={() => {
 if (step < totalSteps) setStep(step + 1);
 else onSave({ text: text.trim(), emoji: emoji || "💡", timeOfDay });
 }}
 canNext={canNext}
 nextLabel={step === totalSteps ? "Add section" : "Next"}
 />
 }
 >
 <AnimatePresence mode="wait">
 {step === 1 && (
 <StepFrame k="t1">
 <label className="t-eyebrow block text-ink/70">The thought</label>
 <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Take vitamins with breakfast" autoFocus rows={3}
 className="t-body w-full bg-white rounded-xl px-4 py-3 outline-none border border-ink/15 focus:border-ink/40 resize-none" />
 </StepFrame>
 )}
 {step === 2 && (
 <StepFrame k="t2">
 <div className="grid grid-cols-6 gap-2">
 {SECTION_EMOJI_SUGGESTIONS.map((e) => (
 <button key={e} onClick={() => setEmoji(e)}
 aria-label={`Choose ${e}`}
 className={`aspect-square rounded-xl text-[20px] transition ${emoji === e ? "bg-ink/10 ring-2 ring-ink" : "bg-canvas/60 hover:bg-ink/5"}`}>
 {e}
 </button>
 ))}
 </div>
 </StepFrame>
 )}
 {step === 3 && (
 <StepFrame k="t3">
 <label className="t-eyebrow block text-ink/70">Default time</label>
 <input type="time" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}
 className="t-title w-full bg-white rounded-xl px-4 py-3 outline-none border border-ink/15 focus:border-ink/40" />
 <p className="t-meta text-ink/60">This is when the thought lands in Later when you tap Use.</p>
 </StepFrame>
 )}
 </AnimatePresence>
 </SheetShell>
 );
}
