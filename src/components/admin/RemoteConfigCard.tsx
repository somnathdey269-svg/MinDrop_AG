import { useState } from "react";
import type { ConfigEntry } from "@/lib/memoryos/types";

interface Props {
  entries: ConfigEntry[];
}

export function RemoteConfigCard({ entries }: Props) {
  const [state, setState] = useState(entries);

  const toggle = (k: string) =>
    setState((s) =>
      s.map((e) => (e.key === k && e.type === "toggle" ? { ...e, value: !e.value } : e)),
    );

  return (
    <div className="bg-brand text-canvas p-6 rounded-2xl">
      <p className="text-[10px] uppercase tracking-widest opacity-60 mb-4">Remote Config</p>
      <div className="space-y-4">
        {state.map((e) => (
          <div key={e.key} className="flex justify-between items-center">
            <span className="text-xs font-medium">{e.label}</span>
            {e.type === "value" ? (
              <span className="font-mono text-xs">{String(e.value)}</span>
            ) : (
              <button
                onClick={() => toggle(e.key)}
                aria-label={`Toggle ${e.label}`}
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  e.value ? "bg-canvas/40" : "bg-canvas/15"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-3 bg-canvas rounded-full transition-all ${
                    e.value ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
