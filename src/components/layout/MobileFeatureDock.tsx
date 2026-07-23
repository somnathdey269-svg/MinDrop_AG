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
    <div className="md:hidden fixed bottom-4 sm:bottom-6 left-4 right-4 z-50 pointer-events-none select-none flex items-center justify-between gap-3">
      {/* LEFT ISLAND: NAVIGATION (HOME & GET APP) */}
      <footer
        className={`pointer-events-auto h-11 rounded-full px-4 flex items-center gap-3.5 transition-all duration-300 backdrop-blur-xl border shadow-xl ${
          isDark
            ? "bg-[#121214]/90 border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            : "bg-white/95 border-ink/20 text-ink shadow-[0_8px_28px_rgba(0,0,0,0.15)]"
        }`}
      >
        <Link
          to="/"
          hash={backHash}
          viewTransition
          className={`flex items-center justify-center h-full text-[10px] font-black uppercase tracking-widest leading-none shrink-0 transition-opacity ${
            isDark ? "text-white/80 hover:text-white" : "text-ink/80 hover:text-ink"
          }`}
        >
          HOME
        </Link>

        <span className={`w-[1px] h-3.5 ${isDark ? "bg-white/20" : "bg-ink/20"}`} />

        <Link
          to="/download"
          viewTransition
          className={`flex items-center justify-center h-full text-[10px] font-black uppercase tracking-widest leading-none shrink-0 transition-opacity ${
            isDark ? "text-white/80 hover:text-white" : "text-ink/80 hover:text-ink"
          }`}
        >
          GET APP
        </Link>
      </footer>

      {/* RIGHT ISLAND: VERTICAL THUMB STEPPER (UP / DOWN) */}
      <div
        className={`pointer-events-auto h-12 w-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-xl border shadow-xl ${
          isDark
            ? "bg-white text-ink border-white shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            : "bg-ink text-white border-ink shadow-[0_8px_28px_rgba(0,0,0,0.2)]"
        }`}
      >
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className={`w-full flex-1 flex items-center justify-center rounded-t-2xl transition-all cursor-pointer ${
            current === 0
              ? "opacity-25 cursor-not-allowed"
              : isDark
              ? "hover:bg-ink/10 active:scale-90"
              : "hover:bg-white/20 active:scale-90"
          }`}
          aria-label="Previous Slide (UP)"
        >
          <ChevronUp className="size-4 stroke-[3px]" />
        </button>

        <span className={`w-5 h-[1px] ${isDark ? "bg-ink/20" : "bg-white/20"}`} />

        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className={`w-full flex-1 flex items-center justify-center rounded-b-2xl transition-all cursor-pointer ${
            current === total - 1
              ? "opacity-25 cursor-not-allowed"
              : isDark
              ? "hover:bg-ink/10 active:scale-90"
              : "hover:bg-white/20 active:scale-90"
          }`}
          aria-label="Next Slide (DOWN)"
        >
          <ChevronDown className="size-4 stroke-[3px]" />
        </button>
      </div>
    </div>
  );
};
