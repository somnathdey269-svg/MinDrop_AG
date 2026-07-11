import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagToggle } from "@/components/admin/FlagToggle";
import { useAdmin, useCategories, type Category } from "@/lib/memoryos/store";
import { Plus, Trash2, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/categories")({ component: AdminCategories });

function AdminCategories() {
  const navigate = useNavigate();
  const { state, hydrated } = useAdmin();
  const { list, save, resetList } = useCategories();
  const [draft, setDraft] = useState<Category[]>([]);

  useEffect(() => { if (hydrated && !state.signedIn) navigate({ to: "/ctrl-vx9k2m7fq3z/signin" }); }, [hydrated, state.signedIn, navigate]);
  useEffect(() => { setDraft(list); }, [list]);

  const update = (i: number, patch: Partial<Category>) => {
    setDraft((d) => d.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  };
  const add = () => setDraft((d) => [...d, { id: `c-${Date.now()}`, label: "New", emoji: "🏷️", template: "{note}", color: "#EEEEEE", benefit: "One less thing to remember." }]);
  const remove = (i: number) => setDraft((d) => d.filter((_, idx) => idx !== i));

  return (
    <AdminShell title="Categories">
      <FlagToggle slug="categories" /><div className="max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl">Memory categories</h2>
            <p className="text-sm text-ink/60 mt-1">Each category has a template with {"{placeholders}"} the user fills in. Example: <code className="text-xs bg-ink/5 px-1 rounded">Buy {"{item}"} from {"{place}"}</code></p>
          </div>
          <div className="flex gap-2">
            <button onClick={resetList} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-ink/10 hover:bg-ink/5">
              <RotateCcw className="size-3.5" /> Reset
            </button>
            <button onClick={() => save(draft)} className="text-xs px-4 py-2 rounded-full bg-ink text-canvas font-bold uppercase tracking-widest">Save</button>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white divide-y divide-ink/5">
          {draft.map((c, i) => (
            <div key={c.id} className="p-3 space-y-2">
              <div className="grid grid-cols-[auto_auto_1fr_2fr_auto_auto] items-center gap-2">
                <input value={c.emoji} onChange={(e) => update(i, { emoji: e.target.value })}
                  className="w-12 text-center text-xl bg-ink/5 rounded-lg py-2 outline-none" maxLength={2} />
                <input type="color" value={c.color} onChange={(e) => update(i, { color: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-ink/10 cursor-pointer" />
                <input value={c.label} onChange={(e) => update(i, { label: e.target.value })}
                  placeholder="Label"
                  className="min-w-0 bg-ink/5 rounded-lg px-2 py-2 outline-none text-sm font-medium" />
                <input value={c.template} onChange={(e) => update(i, { template: e.target.value })}
                  placeholder="Template with {placeholders}"
                  className="min-w-0 bg-ink/5 rounded-lg px-2 py-2 outline-none text-xs font-mono" />
                <span className="text-[10px] text-ink/40 hidden md:inline">{(c.template.match(/\{([^}]+)\}/g) || []).length} fields</span>
                <button onClick={() => remove(i)} className="text-ink/40 hover:text-red-500 p-2"><Trash2 className="size-4" /></button>
              </div>
              <div className="pl-[3.75rem]">
                <label className="text-[10px] uppercase tracking-widest text-ink/40">Recovery benefit (shown in Recovery vault)</label>
                <input value={c.benefit} onChange={(e) => update(i, { benefit: e.target.value })}
                  placeholder="How it helped the user…"
                  className="w-full bg-ink/5 rounded-lg px-2 py-2 outline-none text-xs italic mt-1" />
              </div>
            </div>
          ))}
          <button onClick={add} className="w-full inline-flex items-center justify-center gap-2 p-3 text-sm text-ink/60 hover:bg-ink/5">
            <Plus className="size-4" /> Add category
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
