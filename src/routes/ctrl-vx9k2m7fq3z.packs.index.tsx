import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagToggle } from "@/components/admin/FlagToggle";
import { usePacks, GRADIENTS } from "@/lib/memoryos/packs";
import { Plus, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/packs/")({ component: PacksAdmin });

function PacksAdmin() {
  const { list, updatePack, resetAll } = usePacks();
  return (
    <AdminShell title="Memory Packs">
      <FlagToggle slug="packs" /><div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink/60">
          {list.length} packs · {list.reduce((a, p) => a + p.templates.length, 0)} total templates
        </p>
        <button
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink px-3 py-2 rounded-lg border border-ink/15"
        >
          <RefreshCw className="size-3" /> Reset all to seed
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => {
          const g = GRADIENTS[p.gradient];
          return (
            <div key={p.id} className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
              <div
                className="h-28 grid place-items-center text-5xl relative"
                style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}
              >
                {p.emoji}
                <span className={`absolute top-2 right-2 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                  p.visibility === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {p.visibility}
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-sm">{p.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-ink/40">{p.templates.length} tpl</span>
                </div>
                <p className="text-xs text-ink/60 line-clamp-2">{p.shortDesc}</p>
                <div className="flex gap-2 mt-4 text-[10px] uppercase tracking-widest">
                  <Link
                    to="/ctrl-vx9k2m7fq3z/packs/$packId"
                    params={{ packId: p.id }}
                    className="flex-1 py-2 bg-ink text-canvas rounded text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => updatePack(p.id, { visibility: p.visibility === "published" ? "draft" : "published" })}
                    className="flex-1 py-2 border border-ink/15 rounded"
                  >
                    {p.visibility === "published" ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <button className="rounded-2xl border-2 border-dashed border-ink/15 p-8 grid place-items-center text-ink/40 hover:text-brand hover:border-brand/40 transition-all">
          <div className="text-center">
            <Plus className="size-6 mx-auto mb-2" />
            <p className="text-xs uppercase tracking-widest">Create pack</p>
          </div>
        </button>
      </div>
    </AdminShell>
  );
}
