import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, Check, Loader2, ExternalLink,
  Sparkles, ShieldCheck,
} from "lucide-react";
import type { ProviderId, SummaryPreset } from "@/lib/notify/summary/types";
import { GUIDES } from "@/lib/notify/summary/onboarding";
import { getProvider } from "@/lib/notify/summary/providers";
import {
  getKey, saveKey, markTested, setActiveProvider, updateModel, getActiveProvider,
} from "@/lib/notify/summary/keyring";
import { usePresets } from "@/lib/notify/summary/sources";
import { SourcesCard } from "@/components/notify/summary/SourcesCard";
import { readSchedule, writeSchedule, armScheduler } from "@/lib/notify/summary/scheduler";
import { estimateCostINR, formatINR } from "@/lib/notify/summary/cost";

export type WizardStep = "provider" | "key" | "sources" | "schedule" | "confirm";
export type WizardMode = "create" | "edit";

const PROVIDERS: ProviderId[] = ["gemini", "openai", "anthropic"];
const STEP_ORDER: WizardStep[] = ["provider", "key", "sources", "schedule", "confirm"];
const STEP_LABEL: Record<WizardStep, string> = {
  provider: "Provider", key: "Key", sources: "Sources", schedule: "Schedule", confirm: "Confirm",
};

export function SummaryWizard({
  accent, initialStep = "provider", mode = "create", onClose, onFinish,
}: {
  accent: string;
  initialStep?: WizardStep;
  mode?: WizardMode;
  onClose: () => void;
  onFinish: (opts: { generateNow: boolean }) => void;
}) {
  const [step, setStep] = useState<WizardStep>(initialStep);
  const [provider, setProvider] = useState<ProviderId>(() => getActiveProvider() ?? "gemini");
  const stepIndex = STEP_ORDER.indexOf(step);
  const canBack = stepIndex > 0 && mode === "create";

  const goNext = (next?: WizardStep) =>
    setStep(next ?? STEP_ORDER[Math.min(stepIndex + 1, STEP_ORDER.length - 1)]);
  const goBack = () => setStep(STEP_ORDER[Math.max(stepIndex - 1, 0)]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-label="Set up AI summary">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[88vh] bg-canvas rounded-t-3xl overflow-hidden shadow-xl flex flex-col">
        <header className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="flex-1 min-w-0">
            <p className="t-eyebrow" style={{ color: accent }}>
              {mode === "edit" ? `EDIT · ${STEP_LABEL[step]}` : `${stepIndex + 1}/${STEP_ORDER.length} · ${STEP_LABEL[step]}`}
            </p>
            {mode === "create" && (
              <div className="flex gap-1 mt-1.5" aria-hidden="true">
                {STEP_ORDER.map((s, i) => (
                  <div key={s} className="h-0.5 flex-1 rounded-full" style={{
                    background: i <= stepIndex ? accent : "color-mix(in oklab, var(--ink) 12%, transparent)",
                  }} />
                ))}
              </div>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-full hover:bg-ink/5">
            <X className="size-5 text-ink/60" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}>
              {step === "provider" && <StepProvider accent={accent} provider={provider}
                onPick={(p) => { setProvider(p); goNext("key"); }} />}
              {step === "key" && <StepKey accent={accent} provider={provider}
                onDone={() => (mode === "edit" ? onFinish({ generateNow: false }) : goNext())}
                editMode={mode === "edit"} />}
              {step === "sources" && <StepSources accent={accent}
                onDone={() => (mode === "edit" ? onFinish({ generateNow: false }) : goNext())}
                editMode={mode === "edit"} />}
              {step === "schedule" && <StepSchedule accent={accent}
                onDone={() => (mode === "edit" ? onFinish({ generateNow: false }) : goNext())}
                editMode={mode === "edit"} />}
              {step === "confirm" && <StepConfirm accent={accent} provider={provider}
                onFinish={(gen) => onFinish({ generateNow: gen })} />}
            </motion.div>
          </AnimatePresence>

          {canBack && (
            <button onClick={goBack} className="mt-4 inline-flex items-center gap-1 t-eyebrow text-ink/60">
              <ArrowLeft className="size-3" aria-hidden="true" /> Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Step 1: Provider ─────────── */

function StepProvider({ accent, provider, onPick }: {
  accent: string; provider: ProviderId; onPick: (p: ProviderId) => void;
}) {
  return (
    <div>
      <h2 className="t-title text-ink mb-3">Pick your AI</h2>
      <div className="space-y-1.5">
        {PROVIDERS.map((id) => {
          const g = GUIDES[id];
          const has = !!getKey(id);
          const sel = provider === id;
          return (
            <button key={id} onClick={() => onPick(id)}
              className="w-full rounded-2xl border p-3 text-left transition flex items-center gap-3"
              style={{
                borderColor: sel ? accent : "color-mix(in oklab, var(--ink) 12%, transparent)",
                background: sel ? `color-mix(in oklab, ${accent} 6%, var(--canvas))` : "var(--canvas)",
              }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="t-body font-semibold text-ink truncate">{g.label}</p>
                  {has && <Check className="size-3.5 shrink-0" style={{ color: accent }} aria-hidden="true" />}
                </div>
                <p className="t-meta text-ink/60 truncate">
                  {g.bestFor}{g.freeTier ? " · Free tier" : ""}
                </p>
              </div>
              <ArrowRight className="size-4 text-ink/40 shrink-0" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── Step 2: API Key ─────────── */

function StepKey({ accent, provider, onDone, editMode }: {
  accent: string; provider: ProviderId; onDone: () => void; editMode: boolean;
}) {
  const guide = GUIDES[provider];
  const prov = getProvider(provider);
  const existing = getKey(provider);
  const [key, setKey] = useState("");
  const [model, setModel] = useState(existing?.model ?? prov.models[0].id);
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  async function saveAndTest() {
    const useKey = key.trim() || existing?.key;
    if (!useKey) return;
    setStatus("testing"); setErrMsg("");
    const res = await prov.testKey(useKey);
    if (res.ok) {
      if (key.trim()) saveKey(provider, key.trim(), model);
      else if (existing && model !== existing.model) updateModel(provider, model);
      markTested(provider, true);
      setActiveProvider(provider);
      setStatus("ok");
      setTimeout(onDone, 400);
    } else {
      setStatus("err");
      setErrMsg(res.error?.slice(0, 160) ?? "Test failed");
      markTested(provider, false);
    }
  }

  const selectedModel = prov.models.find((m) => m.id === model) ?? prov.models[0];
  const estCost = formatINR(estimateCostINR(selectedModel, 3500, 700));

  return (
    <div>
      <h2 className="t-title text-ink mb-1">{guide.label} key</h2>
      <p className="t-meta text-ink/60 mb-3">Stays on this device.</p>

      <input
        type="password" value={key} onChange={(e) => setKey(e.target.value)}
        placeholder={existing ? "Saved · paste to replace" : guide.keyPrefix}
        autoComplete="off"
        className="w-full rounded-xl border border-ink/15 bg-canvas px-3 py-2.5 t-body-sm text-ink mb-2"
      />

      <select value={model} onChange={(e) => setModel(e.target.value)}
        className="w-full rounded-xl border border-ink/15 bg-canvas px-3 py-2 t-body-sm text-ink mb-3">
        {prov.models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label} · {formatINR(estimateCostINR(m, 3500, 700))}/report
          </option>
        ))}
      </select>

      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => setShowHelp((v) => !v)} className="t-meta text-ink/60 underline underline-offset-2">
          {showHelp ? "Hide" : "How to get a key"}
        </button>
        <a href={guide.signupUrl} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1 t-meta ml-auto" style={{ color: accent }}>
          Open {guide.label} <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      </div>

      {showHelp && (
        <ol className="rounded-xl border border-ink/10 bg-canvas p-3 mb-3 list-decimal list-inside space-y-1">
          {guide.steps.map((s, i) => (<li key={i} className="t-meta text-ink/75">{s}</li>))}
        </ol>
      )}

      <motion.button whileTap={{ scale: 0.98 }} onClick={saveAndTest}
        disabled={(!key.trim() && !existing) || status === "testing"}
        className="w-full t-button py-3 rounded-full text-canvas inline-flex items-center justify-center gap-2 disabled:opacity-40"
        style={{ background: accent }}>
        {status === "testing" ? (<><Loader2 className="size-4 animate-spin" /> Testing…</>)
          : status === "ok" ? (<><Check className="size-4" /> Works · {estCost}/report</>)
          : editMode ? "Save & test" : "Test & continue"}
      </motion.button>

      {status === "err" && (
        <p className="mt-2 t-meta" style={{ color: "#c85555" }}>Failed · {errMsg}</p>
      )}
    </div>
  );
}

/* ─────────── Step 3: Sources ─────────── */

function StepSources({ accent, onDone, editMode }: {
  accent: string; onDone: () => void; editMode: boolean;
}) {
  return (
    <div>
      <h2 className="t-title text-ink mb-1">What to summarise</h2>
      <p className="t-meta text-ink/60 mb-3">Default is all apps.</p>
      <SourcesCard accent={accent} />
      <motion.button whileTap={{ scale: 0.98 }} onClick={onDone}
        className="w-full t-button py-3 rounded-full text-canvas inline-flex items-center justify-center gap-2"
        style={{ background: accent }}>
        {editMode ? "Save" : "Continue"} <ArrowRight className="size-4" aria-hidden="true" />
      </motion.button>
    </div>
  );
}

/* ─────────── Step 4: Schedule ─────────── */

function StepSchedule({ accent, onDone, editMode }: {
  accent: string; onDone: () => void; editMode: boolean;
}) {
  const { activeId } = usePresets();
  const [existing] = useState(() => readSchedule());
  const [mode, setMode] = useState<"once" | "daily">(existing.enabled ? "daily" : "once");
  const [hhmm, setHhmm] = useState(existing.hhmm ?? "22:00");

  function save() {
    writeSchedule({
      ...existing,
      enabled: mode === "daily",
      hhmm,
      presetId: activeId,
      rangeDays: 1,
    });
    onDone();
  }

  return (
    <div>
      <h2 className="t-title text-ink mb-1">When?</h2>
      <p className="t-meta text-ink/60 mb-3">Reports cover today only.</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <ChoicePill selected={mode === "once"} accent={accent} label="Just once" onClick={() => setMode("once")} />
        <ChoicePill selected={mode === "daily"} accent={accent} label="Every day" onClick={() => setMode("daily")} />
      </div>

      {mode === "daily" && (
        <label className="flex items-center gap-3 mb-3 rounded-xl border border-ink/10 bg-canvas px-3 py-2">
          <span className="t-body-sm text-ink">Run at</span>
          <input type="time" value={hhmm} onChange={(e) => setHhmm(e.target.value)}
            className="ml-auto rounded-lg border border-ink/15 bg-canvas px-2 py-1 t-body-sm text-ink" />
        </label>
      )}

      <motion.button whileTap={{ scale: 0.98 }} onClick={save}
        className="w-full t-button py-3 rounded-full text-canvas inline-flex items-center justify-center gap-2"
        style={{ background: accent }}>
        {editMode ? "Save" : "Continue"} <ArrowRight className="size-4" aria-hidden="true" />
      </motion.button>
    </div>
  );
}

function ChoicePill({ selected, accent, label, onClick }: {
  selected: boolean; accent: string; label: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="rounded-2xl border py-3 text-center transition t-body-sm font-semibold"
      style={{
        borderColor: selected ? accent : "color-mix(in oklab, var(--ink) 12%, transparent)",
        background: selected ? `color-mix(in oklab, ${accent} 8%, var(--canvas))` : "var(--canvas)",
        color: selected ? accent : "var(--ink)",
      }}>
      {label}
    </button>
  );
}

/* ─────────── Step 5: Confirm ─────────── */

function StepConfirm({ accent, provider, onFinish }: {
  accent: string; provider: ProviderId; onFinish: (gen: boolean) => void;
}) {
  const stored = getKey(provider);
  const prov = getProvider(provider);
  const model = prov.models.find((m) => m.id === stored?.model) ?? prov.models[0];
  const { list: presets, activeId } = usePresets();
  const preset: SummaryPreset | undefined = presets.find((p) => p.id === activeId);
  const sched = readSchedule();
  const estCost = formatINR(estimateCostINR(model, 3500, 700));

  useEffect(() => { if (sched.enabled) armScheduler(() => {}); }, [sched.enabled]);
  const willGenerateNow = !sched.enabled;

  return (
    <div>
      <h2 className="t-title text-ink mb-3">All set</h2>

      <ul className="rounded-2xl border border-ink/10 bg-canvas divide-y divide-ink/10 mb-3">
        <Row label={GUIDES[provider].label} value={model.label} />
        <Row label={preset?.name ?? "All apps"} value={sched.enabled ? `Daily · ${sched.hhmm}` : "Manual"} />
        <Row label="Est. cost" value={`${estCost}/report`} accent={accent} />
      </ul>

      <div className="flex items-center gap-2 mb-3 rounded-xl px-3 py-2 border border-ink/10">
        <ShieldCheck className="size-3.5 shrink-0" style={{ color: accent }} aria-hidden="true" />
        <p className="t-meta text-ink/70">Device → your provider. Nothing routed through us.</p>
      </div>

      <motion.button whileTap={{ scale: 0.98 }} onClick={() => onFinish(willGenerateNow)}
        className="w-full t-button py-3 rounded-full text-canvas inline-flex items-center justify-center gap-2"
        style={{ background: accent }}>
        {willGenerateNow ? (<><Sparkles className="size-4" /> Generate now</>) : "Finish"}
      </motion.button>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <li className="flex items-center gap-3 px-3 py-2.5">
      <span className="t-meta text-ink/60 flex-1 truncate">{label}</span>
      <span className="t-body-sm text-ink truncate" style={accent ? { color: accent } : undefined}>{value}</span>
    </li>
  );
}
