import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { CapturedNotification } from "@/lib/notify/types";
import { knownAppsFromInbox } from "@/lib/notify/store";

export function InboxFilterBar({
  inbox,
  accent,
  pkg,
  query,
  onPkgChange,
  onQueryChange,
}: {
  inbox: CapturedNotification[];
  accent: string;
  pkg: string | null;
  query: string;
  onPkgChange: (pkg: string | null) => void;
  onQueryChange: (q: string) => void;
}) {
  const apps = useMemo(() => knownAppsFromInbox(inbox), [inbox]);
  const [expanded, setExpanded] = useState(false);
  const active = !!pkg || !!query.trim();
  const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;

  if (inbox.length === 0) return null;

  return (
    <div className="mb-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="size-3.5 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Filter by sender or word…"
            className="t-body-sm w-full pl-8 pr-8 py-2 rounded-full bg-card border focus:outline-none"
            style={{ borderColor: tint(18), outlineColor: accent }}
            aria-label="Filter notifications"
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              aria-label="Clear text filter"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-6 rounded-full grid place-items-center hover:bg-ink/5"
            >
              <X className="size-3 text-ink/50" />
            </button>
          )}
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="t-button shrink-0 px-3 py-2 rounded-full border transition"
          style={pkg ? { background: accent, color: "var(--canvas)", borderColor: accent } : { background: "var(--card)", color: "color-mix(in oklab, var(--ink) 70%, transparent)", borderColor: tint(18) }}
        >
          {pkg ? apps.find((a) => a.pkg === pkg)?.appName ?? "App" : "All apps"}
        </button>
      </div>

      {expanded && (
        <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl bg-card border" style={{ borderColor: tint(18) }}>
          <button
            onClick={() => { onPkgChange(null); setExpanded(false); }}
            className="t-meta px-3 py-1.5 rounded-full border transition"
            style={!pkg ? { background: accent, color: "var(--canvas)", borderColor: accent } : { background: "var(--canvas)", color: "var(--ink)", borderColor: tint(20) }}
          >
            All
          </button>
          {apps.map((a) => (
            <button
              key={a.pkg}
              onClick={() => { onPkgChange(a.pkg); setExpanded(false); }}
              className="t-meta px-3 py-1.5 rounded-full border transition"
              style={pkg === a.pkg ? { background: accent, color: "var(--canvas)", borderColor: accent } : { background: "var(--canvas)", color: "var(--ink)", borderColor: tint(20) }}
            >
              {a.appName}
            </button>
          ))}
        </div>
      )}

      {active && (
        <button
          onClick={() => { onPkgChange(null); onQueryChange(""); }}
          className="t-eyebrow px-1"
          style={{ color: accent }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
