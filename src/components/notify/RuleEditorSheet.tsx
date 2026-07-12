import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Bell, BellRing, Check, Clock, Infinity as InfinityIcon, Search, UserRound, X, Zap, Plus, Trash2, Sparkles } from "lucide-react";
import type { CapturedNotification, FrequencyMode, KnownApp, MatchMode, NotifyRule, PresetId, RemindMode, RuleDelivery, RuleCondition, ConditionField, ConditionOperator } from "@/lib/notify/types";
import { NotifyBridge } from "@/lib/notify/bridge";
import { PRESETS, getPreset } from "@/lib/notify/presets";
import { Switch } from "@/components/ui/switch";
import { NextTriggerPreview } from "@/components/reminders/NextTriggerPreview";
import { isLightColor } from "@/lib/theme/palette";

type Draft = {
 id: string;
 pkg: string;
 appName: string;
 logicalOperator: "AND" | "OR";
 conditions: RuleCondition[];

 // Legacies
 matchMode: MatchMode;
 senderMatch: string;
 includeAny: string;
 excludeAny: string;
 priorityOnly: boolean;
 presetId?: PresetId;
 remindMode?: RemindMode;
 afterHours: number;
 afterMinutes: number;
 frequency?: FrequencyMode;
 rangeStart: string;
 rangeEnd: string;
 remindNote: string;
 delivery: RuleDelivery;
 enabled: boolean;
};

function draftFromRule(r: NotifyRule | null, prefill?: Partial<CapturedNotification>): Draft {
  const today = new Date().toISOString().slice(0, 10);
  const weekLater = new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10);

  let initialConditions = r?.conditions ?? [];
  if (!r && prefill) {
    initialConditions = [];
    if (prefill.title) {
      initialConditions.push({
        id: `cond-sender-${Date.now()}`,
        field: "sender",
        operator: "contains",
        value: prefill.title,
      });
    }
  }

  return {
    id: r?.id ?? `nr-${Date.now()}`,
    pkg: r?.pkg ?? prefill?.pkg ?? "",
    appName: r?.appName ?? prefill?.appName ?? "",
    logicalOperator: r?.logicalOperator ?? "AND",
    conditions: initialConditions,

    // Legacies
    matchMode: r?.matchMode ?? "sender",
    senderMatch: r?.senderMatch ?? prefill?.title ?? "",
    includeAny: (r?.includeAny ?? []).join(", "),
    excludeAny: (r?.excludeAny ?? []).join(", "),
    priorityOnly: r?.priorityOnly ?? false,
    presetId: r?.presetId,
    remindMode: r?.remindMode,
    afterHours: r?.afterHours ?? 0,
    afterMinutes: r?.afterMinutes ?? 30,
    frequency: r?.frequency,
    rangeStart: r?.rangeStart ?? today,
    rangeEnd: r?.rangeEnd ?? weekLater,
    remindNote: r?.remindNote ?? "",
    delivery: r?.delivery ?? "notification",
    enabled: r?.enabled ?? true,
  };
}

function parseCsv(s: string): string[] {
 return s.split(",").map((x) => x.trim()).filter(Boolean);
}

type StepId = "source" | "match" | "when" | "timing" | "delivery" | "frequency" | "note" | "review";

export function RuleEditorSheet({
 open,
 accent,
 onClose,
 onSave,
 rule,
 prefill,
 knownApps,
}: {
 open: boolean;
 accent: string;
 onClose: () => void;
 onSave: (r: NotifyRule) => void;
 rule: NotifyRule | null;
 prefill?: Partial<CapturedNotification>;
 knownApps: KnownApp[];
}) {
 const [draft, setDraft] = useState<Draft>(() => draftFromRule(rule, prefill));
 const [stepIdx, setStepIdx] = useState(0);
 const [appSearch, setAppSearch] = useState("");
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;
 // Subtle neutral palette for selected states inside the sheet — the loud
 // country accent is reserved for tiny hints (check icons, thin rails).
 const NEUTRAL_SEL = { background: "color-mix(in oklab, var(--ink) 6%, var(--canvas))", color: "var(--ink)", borderColor: "color-mix(in oklab, var(--ink) 22%, transparent)" } as const;
 const NEUTRAL_UNSEL = { background: "var(--card)", color: "var(--ink)", borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)" } as const;

  const addCondition = (field: ConditionField) => {
    const id = `cond-${field}-${Date.now()}`;
    let operator: ConditionOperator = "contains";
    let value = "";
    if (field === "otp" || field === "transaction" || field === "link" || field === "priority") {
      operator = "isTrue";
    }
    const newCond: RuleCondition = { id, field, operator, value };
    setDraft(d => ({ ...d, conditions: [...d.conditions, newCond] }));
  };

  const updateCondition = (id: string, updates: Partial<RuleCondition>) => {
    setDraft(d => ({
      ...d,
      conditions: d.conditions.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const removeCondition = (id: string) => {
    setDraft(d => ({
      ...d,
      conditions: d.conditions.filter(c => c.id !== id)
    }));
  };

  const getRuleSummaryText = (conditions: RuleCondition[], operator: "AND" | "OR", appName: string): string => {
    if (!conditions || conditions.length === 0) {
      return `Will trigger for every notification from ${appName || "selected app"}.`;
    }
    
    const parts = conditions.map(c => {
      const isNot = c.operator === "doesNotContain";
      const opText = isNot ? "does not contain" : "contains";
      const opEqText = isNot ? "is not" : "is";
      
      if (c.field === "sender") return `sender ${opText} "${c.value || "..."}"`;
      if (c.field === "text") return `body text ${opText} "${c.value || "..."}"`;
      if (c.field === "otp") return `message ${isNot ? "does not look like" : "looks like"} an OTP / code`;
      if (c.field === "transaction") return `message ${isNot ? "does not look like" : "looks like"} a transaction alert`;
      if (c.field === "link") return `message ${isNot ? "does not contain" : "contains"} web links`;
      if (c.field === "priority") return `priority ${opEqText} High`;
      return "";
    }).filter(Boolean);

    const joiner = operator === "AND" ? " AND " : " OR ";
    return `Will trigger if ${parts.join(joiner)}.`;
  };

 const steps = useMemo<StepId[]>(() => {
 const base: StepId[] = ["source", "match", "when"];
 if (draft.remindMode === "after") base.push("timing");
 base.push("delivery", "frequency", "note", "review");
 return base;
 }, [draft.remindMode]);

 const step = steps[Math.min(stepIdx, steps.length - 1)];

 useEffect(() => {
 if (open) {
 const d = draftFromRule(rule, prefill);
 setDraft(d);
 setStepIdx(rule ? 1 : 0);
 setAppSearch("");
 }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [open, rule?.id, prefill?.id]);

 const canSave = !!(draft.pkg && draft.appName);

 const handleSave = () => {
    if (!canSave) return;
    const remindMode: RemindMode = draft.remindMode ?? "immediate";
    const frequency: FrequencyMode = draft.frequency ?? "once";
    const built: NotifyRule = {
      id: draft.id,
      pkg: draft.pkg,
      appName: draft.appName,
      logicalOperator: draft.logicalOperator,
      conditions: draft.conditions,
      matchMode: draft.conditions.length > 0 ? undefined : draft.matchMode,
      senderMatch: draft.senderMatch.trim(),
      includeAny: parseCsv(draft.includeAny),
      excludeAny: parseCsv(draft.excludeAny),
      priorityOnly: draft.priorityOnly || undefined,
      presetId: draft.presetId,
      remindMode,
      afterHours: remindMode === "after" ? Math.max(0, draft.afterHours) : undefined,
      afterMinutes: remindMode === "after" ? Math.max(0, draft.afterMinutes) : undefined,
      frequency,
      rangeStart: undefined,
      rangeEnd: undefined,
      remindNote: draft.remindNote.trim() || undefined,
      delivery: draft.delivery,
      enabled: draft.enabled,
      createdAt: rule?.createdAt ?? Date.now(),
    };
    onSave(built);
    onClose();
  };

  const pickContact = async () => {
    const c = await NotifyBridge.openContactsPicker();
    if (c.name) {
      setDraft((d) => {
        const idx = d.conditions.findIndex((cond) => cond.field === "sender");
        let newConditions = [...d.conditions];
        if (idx >= 0) {
          newConditions[idx] = { ...newConditions[idx], value: c.name! };
        } else {
          newConditions.push({
            id: `cond-sender-${Date.now()}`,
            field: "sender",
            operator: "contains",
            value: c.name!,
          });
        }
        return {
          ...d,
          senderMatch: c.name!,
          conditions: newConditions,
        };
      });
    }
  };

 const applyPreset = (id: PresetId) => {
 const p = getPreset(id);
 if (!p) return;
 const first = p.packages[0];
 setDraft((d) => ({
 ...d,
 presetId: id,
 pkg: first?.pkg ?? d.pkg,
 appName: first?.appName ?? d.appName,
 matchMode: p.keywords.length ? "topic" : d.matchMode,
 includeAny: p.keywords.join(", "),
 excludeAny: (p.excludes ?? []).join(", "),
 }));
 setStepIdx(1);
 };

 const pickApp = (pkg: string, appName: string) => {
 setDraft((d) => ({ ...d, pkg, appName, presetId: undefined }));
 setStepIdx(1);
 };

 const allApps = useMemo(() => {
 const seen = new Map<string, string>();
 for (const a of knownApps) if (!seen.has(a.pkg)) seen.set(a.pkg, a.appName);
 for (const p of PRESETS) for (const a of p.packages) if (!seen.has(a.pkg)) seen.set(a.pkg, a.appName);
 const list = Array.from(seen, ([pkg, appName]) => ({ pkg, appName }));
 const q = appSearch.trim().toLowerCase();
 return q ? list.filter((a) => a.appName.toLowerCase().includes(q) || a.pkg.toLowerCase().includes(q)) : list;
 }, [knownApps, appSearch]);

 const goNext = () => setStepIdx((i) => Math.min(i + 1, steps.length - 1));
 const goBack = () => setStepIdx((i) => Math.max(i - 1, 0));

 const isLast = step === "review";
 const nextDisabled =
 (step === "source" && !draft.pkg) ||
 (step === "when" && !draft.remindMode) ||
 (step === "timing" && draft.remindMode === "after" && draft.afterHours === 0 && draft.afterMinutes === 0) ||
 (step === "frequency" && !draft.frequency) ||
 (step === "note" && !draft.remindNote.trim());

 const pickWhen = (mode: RemindMode) => {
 setDraft((d) => ({ ...d, remindMode: mode }));
 setStepIdx((i) => Math.min(i + 1, steps.length + 1));
 };

 const pickFrequency = (mode: FrequencyMode) => {
 setDraft((d) => ({ ...d, frequency: mode }));
 setStepIdx((i) => i + 1);
 };

 const stepTitle: Record<StepId, string> = {
 source: "Source",
 match: "Filter",
 when: "When",
 timing: "Timing",
 delivery: "Alarm or nudge",
 frequency: "Frequency",
 note: "What to remind",
 review: "Review",
 };

 const isLight = isLightColor(accent);
 const btnTextColor = isLight ? "#1a1a1a" : "var(--canvas)";

 return (
 <AnimatePresence>
 {open && (
 <>
 <motion.div
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={onClose}
 className="fixed inset-0 bg-ink/50 z-40"
 />
 <motion.div
 initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
 transition={{ type: "spring", damping: 30, stiffness: 300 }}
 className="fixed inset-x-0 bottom-0 z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-[440px] md:w-full rounded-t-[2rem] bg-canvas border-t border-ink/10 max-h-[92dvh] flex flex-col"
 >
 {/* Header */}
 <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-canvas border-b border-ink/5">
 <div className="flex items-center gap-2 min-w-0">
 {stepIdx > 0 && (
 <button
 onClick={goBack}
 aria-label="Back"
 className="size-8 rounded-full grid place-items-center hover:bg-ink/5"
 >
 <ArrowLeft className="size-4" />
 </button>
 )}
 <span className="t-eyebrow text-ink/70 truncate">
 {rule ? "Edit rule" : "New rule"} · {stepTitle[step]}
 </span>
 </div>
 <button
 onClick={onClose}
 aria-label="Close"
 className="size-8 rounded-full grid place-items-center hover:bg-ink/5"
 >
 <X className="size-4" />
 </button>
 </div>

 {/* Progress dots */}
 <div className="px-5 pt-3 flex gap-1.5" aria-hidden="true">
 {steps.map((s, i) => (
 <span
 key={s}
 className="h-1 flex-1 rounded-full transition"
 style={{ background: i <= stepIdx ? "var(--ink)" : "color-mix(in oklab, var(--ink) 12%, transparent)" }}
 />
 ))}
  </div>

 {(() => {
   const appLbl = draft.appName || "any app";
   const senderLbl = draft.matchMode === "sender"
     ? (draft.senderMatch.trim() ? `from ${draft.senderMatch.trim()}` : "from anyone")
     : (parseCsv(draft.includeAny)[0] ? `mentioning “${parseCsv(draft.includeAny)[0]}”` : "");
   const whenLbl = draft.remindMode === "after"
     ? `${draft.afterHours ? `${draft.afterHours}h ` : ""}${draft.afterMinutes || 0}m after`
     : "Right away";
   const triggerLine = `${whenLbl} ${appLbl} pings ${senderLbl}`.replace(/\s+/g, " ").trim();
   const freq = draft.frequency === "once" ? "Just once" : draft.frequency === "always" ? "Every time" : "Every time";
   return (
     <div className="px-5 pt-3">
       <NextTriggerPreview trigger={triggerLine} delivery={draft.delivery} detail={freq} />
     </div>
   );
 })()}

 {/* Body */}
 <div className="px-5 py-5 overflow-y-auto flex-1">
 <AnimatePresence mode="wait">
 <motion.div
 key={step}
 initial={{ opacity: 0, x: 12 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -12 }}
 transition={{ duration: 0.18 }}
 className="space-y-5"
 >
 {step === "source" && (
 <>
 <div>
 <p className="t-display text-ink mb-1">Where should we listen?</p>
 <p className="t-body-sm text-ink/60">Pick a category or a specific app.</p>
 </div>
 <section>
 <p className="t-eyebrow text-ink/70 mb-2">Category presets</p>
 <div className="flex flex-wrap gap-2">
 {PRESETS.map((p) => (
 <button
 key={p.id}
 onClick={() => applyPreset(p.id)}
 className="t-meta px-3.5 py-2 rounded-full border transition inline-flex items-center gap-1.5"
 style={draft.presetId === p.id ? NEUTRAL_SEL : NEUTRAL_UNSEL}
 >
 <span aria-hidden="true">{p.emoji}</span> {p.label}
 </button>
 ))}
 </div>
 </section>
 <section>
 <p className="t-eyebrow text-ink/70 mb-2">Or pick an app</p>
 <div className="relative mb-2">
 <Search className="size-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
 <input
 value={appSearch}
 onChange={(e) => setAppSearch(e.target.value)}
 placeholder="Search apps…"
 className="t-body w-full pl-9 pr-3 py-2.5 rounded-2xl bg-card border focus:outline-none"
 style={{ borderColor: tint(18) }}
 />
 </div>
 <div className="rounded-2xl bg-card border divide-y divide-ink/5 max-h-72 overflow-y-auto" style={{ borderColor: tint(18) }}>
 {allApps.length === 0 && (
 <p className="t-meta text-ink/60 p-4">
 No apps found. Open the Inbox tab — every app that pings you shows up here.
 </p>
 )}
 {allApps.map((a) => (
 <button
 key={a.pkg}
 onClick={() => pickApp(a.pkg, a.appName)}
 className="w-full text-left px-4 py-3 flex items-center justify-between"
 style={{ background: draft.pkg === a.pkg ? tint(10, "var(--canvas)") : undefined }}
 >
 <div className="min-w-0">
 <p className="t-body truncate">{a.appName}</p>
 <p className="t-meta text-ink/50 truncate">{a.pkg}</p>
 </div>
 {draft.pkg === a.pkg && <Check className="size-4 shrink-0" style={{ color: accent }} />}
 </button>
 ))}
 </div>
 <details className="mt-2">
 <summary className="t-meta text-ink/60 cursor-pointer px-1">Enter package name manually</summary>
 <input
 placeholder="com.example.app"
 value={draft.pkg}
 onChange={(e) => setDraft((d) => ({ ...d, pkg: e.target.value, appName: d.appName || e.target.value.split(".").pop() || e.target.value }))}
 className="t-body mt-2 w-full px-3 py-2 rounded-lg bg-card border focus:outline-none"
 style={{ borderColor: tint(18) }}
 />
 </details>
 </section>
 </>
 )}

  {step === "match" && (
    <>
      <div className="space-y-1">
        <p className="t-display text-ink">Narrow it down.</p>
        <p className="t-body-sm text-ink/60">Build dynamic filters to decide exactly when this rule triggers.</p>
      </div>

      {/* Summary Box */}
      <div 
        className="p-4 rounded-3xl border flex items-start gap-3 transition-all"
        style={{ borderColor: tint(18), background: tint(5, "var(--canvas)") }}
      >
        <span className="size-8 rounded-xl bg-ink/5 grid place-items-center text-ink/50 shrink-0 mt-0.5">
          <Sparkles className="size-4" style={{ color: accent }} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">Real-time Rule Preview</p>
          <p className="text-xs font-semibold text-ink/80 mt-1 leading-normal">
            {getRuleSummaryText(draft.conditions, draft.logicalOperator, draft.appName)}
          </p>
        </div>
      </div>

      {/* Logic Operator Toggle */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">Combine Logic</p>
        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-ink/[0.04] border border-ink/10">
          {(["AND", "OR"] as const).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => setDraft((d) => ({ ...d, logicalOperator: op }))}
              className={`py-2 rounded-xl t-button text-xs font-bold transition ${draft.logicalOperator === op ? "bg-white text-ink shadow-sm" : "text-ink/60"}`}
            >
              {op === "AND" ? "Match ALL (AND)" : "Match ANY (OR)"}
            </button>
          ))}
        </div>
      </div>

      {/* Active Conditions Cards */}
      <div className="space-y-2.5">
        {draft.conditions.length > 0 && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">Active Filters</p>
        )}
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
          {draft.conditions.map((cond) => {
            const FieldIcon = cond.field === "sender" ? UserRound 
                            : cond.field === "text" ? Bell
                            : cond.field === "otp" ? Check 
                            : cond.field === "transaction" ? Clock 
                            : cond.field === "link" ? InfinityIcon 
                            : Zap;
                            
            const fieldLabel = cond.field === "sender" ? "Sender"
                             : cond.field === "text" ? "Keywords"
                             : cond.field === "otp" ? "OTP & Codes"
                             : cond.field === "transaction" ? "Money Alerts"
                             : cond.field === "link" ? "Web Links"
                             : "High Priority";

            const isTextMatch = cond.field === "sender" || cond.field === "text";

            return (
              <div 
                key={cond.id} 
                className="p-3.5 rounded-3xl bg-white border border-ink/[0.06] shadow-sm flex flex-col gap-2.5 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="size-7 rounded-xl bg-ink/[0.04] grid place-items-center text-ink/60" style={{ color: accent }}>
                      <FieldIcon className="size-3.5" />
                    </span>
                    <span className="text-xs font-bold text-ink/80">{fieldLabel}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={cond.operator}
                      onChange={(e) => updateCondition(cond.id, { operator: e.target.value as ConditionOperator })}
                      className="text-[10px] font-bold uppercase tracking-wider bg-ink/[0.04] border border-ink/10 rounded-lg px-2 py-1 outline-none text-ink/75 focus:border-ink/20 cursor-pointer"
                    >
                      {isTextMatch ? (
                        <>
                          <option value="contains">Contains</option>
                          <option value="doesNotContain">Excludes (NOT)</option>
                          <option value="equals">Equals</option>
                        </>
                      ) : (
                        <>
                          <option value="isTrue">Matches</option>
                          <option value="doesNotContain">Excludes (NOT)</option>
                        </>
                      )}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeCondition(cond.id)}
                      className="size-7 rounded-full hover:bg-ink/5 grid place-items-center text-ink/40 hover:text-ink/80 transition"
                      aria-label="Remove condition"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {isTextMatch && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cond.value}
                      onChange={(e) => updateCondition(cond.id, { value: e.target.value })}
                      placeholder={cond.field === "sender" ? "Enter sender name..." : "Enter keywords (e.g. urgent, bill)..."}
                      className="flex-1 px-3.5 py-2.5 rounded-2xl bg-card border border-ink/10 text-xs outline-none focus:border-ink/30 transition font-medium"
                    />
                    {cond.field === "sender" && (
                      <button
                        type="button"
                        onClick={pickContact}
                        aria-label="Pick from contacts"
                        className="shrink-0 size-[38px] rounded-2xl bg-card border grid place-items-center hover:bg-ink/5 transition"
                        style={{ borderColor: tint(18) }}
                      >
                        <UserRound className="size-4" style={{ color: accent }} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Match Filter Toggles */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">Add Match Filter</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addCondition("sender")}
            className="t-button text-[10px] font-bold px-3 py-1.5 rounded-full border border-ink/10 bg-white text-ink/70 hover:bg-ink/[0.03] transition-all flex items-center gap-1.5"
          >
            <Plus className="size-3" style={{ color: accent }} />
            Sender
          </button>
          <button
            type="button"
            onClick={() => addCondition("text")}
            className="t-button text-[10px] font-bold px-3 py-1.5 rounded-full border border-ink/10 bg-white text-ink/70 hover:bg-ink/[0.03] transition-all flex items-center gap-1.5"
          >
            <Plus className="size-3" style={{ color: accent }} />
            Keywords
          </button>
          <button
            type="button"
            onClick={() => addCondition("otp")}
            className="t-button text-[10px] font-bold px-3 py-1.5 rounded-full border border-ink/10 bg-white text-ink/70 hover:bg-ink/[0.03] transition-all flex items-center gap-1.5"
          >
            <Plus className="size-3" style={{ color: accent }} />
            OTP / Codes
          </button>
          <button
            type="button"
            onClick={() => addCondition("transaction")}
            className="t-button text-[10px] font-bold px-3 py-1.5 rounded-full border border-ink/10 bg-white text-ink/70 hover:bg-ink/[0.03] transition-all flex items-center gap-1.5"
          >
            <Plus className="size-3" style={{ color: accent }} />
            Money Alerts
          </button>
          <button
            type="button"
            onClick={() => addCondition("link")}
            className="t-button text-[10px] font-bold px-3 py-1.5 rounded-full border border-ink/10 bg-white text-ink/70 hover:bg-ink/[0.03] transition-all flex items-center gap-1.5"
          >
            <Plus className="size-3" style={{ color: accent }} />
            Web Links
          </button>
          <button
            type="button"
            onClick={() => addCondition("priority")}
            className="t-button text-[10px] font-bold px-3 py-1.5 rounded-full border border-ink/10 bg-white text-ink/70 hover:bg-ink/[0.03] transition-all flex items-center gap-1.5"
          >
            <Plus className="size-3" style={{ color: accent }} />
            High Priority
          </button>
        </div>
      </div>
    </>
  )}


 {step === "when" && (
 <>
 <div>
 <p className="t-display text-ink mb-1">When should we remind you?</p>
 <p className="t-body-sm text-ink/60">Right away, or after a bit.</p>
 </div>
 <div className="grid grid-cols-2 gap-2">
 {([
 { id: "immediate" as RemindMode, icon: Zap, label: "Immediately" },
 { id: "after" as RemindMode, icon: Clock, label: "After sometime" },
 ]).map((opt) => {
 const active = draft.remindMode === opt.id;
 const Icon = opt.icon;
 return (
 <button
 key={opt.id}
 onClick={() => pickWhen(opt.id)}
 className="px-3 py-2.5 rounded-xl border transition text-left flex items-center gap-2"
 style={active ? NEUTRAL_SEL : NEUTRAL_UNSEL}
 >
 <Icon className="size-3.5 shrink-0" />
 <p className="t-meta truncate">{opt.label}</p>
 </button>
 );
 })}
 </div>
 </>
 )}

 {step === "timing" && (
 <>
 <div>
 <p className="t-display text-ink mb-1">After how long?</p>
 <p className="t-body-sm text-ink/60">
 e.g. remind me 30 minutes after the message arrives.
 </p>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <label className="block">
 <span className="t-eyebrow text-ink/60">Hours</span>
 <input
 type="number"
 min={0}
 max={72}
 value={draft.afterHours}
 onChange={(e) => setDraft((d) => ({ ...d, afterHours: Math.max(0, +e.target.value || 0) }))}
 className="t-body mt-1 w-full px-4 py-3 rounded-2xl bg-card border focus:outline-none"
 style={{ borderColor: tint(18) }}
 />
 </label>
 <label className="block">
 <span className="t-eyebrow text-ink/60">Minutes</span>
 <input
 type="number"
 min={0}
 max={59}
 value={draft.afterMinutes}
 onChange={(e) => setDraft((d) => ({ ...d, afterMinutes: Math.max(0, +e.target.value || 0) }))}
 className="t-body mt-1 w-full px-4 py-3 rounded-2xl bg-card border focus:outline-none"
 style={{ borderColor: tint(18) }}
 />
 </label>
 </div>
 <div className="flex flex-wrap gap-2">
 {[
 { label: "15 min", h: 0, m: 15 },
 { label: "30 min", h: 0, m: 30 },
 { label: "1 hr", h: 1, m: 0 },
 { label: "2 hr", h: 2, m: 0 },
 ].map((p) => (
 <button
 key={p.label}
 onClick={() => setDraft((d) => ({ ...d, afterHours: p.h, afterMinutes: p.m }))}
 className="t-meta px-3.5 py-1.5 rounded-full border transition"
 style={draft.afterHours === p.h && draft.afterMinutes === p.m ? NEUTRAL_SEL : NEUTRAL_UNSEL}
 >
 {p.label}
 </button>
 ))}
 </div>
 </>
 )}

 {step === "delivery" && (
 <>
 <div>
 <p className="t-display text-ink mb-1">Ring or just nudge?</p>
 <p className="t-body-sm text-ink/60">Loud alarms wake you; nudges are silent heads‑ups.</p>
 </div>
 <div className="grid grid-cols-1 gap-2">
 {([
 { id: "notification" as RuleDelivery, icon: Bell, label: "Silent notification", sub: "A quiet heads‑up in your tray." },
 { id: "alarm" as RuleDelivery, icon: BellRing, label: "Loud alarm", sub: "Rings with your chosen tone, full‑screen." },
 ]).map((opt) => {
 const active = draft.delivery === opt.id;
 const Icon = opt.icon;
 return (
 <button
 key={opt.id}
 onClick={() => setDraft((d) => ({ ...d, delivery: opt.id }))}
 className="px-4 py-3 rounded-2xl border transition text-left flex items-start gap-3"
 style={active ? NEUTRAL_SEL : NEUTRAL_UNSEL}
 >
 <Icon className="size-4 mt-0.5 shrink-0" style={{ color: active ? accent : "var(--ink)" }} />
 <div className="min-w-0">
 <p className="t-body">{opt.label}</p>
 <p className="t-meta opacity-70 mt-0.5">{opt.sub}</p>
 </div>
 {active && <Check className="size-4 ml-auto shrink-0" style={{ color: accent }} />}
 </button>
 );
 })}
 </div>
 </>
 )}



 {step === "frequency" && (
 <>
 <div>
 <p className="t-display text-ink mb-1">How often?</p>
 <p className="t-body-sm text-ink/60">Fire once and archive, or every time the app pings.</p>
 </div>
 <div className="grid grid-cols-1 gap-2">
 {([
 { id: "once" as FrequencyMode, icon: Zap, label: "Just once", sub: "Fires the first time it matches, then archives." },
 { id: "always" as FrequencyMode, icon: InfinityIcon, label: "Every time", sub: "Fires whenever this app pings and the filter matches." },
 ]).map((opt) => {
 const active = draft.frequency === opt.id;
 const Icon = opt.icon;
 return (
 <button
 key={opt.id}
 onClick={() => pickFrequency(opt.id)}
 className="px-3 py-3 rounded-xl border transition text-left flex items-start gap-3"
 style={active ? NEUTRAL_SEL : NEUTRAL_UNSEL}
 >
 <Icon className="size-4 shrink-0 mt-0.5" style={{ color: active ? accent : "var(--ink)" }} />
 <div className="min-w-0">
 <p className="t-body text-ink">{opt.label}</p>
 <p className="t-meta text-ink/60 mt-0.5">{opt.sub}</p>
 </div>
 {active && <Check className="size-4 ml-auto" style={{ color: accent }} />}
 </button>
 );
 })}
 </div>
 </>
 )}


 {step === "note" && (
 <>
 <div>
 <p className="t-display text-ink mb-1">What should we remind you about?</p>
 <p className="t-body-sm text-ink/60">Optional — a short line so future-you knows why this pinged.</p>
 </div>
 <textarea
 value={draft.remindNote}
 onChange={(e) => setDraft((d) => ({ ...d, remindNote: e.target.value }))}
 placeholder="e.g. Reply to Priya about weekend plans"
 rows={4}
 className="t-body w-full px-4 py-3 rounded-2xl bg-card border focus:outline-none resize-none"
 style={{ borderColor: tint(18) }}
 />
 <button
 onClick={goNext}
 className="t-eyebrow text-ink/60"
 >
 Skip →
 </button>
 </>
 )}

 {step === "review" && (
 <>
 <div>
 <p className="t-display text-ink mb-1">Looks good?</p>
 <p className="t-body-sm text-ink/60">Review and save your rule.</p>
 </div>
 <div className="t-body rounded-2xl bg-card border divide-y divide-ink/5" style={{ borderColor: tint(18) }}>
 <Row label="App" value={draft.appName || "—"} sub={draft.pkg} />
 <Row
 label="Filter"
 value={
 draft.matchMode === "sender"
 ? draft.senderMatch || "Anyone"
 : parseCsv(draft.includeAny).join(", ") || "Any message"
 }
 sub={draft.matchMode === "topic" && draft.excludeAny ? `Exclude: ${draft.excludeAny}` : undefined}
 />
 
 <Row
 label="Remind"
 value={
 draft.remindMode === "immediate"
 ? "Right away"
 : `In ${draft.afterHours ? `${draft.afterHours}h ` : ""}${draft.afterMinutes}m`
 }
 />
 <Row
 label="Delivery"
 value={draft.delivery === "alarm" ? "Loud alarm" : "Silent notification"}
 />
  <Row
 label="How often"
 value={draft.frequency === "once" ? "Just once" : "Every time"}
 />

 <Row label="Note" value={draft.remindNote || "—"} />
 </div>
 <label className="flex items-center justify-between p-3 rounded-2xl bg-card border" style={{ borderColor: tint(18) }}>
 <p className="t-body text-ink">Enable rule</p>
 <Switch
 checked={draft.enabled}
 onCheckedChange={(v) => setDraft((d) => ({ ...d, enabled: v }))}
 aria-label="Enable rule"
 style={{ "--switch-accent": accent } as React.CSSProperties}
 />
 </label>
 </>
 )}
 </motion.div>
 </AnimatePresence>
 </div>

 {/* Footer */}
 <div className="px-5 pt-3 pb-4 border-t border-ink/5 bg-canvas">
 {isLast ? (
 <button
 onClick={handleSave}
 disabled={!canSave}
 className="t-button w-full py-3.5 rounded-2xl disabled:opacity-40 shadow-sm transition-all"
 style={{ backgroundColor: accent, color: btnTextColor }}
 >
 Save rule
 </button>
 ) : (
 <button
 onClick={goNext}
 disabled={nextDisabled}
 className="t-button w-full py-3.5 rounded-2xl disabled:opacity-40 shadow-sm transition-all"
 style={{ backgroundColor: accent, color: btnTextColor }}
 >
 Continue
 </button>
 )}
 <div className="mt-2 flex justify-center">
 <button
 onClick={stepIdx > 0 ? goBack : onClose}
 className="t-meta text-ink/50 hover:text-ink transition"
 >
 {stepIdx > 0 ? "← Back" : "Close"}
 </button>
 </div>
  </div>
 </motion.div>

 </>
 )}
 </AnimatePresence>
 );
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
 return (
 <div className="px-4 py-3 flex items-start justify-between gap-3">
 <p className="t-eyebrow text-ink/50 shrink-0 w-20 pt-0.5">{label}</p>
 <div className="min-w-0 text-right">
 <p className="t-body text-ink break-words">{value}</p>
 {sub && <p className="t-meta text-ink/50 mt-0.5 break-words">{sub}</p>}
 </div>
 </div>
 );
}
