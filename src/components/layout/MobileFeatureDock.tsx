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
    <div className="md:hidden fixed bottom-4 sm:bottom-6 left-4 right-4 z-50 pointer-events-none select-none flex items-end justify-between gap-3">
      {/* LEFT ISLAND: NAVIGATION (HOME & GET APP) */}
      <footer
        className={`pointer-events-auto h-10 rounded-full px-4 flex items-center gap-3.5 backdrop-blur-xl border shadow-lg transition-all duration-300 ${
          isDark
            ? "bg-[#18181B]/95 border-white/20 text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            : "bg-white/95 border-ink/20 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
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

      {/* RIGHT ISLAND: TALL VERTICAL THUMB STEPPER CAPSULE (UP / DOWN) */}
      <div
        className={`pointer-events-auto w-10 h-20 rounded-full flex flex-col items-center justify-between p-1 backdrop-blur-xl border shadow-xl transition-all duration-300 ${
          isDark
            ? "bg-[#18181B]/95 border-white/20 text-white shadow-[0_8px_28px_rgba(0,0,0,0.6)]"
            : "bg-white/95 border-ink/20 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        }`}
      >
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className={`w-full flex-1 flex items-center justify-center rounded-t-full transition-all cursor-pointer ${
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

        <span className={`w-5 h-[1px] shrink-0 ${isDark ? "bg-white/20" : "bg-ink/20"}`} />

        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className={`w-full flex-1 flex items-center justify-center rounded-b-full transition-all cursor-pointer ${
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
    </div>
  );
};
