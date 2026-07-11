import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { searchAddress, type GeoHit } from "@/lib/places/geocode";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

interface Props {
  onPick: (hit: GeoHit) => void;
}

export function AddressSearchField({ onPick }: Props) {
  const { accent3 } = useCountryTheme();
  const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent3} ${pct}%, ${base})`;
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<GeoHit[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (q.trim().length < 3) { setHits([]); return; }
    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      try {
        const results = await searchAddress(q, ac.signal);
        setHits(results);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div>
      <div className="relative">
        <Search className="size-4 text-ink/50 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search an address or place"
          className="t-body w-full pl-9 pr-9 py-2.5 rounded-xl border bg-card focus:outline-none"
          style={{ borderColor: tint(18) }}
          aria-label="Search address"
        />
        {loading && (
          <Loader2 className="size-4 text-ink/50 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" aria-hidden="true" />
        )}
      </div>
      {hits.length > 0 && (
        <ul className="mt-2 rounded-xl border bg-card overflow-hidden divide-y divide-ink/5" style={{ borderColor: tint(18) }}>
          {hits.map((h) => (
            <li key={`${h.lat},${h.lng}`}>
              <button
                type="button"
                onClick={() => { onPick(h); setHits([]); setQ(h.displayName.split(",")[0]); }}
                className="t-body-sm w-full text-left px-3 py-2 text-ink hover:bg-canvas press"
              >
                {h.displayName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
