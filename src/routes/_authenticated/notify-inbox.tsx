import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { readCaptures, clearCaptures, purgeCaptures, type CapturedEntry } from "@/lib/notify/capture";
import { useOnboarding } from "@/lib/memoryos/store";
import { Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/notify-inbox")({
  head: () => ({ meta: [{ title: "Notification Inbox — MinDrop" }] }),
  component: NotifyInbox,
});

function NotifyInbox() {
  const { state } = useOnboarding();
  const plan: "free" | "premium" = state.plan === "premium" ? "premium" : "free";
  const [list, setList] = useState<CapturedEntry[]>([]);
  const [q, setQ] = useState("");
  const [pkgFilter, setPkgFilter] = useState<string>("");

  useEffect(() => {
    purgeCaptures(plan);
    setList(readCaptures());
    const on = () => setList(readCaptures());
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, [plan]);

  const apps = useMemo(() => {
    const m = new Map<string, string>();
    list.forEach((e) => m.set(e.pkg, e.appName));
    return Array.from(m.entries()).map(([pkg, appName]) => ({ pkg, appName }));
  }, [list]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return list.filter((e) => {
      if (pkgFilter && e.pkg !== pkgFilter) return false;
      if (!query) return true;
      return (
        e.title.toLowerCase().includes(query) ||
        e.text.toLowerCase().includes(query) ||
        e.appName.toLowerCase().includes(query)
      );
    });
  }, [list, q, pkgFilter]);

  return (
    <PhoneFrame>
      <PageHeader title="All notifications" />
      <div className="px-4 -mt-2 mb-1">
        <p className="t-meta text-ink/50">{list.length} captured · {plan === "premium" ? "90-day" : "7-day"} history</p>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-ink/10 px-3 py-2">
          <Search size={16} className="text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, text, or app"
            className="flex-1 bg-transparent outline-none t-body-sm"
          />
          {list.length > 0 && (
            <button
              onClick={() => { if (confirm("Clear all captured notifications?")) { clearCaptures(); setList([]); } }}
              className="p-1 text-ink/40 hover:text-ink"
              aria-label="Clear all"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {apps.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => setPkgFilter("")}
              className={`t-eyebrow whitespace-nowrap px-3 py-1.5 rounded-full border ${pkgFilter === "" ? "bg-ink text-canvas border-ink" : "bg-white text-ink/60 border-ink/15"}`}
            >
              All apps
            </button>
            {apps.map((a) => (
              <button
                key={a.pkg}
                onClick={() => setPkgFilter(a.pkg)}
                className={`t-eyebrow whitespace-nowrap px-3 py-1.5 rounded-full border ${pkgFilter === a.pkg ? "bg-ink text-canvas border-ink" : "bg-white text-ink/60 border-ink/15"}`}
              >
                {a.appName}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-ink/50">
            <p className="t-body-sm">Nothing captured yet.</p>
            <p className="t-meta mt-1">Enable notification access in <Link to="/permissions" className="underline">Permissions</Link>.</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {filtered.map((e) => (
            <div key={e.id + e.capturedAt} className="bg-white rounded-2xl border border-ink/10 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="t-eyebrow text-ink/50">{e.appName}</span>
                <span className="t-meta text-ink/40">{new Date(e.capturedAt).toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}</span>
              </div>
              {e.title && <p className="t-body-sm text-ink font-medium truncate">{e.title}</p>}
              {e.text && <p className="t-body-sm text-ink/70 line-clamp-3">{e.text}</p>}
              {e.matchedRuleIds && e.matchedRuleIds.length > 0 && (
                <p className="t-meta text-ink/40 mt-1">Matched {e.matchedRuleIds.length} rule{e.matchedRuleIds.length > 1 ? "s" : ""}</p>
              )}
              <div className="mt-2">
                <Link to="/notify" className="t-eyebrow text-ink/60 underline">
                  Create rule from this
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomTabs />
    </PhoneFrame>
  );
}
