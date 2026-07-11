import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagToggle } from "@/components/admin/FlagToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, Pencil, X, Palette } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCountryThemes, saveCountryTheme, deleteCountryTheme } from "@/lib/theme/countryThemes.functions";
import { flagEmoji, isHex, padPalette, type CountryTheme } from "@/lib/theme/palette";
import { toast } from "sonner";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/country-themes")({ component: CountryThemesAdmin });

function CountryThemesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["country-themes"],
    queryFn: () => listCountryThemes(),
  });

  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<CountryTheme | "new" | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (t) => t.name.toLowerCase().includes(term) || t.code.toLowerCase().includes(term),
    );
  }, [data, q]);

  const del = useMutation({
    mutationFn: (code: string) => deleteCountryTheme({ data: { code } }),
    onSuccess: () => {
      toast.success("Country theme removed");
      qc.invalidateQueries({ queryKey: ["country-themes"] });
    },
    onError: (e: any) => toast.error(e?.message || "Failed to delete"),
  });

  return (
    <AdminShell title="Country Themes">
      <FlagToggle slug="country-themes" /><div className="space-y-5">
        <div className="rounded-2xl bg-white border border-ink/10 p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h2 className="font-serif text-2xl">Country flag palettes</h2>
              <p className="text-sm text-ink/60 mt-1 max-w-xl">
                MinDrop detects the user's country by IP on first launch and paints the
                dashboard rooms (Do it Later · Notify · Location) using the flag colors
                below. Anything not listed here falls back to the India palette.
              </p>
              <p className="text-xs text-ink/50 mt-2">
                Store 1–3 raw flag colors per country. The client pads to 3 accents using
                the rule: 2 colors → append India blue; 1 color → append India saffron then
                India blue.
              </p>
            </div>
            <button
              onClick={() => setEditing("new")}
              className="inline-flex items-center gap-2 rounded-xl bg-ink text-canvas px-4 py-2 text-sm font-medium hover:bg-ink/90"
            >
              <Plus className="size-4" /> Add country
            </button>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink/40" aria-hidden="true" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or ISO code"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-ink/15 bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-ink/10 overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-5 py-3 border-b border-ink/8 text-[10px] uppercase tracking-widest text-ink/50">
            <span>Flag</span>
            <span>Country</span>
            <span>Palette (raw → padded to 3)</span>
            <span>Actions</span>
          </div>
          {isLoading ? (
            <div className="p-6 text-sm text-ink/60">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-ink/60">No countries match your search.</div>
          ) : (
            <ul className="divide-y divide-ink/8">
              {filtered.map((t) => {
                const padded = padPalette(t.colors);
                return (
                  <li
                    key={t.code}
                    className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-5 py-3"
                  >
                    <span className="text-2xl leading-none" aria-hidden="true">
                      {flagEmoji(t.code)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <p className="text-[11px] text-ink/50 font-mono">{t.code}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1" title="Raw flag colors">
                        {(t.colors as string[]).map((c: string) => (
                          <span
                            key={c}
                            className="size-5 rounded-md border border-ink/10"
                            style={{ background: c }}
                            aria-label={c}
                          />
                        ))}
                      </div>
                      <span className="text-ink/30">→</span>
                      <div className="flex items-center gap-1" title="Padded 3-accent output">
                        {[padded.accent1, padded.accent2, padded.accent3].map((c, i) => (
                          <span
                            key={i}
                            className="size-5 rounded-md border border-ink/10"
                            style={{ background: c }}
                            aria-label={c}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditing(t)}
                        className="p-2 rounded-lg hover:bg-ink/5 text-ink/70"
                        aria-label={`Edit ${t.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (t.code === "IN") {
                            toast.error("India is the fallback palette and can't be removed.");
                            return;
                          }
                          if (confirm(`Remove ${t.name}? Users in ${t.name} will fall back to India.`)) {
                            del.mutate(t.code);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 disabled:opacity-40"
                        disabled={t.code === "IN"}
                        aria-label={`Delete ${t.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editing && (
          <EditSheet
            initial={editing === "new" ? null : editing}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              qc.invalidateQueries({ queryKey: ["country-themes"] });
            }}
          />
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

function EditSheet({
  initial,
  onClose,
  onSaved,
}: {
  initial: CountryTheme | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [colors, setColors] = useState<string[]>(() => {
    const src = initial?.colors ?? ["#FF671F"];
    // pad state to 3 slots for UI, filter empties on save
    const padded = [...src];
    while (padded.length < 3) padded.push("");
    return padded.slice(0, 3);
  });

  const validColors = colors.filter((c) => isHex(c));
  const preview = padPalette(validColors);

  const save = useMutation({
    mutationFn: () =>
      saveCountryTheme({
        data: {
          code: code.toUpperCase().trim(),
          name: name.trim(),
          colors: validColors,
        },
      }),
    onSuccess: () => {
      toast.success(initial ? "Country theme updated" : "Country theme added");
      onSaved();
    },
    onError: (e: any) => toast.error(e?.message || "Failed to save"),
  });

  const isEditing = !!initial;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 z-40"
      />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-canvas border-t border-ink/10 max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 flex items-center justify-between px-5 py-3 bg-canvas border-b border-ink/5 z-10">
          <span className="text-[10px] uppercase tracking-widest text-ink/70">
            {isEditing ? "Edit country theme" : "Add country theme"}
          </span>
          <button onClick={onClose} className="size-8 rounded-full grid place-items-center hover:bg-ink/5" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5 max-w-2xl">
          <div className="grid grid-cols-[auto_1fr] items-end gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-ink/50 mb-1">ISO code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 2))}
                disabled={isEditing}
                placeholder="IN"
                className="w-24 px-3 py-2 rounded-xl border border-ink/15 bg-white text-sm font-mono uppercase text-center disabled:opacity-60"
                maxLength={2}
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[10px] uppercase tracking-widest text-ink/50 mb-1">Country name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="India"
                className="w-full px-3 py-2 rounded-xl border border-ink/15 bg-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-ink/50 mb-2">
              Flag colors (1–3, most iconic first)
            </label>
            <div className="space-y-2">
              {colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={isHex(c) ? c : "#000000"}
                    onChange={(e) => {
                      const next = [...colors];
                      next[i] = e.target.value.toUpperCase();
                      setColors(next);
                    }}
                    className="size-10 rounded-lg border border-ink/15 cursor-pointer"
                    aria-label={`Color ${i + 1}`}
                  />
                  <input
                    value={c}
                    onChange={(e) => {
                      const next = [...colors];
                      next[i] = e.target.value.toUpperCase();
                      setColors(next);
                    }}
                    placeholder="#RRGGBB"
                    className="flex-1 px-3 py-2 rounded-xl border border-ink/15 bg-white text-sm font-mono uppercase"
                    maxLength={7}
                  />
                  <button
                    onClick={() => {
                      const next = [...colors];
                      next[i] = "";
                      setColors(next);
                    }}
                    className="p-2 rounded-lg text-ink/50 hover:bg-ink/5"
                    aria-label={`Clear color ${i + 1}`}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            {validColors.length === 0 && (
              <p className="text-[11px] text-red-500 mt-2">Add at least one valid hex color.</p>
            )}
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-4">
            <p className="text-[10px] uppercase tracking-widest text-ink/50 mb-3 flex items-center gap-1.5">
              <Palette className="size-3" /> Live preview — padded 3 accents
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(["accent1", "accent2", "accent3"] as const).map((k, i) => (
                <div
                  key={k}
                  className="rounded-2xl p-4 border"
                  style={{
                    background: `color-mix(in oklab, ${preview[k]} 12%, var(--canvas))`,
                    borderColor: `color-mix(in oklab, ${preview[k]} 30%, transparent)`,
                  }}
                >
                  <div
                    className="size-8 rounded-xl mb-2"
                    style={{ background: preview[k] }}
                    aria-hidden="true"
                  />
                  <p className="text-[10px] uppercase tracking-widest text-ink/60">
                    {["Do it Later", "Notify", "Location"][i]}
                  </p>
                  <p className="text-[10.5px] text-ink/50 font-mono mt-0.5">{preview[k]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-ink/70 hover:bg-ink/5">
              Cancel
            </button>
            <button
              onClick={() => save.mutate()}
              disabled={save.isPending || validColors.length === 0 || !name.trim() || code.length !== 2}
              className="px-4 py-2 rounded-xl bg-ink text-canvas text-sm font-medium disabled:opacity-40"
            >
              {save.isPending ? "Saving…" : isEditing ? "Save changes" : "Add country"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
