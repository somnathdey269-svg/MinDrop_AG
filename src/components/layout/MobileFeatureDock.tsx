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
    <div className="md:hidden fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[310px] px-3 pointer-events-none select-none">
      <footer
        className={`pointer-events-auto w-full h-11 rounded-full px-5 flex items-center justify-between transition-all duration-300 backdrop-blur-xl border ${
          isDark
            ? "bg-[#18181B]/95 border-white/20 text-white shadow-[0_12px_36px_rgba(0,0,0,0.65)]"
            : "bg-white/95 border-ink/20 text-ink shadow-[0_12px_32px_rgba(0,0,0,0.15)]"
        }`}
      >
        {/* HOME LINK */}
        <Link
          to="/"
          hash={backHash}
          viewTransition
          className={`flex items-center justify-center h-full text-[11px] font-black uppercase tracking-widest leading-none shrink-0 transition-opacity ${
            isDark ? "text-white/80 hover:text-white" : "text-ink/80 hover:text-ink"
          }`}
        >
          HOME
        </Link>

        {/* ELEGANT ICON-ONLY UP / DOWN CONTROLS */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full border shrink-0 ${
            isDark
              ? "bg-white/10 border-white/15 text-white"
              : "bg-ink/5 border-ink/15 text-ink"
          }`}
        >
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className={`flex items-center justify-center p-1 rounded-full transition-all duration-150 cursor-pointer ${
              current === 0
                ? "opacity-20 cursor-not-allowed"
                : isDark
                ? "hover:bg-white/20 active:scale-90 text-white"
                : "hover:bg-ink/10 active:scale-90 text-ink"
            }`}
            aria-label="Previous Slide (UP)"
          >
            <ChevronUp className="size-4 stroke-[2.8px]" />
          </button>

          <span className={`w-[1px] h-3.5 ${isDark ? "bg-white/20" : "bg-ink/20"}`} />

          <button
            type="button"
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            className={`flex items-center justify-center p-1 rounded-full transition-all duration-150 cursor-pointer ${
              current === total - 1
                ? "opacity-20 cursor-not-allowed"
                : isDark
                ? "hover:bg-white/20 active:scale-90 text-white"
                : "hover:bg-ink/10 active:scale-90 text-ink"
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
          className={`flex items-center justify-center h-full text-[11px] font-black uppercase tracking-widest leading-none shrink-0 transition-opacity ${
            isDark ? "text-white/80 hover:text-white" : "text-ink/80 hover:text-ink"
          }`}
        >
          GET APP
        </Link>
      </footer>
    </div>
  );
};
