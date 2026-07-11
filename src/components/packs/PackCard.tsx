import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GRADIENTS, type Pack } from "@/lib/memoryos/packs";
import { Check } from "lucide-react";

interface Props {
  pack: Pack;
  installedCount?: number;
  totalTemplates: number;
  onClick?: () => void;
}

export function PackCard({ pack, installedCount, totalTemplates, onClick }: Props) {
  const g = GRADIENTS[pack.gradient];
  const isInstalled = (installedCount ?? 0) > 0;

  const inner = (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="h-24 flex items-end p-3 relative"
        style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}
      >
        <span className="t-title drop-shadow-sm" aria-hidden="true">{pack.emoji}</span>
        <span className="t-eyebrow absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-full bg-white/85 text-ink/80">
          Template
        </span>
        {isInstalled && (
          <span className="t-eyebrow absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/85 text-ink/80">
            <Check className="size-3" aria-hidden="true" /> {installedCount}/{totalTemplates}
          </span>
        )}
      </motion.div>
      <div className="p-3">
        <div className="t-body text-ink truncate">{pack.name}</div>
        <p className="t-meta text-ink/75 mt-0.5 line-clamp-2">{pack.shortDesc}</p>
        <p className="t-eyebrow text-ink/70 mt-2">
          {pack.templates.length} thoughts
        </p>
      </div>
    </>
  );

  const cls = "group relative rounded-2xl overflow-hidden border border-ink/10 bg-white hover:border-ink/30 transition-all text-left w-full block";

  if (onClick) {
    return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
  }
  return (
    <Link to="/packs/$packId" params={{ packId: pack.id }} className={cls}>
      {inner}
    </Link>
  );
}
