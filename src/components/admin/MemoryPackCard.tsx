import type { MemoryPack } from "@/lib/memoryos/types";

interface Props {
  packs: MemoryPack[];
}

export function MemoryPackCard({ packs }: Props) {
  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-8">
      <h3 className="text-sm font-medium uppercase tracking-widest mb-6">Curated Packs</h3>
      <div className="space-y-6">
        {packs.map((pack, i) => (
          <div
            key={pack.id}
            className={`space-y-3 ${i > 0 ? "pt-4 border-t border-ink/5" : ""}`}
          >
            {pack.imageUrl && (
              <img
                src={pack.imageUrl}
                alt={pack.name}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover rounded-lg border border-ink/5"
              />
            )}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{pack.name}</p>
                <p className="text-[10px] text-ink/40 mt-0.5">{pack.subtitle}</p>
              </div>
              <div
                className={`size-2 rounded-full mt-1.5 ${
                  pack.active ? "bg-brand" : "bg-ink/10"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
