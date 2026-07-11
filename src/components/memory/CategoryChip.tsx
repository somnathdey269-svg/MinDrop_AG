import { useCategories } from "@/lib/memoryos/store";

interface Props {
 value?: string;
 onChange?: (label: string) => void;
 compact?: boolean;
 accent: string;
}

/**
 * Read-only category badge. Refined: soft category-tinted wash, hairline
 * border, category emoji as leading icon. Category is locked after creation.
 */
export function CategoryChip({ value, compact = false, accent }: Props) {
 const { list } = useCategories();
 const cat = list.find((c) => c.label === value);
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;

 return (
 <span
 aria-label={`Category: ${value || "none"}`}
 className={`inline-flex items-center gap-1.5 rounded-full border ${
 compact ? "px-2 py-0.5 t-eyebrow" : "px-2.5 py-1 t-eyebrow"
 } `}
 style={{
 background: tint(10, "var(--canvas)"),
 borderColor: tint(30),
 color: "var(--ink)",
 }}
 >
 {cat?.emoji && <span aria-hidden="true" className="t-body-sm">{cat.emoji}</span>}
 <span className="truncate max-w-[120px] normal-case tracking-normal">
 {value || "Uncategorised"}
 </span>
 </span>
 );
}
