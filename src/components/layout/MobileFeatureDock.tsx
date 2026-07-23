import React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronUp, ChevronDown } from "lucide-react";

interface MobileFeatureDockProps {
  current: number;
  total: number;
  goTo: (index: number) => void;
  backHash?: string;
  isDark?: boolean;
}

export const MobileFeatureDock: React.FC<MobileFeatureDockProps> = ({
  current,
  total,
  goTo,
  backHash,
  isDark = false,
}) => {
  return (
    <div className="md:hidden w-full flex items-center justify-center shrink-0 z-40 px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-1 select-none pointer-events-auto">
      <footer
        className={`w-full max-w-[340px] rounded-full px-5 py-2 flex items-center justify-between transition-all duration-400 backdrop-blur-xl border ${
          isDark
            ? "bg-black/65 border-white/20 shadow-[0_10px_38px_rgba(0,0,0,0.55)] text-white"
            : "bg-white/90 border-ink/15 shadow-[0_10px_30px_rgba(0,0,0,0.12)] text-ink"
        }`}
      >
        {/* HOME LINK */}
        <Link
          to="/"
          hash={backHash}
          viewTransition
          className={`text-[11px] uppercase font-black tracking-widest transition-colors leading-none shrink-0 ${
            isDark ? "text-white/80 hover:text-white" : "text-ink/80 hover:text-ink"
          }`}
        >
          HOME
        </Link>

        {/* ICON-ONLY UP / DOWN CONTROLS */}
        <div
          className={`p-1 rounded-full flex items-center gap-1.5 shrink-0 border transition-colors ${
            isDark
              ? "bg-white/10 border-white/15"
              : "bg-ink/5 border-ink/10"
          }`}
        >
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
              current === 0
                ? "opacity-25 cursor-not-allowed"
                : isDark
                ? "bg-white text-ink shadow-sm hover:scale-105 active:scale-95"
                : "bg-ink text-white shadow-sm hover:scale-105 active:scale-95"
            }`}
            aria-label="Previous Slide (UP)"
          >
            <ChevronUp className="size-4 stroke-[2.8px]" />
          </button>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
              current === total - 1
                ? "opacity-25 cursor-not-allowed"
                : isDark
                ? "bg-white text-ink shadow-sm hover:scale-105 active:scale-95"
                : "bg-ink text-white shadow-sm hover:scale-105 active:scale-95"
            }`}
            aria-label="Next Slide (DOWN)"
          >
            <ChevronDown className="size-4 stroke-[2.8px]" />
          </button>
        </div>

        {/* GET APP LINK */}
        <Link
          to="/download"
          viewTransition
          className={`text-[11px] uppercase font-black tracking-widest transition-colors leading-none shrink-0 ${
            isDark ? "text-white/80 hover:text-white" : "text-ink/80 hover:text-ink"
          }`}
        >
          GET APP
        </Link>
      </footer>
    </div>
  );
};
