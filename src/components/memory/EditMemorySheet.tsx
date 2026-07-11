import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Bell, AlarmClock, Save, ChevronLeft, ArrowRight, Check } from "lucide-react";
import type { Memory } from "@/lib/memoryos/types";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";
import { NextTriggerPreview } from "@/components/reminders/NextTriggerPreview";

interface Props {
  open: boolean;
  memory: Memory | null;
  onClose: () => void;
  onSave: (patch: Partial<Memory>) => void;
}

type WhenId = "hours" | "tomorrow" | "pick";

const STEPS = [
  { title: "Thought", hint: "Edit what MinDrop should remember." },
  { title: "When",    hint: "Which day should we ping you?" },
  { title: "Time",    hint: "Pick a time." },
  { title: "Notify",  hint: "How should we nudge?" },
  { title: "Review",  hint: "Looks good?" },
];

const whenDefs: { id: WhenId; label: string; emoji: string; hint: string }[] = [
  { id: "hours",    label: "Later today", emoji: "⏱️", hint: "Today, at the time you choose" },
  { id: "tomorrow", label: "Tomorrow",    emoji: "🌅", hint: "Pick a time for tomorrow" },
  { id: "pick",     label: "Pick a date", emoji: "📅", hint: "One future date & time" },
];

const fmt12 = (t: string) => { if (!t) return ""; const [hh,mm] = t.split(":").map(Number); const ap = hh>=12?"PM":"AM"; const h = hh%12||12; return `${h}:${String(mm).padStart(2,"0")} ${ap}`; };
const fmtDate = (iso: string) => { if (!iso) return ""; const [y,m,d] = iso.split("-"); return `${d}.${m}.${y}`; };
const toHM = (d: Date) => `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
const toYMD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

export function EditMemorySheet({ open, memory, onClose, onSave }: Props) {
  const { accent1 } = useCountryTheme();
  const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent1} ${pct}%, ${base})`;
  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [when, setWhen] = useState<WhenId>("hours");
  const [time, setTime] = useState("18:00");
  const [pickDate, setPickDate] = useState("");
  const [notify, setNotify] = useState<"notification" | "alarm">("notification");

  useEffect(() => {
    if (!memory) return;
    setText(memory.text);
    setNotify(memory.notify || "notification");
    setStep(0);

    // Prefill day + time from dueAt (fallback: today 6pm)
    const base = memory.dueAt ? new Date(memory.dueAt) : null;
    const now = new Date();
    if (base && !Number.isNaN(base.getTime())) {
      const sameDay = toYMD(base) === toYMD(now);
      const tomorrow = new Date(now); tomorrow.setDate(now.getDate()+1);
      const isTomorrow = toYMD(base) === toYMD(tomorrow);
      setTime(toHM(base));
      if (sameDay) { setWhen("hours"); setPickDate(""); }
      else if (isTomorrow) { setWhen("tomorrow"); setPickDate(""); }
      else { setWhen("pick"); setPickDate(toYMD(base)); }
    } else {
      setWhen("hours"); setTime("18:00"); setPickDate("");
    }
  }, [memory?.id, open]);

  const LAST = STEPS.length - 1;
  const meta = STEPS[step];

  const whenLabel = useMemo(() => {
    if (when === "hours") return `Today at ${fmt12(time)}`;
    if (when === "tomorrow") return `Tomorrow ${fmt12(time)}`;
    if (when === "pick") return pickDate ? `${fmtDate(pickDate)} ${fmt12(time)}` : "Pick a date";
    return "";
  }, [when, time, pickDate]);

  const computeDueAt = (): string | undefined => {
    const now = new Date();
    const [h, m] = time.split(":").map(Number);
    let d: Date | null = null;
    if (when === "hours") { d = new Date(now); d.setHours(h, m, 0, 0); }
    else if (when === "tomorrow") { d = new Date(now); d.setDate(d.getDate()+1); d.setHours(h, m, 0, 0); }
    else if (when === "pick" && pickDate) { d = new Date(`${pickDate}T00:00`); d.setHours(h, m, 0, 0); }
    if (!d || d.getTime() <= now.getTime()) return undefined;
    return d.toISOString();
  };

  const canNext = useMemo(() => {
    if (step === 0) return text.trim().length > 0;
    if (step === 1) return !!when;
    if (step === 2) {
      if (when === "pick" && !pickDate) return false;
      if (!time) return false;
      return !!computeDueAt();
    }
    return true;
  }, [step, text, when, time, pickDate]);

  if (!memory) return null;

  const AUTO_ADVANCE = new Set([1, 3]);

  const next = () => {
    if (!canNext) return;
    if (step === LAST) {
      const dueAt = computeDueAt();
      onSave({ text: text.trim(), date: whenLabel, notify, dueAt });
      return;
    }
    setStep((s) => Math.min(LAST, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const pickWhen = (id: WhenId) => {
    setWhen(id);
    setTimeout(() => setStep((s) => (s === 1 ? 2 : s)), 140);
  };
  const pickNotify = (n: "notification" | "alarm") => {
    setNotify(n);
    setTimeout(() => setStep((s) => (s === 3 ? 4 : s)), 140);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="p-0 overflow-hidden max-w-[440px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-ink/5">
          <div>
            <p className="t-eyebrow text-ink/70">
              ✏️ Edit · Step {step + 1} of {STEPS.length}
            </p>
            <DialogTitle className="t-display text-ink mt-0.5">{meta.title}</DialogTitle>
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 pt-3 flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className="h-0.5 flex-1 rounded-full bg-ink/10 overflow-hidden">
              <div className="h-full transition-all" style={{ width: i <= step ? "100%" : "0%", background: accent1 }} />
            </div>
          ))}
        </div>

        <div className="px-5 pt-3">
          <NextTriggerPreview trigger={whenLabel || "Pick a time"} delivery={notify} />
        </div>

        {/* Body */}
        <div className="px-5 py-5 min-h-[280px] max-h-[60vh] overflow-y-auto transition-all" style={{ background: `linear-gradient(160deg, ${tint(18, "var(--canvas)")} 0%, ${tint(7, "var(--canvas)")} 100%)` }}>
          <p className="t-meta text-ink/75 mb-3">{meta.hint}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <textarea
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="t-body w-full rounded-xl border border-ink/15 px-3 py-2.5 bg-white focus:outline-none focus:border-ink/40 resize-none"
                />
              )}

              {step === 1 && (
                <div className="space-y-2">
                  {whenDefs.map((w) => {
                    const active = when === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => pickWhen(w.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${
                          active ? "border-ink bg-white shadow-md" : "border-white/60 bg-white/70 hover:bg-white"
                        }`}
                      >
                        <span className="t-title">{w.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="t-title text-ink">{w.label}</p>
                          <p className="t-meta text-ink/75 mt-0.5">{w.hint}</p>
                        </div>
                        {active && <Check className="size-4 text-ink" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 2 && (() => {
                const todayIso = (() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`; })();
                const isPast = !!time && !computeDueAt() && (when !== "pick" || !!pickDate);
                return (
                <div className="space-y-3">
                  {when === "pick" && (
                    <div>
                      <label className="t-eyebrow text-ink/70">Date</label>
                      <input type="date" min={todayIso} value={pickDate} onChange={(e) => setPickDate(e.target.value)}
                        className="t-body mt-1 w-full bg-white rounded-lg px-3 py-3 outline-none border border-ink/10 focus:border-ink/40" />
                      {pickDate && <p className="t-meta text-ink/75 mt-1">{fmtDate(pickDate)}</p>}
                    </div>
                  )}
                  <div>
                    <label className="t-eyebrow text-ink/70">
                      {when === "hours" ? "Time today" : when === "tomorrow" ? "Tomorrow at" : "Time"}
                    </label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                      className="t-body mt-1 w-full bg-white rounded-lg px-3 py-3 outline-none border border-ink/10 focus:border-ink/40" />
                    {isPast
                      ? <p className="t-meta mt-2" style={{ color: accent1 }}>That time has already passed — pick a future moment.</p>
                      : <p className="t-meta text-ink/75 mt-2">→ {fmt12(time)}</p>}
                  </div>
                </div>
                );
              })()}

              {step === 3 && (
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
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-white border border-ink/10 px-4 py-3">
                    <p className="t-eyebrow text-ink/60">Thought</p>
                    <p className="t-body text-ink mt-1">“{text}”</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-white border border-ink/10 px-4 py-3">
                      <p className="t-eyebrow text-ink/60">When</p>
                      <p className="t-title text-ink mt-1">{whenLabel}</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-ink/10 px-4 py-3">
                      <p className="t-eyebrow text-ink/60">Nudge</p>
                      <p className="t-title text-ink mt-1 inline-flex items-center gap-1.5 capitalize">
                        {notify === "alarm" ? <AlarmClock className="size-3.5" /> : <Bell className="size-3.5" />}
                        {notify}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-5 py-3 border-t border-ink/5 bg-white">
          <button
            onClick={step === 0 ? onClose : back}
            className="t-button inline-flex items-center gap-1 rounded-xl border border-ink/15 px-3 py-2.5 text-ink/75 hover:bg-ink/5"
          >
            <ChevronLeft className="size-3.5" />
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <div className="flex-1" />
          {!AUTO_ADVANCE.has(step) && (
            <button
              onClick={next}
              disabled={!canNext}
              className="t-button inline-flex items-center gap-1.5 rounded-xl bg-ink text-canvas px-4 py-2.5 hover:bg-ink/90 disabled:opacity-40"
            >
              {step === LAST ? (<><Save className="size-3.5" /> Save changes</>) : (<>Next <ArrowRight className="size-3.5" /></>)}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
