import { useMemo, useState } from "react";
import { Filter, Save, Trash2, X, EyeOff, Eye } from "lucide-react";
import type { SummaryPreset, SummarySources } from "@/lib/notify/summary/types";
import type { CategoryId } from "@/lib/notify/summary/sources";
import { categoryFor, DEFAULT_SOURCES, usePresets } from "@/lib/notify/summary/sources";
import { useInbox, knownAppsFromInbox } from "@/lib/notify/store";
import { readProfile, writeProfile, markIgnoreApp } from "@/lib/notify/summary/profile";

const CATS: { id: CategoryId; label: string }[] = [
  { id: "chat", label: "Chat" },
  { id: "social", label: "Social" },
  { id: "work", label: "Work" },
  { id: "shopping", label: "Shopping" },
  { id: "news", label: "News" },
  { id: "finance", label: "Finance" },
  { id: "system", label: "System" },
  { id: "other", label: "Other" },
];

export function SourcesCard({ accent }: { accent: string }) {
  const [open, setOpen] = useState(false);
  const { list: presets, activeId, save, remove, activate } = usePresets();
  const active = presets.find((p) => p.id === activeId) ?? presets[0];
  const src = active?.sources ?? DEFAULT_SOURCES;

  const summary =
    src.scope === "all" ? "All apps"
    : src.scope === "selected" ? `${src.appIds?.length ?? 0} apps`
    : src.scope === "categories" ? (src.categoryIds ?? []).map((c) => CATS.find((x) => x.id === c)?.label).filter(Boolean).join(", ") || "No categories"
    : `Everything except ${src.excludeIds?.length ?? 0} apps`;

  return (
    <>
      <section className="rounded-2xl border border-ink/10 bg-canvas p-4 mb-4">
        <header className="flex items-center gap-2 mb-2">
          <Filter className="size-4" style={{ color: accent }} aria-hidden="true" />
          <h3 className="t-body font-semibold text-ink">Sources</h3>
        </header>
        <p className="t-body-sm text-ink/70">Analyse: <span className="text-ink">{summary}</span></p>
        <div className="flex flex-wrap gap-2 mt-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => activate(p.id)}
              className="t-eyebrow px-2.5 py-1 rounded-full border"
              style={{
                borderColor: p.id === activeId ? accent : "color-mix(in oklab, var(--ink) 15%, transparent)",
                background: p.id === activeId ? `color-mix(in oklab, ${accent} 10%, var(--canvas))` : "transparent",
                color: p.id === activeId ? accent : "var(--ink)",
              }}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => setOpen(true)}
            className="t-eyebrow px-2.5 py-1 rounded-full underline underline-offset-2"
            style={{ color: accent }}
          >
            Edit
          </button>
        </div>
      </section>
      {open && <SourcePickerSheet accent={accent} onClose={() => setOpen(false)} preset={active} onSave={save} onDelete={remove} />}
    </>
  );
}

function SourcePickerSheet({
  accent, onClose, preset, onSave, onDelete,
}: {
  accent: string;
  onClose: () => void;
  preset?: SummaryPreset;
  onSave: (p: SummaryPreset) => void;
  onDelete: (id: string) => void;
}) {
  const { list: inbox } = useInbox();
  const apps = useMemo(() => {
    const known = knownAppsFromInbox(inbox);
    const counts = new Map<string, number>();
    inbox.forEach((n) => counts.set(n.pkg, (counts.get(n.pkg) || 0) + 1));
    return known
      .map((a) => ({ ...a, count: counts.get(a.pkg) || 0, cat: categoryFor(a.pkg, a.appName) }))
      .sort((a, b) => b.count - a.count);
  }, [inbox]);

  const [name, setName] = useState(preset?.name ?? "My preset");
  const [sources, setSources] = useState<SummarySources>(preset?.sources ?? DEFAULT_SOURCES);
  const [query, setQuery] = useState("");
  const [ignoredSet, setIgnoredSet] = useState<Set<string>>(() => new Set(readProfile().ignoreApps));

  function toggleIgnore(pkg: string) {
    const p = readProfile();
    const next = new Set(p.ignoreApps);
    if (next.has(pkg)) {
      next.delete(pkg);
      writeProfile({ ...p, ignoreApps: Array.from(next) });
    } else {
      markIgnoreApp(pkg);
      next.add(pkg);
    }
    setIgnoredSet(new Set(next));
  }

  const filteredApps = apps.filter((a) =>
    !query || a.appName.toLowerCase().includes(query.toLowerCase()) || a.pkg.includes(query.toLowerCase())
  );

  function toggleApp(pkg: string) {
    if (sources.scope === "selected") {
      const next = new Set(sources.appIds ?? []);
      next.has(pkg) ? next.delete(pkg) : next.add(pkg);
      setSources({ ...sources, appIds: Array.from(next) });
    } else if (sources.scope === "exclude") {
      const next = new Set(sources.excludeIds ?? []);
      next.has(pkg) ? next.delete(pkg) : next.add(pkg);
      setSources({ ...sources, excludeIds: Array.from(next) });
    }
  }
  function toggleCat(id: CategoryId) {
    const next = new Set(sources.categoryIds ?? []);
    next.has(id) ? next.delete(id) : next.add(id);
    setSources({ ...sources, categoryIds: Array.from(next) });
  }

  const isCustom = !preset?.id.startsWith("p_");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-label="Edit sources">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[85vh] bg-canvas rounded-t-3xl p-4 overflow-y-auto">
        <header className="flex items-center gap-2 mb-3">
          <h4 className="t-body font-semibold text-ink flex-1">Edit sources</h4>
          <button onClick={onClose} aria-label="Close"><X className="size-5 text-ink/60" /></button>
        </header>

        <label className="block mb-3">
          <span className="t-meta text-ink/60">Preset name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-canvas px-3 py-2 t-body-sm"
          />
        </label>

        <p className="t-meta text-ink/60 mb-1">Scope</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {(["all", "selected", "categories", "exclude"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSources({ ...sources, scope: s })}
              className="t-eyebrow px-2.5 py-1 rounded-full border"
              style={{
                borderColor: sources.scope === s ? accent : "color-mix(in oklab, var(--ink) 15%, transparent)",
                background: sources.scope === s ? `color-mix(in oklab, ${accent} 10%, var(--canvas))` : "transparent",
              }}
            >
              {s === "all" ? "All" : s === "selected" ? "Selected apps" : s === "categories" ? "Categories" : "Exclude list"}
            </button>
          ))}
        </div>

        {sources.scope === "categories" && (
          <div className="flex flex-wrap gap-2 mb-3">
            {CATS.map((c) => {
              const sel = (sources.categoryIds ?? []).includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCat(c.id)}
                  className="t-eyebrow px-2.5 py-1 rounded-full border"
                  style={{
                    borderColor: sel ? accent : "color-mix(in oklab, var(--ink) 15%, transparent)",
                    background: sel ? `color-mix(in oklab, ${accent} 10%, var(--canvas))` : "transparent",
                    color: sel ? accent : "var(--ink)",
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        )}

        {(sources.scope === "selected" || sources.scope === "exclude") && (
          <>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps in your inbox"
              className="w-full rounded-xl border border-ink/15 bg-canvas px-3 py-2 t-body-sm mb-2"
            />
            <div className="max-h-64 overflow-y-auto border border-ink/10 rounded-xl divide-y divide-ink/10">
              {filteredApps.length === 0 && (
                <p className="p-3 t-body-sm text-ink/60">No apps in inbox yet.</p>
              )}
              {filteredApps.map((a) => {
                const list = sources.scope === "selected" ? sources.appIds : sources.excludeIds;
                const on = (list ?? []).includes(a.pkg);
                const ignored = ignoredSet.has(a.pkg);
                return (
                  <div key={a.pkg} className="flex items-center gap-2 p-2">
                    <label className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                      <input type="checkbox" checked={on} onChange={() => toggleApp(a.pkg)} className="accent-ink" />
                      <span className={`t-body-sm flex-1 truncate ${ignored ? "text-ink/40 line-through" : "text-ink"}`}>{a.appName}</span>
                      <span className="t-meta text-ink/50">{a.count}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleIgnore(a.pkg)}
                      aria-label={ignored ? `Unignore ${a.appName}` : `Ignore ${a.appName} across all reports`}
                      title={ignored ? "Include again" : "Ignore across all reports"}
                      className="p-1.5 rounded-full hover:bg-ink/5"
                    >
                      {ignored ? <Eye className="size-4 text-ink/60" /> : <EyeOff className="size-4 text-ink/40" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-4 space-y-3">
          <p className="t-meta text-ink/60">Filters</p>
          <label className="flex items-center gap-2 t-body-sm text-ink">
            <input
              type="checkbox"
              checked={sources.filters.includeChatBodies}
              onChange={(e) => setSources({ ...sources, filters: { ...sources.filters, includeChatBodies: e.target.checked } })}
            />
            Include chat message bodies (less private)
          </label>
          <label className="flex items-center gap-2 t-body-sm text-ink">
            <input
              type="checkbox"
              checked={sources.filters.includeTransactional}
              onChange={(e) => setSources({ ...sources, filters: { ...sources.filters, includeTransactional: e.target.checked } })}
            />
            Include OTPs & delivery pings
          </label>
          <label className="block">
            <span className="t-meta text-ink/60">Time window</span>
            <select
              value={sources.filters.timeWindow}
              onChange={(e) => setSources({ ...sources, filters: { ...sources.filters, timeWindow: e.target.value as SummarySources["filters"]["timeWindow"] } })}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-canvas px-3 py-2 t-body-sm"
            >
              <option value="all">Full day</option>
              <option value="work">Work hours (9–18)</option>
              <option value="evening">Evening (18–23)</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              const id = preset?.id.startsWith("p_") ? `c_${Date.now().toString(36)}` : preset?.id ?? `c_${Date.now().toString(36)}`;
              onSave({ id, name: name.trim() || "My preset", sources });
              onClose();
            }}
            className="t-button flex-1 px-4 py-2 rounded-full text-canvas inline-flex items-center justify-center gap-2"
            style={{ background: accent }}
          >
            <Save className="size-4" aria-hidden="true" /> Save preset
          </button>
          {isCustom && preset && (
            <button
              onClick={() => { onDelete(preset.id); onClose(); }}
              aria-label="Delete preset"
              className="t-button px-3 py-2 rounded-full border border-ink/15 text-ink/70"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
