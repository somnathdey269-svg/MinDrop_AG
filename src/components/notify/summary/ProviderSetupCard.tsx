import { useState } from "react";
import { ExternalLink, KeyRound, ShieldCheck, Trash2, Check, Loader2 } from "lucide-react";
import { GUIDES } from "@/lib/notify/summary/onboarding";
import { getProvider } from "@/lib/notify/summary/providers";
import { getKey, saveKey, deleteKey, markTested, updateModel, setActiveProvider } from "@/lib/notify/summary/keyring";
import type { ProviderId } from "@/lib/notify/summary/types";
import { formatINR, estimateCostINR } from "@/lib/notify/summary/cost";

const PROVIDERS: ProviderId[] = ["gemini", "openai", "anthropic"];

export function ProviderSetupCard({
  accent,
  activeProvider,
  onChange,
}: {
  accent: string;
  activeProvider: ProviderId | null;
  onChange: () => void;
}) {
  const [selected, setSelected] = useState<ProviderId>(activeProvider ?? "gemini");
  const [showGuide, setShowGuide] = useState(false);
  const [key, setKey] = useState("");
  const [model, setModel] = useState(getKey(selected)?.model ?? getProvider(selected).models[0].id);
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  const guide = GUIDES[selected];
  const provider = getProvider(selected);
  const existing = getKey(selected);

  function switchProvider(id: ProviderId) {
    setSelected(id);
    const ex = getKey(id);
    setModel(ex?.model ?? getProvider(id).models[0].id);
    setKey("");
    setStatus("idle");
    setErrMsg("");
  }

  async function test(k?: string) {
    const useKey = k ?? key ?? existing?.key;
    if (!useKey) return;
    setStatus("testing"); setErrMsg("");
    const res = await provider.testKey(useKey);
    if (res.ok) {
      setStatus("ok");
      if (k || key) saveKey(selected, useKey, model);
      markTested(selected, true);
      setActiveProvider(selected);
      onChange();
    } else {
      setStatus("err");
      setErrMsg(res.error?.slice(0, 200) ?? "Test failed");
      markTested(selected, false);
    }
  }

  function save() {
    if (!key.trim()) return;
    saveKey(selected, key.trim(), model);
    setActiveProvider(selected);
    test(key.trim());
  }

  function remove() {
    if (!confirm(`Delete your ${guide.label} key from this device?`)) return;
    deleteKey(selected);
    setKey(""); setStatus("idle");
    onChange();
  }

  function pickModel(id: string) {
    setModel(id);
    if (existing) { updateModel(selected, id); onChange(); }
  }

  const selectedModel = provider.models.find((m) => m.id === model) ?? provider.models[0];
  const estCost = formatINR(estimateCostINR(selectedModel, 3500, 700));

  return (
    <section
      className="rounded-2xl border p-4 mb-4"
      style={{
        borderColor: `color-mix(in oklab, ${accent} 25%, transparent)`,
        background: `color-mix(in oklab, ${accent} 4%, var(--canvas))`,
      }}
    >
      <header className="flex items-center gap-2 mb-3">
        <KeyRound className="size-4" style={{ color: accent }} aria-hidden="true" />
        <h3 className="t-body font-semibold text-ink">Bring your own AI key</h3>
        <button
          onClick={() => setShowGuide((v) => !v)}
          className="ml-auto t-eyebrow text-ink/60 underline underline-offset-2"
        >
          {showGuide ? "Hide guide" : "Setup guide"}
        </button>
      </header>

      {/* Provider chips */}
      <div className="flex gap-2 mb-3" role="tablist" aria-label="AI provider">
        {PROVIDERS.map((id) => {
          const g = GUIDES[id];
          const isSel = selected === id;
          const has = !!getKey(id);
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isSel}
              onClick={() => switchProvider(id)}
              className="flex-1 rounded-xl border px-2 py-2 text-left transition"
              style={{
                borderColor: isSel ? accent : "color-mix(in oklab, var(--ink) 10%, transparent)",
                background: isSel ? `color-mix(in oklab, ${accent} 8%, var(--canvas))` : "var(--canvas)",
              }}
            >
              <p className="t-body-sm font-semibold text-ink truncate">{g.label.split(" ")[0]}</p>
              <p className="t-meta text-ink/60 mt-0.5">{g.bestFor.split(".")[0]}</p>
              {has && <Check className="size-3 mt-1" style={{ color: accent }} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {showGuide && (
        <div className="rounded-xl border border-ink/10 bg-canvas p-3 mb-3">
          <p className="t-body-sm font-semibold text-ink">{guide.label}</p>
          <p className="t-meta text-ink/60 mt-0.5">{guide.bestFor} {guide.freeTier ?? ""}</p>
          <ol className="mt-2 space-y-1 list-decimal list-inside">
            {guide.steps.map((s, i) => (
              <li key={i} className="t-body-sm text-ink/80">{s}</li>
            ))}
          </ol>
          {!!guide.gotchas.length && (
            <ul className="mt-2 space-y-1">
              {guide.gotchas.map((g, i) => (
                <li key={i} className="t-meta text-ink/60">• {g}</li>
              ))}
            </ul>
          )}
          <a
            href={guide.signupUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 t-eyebrow"
            style={{ color: accent }}
          >
            Get key <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </div>
      )}

      {/* Model dropdown */}
      <label className="block mb-2">
        <span className="t-meta text-ink/60">Model</span>
        <select
          value={model}
          onChange={(e) => pickModel(e.target.value)}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-canvas px-3 py-2 t-body-sm text-ink"
        >
          {provider.models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label} — {formatINR(estimateCostINR(m, 3500, 700))}/report
            </option>
          ))}
        </select>
      </label>

      {/* Key input */}
      <label className="block mb-2">
        <span className="t-meta text-ink/60">
          API key {existing ? "(saved — paste to replace)" : `(starts with ${guide.keyPrefix})`}
        </span>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={guide.keyPrefix}
          autoComplete="off"
          className="mt-1 w-full rounded-xl border border-ink/15 bg-canvas px-3 py-2 t-body-sm text-ink"
        />
      </label>

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={save}
          disabled={!key.trim() || status === "testing"}
          className="t-button px-4 py-2 rounded-full text-canvas disabled:opacity-40"
          style={{ background: accent }}
        >
          {status === "testing" ? (
            <span className="inline-flex items-center gap-1"><Loader2 className="size-3 animate-spin" /> Testing…</span>
          ) : existing ? "Replace & Test" : "Save & Test"}
        </button>
        {existing && (
          <button
            onClick={() => test()}
            disabled={status === "testing"}
            className="t-button px-3 py-2 rounded-full border border-ink/15 text-ink"
          >
            Test current key
          </button>
        )}
        {existing && (
          <button
            onClick={remove}
            className="ml-auto inline-flex items-center gap-1 t-eyebrow text-ink/60"
            aria-label="Delete key from this device"
          >
            <Trash2 className="size-3" aria-hidden="true" /> Delete key
          </button>
        )}
      </div>

      {status === "ok" && (
        <p className="mt-3 t-body-sm inline-flex items-center gap-1" style={{ color: accent }}>
          <Check className="size-4" aria-hidden="true" /> Key works. Est. {estCost}/report.
        </p>
      )}
      {status === "err" && (
        <p className="mt-3 t-body-sm text-ink/80">
          <span className="font-semibold" style={{ color: "#c85555" }}>Test failed.</span>{" "}
          {errMsg}
        </p>
      )}
      {existing && status === "idle" && !existing.tested && (
        <p className="mt-3 t-meta text-ink/60 inline-flex items-center gap-1">
          <ShieldCheck className="size-3" aria-hidden="true" /> Key saved but not tested yet.
        </p>
      )}
    </section>
  );
}
