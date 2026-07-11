import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagToggle } from "@/components/admin/FlagToggle";
import { useGreetingsConfig, DEFAULT_GREETINGS, type Greeting } from "@/lib/memoryos/greetings";
import { Plus, Trash2, RotateCcw, ArrowUp, ArrowDown } from "lucide-react";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/greetings")({ component: AdminGreetings });

function AdminGreetings() {
  const { config, save, reset } = useGreetingsConfig();
  const [draft, setDraft] = useState<Greeting>({ id: "", word: "", language: "", meaning: "Hello" });

  const update = (idx: number, patch: Partial<Greeting>) => {
    const next = [...config.greetings];
    next[idx] = { ...next[idx], ...patch };
    save({ ...config, greetings: next });
  };
  const remove = (idx: number) =>
    save({ ...config, greetings: config.greetings.filter((_, i) => i !== idx) });
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= config.greetings.length) return;
    const next = [...config.greetings];
    [next[idx], next[j]] = [next[j], next[idx]];
    save({ ...config, greetings: next });
  };
  const add = () => {
    if (!draft.word.trim() || !draft.language.trim()) return;
    const id = draft.language.toLowerCase().slice(0, 3) + "-" + Date.now().toString(36).slice(-3);
    save({ ...config, greetings: [...config.greetings, { ...draft, id }] });
    setDraft({ id: "", word: "", language: "", meaning: "Hello" });
  };

  return (
    <AdminShell title="World Greetings">
      <FlagToggle slug="greetings" /><div className="max-w-4xl space-y-6">
        <header className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest text-ink/40">Home header rotator</p>
          <h1 className="font-serif text-3xl">A hello from every corner of the world.</h1>
          <p className="text-sm text-ink/60">
            The consumer home swaps greeting every <strong>{config.intervalHours} hour{config.intervalHours === 1 ? "" : "s"}</strong>.
            Edit, add, or remove languages — changes go live instantly.
          </p>
        </header>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] sm:flex sm:items-end gap-4 p-4 rounded-2xl bg-white border border-ink/10">
          <div className="min-w-0">
            <label className="text-[10px] uppercase tracking-widest text-ink/50">Rotation interval (hours)</label>
            <input
              type="number"
              min={1}
              max={168}
              value={config.intervalHours}
              onChange={(e) => save({ ...config, intervalHours: Math.max(1, Number(e.target.value) || 1) })}
              className="mt-1 w-full sm:w-32 px-3 py-2 rounded-lg border border-ink/10 text-sm"
            />
          </div>
          <button
            onClick={reset}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink/60 hover:text-brand px-3 py-2"
          >
            <RotateCcw className="size-3.5" /> Reset to defaults ({DEFAULT_GREETINGS.length})
          </button>
        </div>

        <p className="text-[11px] text-ink/50 px-1">
          Order matters — the rotation walks this list top to bottom. Indian languages are seeded first; use the arrows to reorder.
        </p>
        <div className="rounded-2xl bg-white border border-ink/10 overflow-hidden">
          <div className="grid grid-cols-[2.5rem_1.2fr_1fr_1.4fr_auto_auto] gap-2 px-4 py-2 text-[10px] uppercase tracking-widest text-ink/40 border-b border-ink/10">
            <span>#</span>
            <span>Word</span>
            <span>Language</span>
            <span>Meaning / Note</span>
            <span>Order</span>
            <span />
          </div>
          <div className="divide-y divide-ink/5 max-h-[55vh] overflow-y-auto">
            {config.greetings.map((g, i) => (
              <div key={g.id + i} className="grid grid-cols-[2.5rem_1.2fr_1fr_1.4fr_auto_auto] gap-2 px-4 py-2 items-center">
                <span className="text-[11px] font-mono text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                <input
                  value={g.word}
                  onChange={(e) => update(i, { word: e.target.value })}
                  className="px-2 py-1.5 rounded border border-ink/10 text-sm font-medium min-w-0"
                />
                <input
                  value={g.language}
                  onChange={(e) => update(i, { language: e.target.value })}
                  className="px-2 py-1.5 rounded border border-ink/10 text-sm min-w-0"
                />
                <input
                  value={g.meaning}
                  onChange={(e) => update(i, { meaning: e.target.value })}
                  className="px-2 py-1.5 rounded border border-ink/10 text-sm text-ink/70 min-w-0"
                />
                <div className="flex gap-0.5">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="size-7 grid place-items-center rounded border border-ink/10 text-ink/50 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move up"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === config.greetings.length - 1}
                    className="size-7 grid place-items-center rounded border border-ink/10 text-ink/50 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move down"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => remove(i)}
                  className="size-8 grid place-items-center text-ink/40 hover:text-red-600"
                  aria-label="Remove"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[2.5rem_1.2fr_1fr_1.4fr_auto_auto] gap-2 px-4 py-3 items-center bg-ink/[0.02] border-t border-ink/10">
            <span className="text-[11px] font-mono text-ink/30">new</span>
            <input
              placeholder="Bonjour"
              value={draft.word}
              onChange={(e) => setDraft({ ...draft, word: e.target.value })}
              className="px-2 py-1.5 rounded border border-ink/10 text-sm min-w-0"
            />
            <input
              placeholder="French"
              value={draft.language}
              onChange={(e) => setDraft({ ...draft, language: e.target.value })}
              className="px-2 py-1.5 rounded border border-ink/10 text-sm min-w-0"
            />
            <input
              placeholder="Good day"
              value={draft.meaning}
              onChange={(e) => setDraft({ ...draft, meaning: e.target.value })}
              className="px-2 py-1.5 rounded border border-ink/10 text-sm min-w-0"
            />
            <span />
            <button
              onClick={add}
              className="size-8 grid place-items-center rounded-full bg-brand text-white hover:opacity-90"
              aria-label="Add greeting"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
