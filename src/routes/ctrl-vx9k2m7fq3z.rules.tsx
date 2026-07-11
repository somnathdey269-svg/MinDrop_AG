import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagToggle } from "@/components/admin/FlagToggle";
import { useRulesCatalog, type RuleDef } from "@/lib/memoryos/rules";
import { useQuizConfig } from "@/lib/memoryos/store";
import type { PersonalityId } from "@/lib/memoryos/quiz";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/rules")({ component: RuleCatalogAdmin });

const CATEGORIES = ["Smart tags", "Quiet hours", "Timing", "Routines"] as const;

function RuleCatalogAdmin() {
  const { catalog, save, reset, hydrated } = useRulesCatalog();
  const { config: quizConfig } = useQuizConfig();
  if (!hydrated) return <AdminShell title="Rule Catalog"><FlagToggle slug="rules" /><div className="text-ink/40 text-sm">Loading…</div></AdminShell>;

  const update = (id: string, patch: Partial<RuleDef>) => {
    save(catalog.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };
  const remove = (id: string) => save(catalog.filter((r) => r.id !== id));
  const add = () => {
    const r: RuleDef = {
      id: `r-${Date.now()}`,
      sentence: "When I capture an Idea, keep it a gentle ping.",
      trigger: { kind: "category-is", value: "idea" },
      effect: { setNotify: "notification" },
      defaultOn: false,
      category: "Smart tags",
    };
    save([...catalog, r]);
  };

  return (
    <AdminShell title="Rule Catalog">
      <div className="space-y-4">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ink/40">Catalog</p>
            <h2 className="font-serif text-xl mt-1">Rules users see in "My rules"</h2>
            <p className="text-xs text-ink/60 mt-1 max-w-2xl">
              Write each rule as the plain-English sentence the user actually reads.
              Mark which personalities it's suggested for and what "default" means —
              that's what "Back to default" restores.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink/50 hover:text-brand">
              <RotateCcw className="size-3" /> Reset
            </button>
            <button onClick={add} className="inline-flex items-center gap-1.5 bg-ink text-canvas px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
              <Plus className="size-3" /> New rule
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {catalog.map((r) => (
            <div key={r.id} className="bg-white border border-ink/10 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <textarea value={r.sentence} rows={2}
                  onChange={(e) => update(r.id, { sentence: e.target.value })}
                  className="flex-1 font-serif text-base bg-canvas/40 border border-ink/10 rounded-lg px-3 py-2 outline-none focus:border-brand resize-none" />
                <button onClick={() => remove(r.id)} className="text-ink/30 hover:text-red-500 mt-1">
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ink/50">Category</label>
                  <select value={r.category ?? "Smart tags"}
                    onChange={(e) => update(r.id, { category: e.target.value as RuleDef["category"] })}
                    className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-2 py-1.5 text-xs">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ink/50">Trigger kind</label>
                  <select value={r.trigger.kind}
                    onChange={(e) => update(r.id, { trigger: { ...r.trigger, kind: e.target.value as RuleDef["trigger"]["kind"] } })}
                    className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-2 py-1.5 text-xs">
                    <option value="category-is">Category is…</option>
                    <option value="text-contains">Text contains…</option>
                    <option value="after-hour">After hour…</option>
                    <option value="weekday">Weekday + hour</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ink/50">Trigger value</label>
                  <input value={r.trigger.value}
                    onChange={(e) => update(r.id, { trigger: { ...r.trigger, value: e.target.value } })}
                    className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-2 py-1.5 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ink/50">Default state</label>
                  <select value={r.defaultOn ? "on" : "off"}
                    onChange={(e) => update(r.id, { defaultOn: e.target.value === "on" })}
                    className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-2 py-1.5 text-xs">
                    <option value="on">Default On</option>
                    <option value="off">Default Off (opt-in)</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ink/50">Effect — set nudge</label>
                  <select value={r.effect.setNotify ?? ""}
                    onChange={(e) => update(r.id, { effect: { ...r.effect, setNotify: (e.target.value || undefined) as "notification" | "alarm" | undefined } })}
                    className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-2 py-1.5 text-xs">
                    <option value="">— no change —</option>
                    <option value="notification">Notification</option>
                    <option value="alarm">Alarm</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ink/50">Effect — preferred timing</label>
                  <select value={r.effect.preferredWhen ?? ""}
                    onChange={(e) => update(r.id, { effect: { ...r.effect, preferredWhen: (e.target.value || undefined) as RuleDef["effect"]["preferredWhen"] } })}
                    className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-2 py-1.5 text-xs">
                    <option value="">— no change —</option>
                    <option value="hours">In a few hours</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="pick">Pick a date</option>
                    <option value="schedule">Schedule</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="text-[10px] uppercase tracking-widest text-ink/50">Suggested for personalities</label>
                <div className="mt-1 flex gap-1.5 flex-wrap">
                  {quizConfig.personalities.map((p) => {
                    const on = r.suggestedFor?.includes(p.id);
                    return (
                      <button key={p.id}
                        onClick={() => {
                          const set = new Set(r.suggestedFor ?? []);
                          if (on) set.delete(p.id); else set.add(p.id);
                          update(r.id, { suggestedFor: Array.from(set) as PersonalityId[] });
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest border ${
                          on ? "bg-ink text-canvas border-ink" : "bg-white text-ink/60 border-ink/15"
                        }`}>
                        {p.emoji} {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
