import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { allPacks } from "@/lib/memoryos/extra";
import { useOnboarding } from "@/lib/memoryos/store";

export const Route = createFileRoute("/_authenticated/packs-picker")({ component: PacksPicker });

function PacksPicker() {
  const navigate = useNavigate();
  const { state, update } = useOnboarding();
  const toggle = (id: string) => {
    const next = state.packs.includes(id) ? state.packs.filter((x) => x !== id) : [...state.packs, id];
    update({ packs: next });
  };
  const done = () => { update({ onboarded: true }); navigate({ to: "/home" }); };
  return (
    <PhoneFrame>
      <div className="p-8 flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
        <p className="t-eyebrow text-ink/70 mb-2">Premium</p>
        <h1 className="t-display mb-1">Pick your first pack.</h1>
        <p className="t-body text-ink/75 mb-8">Pick two to start. More in the library later.</p>
        <div data-tour="packs-picker" className="grid grid-cols-2 gap-3">
          {allPacks.map((p) => {
            const on = state.packs.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`rounded-2xl p-4 text-left border transition-all ${
                  on ? "border-brand ring-2 ring-brand/30" : "border-ink/10 hover:border-brand/40"
                }`}
                style={{ background: p.color + "44" }}
              >
                <div className="t-title mb-3">{p.emoji}</div>
                <div className="t-body">{p.name}</div>
                <div className="t-meta text-ink/75 mt-0.5">{p.subtitle}</div>
              </button>
            );
          })}
        </div>
        <div className="flex-1" />
        <button onClick={done} className="t-button mt-8 w-full bg-ink text-canvas py-4 rounded-2xl">
          Enter MinDrop
        </button>
      </div>
    </PhoneFrame>
  );
}
