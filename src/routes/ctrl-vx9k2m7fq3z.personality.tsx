import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagToggle } from "@/components/admin/FlagToggle";
import { Switch } from "@/components/ui/switch";
import { usePersonalityConfig, BALANCED_DEFAULTS, DEFAULT_SETUP_CATALOG, type SetupCategory, type SetupOption } from "@/lib/memoryos/personality";
import { useQuizConfig } from "@/lib/memoryos/store";
import type { PersonalityId } from "@/lib/memoryos/quiz";
import type { WhenId } from "@/lib/memoryos/personality";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/personality")({ component: PersonalityAdmin });

const WHEN_OPTIONS: WhenId[] = ["hours", "tomorrow", "pick", "schedule"];


function PersonalityAdmin() {
  const { config, save, reset, hydrated } = usePersonalityConfig();
  const { config: quizConfig } = useQuizConfig();
  if (!hydrated) return <AdminShell title="Personality Engine"><FlagToggle slug="personality" /><div className="text-ink/40 text-sm">Loading…</div></AdminShell>;

  const personalities = quizConfig.personalities;

  const updateDefaults = (id: PersonalityId, patch: Partial<typeof BALANCED_DEFAULTS>) => {
    save({ ...config, defaults: { ...config.defaults, [id]: { ...config.defaults[id], ...patch } } });
  };

  return (
    <AdminShell title="Personality Engine">
      <div className="space-y-6">
        <div className="bg-white border border-ink/10 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink/40">What this does</p>
              <h2 className="font-serif text-xl mt-1">Defaults tuned per personality</h2>
              <p className="text-xs text-ink/60 mt-1 max-w-2xl">
                These values silently set themselves in the user's app based on their MCQ result.
                The user never sees "because you're a Juggler" — the app just feels tuned.
              </p>
            </div>
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink/50 hover:text-brand">
              <RotateCcw className="size-3" /> Reset defaults
            </button>
          </div>
        </div>

        {/* Engagement / re-challenge */}
        <div className="bg-white border border-ink/10 rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-widest text-ink/40">Re-challenge cadence</p>
          <h3 className="font-serif text-lg mt-1 mb-3">When to surface the 90-second re-tune</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Num label="Active threshold (captures/week)" value={config.engagement.activeCapturesPerWeek}
              onChange={(v) => save({ ...config, engagement: { ...config.engagement, activeCapturesPerWeek: v } })} />
            <Num label="Casual threshold (captures/week)" value={config.engagement.casualCapturesPerWeek}
              onChange={(v) => save({ ...config, engagement: { ...config.engagement, casualCapturesPerWeek: v } })} />
            <Num label="Short re-take length (Qs)" value={config.engagement.shortQuestionCount}
              onChange={(v) => save({ ...config, engagement: { ...config.engagement, shortQuestionCount: v } })} />
            <Num label="Active cadence (days)" value={config.engagement.activeCadenceDays}
              onChange={(v) => save({ ...config, engagement: { ...config.engagement, activeCadenceDays: v } })} />
            <Num label="Casual cadence (days)" value={config.engagement.casualCadenceDays}
              onChange={(v) => save({ ...config, engagement: { ...config.engagement, casualCadenceDays: v } })} />
            <Num label="Dormant gap (days)" value={config.engagement.dormantGapDays}
              onChange={(v) => save({ ...config, engagement: { ...config.engagement, dormantGapDays: v } })} />
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Txt label="Banner title" value={config.engagement.bannerTitle}
              onChange={(v) => save({ ...config, engagement: { ...config.engagement, bannerTitle: v } })} />
            <Txt label="Banner body" value={config.engagement.bannerBody}
              onChange={(v) => save({ ...config, engagement: { ...config.engagement, bannerBody: v } })} />
          </div>
        </div>

        {/* Per personality */}
        <div className="space-y-4">
          {personalities.map((p) => {
            const d = config.defaults[p.id] ?? BALANCED_DEFAULTS;
            return (
              <div key={p.id} className="bg-white border border-ink/10 rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${p.color}15 0%, #ffffff 60%)` }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="size-10 grid place-items-center rounded-full text-xl" style={{ background: p.color + "33" }}>{p.emoji}</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ink/50">Personality</p>
                    <h3 className="font-serif text-lg">{p.name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-ink/50">Default nudge</label>
                    <select
                      value={d.defaultNotify}
                      onChange={(e) => updateDefaults(p.id, { defaultNotify: e.target.value as "notification" | "alarm" })}
                      className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="notification">Notification (soft ping)</option>
                      <option value="alarm">Alarm (firm wake)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-ink/50">Default "Tomorrow" time</label>
                    <input type="time" value={d.defaultTomorrowTime}
                      onChange={(e) => updateDefaults(p.id, { defaultTomorrowTime: e.target.value })}
                      className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/50">Capture wizard timing order</label>
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {d.whenOrder.map((id, idx) => (
                        <div key={id} className="inline-flex items-center gap-1 bg-white border border-ink/15 rounded-lg px-2 py-1 text-xs">
                          <span className="text-ink/40">{idx + 1}.</span>
                          <select value={id}
                            onChange={(e) => {
                              const next = [...d.whenOrder];
                              next[idx] = e.target.value as WhenId;
                              updateDefaults(p.id, { whenOrder: next });
                            }}
                            className="bg-transparent text-xs outline-none">
                            {WHEN_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Txt label="Pack affinity (IDs, comma-separated)" value={d.packAffinity.join(", ")}
                    onChange={(v) => updateDefaults(p.id, { packAffinity: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
                  <Txt label="Ribbon label (e.g. 'tabs closed')" value={d.ribbonLabel}
                    onChange={(v) => updateDefaults(p.id, { ribbonLabel: v })} />
                  <Txt label="Home empty-state copy" value={d.homeEmptyCopy}
                    onChange={(v) => updateDefaults(p.id, { homeEmptyCopy: v })} />
                  <Txt label="Welcome banner subtitle" value={d.bannerCopy}
                    onChange={(v) => updateDefaults(p.id, { bannerCopy: v })} />
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/50">Cycling taglines (one per line)</label>
                    <textarea rows={5} value={d.taglines.join("\n")}
                      onChange={(e) => updateDefaults(p.id, { taglines: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                      className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-xs" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Setup catalog */}
        <div className="bg-white border border-ink/10 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink/40">Setup catalog</p>
              <h3 className="font-serif text-xl mt-1">Smart-setup categories shown after the quiz</h3>
              <p className="text-xs text-ink/60 mt-1 max-w-2xl">
                These categories appear on the quiz result "Setup" screen. Each personality sees the categories flagged as relevant to them first — the rest collapse under "More options".
              </p>
            </div>
            <button
              onClick={() => save({ ...config, setupCatalog: DEFAULT_SETUP_CATALOG })}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink/50 hover:text-brand shrink-0"
            >
              <RotateCcw className="size-3" /> Reset catalog
            </button>
          </div>

          <div className="space-y-3">
            {config.setupCatalog.map((cat, idx) => (
              <SetupCategoryEditor
                key={cat.id}
                cat={cat}
                personalities={personalities}
                onChange={(next) => {
                  const list = [...config.setupCatalog];
                  list[idx] = next;
                  save({ ...config, setupCatalog: list });
                }}
                onDelete={() => save({ ...config, setupCatalog: config.setupCatalog.filter((_, i) => i !== idx) })}
              />
            ))}
            <button
              onClick={() => {
                const id = `cat_${Date.now()}`;
                save({
                  ...config,
                  setupCatalog: [
                    ...config.setupCatalog,
                    {
                      id, icon: "Bell", title: "New category", subtitle: "Describe what this tunes",
                      options: [{ id: "opt1", label: "Option A", preview: "Short preview", how: "How this helps." }],
                      relevantFor: [], defaultOptionId: "opt1", personalityDefaults: {}, enabledByDefault: false,
                    },
                  ],
                });
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-ink/20 text-xs uppercase tracking-widest text-ink/60 hover:text-ink hover:border-ink/40 inline-flex items-center justify-center gap-1.5"
            >
              <Plus className="size-3" /> Add category
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function SetupCategoryEditor({
  cat, personalities, onChange, onDelete,
}: {
  cat: SetupCategory;
  personalities: { id: PersonalityId; name: string; emoji: string; color: string }[];
  onChange: (next: SetupCategory) => void;
  onDelete: () => void;
}) {
  const toggleRelevant = (pid: PersonalityId) => {
    const has = cat.relevantFor.includes(pid);
    onChange({ ...cat, relevantFor: has ? cat.relevantFor.filter((x) => x !== pid) : [...cat.relevantFor, pid] });
  };
  const updateOption = (i: number, patch: Partial<SetupOption>) => {
    const opts = [...cat.options];
    opts[i] = { ...opts[i], ...patch };
    onChange({ ...cat, options: opts });
  };
  const addOption = () => {
    const id = `opt_${Date.now()}`;
    onChange({ ...cat, options: [...cat.options, { id, label: "New option", preview: "", how: "" }] });
  };
  const removeOption = (i: number) => {
    onChange({ ...cat, options: cat.options.filter((_, x) => x !== i) });
  };
  return (
    <div className="border border-ink/10 rounded-xl p-4 bg-canvas/40">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Txt label="Title" value={cat.title} onChange={(v) => onChange({ ...cat, title: v })} />
        <Txt label="Subtitle" value={cat.subtitle} onChange={(v) => onChange({ ...cat, subtitle: v })} />
        <Txt label="Icon (lucide name)" value={cat.icon} onChange={(v) => onChange({ ...cat, icon: v })} />
      </div>

      <div className="mt-3">
        <label className="text-[10px] uppercase tracking-widest text-ink/50">Relevant for (primary list)</label>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {personalities.map((p) => {
            const on = cat.relevantFor.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleRelevant(p.id)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                  on ? "border-ink bg-ink text-canvas" : "border-ink/15 bg-white text-ink/70"
                }`}
                style={on ? { background: p.color, borderColor: p.color, color: "#1a1a1a" } : undefined}
              >
                <span>{p.emoji}</span>{p.name.replace(/^The\s+/, "")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-ink/50">Fallback default option</label>
          <select
            value={cat.defaultOptionId}
            onChange={(e) => onChange({ ...cat, defaultOptionId: e.target.value })}
            className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-sm"
          >
            {cat.options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
        <AdminToggle label="On by default" checked={cat.enabledByDefault} onChange={(checked) => onChange({ ...cat, enabledByDefault: checked })} />
        <AdminToggle label="Whole category premium-only" checked={!!cat.premium} onChange={(checked) => onChange({ ...cat, premium: checked })} />
      </div>

      <div className="mt-3">
        <label className="text-[10px] uppercase tracking-widest text-ink/50">Per-personality default option</label>
        <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
          {personalities.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="text-xs w-32 text-ink/70">{p.emoji} {p.name.replace(/^The\s+/, "")}</span>
              <select
                value={cat.personalityDefaults[p.id] ?? ""}
                onChange={(e) => {
                  const next = { ...cat.personalityDefaults };
                  if (e.target.value) next[p.id] = e.target.value;
                  else delete next[p.id];
                  onChange({ ...cat, personalityDefaults: next });
                }}
                className="flex-1 bg-canvas/60 border border-ink/10 rounded-lg px-2 py-1 text-xs"
              >
                <option value="">— fallback —</option>
                {cat.options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] uppercase tracking-widest text-ink/50">Options</label>
          <button onClick={addOption} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink">
            <Plus className="size-3" /> Add option
          </button>
        </div>
        <div className="space-y-2">
          {cat.options.map((o, i) => (
            <div key={o.id} className="border border-ink/10 rounded-lg p-3 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Txt label="Label" value={o.label} onChange={(v) => updateOption(i, { label: v })} />
                <Txt label="Preview (one line)" value={o.preview} onChange={(v) => updateOption(i, { preview: v })} />
                <Txt label="Option ID" value={o.id} onChange={(v) => updateOption(i, { id: v })} />
              </div>
              <div className="mt-2">
                <label className="text-[10px] uppercase tracking-widest text-ink/50">How? explainer</label>
                <textarea rows={2} value={o.how} onChange={(e) => updateOption(i, { how: e.target.value })}
                  className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-xs" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <AdminToggle label="Premium-only" checked={!!o.premium} onChange={(checked) => updateOption(i, { premium: checked })} />
                <button onClick={() => removeOption(i)} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-ink/50 hover:text-red-600">
                  <Trash2 className="size-3" /> Remove option
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button onClick={onDelete} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-ink/50 hover:text-red-600">
          <Trash2 className="size-3" /> Delete category
        </button>
      </div>
    </div>
  );
}

function AdminToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="text-[10px] uppercase tracking-widest text-ink/50 flex items-center gap-2 self-end pb-2">
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
      <span>{label}</span>
    </div>
  );
}


function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-ink/50">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-sm" />
    </div>
  );
}

function Txt({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-ink/50">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-sm" />
    </div>
  );
}
