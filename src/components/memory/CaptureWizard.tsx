import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Bell, AlarmClock, ChevronLeft, ArrowRight, Check, X, ImagePlus, Trash2, Mic, Square, Play, Pause, PencilLine, Repeat, CalendarRange } from "lucide-react";
import { useCategories, type Category, useMemories } from "@/lib/memoryos/store";
import { usePersonalityDefaults } from "@/lib/memoryos/personality";
import type { Pack } from "@/lib/memoryos/packs";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { VoicePlayer } from "./VoicePlayer";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";
import { SmartPermissionPrompt, type PromptKind } from "@/components/permissions/SmartPermissionPrompt";
import { isNative as isNativePerm, readPermissions, shouldPrompt } from "@/lib/permissions/state";
import { AlarmsBridge, type AlarmsStatus } from "@/lib/alarms/bridge";

export type CaptureSubmit = {
 text: string;
 when: string;
 category: string;
 categoryId?: string;
 notify: "notification" | "alarm";
 imageUrl?: string;
 audioUrl?: string;
 audioDuration?: number;
 dueAt?: string;
 recurrence?: "once" | "daily";
 until?: string;
 kind?: "note" | "recording";
};

interface Props {
 open: boolean;
 onClose: () => void;
 plan?: "free" | "premium" | null;
 onUpgrade?: () => void;
 onSubmit: (data: CaptureSubmit) => void;
 initial?: {
 text?: string;
 timeOfDay?: string;
 notify?: "notification" | "alarm";
 };
 /** capture = full flow. pack = no mode/category/photo, with pack context. */
 mode?: "capture" | "pack";
 pack?: Pack | null;
 title?: string;
 submitLabel?: string;
}

type StepKey = "mode" | "category" | "record" | "details" | "when" | "time" | "frequency" | "notify" | "photo" | "review";
type WhenId = "hours" | "tomorrow" | "pick";
type FreqId = "once" | "daily" | "range";
type WhenDef = { id: WhenId; label: string; emoji: string; premiumOnly: boolean; hint?: string };

const whenDefs: WhenDef[] = [
 { id: "hours", label: "In a few hours", emoji: "⏱️", premiumOnly: false, hint: "Today, at the time you choose" },
 { id: "tomorrow", label: "Tomorrow", emoji: "🌅", premiumOnly: true, hint: "Pick a time for tomorrow" },
 { id: "pick", label: "Pick a date", emoji: "📅", premiumOnly: true, hint: "One future date & time" },
];

const STEP_META: Record<StepKey, { title: string; autoAdvance: boolean }> = {
 mode: { title: "How to capture", autoAdvance: true },
 category: { title: "Category", autoAdvance: true },
 record: { title: "Record", autoAdvance: false },
 details: { title: "Details", autoAdvance: false },
 when: { title: "When", autoAdvance: true },
 time: { title: "Time", autoAdvance: false },
 frequency: { title: "Frequency", autoAdvance: false },
 notify: { title: "Notify", autoAdvance: true },
 photo: { title: "Photo", autoAdvance: false },
 review: { title: "Review", autoAdvance: false },
};

const fmtDate = (iso: string) => { if (!iso) return ""; const [y,m,d] = iso.split("-"); return `${d}.${m}.${y}`; };
const fmt12 = (t: string) => { if (!t) return ""; const [hh,mm] = t.split(":").map(Number); const ap = hh>=12?"PM":"AM"; const h = hh%12||12; return `${h}:${String(mm).padStart(2,"0")} ${ap}`; };
const todayIso = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`; };
const mmss = (s: number) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
const placeholders = (tpl: string) => Array.from(tpl.matchAll(/\{([^}]+)\}/g)).map((m) => m[1]);
const fillTemplate = (tpl: string, vals: Record<string,string>) => tpl.replace(/\{([^}]+)\}/g, (_, k) => (vals[k]?.trim() ? vals[k] : `{${k}}`));

export function CaptureWizard({ open, onClose, plan, onUpgrade, onSubmit, initial, mode = "capture", pack = null, title, submitLabel }: Props) {
 const { list } = useCategories();
 const { accent1 } = useCountryTheme();
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent1} ${pct}%, ${base})`;
 const pDef = usePersonalityDefaults();
 const kb = useKeyboardInset();

  const [captureMode, setCaptureMode] = useState<"note" | "recording">("note");
  const [step, setStep] = useState(0);
  const [upgradePrompt, setUpgradePrompt] = useState<{ label: string; emoji: string } | null>(null);
  const { list: memoriesAll } = useMemories();
  const [pendingPerms, setPendingPerms] = useState<PromptKind[]>([]);
  const [pendingPayload, setPendingPayload] = useState<CaptureSubmit | null>(null);

 // Steps for the current mode
 const activeSteps: StepKey[] = useMemo(() => {
 if (mode === "pack") return ["details", "when", "time", "frequency", "notify", "review"];
 if (captureMode === "recording") return ["mode", "record", "when", "time", "frequency", "notify", "review"];
 return ["mode", "category", "details", "when", "time", "frequency", "notify", "photo", "review"];
 }, [mode, captureMode]);
 const LAST = activeSteps.length - 1;
 const key = activeSteps[Math.min(step, LAST)];
 const stepMeta = STEP_META[key];

 const orderedWhenDefs = useMemo(() => {
 const map = new Map(whenDefs.map((w) => [w.id, w]));
 return pDef.whenOrder
 .map((id) => map.get(id as WhenId))
 .filter(Boolean) as WhenDef[];
 }, [pDef.whenOrder]);

 const packCategory: Category | null = useMemo(() => {
 if (mode !== "pack" || !pack) return null;
 const found = list.find((c) => c.id === pack.primaryCategoryId);
 if (found) return found;
 return { id: pack.primaryCategoryId, label: pack.name, emoji: pack.emoji, template: "", color: accent1, benefit: "" };
 }, [mode, pack, list, accent1]);

 const [cat, setCat] = useState<Category | null>(packCategory);
 const [vals, setVals] = useState<Record<string,string>>({});
 const [freeText, setFreeText] = useState("");
 const [when, setWhen] = useState<WhenId>("hours");
 const [hoursTime, setHoursTime] = useState("18:00");
 const [tomorrowTime, setTomorrowTime] = useState(pDef.defaultTomorrowTime);
 const [pickDate, setPickDate] = useState("");
 const [pickTime, setPickTime] = useState("09:00");
 const [freq, setFreq] = useState<FreqId>("once");
 const [rangeEnd, setRangeEnd] = useState("");
 const [notify, setNotify] = useState<"notification" | "alarm">(pDef.defaultNotify);
 const [imageUrl, setImageUrl] = useState<string>("");
 const [audioUrl, setAudioUrl] = useState<string>("");
 const [audioDuration, setAudioDuration] = useState<number>(0);

 // Reset when opening or when pack changes
 useEffect(() => {
 if (!open) return;
 setStep(0);
 setCaptureMode("note");
 setCat(packCategory);
 setVals({}); setFreeText(initial?.text ?? "");
 setWhen("hours");
 setHoursTime(initial?.timeOfDay ?? "18:00");
 setTomorrowTime(pDef.defaultTomorrowTime);
 setPickTime(initial?.timeOfDay ?? "09:00");
 setPickDate("");
 setFreq("once"); setRangeEnd("");
 setNotify(initial?.notify ?? pDef.defaultNotify);
 setImageUrl(""); setAudioUrl(""); setAudioDuration(0);
 setUpgradePrompt(null);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [open, pack?.id, mode, initial?.text, initial?.timeOfDay, initial?.notify]);

 const fields = useMemo(() => (cat ? placeholders(cat.template) : []), [cat]);

 const composedText = useMemo(() => {
 if (captureMode === "recording") return `🎙 Voice note · ${mmss(audioDuration)}`;
 if (!cat) return freeText;
 if (cat.id === "other" || !cat.template) return vals.note || freeText || "";
 return fillTemplate(cat.template, vals);
 }, [cat, vals, freeText, captureMode, audioDuration]);

 const whenLabel = useMemo(() => {
 let base = "";
 if (when === "hours") base = `Today at ${fmt12(hoursTime)}`;
 else if (when === "tomorrow") base = `Tomorrow ${fmt12(tomorrowTime)}`;
 else if (when === "pick") base = pickDate ? `${fmtDate(pickDate)} ${fmt12(pickTime)}` : "Pick a date";
 if (freq === "daily") return `${base} · daily`;
 if (freq === "range" && rangeEnd) return `${base} → ${fmtDate(rangeEnd)} · daily`;
 return base;
 }, [when, hoursTime, tomorrowTime, pickDate, pickTime, freq, rangeEnd]);

 const isFree = plan !== "premium";
 const MIN_LEN = 5;
 const MAX_LEN = 100;
 const validLen = (s: string) => {
 const t = (s || "").trim();
 if (t.length < MIN_LEN) return false;
 if (isFree && t.length > MAX_LEN) return false;
 return true;
 };

 const detailsValid = useMemo(() => {
 if (captureMode === "recording") return true;
 if (!cat) return false;
 if (mode !== "pack" && fields.length > 0) {
 return fields.every((f) => validLen(vals[f] || ""));
 }
 return validLen(freeText);
 }, [cat, mode, fields, vals, freeText, isFree, captureMode]);

 const computeDueAt = (): { dueAt?: string; recurrence?: "once" | "daily"; until?: string } => {
 const now = new Date();
 const setHM = (d: Date, t: string) => { const [h, m] = t.split(":").map(Number); d.setHours(h, m, 0, 0); return d; };
 let base: Date | null = null;
 if (when === "hours") base = setHM(new Date(now), hoursTime);
 else if (when === "tomorrow") { const d = new Date(now); d.setDate(d.getDate() + 1); base = setHM(d, tomorrowTime); }
 else if (when === "pick" && pickDate) base = setHM(new Date(`${pickDate}T00:00`), pickTime);
 if (!base || base.getTime() <= now.getTime()) return {};
 const rec: "once" | "daily" = freq === "once" ? "once" : "daily";
 const until = freq === "range" && rangeEnd ? new Date(`${rangeEnd}T23:59`).toISOString() : undefined;
 return { dueAt: base.toISOString(), recurrence: rec, until };
 };

 const canNext = () => {
 if (key === "mode") return true;
 if (key === "record") return !!audioUrl;
 if (key === "category") return !!cat;
 if (key === "details") return detailsValid;
 if (key === "when") return !!when;
 if (key === "time") {
 if (when === "pick" && !pickDate) return false;
 return !!computeDueAt().dueAt;
 }
 if (key === "frequency") {
 if (freq === "range" && !rangeEnd) return false;
 return true;
 }
 return true;
 };

 const buildPayload = (): CaptureSubmit => {
 const { dueAt, recurrence, until } = computeDueAt();
 return {
 text: composedText,
 when: whenLabel,
 category: captureMode === "recording" ? "Voice" : (cat?.label || "Other"),
 categoryId: captureMode === "recording" ? undefined : cat?.id,
 notify,
 imageUrl: imageUrl || undefined,
 audioUrl: audioUrl || undefined,
 audioDuration: audioDuration || undefined,
 dueAt,
 recurrence,
 until,
 kind: captureMode,
 };
 };

 const finalizeSubmit = (payload: CaptureSubmit) => {
 onSubmit(payload);
 onClose();
 };

 const next = async () => {
    if (!canNext()) return;
    if (step === LAST) {
      const payload = buildPayload();
      const needed: PromptKind[] = [];
      try {
        const snap = await readPermissions();
        // 1 & 2. Notification / Exact Alarm based on notify setting
        if (payload.dueAt) {
          if (notify === "notification" && snap.notifications !== "granted") {
            needed.push("notifications");
          } else if (notify === "alarm" && snap.exactAlarm !== "granted") {
            needed.push("exact-alarm");
          }
        }
        // 3, 5, 6. First reminder checks: battery, notification-access, mic
        const isFirstReminder = memoriesAll.length === 0;
        if (isFirstReminder) {
          if (snap.battery !== "granted") needed.push("battery");
          if (snap.notificationAccess !== "granted") needed.push("notification-access");
          if (snap.mic !== "granted") needed.push("mic");
        }
      } catch (e) {
        console.warn("Failed to check JIT permissions on save:", e);
      }

      if (needed.length > 0) {
        setPendingPayload(payload);
        setPendingPerms(needed);
        return;
      }

      finalizeSubmit(payload);
      return;
    }
    setStep((s) => Math.min(LAST, s + 1));
  };
 const back = () => setStep((s) => Math.max(0, s - 1));

 const advanceIf = (currentKey: StepKey) => {
 if (activeSteps[step] === currentKey) setStep((s) => Math.min(LAST, s + 1));
 };

 const pickWhen = (id: WhenId, locked: boolean) => {
 const option = whenDefs.find((w) => w.id === id);
 if (locked) { setUpgradePrompt({ label: option?.label || "Future dates", emoji: option?.emoji || "🌅" }); return; }
 setWhen(id);
 setTimeout(() => advanceIf("when"), 140);
 };

 const pickCategory = (c: Category) => {
 setCat(c); setVals({});
 setTimeout(() => advanceIf("category"), 140);
 };

 const pickNotify = (n: "notification" | "alarm") => {
 setNotify(n);
 setTimeout(() => advanceIf("notify"), 140);
 };

 const pickMode = (m: "note" | "recording") => {
 setCaptureMode(m);
 setTimeout(() => setStep((s) => Math.min(LAST, s + 1)), 140);
 };

 const goToUpgrade = () => { setUpgradePrompt(null); onClose(); onUpgrade?.(); };

 const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0]; if (!file) return;
 const reader = new FileReader();
 reader.onload = () => setImageUrl(String(reader.result || ""));
 reader.readAsDataURL(file);
 };

 const headerTitle = title || (mode === "pack" ? `Add to ${pack?.name ?? "pack"}` : stepMeta.title);

 return (
 <>
 <AnimatePresence>
 {open && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={onClose} className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40" />
 )}
 </AnimatePresence>

 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
 transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
 style={{ bottom: kb, transition: "bottom 240ms cubic-bezier(0.32, 0.72, 0, 1)", willChange: "bottom" }}
 className="fixed inset-x-0 sm:bottom-24 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[calc(100%-1.5rem)] sm:max-w-[440px] z-50"
 >
 <div className="bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl border overflow-hidden" style={{ borderColor: tint(18) }}>
 {/* Header */}
 <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-ink/5">
 <div className="min-w-0">
 <p className="t-eyebrow text-ink/70">
 {mode === "pack" && pack ? <span>{pack.emoji} {pack.name} · </span> : null}
 Step {step + 1} of {activeSteps.length}
 </p>
 <h3 className="t-display text-ink mt-0.5 truncate">{step === 0 && mode === "pack" ? headerTitle : stepMeta.title}</h3>
 </div>
 <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-ink/5 text-ink/75">
 <X className="size-4" aria-hidden="true" />
 </button>
 </div>

 {/* Progress bar */}
 <div className="px-5 pt-3 flex gap-1">
 {activeSteps.map((_, i) => (
 <div key={i} className="h-0.5 flex-1 rounded-full bg-ink/10 overflow-hidden">
 <div className="h-full transition-all" style={{ width: i <= step ? "100%" : "0%", background: accent1 }} />
 </div>
 ))}
 </div>

 {/* Body */}
 <div className="px-5 py-5 min-h-[240px] max-h-[60dvh] sm:max-h-[55vh] overflow-y-auto overscroll-contain transition-all" style={{ background: `linear-gradient(160deg, ${tint(18, "var(--canvas)")} 0%, ${tint(7, "var(--canvas)")} 100%)` }}>
 <AnimatePresence mode="wait">
 <motion.div key={key}
 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
 transition={{ duration: 0.2 }}>

 {key === "mode" && (
 <div className="space-y-2.5">
 <p className="t-meta text-ink/75 mb-1">Pick how you'd like to capture this thought.</p>
 {([
 { id: "note", emoji: "📝", label: "Write a note", hint: "Categorise it, add details, get smart recall.", icon: PencilLine },
 { id: "recording", emoji: "🎙️", label: "Record voice", hint: "Tap, talk, done — no typing. Recall is off.", icon: Mic },
 ] as const).map((opt) => {
 const active = captureMode === opt.id;
 const Icon = opt.icon;
 return (
 <button key={opt.id} onClick={() => pickMode(opt.id)}
 className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border text-left transition-all ${
 active ? "border-ink bg-white shadow-md" : "border-white/60 bg-white/80 hover:bg-white"
 }`}>
 <div className="t-title size-11 rounded-2xl bg-ink/5 grid place-items-center shrink-0">{opt.emoji}</div>
 <div className="flex-1 min-w-0">
 <p className="t-title text-ink inline-flex items-center gap-1.5">
 <Icon className="size-3.5" aria-hidden="true" /> {opt.label}
 </p>
 <p className="t-meta text-ink/70 mt-0.5">{opt.hint}</p>
 </div>
 {active && <Check className="size-4 text-ink" />}
 </button>
 );
 })}
 </div>
 )}

 {key === "record" && (
 <RecordStep
 audioUrl={audioUrl}
 setAudioUrl={setAudioUrl}
 duration={audioDuration}
 setDuration={setAudioDuration}
 maxSeconds={isFree ? 15 : 60}
 isFree={isFree}
 accent={accent1}
 onUpgrade={onUpgrade}
 />
 )}

 {key === "category" && (
 <div>
 <p className="t-meta text-ink/75 mb-3">What kind of thing is it?</p>
 <div className="grid grid-cols-3 gap-2">
 {list.map((c) => {
 const active = cat?.id === c.id;
 return (
 <button key={c.id} onClick={() => pickCategory(c)}
 className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all bg-white ${
 active ? "border-ink shadow-sm" : "border-ink/10 hover:border-ink/30"
 }`}>
 <span className="t-title">{c.emoji}</span>
 <span className="t-meta text-ink">{c.label}</span>
 </button>
 );
 })}
 </div>
 </div>
 )}

 {key === "details" && cat && (
 <div className="space-y-3">
 {mode === "pack" && pack ? (
 <div className="t-meta rounded-xl bg-ink/5 px-3 py-2 text-ink/70">
 <span className="t-title mr-1">{pack.emoji}</span>
 This thought will live inside <b className="text-ink">{pack.name}</b> — only for you.
 </div>
 ) : cat.template ? (
 <div className="t-meta rounded-xl bg-ink/5 px-3 py-2 text-ink/70">
 <span className="t-title mr-1">{cat.emoji}</span>Template: <span className="text-ink">{cat.template}</span>
 </div>
 ) : null}
 {mode !== "pack" && fields.length > 0 ? (
 <div className="space-y-2">
 {fields.map((f) => {
 const val = vals[f] || "";
 const trimmed = val.trim();
 const tooShort = trimmed.length > 0 && trimmed.length < MIN_LEN;
 const tooLong = isFree && trimmed.length > MAX_LEN;
 return (
 <div key={f}>
 <label className="t-eyebrow flex items-center justify-between text-ink/70">
 <span>{f} <span style={{ color: accent1 }}>*</span></span>
 <span className="normal-case tracking-normal" style={{ color: tooLong ? accent1 : undefined }}>
 {trimmed.length}{isFree ? `/${MAX_LEN}` : ""}
 </span>
 </label>
 <input autoFocus={f === fields[0]} value={val}
 onChange={(e) => setVals((v) => ({ ...v, [f]: e.target.value }))}
 maxLength={isFree ? MAX_LEN : undefined}
 placeholder={`Enter ${f}… (min ${MIN_LEN} chars)`}
 className="t-body mt-1 w-full bg-white rounded-lg px-3 py-2.5 outline-none border"
 style={{ borderColor: tooShort || tooLong ? accent1 : undefined }} />
 {tooShort && <p className="t-meta mt-1" style={{ color: accent1 }}>Min {MIN_LEN} characters</p>}
 </div>
 );
 })}
 </div>
 ) : (
 <div>
 <textarea autoFocus value={freeText} onChange={(e) => isFree ? setFreeText(e.target.value.slice(0, MAX_LEN)) : setFreeText(e.target.value)}
 maxLength={isFree ? MAX_LEN : undefined}
 placeholder={mode === "pack" && pack ? `Something about ${pack.name.toLowerCase()}… (min ${MIN_LEN} chars)` : `What should MinDrop remember? (min ${MIN_LEN} chars)`}
 className="t-body w-full bg-white rounded-lg px-3 py-2.5 outline-none border border-ink/10 focus:border-ink/40 min-h-20 resize-none" />
 <div className="flex items-center justify-between mt-1">
 <p className="t-meta text-ink/60">
 {freeText.trim().length > 0 && freeText.trim().length < MIN_LEN ? <span style={{ color: accent1 }}>Min {MIN_LEN} characters</span> : `Min ${MIN_LEN}${isFree ? `, max ${MAX_LEN}` : ""} characters`}
 </p>
 <p className="t-meta text-ink/50">{freeText.trim().length}{isFree ? `/${MAX_LEN}` : ""}</p>
 </div>
 {isFree && (
 <p className="t-meta text-ink/50 mt-1">Free plan limit — upgrade for unlimited length.</p>
 )}
 </div>
 )}
 {composedText.trim() && (
 <div className="t-body rounded-xl bg-white border border-dashed border-ink/20 px-3 py-2 text-ink">
 “{composedText}”
 </div>
 )}
 </div>
 )}

 {key === "when" && (
 <div className="space-y-2">
 <p className="t-meta text-ink/75 mb-1">Default: in a few hours. Premium unlocks future dates.</p>
 {orderedWhenDefs.map((w) => {
 const locked = w.premiumOnly && plan !== "premium";
 const active = !locked && when === w.id;
 return (
 <button key={w.id} onClick={() => pickWhen(w.id, locked)}
 className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${
 active ? "border-ink bg-white shadow-md" : locked ? "border-dashed border-ink/25 bg-white/45 opacity-75" : "border-white/60 bg-white/70 hover:bg-white"
 }`}>
 <span className="t-title">{w.emoji}</span>
 <div className="flex-1 min-w-0">
 <p className="t-title text-ink">{w.label}</p>
 {locked
 ? <p className="t-meta text-ink/70 mt-0.5">Premium · tap to see plan</p>
 : w.hint && <p className="t-meta text-ink/75 mt-0.5">{w.hint}</p>}
 </div>
 {locked ? (
 <span className="t-eyebrow inline-flex items-center gap-1 rounded-full bg-ink/5 px-2 py-1 text-ink/75">
 <Lock className="size-3" /> Paid
 </span>
 ) : active && <Check className="size-4 text-ink" />}
 </button>
 );
 })}
 </div>
 )}

 {key === "time" && (() => {
 const { dueAt } = computeDueAt();
 const isPast = !dueAt;
 const pastWarn = <p className="t-meta mt-1.5" style={{ color: accent1 }}>That time has already passed — pick a future moment.</p>;
 return (
 <div className="space-y-3">
 {when === "hours" && (
 <div>
 <label className="t-eyebrow text-ink/70">Time today</label>
 <input type="time" value={hoursTime} onChange={(e) => setHoursTime(e.target.value)}
 className="t-body mt-1 w-full bg-white rounded-lg px-3 py-3 outline-none border border-ink/10 focus:border-ink/40" />
 {isPast ? pastWarn : <p className="t-meta text-ink/75 mt-2">We'll ping you at <b>{fmt12(hoursTime)}</b> today.</p>}
 </div>
 )}
 {when === "tomorrow" && (
 <div>
 <label className="t-eyebrow text-ink/70">Tomorrow at</label>
 <input type="time" value={tomorrowTime} onChange={(e) => setTomorrowTime(e.target.value)}
 className="t-body mt-1 w-full bg-white rounded-lg px-3 py-3 outline-none border border-ink/10 focus:border-ink/40" />
 <p className="t-meta text-ink/75 mt-2">→ {fmt12(tomorrowTime)}</p>
 </div>
 )}
 {when === "pick" && (
 <div className="space-y-3">
 <div>
 <label className="t-eyebrow text-ink/70">Date (DD.MM.YYYY)</label>
 <input type="date" min={todayIso()} value={pickDate} onChange={(e) => setPickDate(e.target.value)}
 className="t-body mt-1 w-full bg-white rounded-lg px-3 py-3 outline-none border border-ink/10 focus:border-ink/40" />
 {pickDate && <p className="t-meta text-ink/75 mt-1">{fmtDate(pickDate)}</p>}
 </div>
 <div>
 <label className="t-eyebrow text-ink/70">Time</label>
 <input type="time" value={pickTime} onChange={(e) => setPickTime(e.target.value)}
 className="t-body mt-1 w-full bg-white rounded-lg px-3 py-3 outline-none border border-ink/10 focus:border-ink/40" />
 {isPast && pickDate ? pastWarn : <p className="t-meta text-ink/75 mt-1">{fmt12(pickTime)}</p>}
 </div>
 </div>
 )}
 </div>
 );
 })()}

 {key === "frequency" && (
 <div className="space-y-2">
 <p className="t-meta text-ink/75 mb-1">How often should we ping you?</p>
 {([
 { id: "once", emoji: "🎯", label: "One time", hint: "Fire once at the chosen time.", premium: false, icon: Check },
 { id: "daily", emoji: "🔁", label: "Daily", hint: "Same time, every day — until you stop it.", premium: true, icon: Repeat },
 { id: "range", emoji: "🗓️", label: "Set date range", hint: "Daily nudges between two dates.", premium: true, icon: CalendarRange },
 ] as const).map((f) => {
 const locked = f.premium && isFree;
 const active = !locked && freq === f.id;
 const Icon = f.icon;
 return (
 <button key={f.id}
 onClick={() => {
 if (locked) { setUpgradePrompt({ label: f.label, emoji: f.emoji }); return; }
 setFreq(f.id);
 if (f.id !== "range") setRangeEnd("");
 }}
 className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${
 active ? "border-ink bg-white shadow-md" : locked ? "border-dashed border-ink/25 bg-white/45 opacity-75" : "border-white/60 bg-white/80 hover:bg-white"
 }`}>
 <div className="t-title size-10 rounded-2xl bg-ink/5 grid place-items-center shrink-0">{f.emoji}</div>
 <div className="flex-1 min-w-0">
 <p className="t-title text-ink inline-flex items-center gap-1.5">
 <Icon className="size-3.5" aria-hidden="true" /> {f.label}
 </p>
 <p className="t-meta text-ink/70 mt-0.5">{f.hint}</p>
 </div>
 {locked ? (
 <span className="t-eyebrow inline-flex items-center gap-1 rounded-full bg-ink/5 px-2 py-1 text-ink/75">
 <Lock className="size-3" /> Paid
 </span>
 ) : active && <Check className="size-4 text-ink" />}
 </button>
 );
 })}
 {freq === "range" && !isFree && (
 <div className="grid grid-cols-2 gap-2 mt-2">
 <div>
 <label className="t-eyebrow text-ink/70">From</label>
 <input type="date" value={pickDate || todayIso()} readOnly
 className="t-body mt-1 w-full bg-white/70 rounded-lg px-3 py-3 outline-none border border-ink/10 text-ink/70" />
 <p className="t-meta text-ink/50 mt-1">Uses your start date.</p>
 </div>
 <div>
 <label className="t-eyebrow text-ink/70">To *</label>
 <input type="date" min={pickDate || todayIso()} value={rangeEnd}
 onChange={(e) => setRangeEnd(e.target.value)}
 className="t-body mt-1 w-full bg-white rounded-lg px-3 py-3 outline-none border border-ink/10 focus:border-ink/40" />
 {rangeEnd && <p className="t-meta text-ink/70 mt-1">Until {fmtDate(rangeEnd)}</p>}
 </div>
 </div>
 )}
 </div>
 )}

  {key === "notify" && (
  <div className="space-y-2">
  <button onClick={() => pickNotify("notification")}
  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all ${
  notify === "notification" ? "border-ink bg-white shadow-md" : "border-white/60 bg-white/70 hover:bg-white"
  }`}>
  <div className="size-10 rounded-full bg-ink/5 flex items-center justify-center"><Bell className="size-5 text-ink" /></div>
  <div className="flex-1 text-left">
  <p className="t-title text-ink">Gentle notification</p>
  <p className="t-meta text-ink/75">A soft push, easy to dismiss.</p>
  </div>
  {notify === "notification" && <Check className="size-4 text-ink" />}
  </button>
  <button onClick={() => pickNotify("alarm")}
  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all ${
  notify === "alarm" ? "border-ink bg-white shadow-md" : "border-white/60 bg-white/70 hover:bg-white"
  }`}>
  <div className="size-10 rounded-full bg-ink/5 flex items-center justify-center"><AlarmClock className="size-5 text-ink" /></div>
  <div className="flex-1 text-left">
  <p className="t-title text-ink">Loud alarm</p>
  <p className="t-meta text-ink/75">Won't let you ignore it.</p>
  </div>
  {notify === "alarm" && <Check className="size-4 text-ink" />}
  </button>
  {notify === "alarm" && <AlarmReadinessNudge />}
  </div>
  )}

 {key === "photo" && (
 <div className="space-y-3">
 {plan !== "premium" ? (
 <div className="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border-2 border-dashed border-ink/20 bg-white">
 <div className="size-12 rounded-full bg-ink/5 flex items-center justify-center">
 <Lock className="size-5 text-ink" />
 </div>
 <div className="text-center">
 <p className="t-title text-ink">Photo attachments</p>
 <p className="t-meta text-ink/75 mt-1">Premium feature — upload receipts, labels, parking spots.</p>
 </div>
 <button
 onClick={() => setUpgradePrompt({ label: "Photo attachments", emoji: "📎" })}
 className="t-button rounded-full bg-ink px-5 py-2.5 text-canvas shadow-lg shadow-ink/20"
 >
 See plan
 </button>
 <p className="t-meta text-ink/70">No photo? No worries — just tap Skip.</p>
 </div>
 ) : (
 <>
 <p className="t-meta text-ink/75">Attach a photo so it clicks faster later — receipt, label, parking spot. Totally optional.</p>
 {imageUrl ? (
 <div className="relative rounded-2xl overflow-hidden border border-ink/10 bg-white">
 <img src={imageUrl} alt="attachment preview" className="w-full max-h-64 object-contain bg-ink/[0.03]" />
 <button onClick={() => setImageUrl("")}
 className="t-eyebrow absolute top-2 right-2 inline-flex items-center gap-1 bg-white/95 text-ink px-2.5 py-1.5 rounded-full shadow border border-ink/10">
 <Trash2 className="size-3" /> Remove
 </button>
 </div>
 ) : (
 <label className="flex flex-col items-center justify-center gap-2 py-10 rounded-2xl border-2 border-dashed border-ink/20 bg-white cursor-pointer hover:border-ink/40 transition-colors">
 <div className="size-12 rounded-full bg-ink/5 flex items-center justify-center">
 <ImagePlus className="size-5 text-ink" />
 </div>
 <p className="t-title text-ink">Upload a photo</p>
 <p className="t-meta text-ink/75">JPG, PNG · up to ~5 MB</p>
 <input type="file" accept="image/*" onChange={onPickImage} className="hidden" />
 </label>
 )}
 <p className="t-meta text-center text-ink/70">No photo? No worries — just tap Skip.</p>
 </>
 )}
 </div>
 )}

 {key === "review" && (
 <div className="space-y-3">
 <div className="rounded-xl p-4 bg-ink/[0.03] border border-ink/10">
 <p className="t-eyebrow text-ink/75 mb-1">
 {captureMode === "recording"
 ? "🎙 Voice note"
 : (mode === "pack" && pack ? `${pack.emoji} ${pack.name}` : `${cat?.emoji} ${cat?.label}`)}
 </p>
 <p className="t-body text-ink">“{composedText}”</p>
 </div>
 {audioUrl && (
 <div className="rounded-xl bg-white border border-ink/10 p-2">
 <VoicePlayer src={audioUrl} knownDuration={audioDuration} className="mt-0" />
 </div>
 )}
 {imageUrl && (
 <div className="rounded-xl overflow-hidden border border-ink/10 bg-white">
 <img src={imageUrl} alt="attachment" className="w-full max-h-40 object-contain bg-ink/[0.03]" />
 </div>
 )}
 <div className="grid grid-cols-2 gap-2">
 <div className="rounded-xl bg-white border border-ink/10 p-3">
 <p className="t-eyebrow text-ink/70">When</p>
 <p className="t-title text-ink mt-1">{whenLabel}</p>
 </div>
 <div className="rounded-xl bg-white border border-ink/10 p-3">
 <p className="t-eyebrow text-ink/70">Nudge</p>
 <p className="t-title text-ink mt-1 capitalize inline-flex items-center gap-1">
 {notify === "notification" ? <Bell className="size-3.5" /> : <AlarmClock className="size-3.5" />} {notify}
 </p>
 </div>
 </div>
 <button onClick={() => setStep(0)} className="t-eyebrow text-ink/70 hover:text-ink">
 ← Start over
 </button>
 </div>
 )}
 </motion.div>
 </AnimatePresence>
 </div>

 {/* Footer nav */}
 <div className="flex items-center justify-between px-5 py-3 bg-white border-t border-ink/5">
 <button onClick={step === 0 ? onClose : back}
 className="t-button inline-flex items-center gap-1 text-ink/75 hover:text-ink px-3 py-2 rounded-full">
 <ChevronLeft className="size-4" /> {step === 0 ? "Cancel" : "Back"}
 </button>
 <div className="flex items-center gap-2">
 {key === "photo" && imageUrl === "" && (
 <button onClick={() => setStep((s) => Math.min(LAST, s + 1))}
 className="t-button text-ink/75 hover:text-ink px-3 py-2 rounded-full">
 Skip
 </button>
 )}
 {!stepMeta.autoAdvance && (
 <button onClick={next} disabled={!canNext()}
 className="t-button inline-flex items-center gap-1.5 text-canvas px-5 py-2.5 rounded-full disabled:opacity-30 transition-opacity"
 style={{ background: accent1 }}>
 {step === LAST ? (submitLabel || (mode === "pack" ? "Add to pack" : "Capture")) : "Next"} <ArrowRight className="size-4" />
 </button>
 )}
 </div>
 </div>
 </div>

 <AnimatePresence>
 {upgradePrompt && (
 <motion.div
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 className="absolute inset-0 z-10 flex items-end sm:items-center justify-center bg-ink/25 backdrop-blur-sm p-3"
 >
 <motion.div
 initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.98 }}
 className="w-full rounded-3xl border shadow-2xl p-5"
 style={{ background: tint(10, "var(--canvas)"), borderColor: tint(30) }}
 >
 <div className="flex items-start gap-3">
 <div className="t-title size-11 rounded-2xl bg-card border grid place-items-center shrink-0" style={{ borderColor: tint(24) }}>
 {upgradePrompt.emoji}
 </div>
 <div className="min-w-0">
 <p className="t-eyebrow" style={{ color: accent1 }}>Paid plan</p>
 <h4 className="t-display text-ink mt-1">Plan ahead, peacefully.</h4>
 <p className="t-body text-ink/65 mt-2">
 Free reminders stay for today. {upgradePrompt.label} is a Premium feature so your future plans don't have to live rent-free in your head.
 </p>
 </div>
 </div>
 <div className="mt-5 grid grid-cols-2 gap-2">
 <button
 onClick={() => setUpgradePrompt(null)}
 className="t-button rounded-full bg-white border border-ink/10 px-4 py-3 text-ink/75 hover:text-ink"
 >
 Not now
 </button>
 <button
 onClick={goToUpgrade}
 className="t-button rounded-full bg-ink px-4 py-3 text-canvas shadow-lg shadow-ink/20"
 >
 See plan
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 )}
  </AnimatePresence>
  <SmartPermissionPrompt
    kind={pendingPerms[0] ?? "notifications"}
    open={pendingPerms.length > 0}
    onResolved={() => {
      setPendingPerms((prev) => {
        const nextList = prev.slice(1);
        if (nextList.length === 0) {
          if (pendingPayload) {
            finalizeSubmit(pendingPayload);
            setPendingPayload(null);
          }
        }
        return nextList;
      });
    }}
  />
 </>
 );
}

/* ─────────────────── Voice recording step ─────────────────── */

function RecordStep({
 audioUrl, setAudioUrl, duration, setDuration, maxSeconds, isFree, accent, onUpgrade,
}: {
 audioUrl: string;
 setAudioUrl: (u: string) => void;
 duration: number;
 setDuration: (n: number) => void;
 maxSeconds: number;
 isFree: boolean;
 accent: string;
 onUpgrade?: () => void;
}) {
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;
 const [recording, setRecording] = useState(false);
 const [paused, setPaused] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [playing, setPlaying] = useState(false);
 const [busy, setBusy] = useState(false);
 const [hitLimit, setHitLimit] = useState(false);
 const recorderRef = useRef<import("@/lib/memoryos/recorder").Recorder | null>(null);
 const timerRef = useRef<number | null>(null);
 const startRef = useRef<number>(0);
 const baseRef = useRef<number>(0); // accumulated seconds before current segment
 const audioElRef = useRef<HTMLAudioElement | null>(null);

 const stopTimer = () => {
 if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null; }
 };
 const stopRef = useRef<() => void>(() => {});
 const startTimer = () => {
 startRef.current = Date.now();
 timerRef.current = window.setInterval(() => {
 const secs = baseRef.current + Math.floor((Date.now() - startRef.current) / 1000);
 setDuration(secs);
 if (secs >= maxSeconds) {
 setHitLimit(true);
 stopRef.current();
 }
 }, 250);
 };

 // Release the mic if user backs out mid-record or tab is hidden.
 useEffect(() => {
 const onHide = () => {
 if (document.visibilityState === "hidden") {
 recorderRef.current?.cancel();
 stopTimer();
 }
 };
 document.addEventListener("visibilitychange", onHide);
 return () => {
 document.removeEventListener("visibilitychange", onHide);
 stopTimer();
 recorderRef.current?.cancel();
 };
 }, []);

 const start = async () => {
 if (busy) return;
 setError(null);
 setHitLimit(false);
 setBusy(true);
 try {
 const { createRecorder, RecorderError } = await import("@/lib/memoryos/recorder");
 const rec = createRecorder();
 recorderRef.current = rec;
 try {
 await rec.start();
 } catch (e: any) {
 if (e instanceof RecorderError) throw e;
 throw new RecorderError("unknown", e?.message || "Couldn't start recording.");
 }
 setAudioUrl("");
 setDuration(0);
 baseRef.current = 0;
 setRecording(true);
 setPaused(false);
 startTimer();
 } catch (e: any) {
 setError(e?.message || "Couldn't start recording.");
 recorderRef.current = null;
 } finally {
 setBusy(false);
 }
 };

 const pause = async () => {
 const rec = recorderRef.current;
 if (!rec || paused) return;
 stopTimer();
 baseRef.current += Math.floor((Date.now() - startRef.current) / 1000);
 try { await rec.pause(); } catch {}
 setPaused(true);
 };

 const resume = async () => {
 const rec = recorderRef.current;
 if (!rec || !paused) return;
 if (baseRef.current >= maxSeconds) return;
 try { await rec.resume(); } catch {}
 setPaused(false);
 startTimer();
 };

 const stop = async () => {
 stopTimer();
 setRecording(false);
 setPaused(false);
 const rec = recorderRef.current;
 if (!rec) return;
 try {
 const result = await rec.stop();
 setAudioUrl(result.audioUrl);
 const rawDuration = Number(result.durationMs) || 0;
 // Web gives milliseconds; some native shells/plugins may already give seconds.
 const seconds = rawDuration > maxSeconds * 10 ? rawDuration / 1000 : rawDuration;
 const secs = Math.min(maxSeconds, Math.max(1, Math.round(seconds)));
 setDuration(secs);
 } catch (e: any) {
 setError(e?.message || "Couldn't finish recording.");
 } finally {
 recorderRef.current = null;
 }
 };
 stopRef.current = stop;

 const discard = () => {
 setAudioUrl("");
 setDuration(0);
 setPlaying(false);
 setError(null);
 setHitLimit(false);
 };

 const remaining = Math.max(0, maxSeconds - duration);

 return (
 <div className="flex flex-col items-center gap-4 py-2">
 <p className="t-meta text-ink/75 text-center">Speak your thought — we'll keep the audio, not the words.</p>

 <div className="relative size-32 rounded-full grid place-items-center transition-all border shadow-inner" style={{ background: recording && !paused ? tint(18, "var(--canvas)") : "var(--card)", borderColor: tint(20) }}>
 {recording && !paused && (
 <motion.div className="absolute inset-0 rounded-full border-2"
 style={{ borderColor: tint(60) }}
 animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.2, 0.6] }}
 transition={{ duration: 1.6, repeat: Infinity }} />
 )}
 {!recording ? (
 <button
 onClick={audioUrl ? discard : start}
 disabled={busy}
 aria-label={audioUrl ? "Discard recording" : "Start recording"}
 className="size-20 rounded-full grid place-items-center text-canvas shadow-lg transition-transform active:scale-95 disabled:opacity-60"
 style={{ background: audioUrl ? "color-mix(in oklab, var(--ink) 70%, transparent)" : accent }}
 >
 {audioUrl ? <Trash2 className="size-8" /> : <Mic className="size-8" />}
 </button>
 ) : (
 <div className="size-20 rounded-full grid place-items-center text-canvas shadow-lg" style={{ background: paused ? tint(60) : accent }}>
 {paused ? <Pause className="size-8 opacity-70" /> : <Mic className="size-8" />}
 </div>
 )}
 </div>

 <div className="text-center">
 <p className="t-title text-ink tabular-nums">{mmss(duration)}</p>
 <p className="t-meta text-ink/60 mt-1">
 {recording
 ? (paused ? `Paused · ${remaining}s left` : `Recording… ${remaining}s left`)
 : audioUrl
 ? (hitLimit ? `Reached ${maxSeconds}s limit${isFree ? " · upgrade for longer notes" : ""}` : "Tap trash to redo")
 : busy ? "Requesting mic…" : `Tap the mic to start · max ${maxSeconds}s`}
 </p>
 </div>

 {recording && (
 <div className="flex items-center gap-3">
 <button
 onClick={paused ? resume : pause}
 aria-label={paused ? "Resume recording" : "Pause recording"}
 className="t-title inline-flex items-center gap-2 rounded-full bg-white border border-ink/15 text-ink px-4 py-2.5 shadow-sm active:scale-95 transition-transform"
 >
 {paused ? <><Mic className="size-4" /> Resume</> : <><Pause className="size-4" /> Pause</>}
 </button>
 <button
 onClick={stop}
 aria-label="Stop and save recording"
 className="t-title inline-flex items-center gap-2 rounded-full bg-ink text-canvas px-5 py-2.5 shadow-md active:scale-95 transition-transform"
 >
 <Square className="size-4" /> Stop & save
 </button>
 </div>
 )}

 {hitLimit && isFree && !recording && (
 <button
 onClick={onUpgrade}
 className="t-meta underline underline-offset-2"
 style={{ color: accent }}
 >
 Upgrade to record up to 1 minute →
 </button>
 )}

 {audioUrl && !recording && (
 <div className="w-full rounded-2xl bg-white border border-ink/10 p-3 flex items-center gap-3">
 <button
 onClick={() => {
 const el = audioElRef.current; if (!el) return;
 if (playing) { el.pause(); setPlaying(false); }
 else { el.play(); setPlaying(true); }
 }}
 aria-label={playing ? "Pause preview" : "Play preview"}
 className="size-10 rounded-full bg-ink text-canvas grid place-items-center shrink-0"
 >
 {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
 </button>
 <div className="flex-1 min-w-0">
 <p className="t-meta text-ink">Voice note</p>
 <p className="t-meta text-ink/60">{mmss(duration)} · ready to save</p>
 </div>
 <audio ref={audioElRef} src={audioUrl} onEnded={() => setPlaying(false)} className="hidden" />
 </div>
 )}

 {error && (
 <div className="t-meta w-full rounded-xl border px-3 py-2 flex items-start gap-2" style={{ background: tint(10, "var(--canvas)"), borderColor: tint(30), color: accent }}>
 <span className="flex-1">{error}</span>
 <button onClick={start} className=" underline underline-offset-2 shrink-0">Retry</button>
 </div>
 )}
 </div>
 );
}

function AlarmReadinessNudge() {
  const [status, setStatus] = useState<AlarmsStatus | null>(null);
  useEffect(() => {
    let alive = true;
    AlarmsBridge.getStatus().then((s) => { if (alive) setStatus(s); });
    return () => { alive = false; };
  }, []);
  if (!status) return null;
  const missing = !status.postNotifications || !status.canScheduleExactAlarms || !status.ignoringBatteryOptimizations;
  if (!missing) return null;
  const fix = !status.postNotifications
    ? { label: "Turn on notifications", open: () => AlarmsBridge.openNotificationSettings() }
    : !status.canScheduleExactAlarms
    ? { label: "Allow exact alarms", open: () => AlarmsBridge.openExactAlarmSettings() }
    : { label: "Unrestrict battery", open: () => AlarmsBridge.openBatteryOptimizationSettings() };
  return (
    <div className="mt-2 rounded-2xl bg-amber-50 border border-amber-200 px-3 py-2.5">
      <p className="t-body-sm text-amber-900">Alarm may not ring on this device.</p>
      <p className="t-meta text-amber-800/80 mt-0.5">{fix.label} so MinDrop can wake the screen and play sound.</p>
      <button
        type="button"
        onClick={() => void fix.open()}
        className="t-eyebrow underline underline-offset-2 mt-1.5 text-amber-900"
      >
        {fix.label} →
      </button>
    </div>
  );
}


