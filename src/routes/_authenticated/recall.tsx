import { createFileRoute } from "@tanstack/react-router";
import { FeatureGate } from "@/components/consumer/FeatureGate";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Info, Lock, Minus, Plus, RotateCcw, Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { DoItLaterTabs } from "@/components/layout/DoItLaterTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDoItLaterSwipe } from "@/components/layout/useDoItLaterSwipe";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

import {
 useRecallConfig,
 useRecallInsights,
 useRecallState,
 useRecallSuggestions,
 useRecallUnlock,
 USER_THRESHOLD_MAX,
 USER_THRESHOLD_MIN,
 type RecallMethod,
 type RecallSuggestion,
} from "@/lib/memoryos/recall";

export const Route = createFileRoute("/_authenticated/recall")({ component: () => <FeatureGate slug="recall"><RecallPage /></FeatureGate> });

function fillName(text: string | undefined, name: string): string {
 return (text ?? "").replaceAll("{name}", name);
}

function RecallPage() {
 const swipe = useDoItLaterSwipe();
 const { accent1 } = useCountryTheme();
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent1} ${pct}%, ${base})`;
 
 const { config } = useRecallConfig();
 const { unlocked, progress, threshold, bannerCopy, behavior } = useRecallUnlock();
 const allSuggestions = useRecallSuggestions();
 const insights = useRecallInsights();
 const { state, acceptSuggestion, resetDismissed, setUserThreshold } = useRecallState();
 const [activeIndex, setActiveIndex] = useState(0);
 const [methodIndex, setMethodIndex] = useState(0);
 const [accepted, setAccepted] = useState<string | null>(null);
 const [emotionFilter, setEmotionFilter] = useState<string>("all");

 // Emotion tabs auto-derived from live suggestions — new categories/packs appear on their own.
 const emotionTabs = useMemo(() => {
 const seen = new Map<string, { key: string; label: string; count: number }>();
 allSuggestions.forEach((s) => {
 const e = (s.rule.emotion || "").trim();
 if (!e) return;
 const cur = seen.get(e);
 if (cur) cur.count += 1;
 else seen.set(e, { key: e, label: e, count: 1 });
 });
 return [
 { key: "all", label: `All · ${allSuggestions.length}`, count: allSuggestions.length },
 ...Array.from(seen.values()).map((v) => ({ ...v, label: `${v.label} · ${v.count}` })),
 ];
 }, [allSuggestions]);

 const suggestions = useMemo(() => {
 if (emotionFilter === "all") return allSuggestions;
 return allSuggestions.filter((s) => (s.rule.emotion || "").trim() === emotionFilter);
 }, [allSuggestions, emotionFilter]);

 const safeIndex = suggestions.length ? Math.min(activeIndex, suggestions.length - 1) : 0;
 const activeSuggestion = suggestions[safeIndex] ?? null;
 const activeMethods = activeSuggestion?.methods.length ? activeSuggestion.methods : activeSuggestion ? [activeSuggestion.primaryMethod] : [];
 const activeMethod = activeMethods[methodIndex % Math.max(1, activeMethods.length)] ?? null;

 const goSuggestion = (direction: 1 | -1) => {
 if (!suggestions.length) return;
 setActiveIndex((i) => {
 const base = Math.min(i, suggestions.length - 1);
 return (base + direction + suggestions.length) % suggestions.length;
 });
 setMethodIndex(0);
 setAccepted(null);
 };

 const accept = () => {
 if (!activeSuggestion || !activeMethod) return;
 acceptSuggestion(activeSuggestion.id, activeSuggestion.rule.id, activeMethod.id);
 setAccepted(activeSuggestion.id);
 };


 if (!unlocked && behavior !== "hide") {
 return (
 <PhoneFrame>
 <div {...swipe} className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
 <div className="flex-1 px-6 pt-8 pb-32">
 <PageHeader
 eyebrow="Do it Later · Recall"
 title="Patterns first. Recall next."
 lede={config.heroCopy}
 accent={accent1}
 />
 <DoItLaterTabs />


 <div
 className="rounded-3xl p-6 border text-center overflow-hidden"
 style={{
 background: `linear-gradient(135deg, ${tint(30, "var(--canvas)")} 0%, ${tint(14, "var(--canvas)")} 58%, var(--canvas) 100%)`,
 borderColor: tint(45),
 }}
 >
 <div className="size-16 mx-auto rounded-full grid place-items-center mb-4" style={{ background: tint(22, "var(--canvas)") }}>
 <Lock className="size-7" style={{ color: accent1 }} aria-hidden="true" />
 </div>
 <p className="t-eyebrow mb-2" style={{ color: accent1 }}>Learning your patterns</p>
 <p className="t-display text-ink mb-2">{bannerCopy}</p>
 <p className="t-meta text-ink/75 mb-5">
 Once similar activities repeat, MinDrop will suggest the best way to remember them next time.
 </p>
 <div className="w-full h-1.5 rounded-full overflow-hidden mb-2" style={{ background: tint(16, "var(--canvas)") }}>
 <div className="h-full transition-all" style={{ width: `${(progress / threshold) * 100}%`, background: accent1 }} />
 </div>
 <p className="t-eyebrow text-ink/70">{progress} of {threshold}</p>
 </div>

 <div className="mt-4 flex justify-center">
 <ThresholdLink
 value={state.userThreshold ?? threshold}
 isCustom={state.userThreshold != null}
 onChange={setUserThreshold}
 />
 </div>
 </div>
 <div aria-hidden="true" className="h-40 shrink-0" />
 <BottomTabs />
 </div>
 </PhoneFrame>
 );
 }


 return (
 <PhoneFrame>
 <div {...swipe} className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
 <div className="flex-1 px-5 sm:px-6 pt-8 pb-32 overflow-x-hidden relative">
 <PageHeader
 eyebrow="Do it Later · Recall"
 title="Next time, remember easier."
 lede={config.heroCopy}
 accent={accent1}
 />
 <DoItLaterTabs />


 <div className="mb-3 flex justify-end">
 <ThresholdLink
 value={state.userThreshold ?? threshold}
 isCustom={state.userThreshold != null}
 onChange={setUserThreshold}
 />
 </div>


 <div className="grid grid-cols-3 gap-2 mb-4">
 <StatCard label="Captures" value={insights.capturesCount} accent={accent1} />
 <StatCard label="Patterns" value={allSuggestions.length} accent={accent1} />
 <StatCard label="Streak" value={`${state.streakDays}d`} accent={accent1} />
 </div>

 {emotionTabs.length > 1 && (
 <div className="-mx-5 sm:-mx-6 px-5 sm:px-6 mb-4 overflow-x-auto no-scrollbar">
 <div className="flex gap-1.5 min-w-max">
 {emotionTabs.map((t) => {
 const active = emotionFilter === t.key;
 return (
 <button
 key={t.key}
 onClick={() => { setEmotionFilter(t.key); setActiveIndex(0); setMethodIndex(0); setAccepted(null); }}
 className={`shrink-0 rounded-full px-3 py-1.5 t-button border transition ${active ? "text-canvas" : "text-ink/70"}`}
 style={{
 background: active ? accent1 : tint(7, "var(--canvas)"),
 borderColor: active ? accent1 : tint(20),
 }}
 >
 {t.label}
 </button>
 );
 })}
 </div>
 </div>
 )}

 {activeSuggestion && activeMethod ? (
 <div data-tour="recall-deck" className="space-y-4">

 <SuggestionCard
 suggestion={activeSuggestion}
 method={activeMethod}
 methods={activeMethods}
 index={safeIndex}
 total={suggestions.length}
 methodIndex={methodIndex % Math.max(1, activeMethods.length)}
 onSelectMethod={(idx) => { setMethodIndex(idx); setAccepted(null); }}
 onPrev={() => goSuggestion(-1)}
 onNext={() => goSuggestion(1)}
 accent={accent1}
 
 onAccept={accept}
 />

 <AnimatePresence>
 {accepted === activeSuggestion.id && (
 <motion.div
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 className="t-body rounded-2xl border px-4 py-3 flex items-center gap-2"
 style={{ background: tint(12, "var(--canvas)"), borderColor: tint(30), color: accent1 }}
 >
 <Check className="size-4" aria-hidden="true" /> Saved as your next recall trick.
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 ) : (
 <EmptyRecall
 title={config.emptyStateTitle}
 copy={config.emptyStateCopy}
 topCategory={insights.topCategory}
 nearMiss={insights.nearMisses[0] ?? null}
 hasDismissed={state.dismissedRuleIds.length > 0}
 onReset={resetDismissed}
 accent={accent1}
 />
 )}
 </div>
 
 <BottomTabs />
 </div>
 </PhoneFrame>
 );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;
 return (
 <div className="rounded-2xl border p-3 min-w-0" style={{ background: `linear-gradient(135deg, ${tint(22, "var(--canvas)")}, ${tint(8, "var(--canvas)")})`, borderColor: tint(28) }}>
 <p className="t-eyebrow text-ink/65 truncate">{label}</p>
 <p className="t-display mt-1 text-ink">{value}</p>
 </div>
 );
}

function ThresholdLink({
 value,
 isCustom,
 onChange,
}: {
 value: number;
 isCustom: boolean;
 onChange: (v: number | null) => void;
}) {
 const [open, setOpen] = useState(false);
 const [draft, setDraft] = useState(value);
 const dec = () => setDraft((v) => Math.max(USER_THRESHOLD_MIN, v - 1));
 const inc = () => setDraft((v) => Math.min(USER_THRESHOLD_MAX, v + 1));

 return (
 <>
 <button
 onClick={() => { setDraft(value); setOpen(true); }}
 className="t-meta text-ink/50 hover:text-ink/80 underline underline-offset-4 decoration-ink/20"
 >
 Trigger: {value} captures{isCustom ? " · custom" : ""}
 </button>

 <Dialog open={open} onOpenChange={setOpen}>
 <DialogContent className="sm:max-w-sm">
 <DialogHeader>
 <DialogTitle className="t-display">Pattern trigger</DialogTitle>
 <DialogDescription className="t-body text-ink/70">
 How many similar captures should MinDrop see before it suggests a recall trick?
 </DialogDescription>
 </DialogHeader>

 <div className="mt-3 rounded-2xl border border-ink/10 bg-card/70 p-5 flex items-center justify-center gap-4">
 <button
 onClick={dec}
 disabled={draft <= USER_THRESHOLD_MIN}
 aria-label="Fewer captures"
 className="size-10 rounded-full bg-canvas border border-ink/15 grid place-items-center text-ink/70 disabled:opacity-40"
 >
 <Minus className="size-4" aria-hidden="true" />
 </button>
 <div className="text-center min-w-16">
 <p className="t-display text-ink tabular-nums">{draft}</p>
 <p className="t-eyebrow text-ink/55 mt-1">captures</p>
 </div>
 <button
 onClick={inc}
 disabled={draft >= USER_THRESHOLD_MAX}
 aria-label="More captures"
 className="size-10 rounded-full bg-canvas border border-ink/15 grid place-items-center text-ink/70 disabled:opacity-40"
 >
 <Plus className="size-4" aria-hidden="true" />
 </button>
 </div>

 <p className="t-meta text-ink/60 text-center mt-2">
 Range {USER_THRESHOLD_MIN}–{USER_THRESHOLD_MAX}. Applies to every pattern instantly.
 </p>

 <div className="mt-4 flex items-center gap-2">
 {isCustom && (
 <button
 onClick={() => { onChange(null); setOpen(false); }}
 className="t-button flex-1 rounded-2xl border border-ink/15 px-4 py-3 text-ink/70"
 >
 Reset to default
 </button>
 )}
 <button
 onClick={() => { onChange(draft); setOpen(false); }}
 className="t-button flex-1 rounded-2xl bg-ink text-canvas px-4 py-3"
 >
 Save
 </button>
 </div>
 </DialogContent>
 </Dialog>
 </>
 );
}


function SuggestionCard({
 suggestion,
 method,
 methods,
 index,
 total,
 methodIndex,
 onSelectMethod,
 onPrev,
 onNext,
 accent,
 onAccept,
}: {
 suggestion: RecallSuggestion;
 method: RecallMethod;
 methods: RecallMethod[];
 index: number;
 total: number;
 methodIndex: number;
 onSelectMethod: (idx: number) => void;
 onPrev: () => void;
 onNext: () => void;
 accent: string;
 onAccept: () => void;
}) {
 const [knowMore, setKnowMore] = useState(false);
 const sample = useMemo(() => suggestion.sampleText.length > 92 ? `${suggestion.sampleText.slice(0, 92)}…` : suggestion.sampleText, [suggestion.sampleText]);
 const emotion = suggestion.rule.emotion;
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;

 return (
 <>
 <motion.section
 key={`${suggestion.id}-${method.id}`}
 drag="x"
 dragConstraints={{ left: 0, right: 0 }}
 dragElastic={0.25}
 onDragEnd={(_, info) => {
 if (info.offset.x < -60) onNext();
 if (info.offset.x > 60) onPrev();
 }}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="rounded-3xl border border-ink/10 overflow-hidden bg-card shadow-sm"
 >
 {/* Header — emotion pill, title, dismiss + prev/next pattern */}
 <div className="p-4 sm:p-5" style={{ background: `linear-gradient(150deg, ${tint(26, "var(--canvas)")} 0%, ${tint(10, "var(--canvas)")} 72%, var(--canvas) 100%)` }}>
 <div className="flex items-start justify-between gap-3 mb-3">
 <div className="min-w-0">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="t-eyebrow text-ink/70">Pattern {index + 1}/{total}</span>
 {emotion && (
 <span className="t-meta inline-flex items-center rounded-full border px-2.5 py-1 text-ink" style={{ background: tint(10, "var(--canvas)"), borderColor: tint(24) }}>
 {emotion}
 </span>
 )}
 </div>
 <h2 className="t-display text-ink mt-2">{suggestion.rule.title}</h2>
 </div>
 <div className="flex items-center gap-1 shrink-0">
 {total > 1 && (
 <>
 <button onClick={onPrev} aria-label="Previous pattern" className="size-8 rounded-full grid place-items-center" style={{ background: tint(10, "var(--canvas)"), color: accent }}>
 <ChevronLeft className="size-4" aria-hidden="true" />
 </button>
 <button onClick={onNext} aria-label="Next pattern" className="size-8 rounded-full grid place-items-center" style={{ background: tint(10, "var(--canvas)"), color: accent }}>
 <ChevronRight className="size-4" aria-hidden="true" />
 </button>
 </>
 )}
 <button onClick={() => setKnowMore(true)} aria-label="Know more" className="t-meta text-ink/45 hover:text-ink/75 underline underline-offset-3 decoration-ink/15 inline-flex items-center gap-1 px-1">
 <Info className="size-3.5" aria-hidden="true" /> Know more
 </button>
 </div>
 </div>

 {/* Method toggle — names only, at the top */}
 <div>
 <p className="t-eyebrow text-ink/60 mb-1.5">Pick a trick</p>
 <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
 {methods.map((m, i) => {
 const active = i === methodIndex;
 return (
 <button
 key={m.id}
 onClick={() => onSelectMethod(i)}
 className={`shrink-0 rounded-full px-3 py-1.5 t-button transition border ${active ? "text-canvas shadow-sm" : "text-ink/75"}`}
 style={{
 background: active ? accent : tint(8, "var(--canvas)"),
 borderColor: active ? accent : tint(20),
 }}
 >
 <span className="mr-1" aria-hidden="true">{m.emoji}</span>
 {m.name}
 </button>
 );
 })}
 </div>
 </div>
 </div>

 {/* Ready-to-use FIRST — content-driven, wraps to any length */}
 <div className="p-3 sm:p-4">
 <ExampleBlock method={method} name={suggestion.rule.sourceName} override={suggestion.rule.methodExamples?.[method.id]} accent={accent} />
 </div>
 </motion.section>


 {/* Know more dialog */}
 <Dialog open={knowMore} onOpenChange={setKnowMore}>
 <DialogContent className="sm:max-w-md">
 <DialogHeader>
 <DialogTitle className="t-display">{suggestion.rule.title}</DialogTitle>
 </DialogHeader>
 <div className="space-y-3 mt-2">
 {emotion && (
 <span className="t-meta inline-flex items-center rounded-full bg-canvas border border-ink/10 px-3 py-1 text-ink">{emotion}</span>
 )}
 <InfoBlock label="Why this appeared" text={`${suggestion.rule.patternCopy} ${suggestion.count} similar captures found.`} />
 <InfoBlock label="What it means" text={suggestion.rule.whyCopy} />
 <InfoBlock label="Why it helps" text={suggestion.rule.benefit} />
 <InfoBlock label={`About "${method.name}"`} text={`${method.instruction} ${method.benefit}`} subtle />
 {sample && <InfoBlock label="Recent example" text={`“${sample}”`} subtle />}
 </div>
 </DialogContent>
 </Dialog>
 </>
 );
}

function ExampleBlock({ method, name, override, accent }: { method: RecallMethod; name: string; override?: import("@/lib/memoryos/recall").MethodExample; accent: string }) {
 const rawTitle = override?.title ?? method.exampleTitle ?? `Your ready-made ${method.name.toLowerCase()}`;
 const rawText = override?.text ?? method.exampleText;
 const rawItems = override?.items ?? method.exampleItems ?? [];
 const imageUrl = override?.imageUrl ?? method.exampleImageUrl;
 const title = fillName(rawTitle, name);
 const text = fillName(rawText, name);
 const items = rawItems.map((i) => fillName(i, name)).filter(Boolean);
 const hasImage = Boolean(imageUrl);
 const hasContent = text || items.length > 0 || hasImage;
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;
 if (!hasContent) return null;
 return (
 <div
 className="rounded-2xl border overflow-hidden"
 style={{ background: tint(13, "var(--canvas)"), borderColor: tint(28) }}
 >
 <div className="px-3.5 py-2.5 flex items-center gap-2.5 border-b border-ink/5">
 <span
 className="t-body size-8 shrink-0 rounded-full grid place-items-center"
 style={{ background: accent }}
 aria-hidden="true"
 >
 {method.emoji}
 </span>
 <div className="min-w-0 flex-1">
 <p className="t-eyebrow text-ink/60">Ready to use</p>
 <p className="t-body text-ink mt-1 break-words">{title}</p>
 </div>
 </div>
 <div className="p-3 space-y-2.5">
 {hasImage && (
 <img
 src={imageUrl}
 alt=""
 className="w-full max-h-36 object-cover rounded-lg border border-ink/10"
 loading="lazy"
 />
 )}
 {text && (
 <p className="t-body text-ink bg-canvas/70 rounded-lg px-3 py-2.5 border border-ink/10">
 {text}
 </p>
 )}
 {items.length > 0 && (
 <ul className="rounded-lg bg-canvas/70 border border-ink/10 divide-y divide-ink/10">
 {items.map((item, idx) => (
 <li key={idx} className="t-body-sm px-3 py-2 flex items-start gap-2.5 text-ink">
 <span className="t-meta mt-0.5 size-4 rounded-full border border-ink/25 grid place-items-center text-ink/60 shrink-0">
 {idx + 1}
 </span>
 <span className="leading-snug">{item}</span>
 </li>
 ))}
 </ul>
 )}
 </div>
 </div>
 );
}

function InfoBlock({ label, text, subtle = false }: { label: string; text: string; subtle?: boolean }) {
 return (
 <div className={`rounded-2xl px-4 py-3 border border-ink/10 ${subtle ? "bg-card/45" : "bg-card/70"}`}>
 <p className="t-eyebrow text-ink/60 mb-1">{label}</p>
 <p className="t-body text-ink/78">{text}</p>
 </div>
 );
}


function EmptyRecall({
 title,
 copy,
 topCategory,
 nearMiss,
 hasDismissed,
 onReset,
 accent,
}: {
 title: string;
 copy: string;
 topCategory: { category: string; count: number } | null;
 nearMiss: { ruleId: string; name: string; count: number; threshold: number } | null;
 hasDismissed: boolean;
 onReset: () => void;
 accent: string;
}) {
 const remaining = nearMiss ? Math.max(0, nearMiss.threshold - nearMiss.count) : 0;
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;
 return (
 <div className="rounded-3xl p-5 border text-center" style={{ background: `linear-gradient(135deg, ${tint(24, "var(--canvas)")}, ${tint(8, "var(--canvas)")})`, borderColor: tint(34) }}>
 <div className="size-14 mx-auto rounded-full grid place-items-center mb-4" style={{ background: tint(18, "var(--canvas)") }}>
 <Sparkles className="size-6" style={{ color: accent }} aria-hidden="true" />
 </div>
 <p className="t-display text-ink">{title}</p>
 <p className="t-body text-ink/75 mt-2">{copy}</p>
 {nearMiss ? (
 <div className="mt-4 rounded-2xl border px-4 py-3" style={{ background: tint(10, "var(--canvas)"), borderColor: tint(28) }}>
 <p className="t-eyebrow" style={{ color: accent }}>Almost a pattern</p>
 <p className="t-display text-ink mt-1">{nearMiss.name} · {nearMiss.count} of {nearMiss.threshold}</p>
 <p className="t-meta text-ink/65 mt-1">
 {remaining === 1
 ? `One more ${nearMiss.name} capture will unlock a recall trick.`
 : `${remaining} more ${nearMiss.name} captures will unlock a recall trick.`}
 </p>
 </div>
 ) : topCategory && (
 <div className="mt-4 rounded-2xl border px-4 py-3" style={{ background: tint(8, "var(--canvas)"), borderColor: tint(22) }}>
 <p className="t-eyebrow text-ink/60">Closest pattern</p>
 <p className="t-display text-ink mt-1">{topCategory.category} · {topCategory.count} capture{topCategory.count === 1 ? "" : "s"}</p>
 </div>
 )}
 {hasDismissed && (
 <div className="mt-5">
 <button onClick={onReset} className="t-eyebrow inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3" style={{ background: tint(8, "var(--canvas)"), borderColor: tint(24), color: accent }}>
 <RotateCcw className="size-3.5" aria-hidden="true" /> Bring back hidden patterns
 </button>
 </div>
 )}
 </div>
 );
}
