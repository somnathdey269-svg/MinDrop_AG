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
    <div className="md:hidden w-full flex items-center justify-center shrink-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 select-none pointer-events-auto">
      <footer
        className={`w-auto min-w-[260px] max-w-[290px] h-10 rounded-full px-4 flex items-center justify-between transition-all duration-300 backdrop-blur-2xl border ${
          isDark
            ? "bg-black/80 border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.55)] text-white"
            : "bg-white/90 border-ink/15 shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-ink"
        }`}
      >
        {/* HOME LINK */}
        <Link
          to="/"
          hash={backHash}
          viewTransition
          className={`text-[10px] uppercase font-black tracking-widest leading-none shrink-0 transition-opacity ${
            isDark ? "text-white/80 hover:text-white" : "text-ink/80 hover:text-ink"
          }`}
        >
          HOME
        </Link>

        {/* ELEGANT ICON-ONLY UP / DOWN CONTROLS */}
        <div
          className={`p-0.5 rounded-full flex items-center gap-0.5 shrink-0 border ${
            isDark
              ? "bg-white/10 border-white/10"
              : "bg-ink/5 border-ink/10"
          }`}
        >
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
              current === 0
                ? "opacity-20 cursor-not-allowed"
                : isDark
                ? "text-white hover:bg-white/20 active:scale-95"
                : "text-ink hover:bg-ink/10 active:scale-95"
            }`}
            aria-label="Previous Slide (UP)"
          >
            <ChevronUp className="size-3.5 stroke-[2.8px]" />
          </button>

          <div
            className={`w-[1px] h-3 ${
              isDark ? "bg-white/20" : "bg-ink/20"
            }`}
          />

          <button
            type="button"
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
              current === total - 1
                ? "opacity-20 cursor-not-allowed"
                : isDark
                ? "text-white hover:bg-white/20 active:scale-95"
                : "text-ink hover:bg-ink/10 active:scale-95"
            }`}
            aria-label="Next Slide (DOWN)"
          >
            <ChevronDown className="size-3.5 stroke-[2.8px]" />
          </button>
        </div>

        {/* GET APP LINK */}
        <Link
          to="/download"
          viewTransition
          className={`text-[10px] uppercase font-black tracking-widest leading-none shrink-0 transition-opacity ${
            isDark ? "text-white/80 hover:text-white" : "text-ink/80 hover:text-ink"
          }`}
        >
          GET APP
        </Link>
      </footer>
    </div>
  );
};
