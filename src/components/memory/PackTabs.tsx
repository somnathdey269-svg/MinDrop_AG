import type { PackGradient } from "@/lib/memoryos/packs";

export interface PackTabItem {
 id: string;
 name: string;
 emoji: string;
 gradient: PackGradient;
}

interface Props {
 packs: PackTabItem[]; // only installed packs
 activeTab: string; // "all" | "captures" | packId
 onChange: (next: string) => void;
 countsByPack: Record<string, number>;
 allCount: number;
 capturesCount: number;
 accent: string;
}

export function PackTabs({ packs, activeTab, onChange, countsByPack, allCount, capturesCount, accent }: Props) {
 if (packs.length === 0) return null;
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;
 const tabs = [
 { id: "all", label: "All", emoji: "✨", count: allCount },
 { id: "captures", label: "My captures", emoji: "✍️", count: capturesCount },
 ...packs.map((p) => ({
 id: p.id,
 label: p.name,
 emoji: p.emoji,
 count: countsByPack[p.id] ?? 0,
 })),
 ];
 return (
 <div className="-mx-6 px-6 mb-4 overflow-x-auto no-scrollbar">
 <div className="flex gap-2 w-max">
 {tabs.map((t) => {
 const active = activeTab === t.id;
 return (
 <button
 key={t.id}
 onClick={() => onChange(t.id)}
 className={`px-3 py-1.5 rounded-full t-button border inline-flex items-center gap-1.5 transition shrink-0 ${
 active ? "text-canvas" : "text-ink/70 hover:text-ink"
 }`}
 style={active ? { background: accent, borderColor: accent } : { background: tint(8, "var(--canvas)"), borderColor: tint(18) }}
 >
 <span className="t-meta">{t.emoji}</span>
 {t.label} · {t.count}
 </button>
 );
 })}
 </div>
 </div>
 );
}
