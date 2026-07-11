import { useMemo } from "react";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

interface Props {
  valueM: number;
  onChange: (m: number) => void;
}

const STOPS = [50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000];

export function RadiusSlider({ valueM, onChange }: Props) {
  const { accent3 } = useCountryTheme();
  const idx = useMemo(() => {
    let best = 0;
    let bestDiff = Infinity;
    STOPS.forEach((s, i) => {
      const d = Math.abs(s - valueM);
      if (d < bestDiff) { bestDiff = d; best = i; }
    });
    return best;
  }, [valueM]);

  const useKm = valueM >= 1000;
  const display = useKm
    ? `${(valueM / 1000).toFixed(valueM % 1000 === 0 ? 0 : 1)} km`
    : `${valueM} m`;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label htmlFor="radius" className="eyebrow">Radius</label>
        <span className="t-display text-ink tabular-nums">{display}</span>
      </div>
      <input
        id="radius"
        type="range"
        min={0}
        max={STOPS.length - 1}
        step={1}
        value={idx}
        onChange={(e) => onChange(STOPS[Number(e.target.value)])}
        className="w-full"
        style={{ accentColor: accent3 }}
        aria-label="Radius in meters"
      />
      <div className="t-meta mt-1 flex justify-between text-ink/50 tabular-nums">
        <span>50 m</span>
        <span>500 m</span>
        <span>5 km</span>
      </div>
    </div>
  );
}

