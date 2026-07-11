import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Archive, Bell, Share2 } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { seedMemories } from "@/lib/memoryos/data";

export const Route = createFileRoute("/_authenticated/memory/$id")({ component: MemoryDetail });

function MemoryDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const memory = seedMemories.find((m) => m.id === id) ?? seedMemories[0];
  return (
    <PhoneFrame>
      <div className="p-6 min-h-screen md:min-h-[calc(100vh-3rem)] flex flex-col">
        <button onClick={() => navigate({ to: "/home" })} className="t-eyebrow flex items-center gap-2 text-ink/75 mb-8">
          <ArrowLeft className="size-4" /> Back
        </button>
        <p className="t-eyebrow text-ink/70 mb-2">{memory.date} · {memory.time}</p>
        <h1 data-tour="memory-title" className="t-display mb-6">{memory.text}</h1>
        {memory.imageUrl && <img src={memory.imageUrl} alt="" className="w-full rounded-2xl border border-ink/10 mb-6" />}
        {memory.tags && (
          <div data-tour="memory-tags" className="flex gap-2 mb-6">
            {memory.tags.map((t) => (
              <span key={t} className="t-eyebrow px-2 py-1 rounded bg-brand/10 text-brand">{t}</span>
            ))}
          </div>
        )}
        <div className="flex-1" />
        <div data-tour="memory-actions" className="grid grid-cols-3 gap-3">

          {[
            { icon: Bell, label: "Snooze" },
            { icon: Archive, label: "Archive" },
            { icon: Share2, label: "Share" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="t-eyebrow flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-ink/10 text-ink/75">
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}
