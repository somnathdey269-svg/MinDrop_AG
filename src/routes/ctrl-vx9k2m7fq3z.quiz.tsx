import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagToggle } from "@/components/admin/FlagToggle";
import { Switch } from "@/components/ui/switch";
import { useQuizConfig } from "@/lib/memoryos/store";
import type { PersonalityId, QuizQuestion } from "@/lib/memoryos/quiz";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/quiz")({ component: QuizAdmin });

function QuizAdmin() {
  const { config, save, resetConfig, hydrated } = useQuizConfig();
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!hydrated) {
    return <AdminShell title="Onboarding Quiz"><FlagToggle slug="quiz" /><div className="text-ink/40 text-sm">Loading…</div></AdminShell>;
  }

  const active = config.questions.find((q) => q.id === activeId) ?? config.questions[0];
  const personalityIds = config.personalities.map((p) => p.id);

  const updateQuestion = (next: QuizQuestion) => {
    save({
      ...config,
      questions: config.questions.map((q) => (q.id === next.id ? next : q)),
    });
  };

  const addQuestion = () => {
    const id = `q${Date.now()}`;
    const q: QuizQuestion = {
      id,
      title: "New question",
      options: [
        { id: "a", label: "Option A", emoji: "🙂", score: personalityIds[0] },
        { id: "b", label: "Option B", emoji: "🤔", score: personalityIds[1] ?? personalityIds[0] },
      ],
    };
    save({ ...config, questions: [...config.questions, q] });
    setActiveId(id);
  };

  const removeQuestion = (id: string) => {
    save({ ...config, questions: config.questions.filter((q) => q.id !== id) });
    setActiveId(null);
  };

  const addOption = () => {
    const next: QuizQuestion = {
      ...active,
      options: [
        ...active.options,
        { id: `o${Date.now()}`, label: "New option", emoji: "✨", score: personalityIds[0] },
      ],
    };
    updateQuestion(next);
  };

  return (
    <AdminShell title="Onboarding Quiz">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        {/* Question list */}
        <div className="bg-white border border-ink/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-widest text-ink/40">Questions</p>
            <button onClick={addQuestion} className="text-brand"><Plus className="size-4" /></button>
          </div>
          <ul className="space-y-1">
            {config.questions.map((q, i) => (
              <li key={q.id}>
                <button
                  onClick={() => setActiveId(q.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex gap-2 ${
                    active.id === q.id ? "bg-brand/10 text-brand" : "hover:bg-ink/5 text-ink/70"
                  }`}
                >
                  <span className="text-ink/40 shrink-0">{i + 1}.</span>
                  <span className="truncate">{q.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={resetConfig}
            className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-ink/40 hover:text-brand"
          >
            <RotateCcw className="size-3" /> Reset to defaults
          </button>
        </div>

        {/* Editor */}
        <div className="bg-white border border-ink/10 rounded-2xl p-6 space-y-5 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <label className="text-[10px] uppercase tracking-widest text-ink/40">Title</label>
              <input
                value={active.title}
                onChange={(e) => updateQuestion({ ...active, title: e.target.value })}
                className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-sm font-serif text-xl outline-none focus:border-brand"
              />
            </div>
            <button
              onClick={() => removeQuestion(active.id)}
              className="mt-5 text-ink/40 hover:text-red-500"
              aria-label="Delete question"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-ink/40">Scene (optional)</label>
            <input
              value={active.scene ?? ""}
              placeholder="e.g. It's Monday morning ☀️"
              onChange={(e) => updateQuestion({ ...active, scene: e.target.value })}
              className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-ink/40">Helper</label>
            <input
              value={active.helper ?? ""}
              placeholder="Optional helper text"
              onChange={(e) => updateQuestion({ ...active, helper: e.target.value })}
              className="mt-1 w-full bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <Switch checked={!!active.multi} onCheckedChange={(checked) => updateQuestion({ ...active, multi: checked })} aria-label="Multi-select" />
              <span>Multi-select</span>
            </div>
            {active.multi && (
              <label className="flex items-center gap-2 text-xs">
                Max picks
                <input
                  type="number"
                  min={1}
                  value={active.maxPick ?? 2}
                  onChange={(e) => updateQuestion({ ...active, maxPick: Number(e.target.value) })}
                  className="w-16 bg-canvas/60 border border-ink/10 rounded-lg px-2 py-1 text-xs"
                />
              </label>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] uppercase tracking-widest text-ink/40">Options & Scoring</p>
              <button onClick={addOption} className="text-brand text-xs flex items-center gap-1">
                <Plus className="size-3" /> Add option
              </button>
            </div>
            <div className="space-y-2">
              {active.options.map((o) => (
                <div key={o.id} className="grid grid-cols-[40px_1fr_140px_28px] gap-2 items-center">
                  <input
                    value={o.emoji ?? ""}
                    onChange={(e) =>
                      updateQuestion({
                        ...active,
                        options: active.options.map((x) => (x.id === o.id ? { ...x, emoji: e.target.value } : x)),
                      })
                    }
                    className="bg-canvas/60 border border-ink/10 rounded-lg px-2 py-2 text-center text-lg"
                  />
                  <input
                    value={o.label}
                    onChange={(e) =>
                      updateQuestion({
                        ...active,
                        options: active.options.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)),
                      })
                    }
                    className="bg-canvas/60 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                  <select
                    value={o.score}
                    onChange={(e) =>
                      updateQuestion({
                        ...active,
                        options: active.options.map((x) =>
                          x.id === o.id ? { ...x, score: e.target.value as PersonalityId } : x,
                        ),
                      })
                    }
                    className="bg-canvas/60 border border-ink/10 rounded-lg px-2 py-2 text-xs"
                  >
                    {config.personalities.map((p) => (
                      <option key={p.id} value={p.id}>
                        → {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      updateQuestion({
                        ...active,
                        options: active.options.filter((x) => x.id !== o.id),
                      })
                    }
                    className="text-ink/30 hover:text-red-500"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personalities panel */}
        <div className="bg-white border border-ink/10 rounded-2xl p-5 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">
            Memory Personalities
          </p>
          <p className="text-xs text-ink/50 mb-3">
            The option with the most picks wins. Edit names, copy, and preloaded rules.
          </p>
          {config.personalities.map((p, idx) => (
            <div
              key={p.id}
              className="rounded-xl border border-ink/10 p-3 space-y-2"
              style={{ background: p.color + "11" }}
            >
              <div className="flex items-center gap-2">
                <input
                  value={p.emoji}
                  onChange={(e) => {
                    const next = [...config.personalities];
                    next[idx] = { ...p, emoji: e.target.value };
                    save({ ...config, personalities: next });
                  }}
                  className="w-10 text-center text-xl bg-white border border-ink/10 rounded-lg"
                />
                <input
                  value={p.name}
                  onChange={(e) => {
                    const next = [...config.personalities];
                    next[idx] = { ...p, name: e.target.value };
                    save({ ...config, personalities: next });
                  }}
                  className="flex-1 bg-white border border-ink/10 rounded-lg px-2 py-1.5 text-sm font-serif"
                />
                <input
                  type="color"
                  value={p.color}
                  onChange={(e) => {
                    const next = [...config.personalities];
                    next[idx] = { ...p, color: e.target.value };
                    save({ ...config, personalities: next });
                  }}
                  className="size-8 rounded cursor-pointer"
                />
              </div>
              <textarea
                value={p.blurb}
                rows={3}
                onChange={(e) => {
                  const next = [...config.personalities];
                  next[idx] = { ...p, blurb: e.target.value };
                  save({ ...config, personalities: next });
                }}
                className="w-full bg-white border border-ink/10 rounded-lg px-2 py-1.5 text-xs leading-relaxed outline-none focus:border-brand"
              />
              <textarea
                value={p.remembers.join("\n")}
                rows={3}
                placeholder="What they remember (one per line)"
                onChange={(e) => {
                  const next = [...config.personalities];
                  next[idx] = { ...p, remembers: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) };
                  save({ ...config, personalities: next });
                }}
                className="w-full bg-white border border-ink/10 rounded-lg px-2 py-1.5 text-[11px] leading-relaxed outline-none focus:border-brand"
              />
              <textarea
                value={p.forgets.join("\n")}
                rows={3}
                placeholder="What they forget (one per line)"
                onChange={(e) => {
                  const next = [...config.personalities];
                  next[idx] = { ...p, forgets: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) };
                  save({ ...config, personalities: next });
                }}
                className="w-full bg-white border border-ink/10 rounded-lg px-2 py-1.5 text-[11px] leading-relaxed outline-none focus:border-brand"
              />
              <textarea
                value={p.fascinatingFact}
                rows={3}
                placeholder="Fascinating fact shown on the result card"
                onChange={(e) => {
                  const next = [...config.personalities];
                  next[idx] = { ...p, fascinatingFact: e.target.value };
                  save({ ...config, personalities: next });
                }}
                className="w-full bg-white border border-ink/10 rounded-lg px-2 py-1.5 text-[11px] leading-relaxed italic outline-none focus:border-brand"
              />
              <input
                value={p.rules.join(", ")}
                onChange={(e) => {
                  const next = [...config.personalities];
                  next[idx] = { ...p, rules: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) };
                  save({ ...config, personalities: next });
                }}
                placeholder="rule-ids, comma separated"
                className="w-full bg-white border border-ink/10 rounded-lg px-2 py-1.5 text-[11px] font-mono outline-none focus:border-brand"
              />
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
