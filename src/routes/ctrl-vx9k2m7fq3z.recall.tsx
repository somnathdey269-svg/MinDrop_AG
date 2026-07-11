import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagToggle } from "@/components/admin/FlagToggle";
import { Switch } from "@/components/ui/switch";
import {
  useRecallConfig,
  useEffectiveRules,
  DEFAULT_RULE_DEFAULTS,
  type EffectiveRule,
  type RecallConfig,
  type RecallMethod,
  type RecallMethodId,
  type RecallRule,
} from "@/lib/memoryos/recall";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/recall")({ component: RecallAdmin });

type Tab = "defaults" | "categories" | "packs" | "methods";

function RecallAdmin() {
  const { config, save, reset, hydrated } = useRecallConfig();
  const rules = useEffectiveRules();
  const [tab, setTab] = useState<Tab>("defaults");
  const [search, setSearch] = useState("");
  const catRules = useMemo(() => rules.filter((r) => r.kind === "category"), [rules]);
  const packRules = useMemo(() => rules.filter((r) => r.kind === "pack"), [rules]);
  const filter = (r: EffectiveRule) => r.sourceName.toLowerCase().includes(search.trim().toLowerCase());

  if (!hydrated) return <AdminShell title="Recall Engine"><FlagToggle slug="recall" /><div className="text-ink/40 text-sm">Loading…</div></AdminShell>;

  const setDefaults = (patch: Partial<RecallConfig["defaults"]>) => {
    save({ ...config, defaults: { ...config.defaults, ...patch } });
  };

  const setMeta = (patch: Partial<RecallConfig>) => save({ ...config, ...patch });

  const updateMethod = (id: RecallMethodId, patch: Partial<RecallMethod>) => {
    save({ ...config, methods: config.methods.map((m) => (m.id === id ? { ...m, ...patch } : m)) });
  };

  const writeRule = (rule: EffectiveRule, patch: Partial<RecallRule>) => {
    const bucket = rule.kind === "category" ? "categoryRules" : "packRules";
    const current: RecallRule = config[bucket][rule.key] ?? {
      enabled: rule.enabled,
      threshold: rule.threshold,
      windowDays: rule.windowDays,
      methodIds: rule.methodIds,
      premium: rule.premium,
      title: config.defaults.title,
      patternCopy: config.defaults.patternCopy,
      whyCopy: config.defaults.whyCopy,
      nextTimeCopy: config.defaults.nextTimeCopy,
      benefit: config.defaults.benefit,
      emotion: rule.emotion ?? config.defaults.emotion,
      customized: false,
    };
    const isCopyField = ["title", "patternCopy", "whyCopy", "nextTimeCopy", "benefit", "emotion"].some((k) => k in patch);
    const next: RecallRule = { ...current, ...patch, customized: current.customized || isCopyField };
    save({ ...config, [bucket]: { ...config[bucket], [rule.key]: next } } as RecallConfig);
  };

  const resetRule = (rule: EffectiveRule) => {
    const bucket = rule.kind === "category" ? "categoryRules" : "packRules";
    const next = { ...config[bucket] };
    delete next[rule.key];
    save({ ...config, [bucket]: next } as RecallConfig);
  };

  return (
    <AdminShell title="Recall Engine">
      <div className="space-y-5">
        <header className="bg-card border border-ink/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ink/40">Automatic recall logic</p>
            <h2 className="font-serif text-2xl mt-1">Every category & every pack</h2>
            <p className="text-sm text-ink/60 mt-1 max-w-2xl">
              Rules auto-exist for every category and every pack. Edit the shared defaults, or override any single rule. Use <code className="text-ink/70">{"{name}"}</code> and <code className="text-ink/70">{"{n}"}</code> in copy.
            </p>
          </div>
          <button onClick={reset} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink/50 hover:text-brand self-start">
            <RotateCcw className="size-3" aria-hidden="true" /> Reset all
          </button>
        </header>

        <nav className="flex flex-wrap gap-2">
          {(["defaults", "categories", "packs", "methods"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold border ${tab === t ? "bg-ink text-canvas border-ink" : "bg-card text-ink/60 border-ink/10 hover:text-ink"}`}
            >
              {t === "defaults" ? "Defaults" : t === "categories" ? `Categories · ${catRules.length}` : t === "packs" ? `Packs · ${packRules.length}` : `Methods · ${config.methods.length}`}
            </button>
          ))}
        </nav>

        {tab === "defaults" && (
          <section className="bg-card border border-ink/10 rounded-2xl p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Unlock threshold">
                <input type="number" min={1} value={config.unlockThreshold} onChange={(e) => setMeta({ unlockThreshold: Number(e.target.value) })} className="admin-input" />
              </Field>
              <Field label="Locked tab behaviour">
                <select value={config.unlockBehavior} onChange={(e) => setMeta({ unlockBehavior: e.target.value as RecallConfig["unlockBehavior"] })} className="admin-input">
                  <option value="lock-visible">Show locked Recall tab</option>
                  <option value="hide">Hide until unlocked</option>
                </select>
              </Field>
              <Field label="Enabled rules">
                <div className="admin-input flex items-center text-sm font-bold text-ink">{rules.filter((r) => r.enabled).length} of {rules.length}</div>
              </Field>
              <Field label="Unlock banner" wide>
                <input value={config.unlockBanner} onChange={(e) => setMeta({ unlockBanner: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Recall screen intro" wide>
                <input value={config.heroCopy} onChange={(e) => setMeta({ heroCopy: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Empty state title">
                <input value={config.emptyStateTitle} onChange={(e) => setMeta({ emptyStateTitle: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Empty state copy" wide>
                <textarea value={config.emptyStateCopy} onChange={(e) => setMeta({ emptyStateCopy: e.target.value })} className="admin-input min-h-20 resize-none" />
              </Field>
            </div>

            <div className="border-t border-ink/10 pt-5">
              <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Rule template</p>
              <h3 className="font-serif text-xl mb-3">Defaults applied to every category & pack</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Min captures"><input type="number" min={1} value={config.defaults.threshold} onChange={(e) => setDefaults({ threshold: Number(e.target.value) })} className="admin-input" /></Field>
                <Field label="Window (days)"><input type="number" min={1} value={config.defaults.windowDays} onChange={(e) => setDefaults({ windowDays: Number(e.target.value) })} className="admin-input" /></Field>
                <Field label="Paid only"><ToggleLabel label="Premium plan" checked={config.defaults.premium} onChange={(checked) => setDefaults({ premium: checked })} /></Field>
                <Field label="Title (use {name})" wide><input value={config.defaults.title} onChange={(e) => setDefaults({ title: e.target.value })} className="admin-input" /></Field>
                <Field label="Pattern copy (use {name}, {n})" wide><textarea value={config.defaults.patternCopy} onChange={(e) => setDefaults({ patternCopy: e.target.value })} className="admin-input min-h-16 resize-none" /></Field>
                <Field label="Why it appeared" wide><textarea value={config.defaults.whyCopy} onChange={(e) => setDefaults({ whyCopy: e.target.value })} className="admin-input min-h-16 resize-none" /></Field>
                <Field label="Next-time instruction" wide><textarea value={config.defaults.nextTimeCopy} onChange={(e) => setDefaults({ nextTimeCopy: e.target.value })} className="admin-input min-h-16 resize-none" /></Field>
                <Field label="Benefit" wide><textarea value={config.defaults.benefit} onChange={(e) => setDefaults({ benefit: e.target.value })} className="admin-input min-h-16 resize-none" /></Field>
                <Field label="Default emotion pill (e.g. 💡 Spark)" wide><input value={config.defaults.emotion} onChange={(e) => setDefaults({ emotion: e.target.value })} className="admin-input" placeholder="😌 Calm" /></Field>
              </div>
              <div className="mt-3">
                <MethodPicker
                  methods={config.methods}
                  active={config.defaults.methodIds}
                  onToggle={(id) => {
                    const active = config.defaults.methodIds.includes(id);
                    const next = active ? config.defaults.methodIds.filter((x) => x !== id) : [...config.defaults.methodIds, id];
                    setDefaults({ methodIds: next.length ? next : [id] });
                  }}
                />
              </div>
              <button onClick={() => setDefaults(DEFAULT_RULE_DEFAULTS)} className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink/50 hover:text-brand">
                <RotateCcw className="size-3" aria-hidden="true" /> Restore template defaults
              </button>
            </div>
          </section>
        )}

        {(tab === "categories" || tab === "packs") && (
          <section className="bg-card border border-ink/10 rounded-2xl p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-ink/40">{tab === "categories" ? "Category rules" : "Pack rules"}</p>
                <h3 className="font-serif text-xl mt-1">Override defaults per {tab === "categories" ? "category" : "pack"}</h3>
              </div>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="admin-input md:w-64" />
            </div>

            <div className="space-y-3">
              {(tab === "categories" ? catRules : packRules).filter(filter).map((rule) => {
                const bucket = rule.kind === "category" ? config.categoryRules : config.packRules;
                const overridden = Boolean(bucket[rule.key]);
                return (
                  <article key={rule.id} className="rounded-xl border border-ink/10 bg-canvas/30 p-4">
                    <header className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg" aria-hidden="true">{rule.sourceEmoji ?? "•"}</span>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-ink truncate">{rule.sourceName}</p>
                          <p className="text-[10px] uppercase tracking-widest text-ink/45">{overridden ? "Custom rule" : "Using defaults"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ToggleLabel label="Enabled" checked={rule.enabled} onChange={(checked) => writeRule(rule, { enabled: checked })} />
                        <ToggleLabel label="Paid" checked={rule.premium} onChange={(checked) => writeRule(rule, { premium: checked })} />
                        {overridden && (
                          <button onClick={() => resetRule(rule)} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-ink/45 hover:text-brand" title="Reset to defaults">
                            <RotateCcw className="size-3" aria-hidden="true" /> Reset
                          </button>
                        )}
                      </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                      <Field label="Title (use {name})" wide><input value={rule.title} onChange={(e) => writeRule(rule, { title: e.target.value })} className="admin-input" /></Field>
                      <Field label="Emotion pill"><input value={rule.emotion ?? ""} onChange={(e) => writeRule(rule, { emotion: e.target.value })} className="admin-input" placeholder="💡 Spark" /></Field>
                      <Field label="Min captures"><input type="number" min={1} value={rule.threshold} onChange={(e) => writeRule(rule, { threshold: Number(e.target.value) })} className="admin-input" /></Field>
                      <Field label="Window (days)"><input type="number" min={1} value={rule.windowDays} onChange={(e) => writeRule(rule, { windowDays: Number(e.target.value) })} className="admin-input" /></Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <textarea value={rule.patternCopy} onChange={(e) => writeRule(rule, { patternCopy: e.target.value })} className="admin-input min-h-16 resize-none" placeholder="Pattern copy" />
                      <textarea value={rule.whyCopy} onChange={(e) => writeRule(rule, { whyCopy: e.target.value })} className="admin-input min-h-16 resize-none" placeholder="Why it appeared" />
                      <textarea value={rule.nextTimeCopy} onChange={(e) => writeRule(rule, { nextTimeCopy: e.target.value })} className="admin-input min-h-16 resize-none" placeholder="Next-time instruction" />
                      <textarea value={rule.benefit} onChange={(e) => writeRule(rule, { benefit: e.target.value })} className="admin-input min-h-16 resize-none" placeholder="Benefit" />
                    </div>

                    <MethodPicker
                      methods={config.methods}
                      active={rule.methodIds}
                      onToggle={(id) => {
                        const active = rule.methodIds.includes(id);
                        const next = active ? rule.methodIds.filter((x) => x !== id) : [...rule.methodIds, id];
                        writeRule(rule, { methodIds: next.length ? next : [id] });
                      }}
                    />

                    <details className="mt-3 rounded-lg border border-ink/10 bg-card/60 open:bg-card">
                      <summary className="cursor-pointer select-none px-3 py-2 text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink flex items-center justify-between">
                        <span>Per-method examples · unique for this {rule.kind}</span>
                        <span className="text-ink/40 normal-case tracking-normal text-[11px]">click to edit</span>
                      </summary>
                      <div className="p-3 space-y-3 border-t border-ink/10">
                        {rule.methodIds.map((mid) => {
                          const method = config.methods.find((m) => m.id === mid);
                          if (!method) return null;
                          const ex = rule.methodExamples?.[mid] ?? {};
                          const update = (patch: Partial<typeof ex>) => {
                            const nextExamples = { ...(rule.methodExamples ?? {}), [mid]: { ...ex, ...patch } };
                            writeRule(rule, { methodExamples: nextExamples });
                          };
                          const clear = () => {
                            const nextExamples = { ...(rule.methodExamples ?? {}) };
                            delete nextExamples[mid];
                            writeRule(rule, { methodExamples: nextExamples });
                          };
                          return (
                            <div key={mid} className="rounded-md border border-ink/10 bg-canvas/40 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold text-ink"><span aria-hidden="true">{method.emoji}</span> {method.name}</p>
                                <button onClick={clear} className="text-[10px] uppercase tracking-widest text-ink/40 hover:text-brand inline-flex items-center gap-1" title="Restore auto-generated for this method">
                                  <RotateCcw className="size-3" aria-hidden="true" /> Auto
                                </button>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                <input value={ex.title ?? ""} onChange={(e) => update({ title: e.target.value })} className="admin-input" placeholder="Example title (supports {name})" />
                                <textarea value={ex.text ?? ""} onChange={(e) => update({ text: e.target.value })} className="admin-input min-h-16 resize-none" placeholder="Example text (story, phrase, prompt)" />
                                <input value={ex.imageUrl ?? ""} onChange={(e) => update({ imageUrl: e.target.value })} className="admin-input" placeholder="Image URL (optional)" />
                                <textarea
                                  value={(ex.items ?? []).join("\n")}
                                  onChange={(e) => update({ items: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                                  className="admin-input min-h-16 resize-none"
                                  placeholder="Checklist items — one per line"
                                />
                              </div>
                            </div>
                          );
                        })}
                        <p className="text-[10px] text-ink/40">Leave blank and hit “Auto” to use the auto-generated unique content for this {rule.kind}. Overrides only what you edit.</p>
                      </div>
                    </details>
                  </article>
                );
              })}
              {(tab === "categories" ? catRules : packRules).filter(filter).length === 0 && (
                <p className="text-sm text-ink/45">No {tab === "categories" ? "categories" : "packs"} match “{search}”.</p>
              )}
            </div>
          </section>
        )}

        {tab === "methods" && (
          <section className="bg-card border border-ink/10 rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-ink/40">Recall methods</p>
            <h3 className="font-serif text-xl mt-1 mb-4">Ways users can remember next time</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {config.methods.map((method) => (
                <div key={method.id} className="rounded-xl border border-ink/10 bg-canvas/40 p-4">
                  <div className="grid grid-cols-[48px_1fr] gap-3 mb-3">
                    <input value={method.emoji} onChange={(e) => updateMethod(method.id, { emoji: e.target.value })} className="h-11 rounded-lg border border-ink/10 bg-card text-center text-xl" />
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
                      <input value={method.name} onChange={(e) => updateMethod(method.id, { name: e.target.value })} className="admin-input font-bold" />
                      <ToggleLabel label="Enabled" checked={method.enabled} onChange={(checked) => updateMethod(method.id, { enabled: checked })} />
                      <ToggleLabel label="Paid" checked={method.premium} onChange={(checked) => updateMethod(method.id, { premium: checked })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <input value={method.shortDesc} onChange={(e) => updateMethod(method.id, { shortDesc: e.target.value })} className="admin-input" placeholder="Short description" />
                    <textarea value={method.instruction} onChange={(e) => updateMethod(method.id, { instruction: e.target.value })} className="admin-input min-h-16 resize-none" placeholder="Instruction" />
                    <textarea value={method.benefit} onChange={(e) => updateMethod(method.id, { benefit: e.target.value })} className="admin-input min-h-16 resize-none" placeholder="Benefit" />
                    <div className="border-t border-ink/10 pt-3 mt-1">
                      <p className="text-[10px] uppercase tracking-widest text-ink/50 mb-2">Ready-to-use example (shown to user, supports {"{name}"})</p>
                      <div className="grid grid-cols-1 gap-2">
                        <input value={method.exampleTitle ?? ""} onChange={(e) => updateMethod(method.id, { exampleTitle: e.target.value })} className="admin-input" placeholder="Example title (e.g. Your {name} story)" />
                        <textarea value={method.exampleText ?? ""} onChange={(e) => updateMethod(method.id, { exampleText: e.target.value })} className="admin-input min-h-20 resize-none" placeholder="Example text — the actual story, phrase, or note to show" />
                        <input value={method.exampleImageUrl ?? ""} onChange={(e) => updateMethod(method.id, { exampleImageUrl: e.target.value })} className="admin-input" placeholder="Example image URL (optional)" />
                        <textarea
                          value={(method.exampleItems ?? []).join("\n")}
                          onChange={(e) => updateMethod(method.id, { exampleItems: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                          className="admin-input min-h-20 resize-none"
                          placeholder="Checklist items — one per line (optional)"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-ink/60">
                      Colour
                      <input type="color" value={method.color} onChange={(e) => updateMethod(method.id, { color: e.target.value })} className="size-8 rounded border border-ink/10 bg-card" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AdminShell>
  );
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={wide ? "md:col-span-2" : undefined}>
      <span className="text-[10px] uppercase tracking-widest text-ink/50">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ToggleLabel({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-ink/10 bg-card px-2.5 py-2 text-xs text-ink/70 whitespace-nowrap">
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
      <span>{label}</span>
    </div>
  );
}

function MethodPicker({ methods, active, onToggle }: { methods: RecallMethod[]; active: RecallMethodId[]; onToggle: (id: RecallMethodId) => void }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-ink/50 mb-2">Allowed recall methods</p>
      <div className="flex flex-wrap gap-2">
        {methods.map((method) => {
          const isActive = active.includes(method.id);
          return (
            <button
              key={method.id}
              onClick={() => onToggle(method.id)}
              className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold ${isActive ? "border-ink text-ink" : "border-ink/10 text-ink/45 bg-card"}`}
              style={{ background: isActive ? method.color : undefined }}
            >
              {method.emoji} {method.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
