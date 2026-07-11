import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { FeatureGate } from "@/components/consumer/FeatureGate";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ArrowRight, Sparkles, Shield, Wand2, Bell, Clock, Package, MessageCircle, Brain, ListOrdered, Archive, HelpCircle, ChevronDown, X, Lock } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { Switch } from "@/components/ui/switch";
import { useOnboarding, useQuizConfig, type PersonalityToggles, type SetupChoices } from "@/lib/memoryos/store";
import { scorePersonality, type Personality, type PersonalityId } from "@/lib/memoryos/quiz";
import { usePersonalityConfig, useRechallenge, resolveSetupOption, type SetupCategory, type SetupOption } from "@/lib/memoryos/personality";


export const Route = createFileRoute("/_authenticated/quiz")({
 component: () => <FeatureGate slug="quiz"><Quiz /></FeatureGate>,
 validateSearch: (s: Record<string, unknown>) => ({ short: s.short === true || s.short === "true" }),
});

// Per-question vibe — background gradient + accent emoji floating in the back
const VIBES = [
 { from: "#FFE7C2", to: "#FFF7EB", accent: "🍳" },
 { from: "#D9ECFF", to: "#F1F7FF", accent: "🧊" },
 { from: "#E8DCFF", to: "#F6F1FF", accent: "💭" },
 { from: "#FFD9E0", to: "#FFF0F3", accent: "🎈" },
 { from: "#D6F2E0", to: "#EFFBF3", accent: "🌿" },
 { from: "#FFE5B8", to: "#FFF6E3", accent: "🌤" },
 { from: "#E0E4FF", to: "#F2F4FF", accent: "🪐" },
 { from: "#FFD4C2", to: "#FFEDE5", accent: "🔥" },
 { from: "#C8EEF0", to: "#EBFAFB", accent: "🫧" },
 { from: "#F4D9FF", to: "#FAEEFF", accent: "✨" },
];

// Tiny reaction quips shown for ~900ms after each pick. Pure flavour.
const REACTIONS = [
 "Oof. Same.", "Felt that.", "Mood.", "Iconic.", "Classic you.",
 "Caught in 4K.", "Noted.", "Brain logged.", "Big energy.", "We see you.",
];

function Quiz() {
 const navigate = useNavigate();
 const { state, update } = useOnboarding();
 const { config, hydrated } = useQuizConfig();
 const { config: pConfig } = usePersonalityConfig();
 const { markTaken } = useRechallenge();
 const { short } = useSearch({ from: "/quiz" });
 const isRetake = !!state.personality;
 const showWhy = !isRetake && !short;
 const [whyDismissed, setWhyDismissed] = useState(false);
 const [step, setStep] = useState(0);
 const [answers, setAnswers] = useState<Record<string, string[]>>({});
 const [done, setDone] = useState(false);
 const [reaction, setReaction] = useState<string | null>(null);

 const allQuestions = config.questions;
 // Re-takes use a shorter, randomly-picked subset; first-timers see the full set
 const questions = useMemo(() => {
 if (!short && !isRetake) return allQuestions;
 const n = pConfig.engagement.shortQuestionCount;
 return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(n, allQuestions.length));
 }, [allQuestions, short, isRetake, pConfig.engagement.shortQuestionCount]);

 const q = questions[step];
 const vibe = VIBES[step % VIBES.length];

 const result: Personality | null = useMemo(
 () => (done ? scorePersonality(answers, questions, config.personalities) : null),
 [done, answers, questions, config.personalities],
 );

 if (!hydrated) {
 return (
 <PhoneFrame>
 <div className="t-body min-h-screen grid place-items-center text-ink/70">Loading…</div>
 </PhoneFrame>
 );
 }

 if (showWhy && !whyDismissed) {
 return (
 <WhyChallenge onStart={() => setWhyDismissed(true)} onSkip={() => {
 update({ onboarded: true, personality: null, quizSkipped: true });
 navigate({ to: "/home" });
 }} count={questions.length} />
 );
 }

 if (done && result)
 return (
 <Result
 personality={result}
 onContinue={(setupChoices) => {
 // Derive legacy toggles for backward-compat consumers
 const toggles: PersonalityToggles = {
 notify: setupChoices.nudge?.enabled ?? true,
 timing: setupChoices.timing?.enabled ?? true,
 packs: setupChoices.packs?.enabled ?? true,
 copy: setupChoices.copy?.enabled ?? true,
 };
 update({
 personality: result.id,
 quizSkipped: false,
 onboarded: true,
 personalityToggles: toggles,
 setupChoices,
 });
 markTaken();
 navigate({ to: "/home" });
 }}
 />
 );


 const picks = answers[q.id] ?? [];
 const maxPick = q.multi ? q.maxPick ?? 99 : 1;
 const canContinue = picks.length > 0;

 const togglePick = (optId: string) => {
 setAnswers((prev) => {
 const cur = prev[q.id] ?? [];
 if (!q.multi) return { ...prev, [q.id]: [optId] };
 if (cur.includes(optId)) return { ...prev, [q.id]: cur.filter((x) => x !== optId) };
 if (cur.length >= maxPick) return prev;
 return { ...prev, [q.id]: [...cur, optId] };
 });
 if (!q.multi) {
 const r = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
 setReaction(r);
 setTimeout(() => {
 setReaction(null);
 goNext();
 }, 750);
 }
 };

 const goNext = () => {
 if (step < questions.length - 1) setStep(step + 1);
 else setDone(true);
 };
 const goBack = () => step > 0 && setStep(step - 1);
 const skipAll = () => {
 update({ onboarded: true, personality: null, quizSkipped: true });
 navigate({ to: "/home" });
 };

 return (
 <PhoneFrame>
 <div
 className="relative flex flex-col h-full overflow-hidden transition-colors duration-700"
 style={{ background: `linear-gradient(180deg, ${vibe.from} 0%, ${vibe.to} 60%, #FAF7F2 100%)` }}
 >
 {/* Giant floating accent emoji in the background */}
 <motion.div
 key={`bg-${q.id}`}
 initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
 animate={{ opacity: 0.18, scale: 1, rotate: 0 }}
 transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
 className="t-title absolute -top-6 -right-8 pointer-events-none select-none"
 >
 {vibe.accent}
 </motion.div>

 <div className="relative px-5 sm:px-6 md:px-8 pt-4 pb-4 sm:pt-5 sm:pb-5 flex flex-col flex-1 min-h-0">
 {/* Top bar: streak dots + skip */}
 <div className="flex items-center justify-between mb-3 sm:mb-4 shrink-0">
 <div className="flex items-center gap-1.5">
 {questions.map((_, i) => (
 <span
 key={i}
 className={`h-1.5 rounded-full transition-all duration-500 ${
 i < step ? "w-3 bg-ink" : i === step ? "w-6 bg-brand" : "w-1.5 bg-ink/15"
 }`}
 />
 ))}
 </div>
 <button
 onClick={skipAll}
 className="t-eyebrow text-ink/70 hover:text-brand"
 >
 Skip
 </button>
 </div>

 <AnimatePresence mode="wait">
 <motion.div
 key={q.id}
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -16 }}
 transition={{ duration: 0.35 }}
className="flex-1 min-h-0 flex flex-col"
>
<div data-tour="quiz-card" className="mb-2 flex items-center gap-2 shrink-0">
<span className="t-eyebrow text-ink/75 bg-white/70 backdrop-blur px-2 py-1 rounded-full">

 Q{step + 1} / {questions.length}
 </span>
 {q.scene && (
 <span className="t-eyebrow text-ink/70 truncate">
 {q.scene}
 </span>
 )}
 </div>

 <h1 className="t-display mb-1 text-ink shrink-0">{q.title}</h1>
 {q.helper && <p className="t-meta text-ink/75 mb-2 shrink-0">{q.helper}</p>}

 <div data-tour="quiz-options" className="flex-1 min-h-0 flex flex-col gap-2 mt-3 overflow-hidden">
 {q.options.map((o, i) => {
 const on = picks.includes(o.id);
 return (
 <motion.button
 key={o.id}
 initial={{ opacity: 0, x: 14 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
 whileTap={{ scale: 0.97 }}
 onClick={() => togglePick(o.id)}
 className={`group w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border text-left transition-all shadow-sm ${
 on
 ? "bg-ink text-canvas border-ink shadow-md"
 : "bg-white/85 backdrop-blur border-ink/10 hover:border-ink/30"
 }`}
 >
 <span
 className={`size-9 grid place-items-center rounded-lg text-[18px] shrink-0 transition-transform group-hover:scale-110 ${
 on ? "bg-canvas/15" : "bg-ink/5"
 }`}
 >
 {o.emoji ?? "•"}
 </span>
 <span className="t-body flex-1 min-w-0">{o.label}</span>
 {on && q.multi && <span className="t-body text-canvas">✓</span>}
 </motion.button>
 );
 })}
 </div>
 </motion.div>
 </AnimatePresence>


 <div className="relative flex items-center gap-3 pt-3 shrink-0">
 {/* Reaction popup - absolutely centered to the screen width */}
 <div className="pointer-events-none absolute inset-x-0 -top-2 flex justify-center z-10">
 <AnimatePresence>
 {reaction && (
 <motion.div
 initial={{ opacity: 0, y: 6, scale: 0.92 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 4, scale: 0.95 }}
 className="t-button px-4 py-1.5 rounded-full bg-ink text-canvas shadow-lg"
 >
 {reaction}
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {step > 0 ? (
 <button
 onClick={goBack}
 className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-ink/15 text-ink/70 hover:bg-white hover:border-ink/30 transition-colors"
 aria-label="Back"
 >
 <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
 </button>
 ) : (
 <div className="w-11 h-11 shrink-0" />
 )}

 <div className="flex-1" />

 {q.multi ? (
 <button
 onClick={goNext}
 disabled={!canContinue}
 className="t-button shrink-0 flex items-center gap-2 bg-ink text-canvas h-11 px-5 rounded-full disabled:opacity-30 hover:bg-ink/90 transition-colors"
 >
 {step === questions.length - 1 ? "Reveal" : "Next"}
 <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
 </button>
 ) : (
 <div className="w-11 h-11 shrink-0" />
 )}
 </div>

 </div>
 </div>
 </PhoneFrame>
 );
}

const ICON_MAP: Record<string, typeof Bell> = {
 Bell, Clock, Package, MessageCircle, Brain, Shield, ListOrdered, Archive,
};

function Result({ personality, onContinue }: { personality: Personality; onContinue: (choices: SetupChoices) => void }) {
 const { config } = usePersonalityConfig();
 const { state } = useOnboarding();
 const [stage, setStage] = useState<"reveal" | "setup">("reveal");

 // Seed choices from catalog defaults (per-personality)
 const initialChoices = useMemo<SetupChoices>(() => {
 const out: SetupChoices = {};
 for (const cat of config.setupCatalog) {
 const { optionId, enabled } = resolveSetupOption(cat, personality.id, undefined);
 out[cat.id] = { optionId, enabled };
 }
 return out;
 }, [config.setupCatalog, personality.id]);
 const [choices, setChoices] = useState<SetupChoices>(initialChoices);
 const [sheetCat, setSheetCat] = useState<SetupCategory | null>(null);
 const [howFor, setHowFor] = useState<{ cat: SetupCategory; opt: SetupOption } | null>(null);
 const [showMore, setShowMore] = useState(false);

 if (stage === "reveal") {
 return (
 <PhoneFrame>
 <div
 className="relative p-5 sm:p-6 flex flex-col h-full overflow-hidden"
 style={{ background: `radial-gradient(120% 60% at 50% 0%, ${personality.color}55 0%, transparent 60%), #FAF7F2` }}
 >
 {["✨", "🎉", "💫", "🪄", "⭐️"].map((e, i) => (
 <motion.span
 key={i}
 initial={{ opacity: 0, y: -20, x: 0, rotate: 0 }}
 animate={{ opacity: [0, 1, 0], y: 180, x: (i - 2) * 36, rotate: 360 }}
 transition={{ duration: 2.2, delay: 0.2 + i * 0.1, ease: "easeOut" }}
 className="t-title absolute top-8 left-1/2 pointer-events-none"
 aria-hidden="true"
 >{e}</motion.span>
 ))}
 <p className="t-eyebrow text-ink/70 mb-1 relative shrink-0">🧠 Your Memory Type</p>
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
 className="flex-1 min-h-0 flex flex-col items-center text-center overflow-hidden relative"
 >
 <motion.div
 initial={{ rotate: -8, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }}
 transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.1 }}
 className="t-title size-20 sm:size-24 rounded-full grid place-items-center mb-2 mt-1 shadow-xl shrink-0"
 style={{ backgroundColor: personality.color + "33", border: `2px solid ${personality.color}` }}
 >{personality.emoji}</motion.div>
 <h1 className="t-display mb-1 shrink-0">{personality.name}</h1>
 <p className="t-meta text-ink/75 max-w-xs mb-3 shrink-0">{personality.blurb}</p>

 <div className="w-full grid grid-cols-1 gap-2 text-left min-h-0">
 <div className="rounded-xl border border-ink/10 bg-white p-2.5">
 <p className="t-eyebrow text-ink/70 mb-1">You probably remember</p>
 <ul className="t-meta space-y-0.5 text-ink/80">
 {personality.remembers.slice(0, 2).map((r) => (
 <li key={r} className="flex gap-2"><span className="text-brand">✅</span><span>{r}</span></li>
 ))}
 </ul>
 </div>
 <div className="rounded-xl border border-ink/10 bg-white p-2.5">
 <p className="t-eyebrow text-ink/70 mb-1">But often forget</p>
 <ul className="t-meta space-y-0.5 text-ink/80">
 {personality.forgets.slice(0, 2).map((r) => (
 <li key={r} className="flex gap-2"><span className="text-ink/70">❌</span><span>{r}</span></li>
 ))}
 </ul>
 </div>
 </div>
 </motion.div>
 <button
 onClick={() => setStage("setup")}
 className="t-button mt-3 w-full bg-ink text-canvas py-3.5 rounded-2xl shrink-0 inline-flex items-center justify-center gap-2"
 >
 See my smart setup <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden="true" />
 </button>
 </div>
 </PhoneFrame>
 );
 }

 const primary = config.setupCatalog.filter((c) => c.relevantFor.includes(personality.id));
 const more = config.setupCatalog.filter((c) => !c.relevantFor.includes(personality.id));
 const enabledCount = Object.values(choices).filter((c) => c.enabled).length;
 const isFree = state.plan !== "premium";

 const setEnabled = (catId: string, enabled: boolean) =>
 setChoices((prev) => ({ ...prev, [catId]: { ...(prev[catId] ?? { optionId: "" }), enabled } }));
 const setOption = (catId: string, optionId: string) =>
 setChoices((prev) => ({ ...prev, [catId]: { optionId, enabled: prev[catId]?.enabled ?? true } }));

 return (
 <PhoneFrame>
 <div
 className="relative flex flex-col h-full overflow-hidden"
 style={{ background: `radial-gradient(120% 60% at 50% 0%, ${personality.color}44 0%, transparent 55%), #FAF7F2` }}
 >
 <div className="px-5 sm:px-6 pt-5 shrink-0">
 <div className="flex items-center gap-2">
 <button
 onClick={() => setStage("reveal")}
 className="size-8 grid place-items-center rounded-full bg-white/80 border border-ink/15 text-ink/70"
 aria-label="Back"
 >
 <ChevronLeft className="size-4" strokeWidth={2.5} />
 </button>
 <p className="t-eyebrow text-ink/70">Step 2 of 2 · Your setup</p>
 </div>

 <div className="mt-2">
 <h1 className="t-display">
 Tuned for a <span className="t-display" style={{ color: personality.color }}>{personality.name.replace(/^The\s+/, "")}</span>.
 </h1>
 <p className="t-meta text-ink/70 mt-1">
 Tap a row to change the option. Toggle off anything you don't want. Change these anytime in Settings.
 </p>
 </div>
 </div>

 <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 pt-3 pb-3 space-y-2">
 {primary.map((cat, i) => (
 <SetupRow
 key={cat.id}
 index={i}
 cat={cat}
 accent={personality.color}
 choice={choices[cat.id] ?? { optionId: cat.defaultOptionId, enabled: cat.enabledByDefault }}
 onOpen={() => setSheetCat(cat)}
 onToggle={(v) => setEnabled(cat.id, v)}
 onHow={(opt) => setHowFor({ cat, opt })}
 isFree={isFree}
 />
 ))}

 {more.length > 0 && (
 <div className="pt-2">
 <button
 onClick={() => setShowMore((s) => !s)}
 className="t-eyebrow w-full flex items-center justify-between text-ink/60 hover:text-ink py-2"
 >
 <span>More options ({more.length})</span>
 <ChevronDown className={`size-3 transition-transform ${showMore ? "rotate-180" : ""}`} strokeWidth={2.5} />
 </button>
 <AnimatePresence>
 {showMore && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 className="space-y-2 overflow-hidden"
 >
 {more.map((cat, i) => (
 <SetupRow
 key={cat.id}
 index={i}
 cat={cat}
 accent={personality.color}
 choice={choices[cat.id] ?? { optionId: cat.defaultOptionId, enabled: cat.enabledByDefault }}
 onOpen={() => setSheetCat(cat)}
 onToggle={(v) => setEnabled(cat.id, v)}
 onHow={(opt) => setHowFor({ cat, opt })}
 isFree={isFree}
 />
 ))}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 )}
 </div>

 <div className="px-5 sm:px-6 pb-5 pt-2 shrink-0 bg-gradient-to-t from-canvas via-canvas/95 to-transparent">
 <button
 onClick={() => onContinue(choices)}
 className="t-button w-full bg-ink text-canvas py-3.5 rounded-2xl inline-flex items-center justify-center gap-2"
 >
 <Wand2 className="size-3.5" aria-hidden="true" />
 Turn on {enabledCount} smart default{enabledCount === 1 ? "" : "s"}
 </button>
 </div>

 <OptionSheet
 cat={sheetCat}
 personality={personality}
 currentOptionId={sheetCat ? (choices[sheetCat.id]?.optionId || resolveSetupOption(sheetCat, personality.id, undefined).optionId) : ""}
 isFree={isFree}
 onPick={(optId) => { if (sheetCat) setOption(sheetCat.id, optId); setSheetCat(null); }}
 onHow={(opt) => sheetCat && setHowFor({ cat: sheetCat, opt })}
 onClose={() => setSheetCat(null)}
 />

 <HowDialog
 info={howFor}
 personality={personality}
 onClose={() => setHowFor(null)}
 />
 </div>
 </PhoneFrame>
 );
}

function SetupRow({
 cat, index, accent, choice, onOpen, onToggle, onHow, isFree,
}: {
 cat: SetupCategory; index: number; accent: string;
 choice: { optionId: string; enabled: boolean };
 onOpen: () => void; onToggle: (v: boolean) => void; onHow: (opt: SetupOption) => void;
 isFree: boolean;
}) {
 const Icon = ICON_MAP[cat.icon] ?? Bell;
 const on = choice.enabled;
 const opt = cat.options.find((o) => o.id === choice.optionId) ?? cat.options[0];
 const locked = isFree && (cat.premium || opt.premium);
 return (
 <motion.div
 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.03 + index * 0.04 }}
 className={`w-full rounded-2xl border transition-all ${
 on ? "bg-white border-ink/15 shadow-sm" : "bg-white/50 border-ink/10 opacity-70"
 }`}
 >
 <button
 type="button"
 onClick={onOpen}
 className="w-full flex items-center gap-3 p-3 text-left"
 aria-label={`Change ${cat.title}`}
 >
 <span
 className="size-10 grid place-items-center rounded-xl shrink-0"
 style={{ background: on ? accent + "33" : "#EEE8DE" }}
 >
 <Icon className="size-4 text-ink" aria-hidden="true" />
 </span>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-1.5">
 <p className="t-body-sm text-ink truncate">{cat.title}</p>
 {locked && <Lock className="size-2.5 text-ink/60" aria-hidden="true" />}
 </div>
 <p className="t-meta text-ink/80">
 <span className=" text-ink">{opt.label}</span>
 <span className="text-ink/60"> · {opt.preview}</span>
 </p>
 </div>
 <ChevronDown className="size-3.5 -rotate-90 text-ink/40 shrink-0" strokeWidth={2.5} aria-hidden="true" />
 </button>
 <div className="flex items-center justify-between px-3 pb-2 pt-0">
 <button
 type="button"
 onClick={(e) => { e.stopPropagation(); onHow(opt); }}
 className="t-eyebrow inline-flex items-center gap-1 text-ink/60 hover:text-ink"
 >
 <HelpCircle className="size-3" aria-hidden="true" /> How?
 </button>
 <Switch
 checked={on}
 onClick={(e) => e.stopPropagation()}
 onCheckedChange={(v) => onToggle(v)}
 aria-label={on ? "Turn off" : "Turn on"}
 />

 </div>
 </motion.div>
 );
}

function OptionSheet({
 cat, personality, currentOptionId, isFree, onPick, onHow, onClose,
}: {
 cat: SetupCategory | null; personality: Personality; currentOptionId: string;
 isFree: boolean;
 onPick: (optionId: string) => void;
 onHow: (opt: SetupOption) => void;
 onClose: () => void;
}) {
 const navigate = useNavigate();
 return (
 <AnimatePresence>
 {cat && (
 <>
 <motion.div
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={onClose}
 className="absolute inset-0 bg-ink/40 z-40"
 />
 <motion.div
 initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
 transition={{ type: "spring", damping: 32, stiffness: 320 }}
 className="absolute inset-x-0 bottom-0 z-50 bg-canvas rounded-t-3xl border-t border-ink/10 max-h-[80%] flex flex-col"
 >
 <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
 <div>
 <p className="t-eyebrow text-ink/60">{cat.subtitle}</p>
 <h2 className="t-display">{cat.title}</h2>
 </div>
 <button onClick={onClose} className="size-8 grid place-items-center rounded-full bg-ink/5" aria-label="Close">
 <X className="size-4" />
 </button>
 </div>
 <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
 {cat.options.map((opt) => {
 const active = opt.id === currentOptionId;
 const locked = isFree && (cat.premium || opt.premium);
 return (
 <div key={opt.id} className={`rounded-2xl border p-3 ${active ? "border-ink bg-white shadow-sm" : "border-ink/10 bg-white/70"}`}>
 <button
 type="button"
 onClick={() => {
 if (locked) { onClose(); navigate({ to: "/paywall" }); return; }
 onPick(opt.id);
 }}
 className="w-full flex items-start gap-3 text-left"
 >
 <span className={`mt-1 size-4 rounded-full border-2 shrink-0 ${active ? "bg-ink border-ink" : "border-ink/30"}`} aria-hidden="true">
 {active && <span className="block size-1.5 rounded-full bg-canvas m-auto mt-1" />}
 </span>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-1.5">
 <p className="t-title text-ink">{opt.label}</p>
 {locked && <span className="t-eyebrow inline-flex items-center gap-1 bg-ink/10 text-ink/70 px-1.5 py-0.5 rounded-full"><Lock className="size-2.5" />Paid</span>}
 </div>
 <p className="t-meta text-ink/70 mt-0.5">{opt.preview}</p>
 </div>
 </button>
 <button
 type="button"
 onClick={() => onHow(opt)}
 className="t-eyebrow mt-2 inline-flex items-center gap-1 text-ink/60 hover:text-ink"
 >
 <HelpCircle className="size-3" /> How does this help?
 </button>
 </div>
 );
 })}
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
}

function HowDialog({
 info, personality, onClose,
}: {
 info: { cat: SetupCategory; opt: SetupOption } | null;
 personality: Personality;
 onClose: () => void;
}) {
 return (
 <AnimatePresence>
 {info && (
 <>
 <motion.div
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={onClose}
 className="absolute inset-0 bg-ink/40 z-40"
 />
 <motion.div
 initial={{ opacity: 0, y: 20, scale: 0.96 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 20, scale: 0.96 }}
 className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-canvas border border-ink/10 rounded-3xl p-5 shadow-2xl"
 >
 <div className="flex items-start gap-3">
 <span
 className="t-title size-10 grid place-items-center rounded-xl shrink-0"
 style={{ background: personality.color + "33" }}
 >{personality.emoji}</span>
 <div className="flex-1 min-w-0">
 <p className="t-eyebrow text-ink/60">{info.cat.title}</p>
 <h3 className="t-display">{info.opt.label}</h3>
 </div>
 <button onClick={onClose} className="size-8 grid place-items-center rounded-full bg-ink/5" aria-label="Close">
 <X className="size-4" />
 </button>
 </div>
 <p className="t-body-sm text-ink/80 mt-3">{info.opt.how}</p>
 <p className="t-meta text-ink/60 mt-3">
 Picked for a {personality.name.replace(/^The\s+/, "").toLowerCase()} by default — you can change or turn it off.
 </p>
 <button
 onClick={onClose}
 className="t-button mt-4 w-full bg-ink text-canvas py-3 rounded-2xl"
 >
 Got it
 </button>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
}


function WhyChallenge({ onStart, onSkip, count }: { onStart: () => void; onSkip: () => void; count: number }) {
 return (
 <PhoneFrame>
 <div
 className="relative h-full overflow-hidden flex flex-col p-5 sm:p-6"
 style={{ background: "radial-gradient(120% 70% at 30% 10%, #FFE4B533 0%, transparent 60%), linear-gradient(160deg, #FAF7F2 0%, #F4EEE5 100%)" }}
 >
 <motion.div
 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
 className="t-eyebrow text-ink/70 inline-flex items-center gap-1.5 shrink-0"
 >
 <Sparkles className="size-3" aria-hidden="true" /> 2-minute challenge
 </motion.div>

 <motion.h1
 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
 className="t-display mt-2 shrink-0"
 >
 Before we begin —
 <br />
 <span className="t-display text-ink/80">why even bother?</span>
 </motion.h1>

 <motion.p
 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
 className="t-body-sm text-ink/75 mt-2 max-w-md shrink-0"
 >
 {count} quick scenarios. We use your answers to silently tune
 reminders, default times, and which starter packs we show.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
 className="mt-3 space-y-2 flex-1 min-h-0 overflow-hidden"
 >
 {[
 { icon: "🧠", t: "Smarter defaults", d: "Nudge style and timing pre-set the way your brain works." },
 { icon: "🎒", t: "Better starter packs", d: "We show the kits that fit how you forget." },
 { icon: "🗣️", t: "Tone you'll actually like", d: "Soft pings or firm alarms — whichever lands for you." },
 ].map((b, i) => (
 <motion.div
 key={b.t}
 initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.4 + i * 0.08 }}
 className="flex gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/70 border border-ink/10 backdrop-blur"
 >
 <span className="t-title" aria-hidden="true">{b.icon}</span>
 <div className="min-w-0">
 <p className="t-body-sm text-ink">{b.t}</p>
 <p className="t-meta text-ink/75 mt-0.5">{b.d}</p>
 </div>
 </motion.div>
 ))}
 </motion.div>

 <motion.div
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
 className="t-eyebrow flex items-center gap-2 text-ink/70 mb-2 mt-2 shrink-0"
 >
 <Shield className="size-3" aria-hidden="true" /> Stays on your device. Retake or skip anytime.
 </motion.div>

 <div className="flex gap-2 shrink-0">
 <button
 onClick={onSkip}
 className="t-button flex-1 py-3.5 rounded-2xl bg-white/70 border border-ink/15 text-ink/75"
 >
 Skip for now
 </button>
 <button
 onClick={onStart}
 className="t-button flex-[2] py-3.5 rounded-2xl bg-ink text-canvas inline-flex items-center justify-center gap-2"
 >
 <Wand2 className="size-3.5" /> Let's go
 </button>
 </div>
 </div>
 </PhoneFrame>
 );
}

