import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { usePacks, GRADIENTS, type PackTemplate, type Recurrence, type Pack, type PackGradient } from "@/lib/memoryos/packs";
import { ArrowLeft, Plus, Trash2, Copy, RefreshCw, Search } from "lucide-react";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/packs/$packId")({ component: PackEditor });

const RECS: Recurrence[] = ["once", "daily", "weekly", "monthly"];
const GRADS: PackGradient[] = ["peach", "mint", "lilac", "sky", "rose", "sand"];

function PackEditor() {
  const { packId } = useParams({ from: "/ctrl-vx9k2m7fq3z/packs/$packId" });
  const { list, updatePack, updateTemplate, addTemplate, removeTemplate, resetPack } = usePacks();
  const pack = useMemo(() => list.find((p) => p.id === packId), [list, packId]);
  const [tab, setTab] = useState<"info" | "templates" | "defaults">("info");

  if (!pack) {
    return (
      <AdminShell title="Pack not found">
        <Link to="/ctrl-vx9k2m7fq3z/packs" className="text-xs uppercase tracking-widest text-brand">← Back to packs</Link>
      </AdminShell>
    );
  }
  const g = GRADIENTS[pack.gradient];

  return (
    <AdminShell title={pack.name}>
      <div className="flex items-center justify-between mb-5">
        <Link to="/ctrl-vx9k2m7fq3z/packs" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink/60 hover:text-ink">
          <ArrowLeft className="size-3.5" /> All packs
        </Link>
        <button
          onClick={() => resetPack(pack.id)}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink px-3 py-2 rounded-lg border border-ink/15"
        >
          <RefreshCw className="size-3" /> Restore seed
        </button>
      </div>

      <div
        className="rounded-2xl p-5 mb-6 flex items-center gap-4"
        style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}
      >
        <div className="size-16 rounded-2xl bg-white/80 grid place-items-center text-3xl">{pack.emoji}</div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-ink/50">Memory pack</p>
          <h1 className="font-serif text-2xl text-ink truncate">{pack.name}</h1>
          <p className="text-xs text-ink/60 mt-0.5">{pack.templates.length} templates · {pack.visibility}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5 border-b border-ink/10">
        {([
          { id: "info", label: "Pack info" },
          { id: "templates", label: `Templates (${pack.templates.length})` },
          { id: "defaults", label: "Default thoughts library" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs uppercase font-bold tracking-widest border-b-2 transition ${
              tab === t.id ? "border-ink text-ink" : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "info" && <PackInfoTab pack={pack} onChange={(p) => updatePack(pack.id, p)} />}
      {tab === "templates" && (
        <TemplatesTab
          pack={pack}
          onUpdate={(tplId, patch) => updateTemplate(pack.id, tplId, patch)}
          onAdd={(tpl) => addTemplate(pack.id, tpl)}
          onRemove={(tplId) => removeTemplate(pack.id, tplId)}
        />
      )}
      {tab === "defaults" && (
        <DefaultsLibraryTab
          allPacks={list}
          onUpdate={(pid, tid, patch) => updateTemplate(pid, tid, patch)}
        />
      )}
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest text-ink/50 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-xl border border-ink/15 px-3 py-2 text-sm bg-white focus:outline-none focus:border-ink/40 ${props.className ?? ""}`} />;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-xl border border-ink/15 px-3 py-2 text-sm bg-white focus:outline-none focus:border-ink/40 ${props.className ?? ""}`} />;
}

function PackInfoTab({ pack, onChange }: { pack: Pack; onChange: (patch: Partial<Pack>) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl">
      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_80px] gap-3">
          <Field label="Name"><Input value={pack.name} onChange={(e) => onChange({ name: e.target.value })} /></Field>
          <Field label="Emoji"><Input value={pack.emoji} onChange={(e) => onChange({ emoji: e.target.value })} /></Field>
        </div>
        <Field label="Short description">
          <Input value={pack.shortDesc} onChange={(e) => onChange({ shortDesc: e.target.value })} />
        </Field>
        <Field label="Long description">
          <Textarea rows={3} value={pack.longDesc} onChange={(e) => onChange({ longDesc: e.target.value })} />
        </Field>
        <Field label="Recovery benefit (fallback)">
          <Textarea rows={2} value={pack.recoveryBenefit} onChange={(e) => onChange({ recoveryBenefit: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Primary category">
            <Input value={pack.primaryCategoryId} onChange={(e) => onChange({ primaryCategoryId: e.target.value })} />
          </Field>
          <Field label="Visibility">
            <select
              value={pack.visibility}
              onChange={(e) => onChange({ visibility: e.target.value as "draft" | "published" })}
              className="w-full rounded-xl border border-ink/15 px-3 py-2 text-sm bg-white"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </Field>
        </div>
        <Field label="Tags (comma separated)">
          <Input
            value={pack.tags.join(", ")}
            onChange={(e) => onChange({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
          />
        </Field>
        <Field label="Gradient">
          <div className="flex gap-2 flex-wrap">
            {GRADS.map((id) => {
              const g = GRADIENTS[id];
              const active = pack.gradient === id;
              return (
                <button
                  key={id}
                  onClick={() => onChange({ gradient: id })}
                  className={`size-10 rounded-xl border-2 transition ${active ? "border-ink" : "border-transparent"}`}
                  style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}
                  title={id}
                />
              );
            })}
          </div>
        </Field>
      </div>

      <div className="space-y-4">
        <Field label="Benefit bullets (preview page 2 · one per line)">
          <Textarea
            rows={4}
            value={pack.benefitBullets.join("\n")}
            onChange={(e) => onChange({ benefitBullets: e.target.value.split("\n").filter((l) => l.trim()) })}
          />
        </Field>
        <Field label="How it works steps (preview page 4 · one per line)">
          <Textarea
            rows={4}
            value={pack.howItWorks.join("\n")}
            onChange={(e) => onChange({ howItWorks: e.target.value.split("\n").filter((l) => l.trim()) })}
          />
        </Field>
      </div>
    </div>
  );
}

function TemplateRow({ tpl, onUpdate, onRemove }: { tpl: PackTemplate; onUpdate: (p: Partial<PackTemplate>) => void; onRemove: () => void }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-3 space-y-2">
      <div className="flex gap-2 items-start">
        <Input
          value={tpl.emoji ?? ""}
          onChange={(e) => onUpdate({ emoji: e.target.value })}
          className="w-14 text-center text-lg"
        />
        <Input
          value={tpl.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Thought text"
          className="flex-1"
        />
        <button
          onClick={onRemove}
          className="size-9 grid place-items-center text-ink/40 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
          title="Delete"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Input
          value={tpl.categoryId ?? ""}
          onChange={(e) => onUpdate({ categoryId: e.target.value })}
          placeholder="Category"
        />
        <Input
          type="time"
          value={tpl.defaultTimeOfDay}
          onChange={(e) => onUpdate({ defaultTimeOfDay: e.target.value })}
        />
        <select
          value={tpl.defaultRecurrence}
          onChange={(e) => onUpdate({ defaultRecurrence: e.target.value as Recurrence })}
          className="rounded-xl border border-ink/15 px-3 py-2 text-sm bg-white"
        >
          {RECS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={tpl.defaultNotify}
          onChange={(e) => onUpdate({ defaultNotify: e.target.value as "notification" | "alarm" })}
          className="rounded-xl border border-ink/15 px-3 py-2 text-sm bg-white"
        >
          <option value="notification">notification</option>
          <option value="alarm">alarm</option>
        </select>
      </div>
      <Textarea
        rows={1}
        value={tpl.benefit ?? ""}
        onChange={(e) => onUpdate({ benefit: e.target.value })}
        placeholder="Per-template recovery benefit (optional)"
      />
    </div>
  );
}

function TemplatesTab({ pack, onUpdate, onAdd, onRemove }: {
  pack: Pack;
  onUpdate: (id: string, patch: Partial<PackTemplate>) => void;
  onAdd: (tpl: PackTemplate) => void;
  onRemove: (id: string) => void;
}) {
  const addBlank = () => onAdd({
    id: `t-${Date.now()}`,
    text: "New thought",
    emoji: "✨",
    categoryId: pack.primaryCategoryId,
    defaultTimeOfDay: "09:00",
    defaultRecurrence: "daily",
    defaultNotify: "notification",
  });
  return (
    <div className="space-y-3 max-w-4xl">
      <div className="space-y-2.5">
        {pack.templates.map((t) => (
          <TemplateRow
            key={t.id}
            tpl={t}
            onUpdate={(patch) => onUpdate(t.id, patch)}
            onRemove={() => onRemove(t.id)}
          />
        ))}
      </div>
      <button
        onClick={addBlank}
        className="w-full rounded-xl border-2 border-dashed border-ink/20 py-4 text-xs uppercase font-bold tracking-widest text-ink/50 hover:text-brand hover:border-brand/40 inline-flex items-center justify-center gap-1.5"
      >
        <Plus className="size-4" /> Add template
      </button>
    </div>
  );
}

function DefaultsLibraryTab({ allPacks, onUpdate }: {
  allPacks: Pack[];
  onUpdate: (packId: string, tplId: string, patch: Partial<PackTemplate>) => void;
}) {
  const [q, setQ] = useState("");
  const [packFilter, setPackFilter] = useState<string>("");

  const rows = useMemo(() => {
    const list: { pack: Pack; tpl: PackTemplate }[] = [];
    for (const p of allPacks) {
      if (packFilter && p.id !== packFilter) continue;
      for (const t of p.templates) {
        if (q && !t.text.toLowerCase().includes(q.toLowerCase()) && !(t.categoryId ?? "").toLowerCase().includes(q.toLowerCase())) continue;
        list.push({ pack: p, tpl: t });
      }
    }
    return list;
  }, [allPacks, q, packFilter]);

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="size-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search across every pack's default thoughts…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink/15 bg-white text-sm focus:outline-none focus:border-ink/40"
          />
        </div>
        <select
          value={packFilter}
          onChange={(e) => setPackFilter(e.target.value)}
          className="rounded-xl border border-ink/15 px-3 py-2.5 text-sm bg-white"
        >
          <option value="">All packs</option>
          {allPacks.map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
        </select>
      </div>

      <p className="text-xs text-ink/50">Showing {rows.length} default thoughts. Edits save back to their home pack.</p>

      <div className="overflow-x-auto border border-ink/10 rounded-xl bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink/[0.03] text-[10px] uppercase tracking-widest text-ink/50">
            <tr>
              <th className="px-3 py-2 text-left">Pack</th>
              <th className="px-3 py-2 text-left">Thought</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-left">Time</th>
              <th className="px-3 py-2 text-left">Repeats</th>
              <th className="px-3 py-2 text-left">Nudge</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ pack, tpl }) => (
              <tr key={`${pack.id}-${tpl.id}`} className="border-t border-ink/5">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-ink/70">{pack.emoji} {pack.name}</td>
                <td className="px-3 py-2">
                  <input
                    value={tpl.text}
                    onChange={(e) => onUpdate(pack.id, tpl.id, { text: e.target.value })}
                    className="w-full bg-transparent border-b border-transparent focus:border-ink/30 focus:outline-none text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={tpl.categoryId ?? ""}
                    onChange={(e) => onUpdate(pack.id, tpl.id, { categoryId: e.target.value })}
                    className="w-28 bg-transparent border-b border-transparent focus:border-ink/30 focus:outline-none text-xs"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="time"
                    value={tpl.defaultTimeOfDay}
                    onChange={(e) => onUpdate(pack.id, tpl.id, { defaultTimeOfDay: e.target.value })}
                    className="w-24 bg-transparent border-b border-transparent focus:border-ink/30 focus:outline-none text-xs"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={tpl.defaultRecurrence}
                    onChange={(e) => onUpdate(pack.id, tpl.id, { defaultRecurrence: e.target.value as Recurrence })}
                    className="bg-transparent text-xs focus:outline-none"
                  >
                    {RECS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select
                    value={tpl.defaultNotify}
                    onChange={(e) => onUpdate(pack.id, tpl.id, { defaultNotify: e.target.value as "notification" | "alarm" })}
                    className="bg-transparent text-xs focus:outline-none"
                  >
                    <option value="notification">notify</option>
                    <option value="alarm">alarm</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-ink/40 inline-flex items-center gap-1"><Copy className="size-3" /> Tip: changes save instantly to localStorage.</p>
    </div>
  );
}
