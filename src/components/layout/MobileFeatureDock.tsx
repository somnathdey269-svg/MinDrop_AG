import React from "react";
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
  isDark = false,
}) => {
  return (
    <div className="md:hidden fixed bottom-5 right-4 z-50 pointer-events-none select-none">
      <div
        className={`pointer-events-auto w-10 h-[92px] rounded-full flex flex-col items-center justify-between py-2 px-1 transition-all duration-300 backdrop-blur-xl border ${
          isDark
            ? "bg-black/85 border-amber-500/40 text-white shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(217,119,6,0.25)]"
            : "bg-white/95 border-amber-500/30 text-amber-950 shadow-[0_8px_25px_rgba(120,53,15,0.18),0_0_15px_rgba(245,158,11,0.2)]"
        }`}
      >
        {/* TOP BUTTON (UP / PREVIOUS SLIDE) */}
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className={`grid place-items-center size-7 rounded-full transition-all duration-200 cursor-pointer ${
            current === 0
              ? "opacity-25 cursor-not-allowed"
              : isDark
              ? "bg-white/10 hover:bg-amber-500/30 active:scale-75 text-amber-300"
              : "bg-amber-500/10 hover:bg-amber-500/25 active:scale-75 text-amber-800"
          }`}
          aria-label="Previous Slide (UP)"
        >
          <ChevronUp className="size-4 stroke-[3px] block shrink-0" />
        </button>

        {/* STEP COUNT / INDEX INDICATOR */}
        <div className="flex flex-col items-center justify-center my-0.5">
          <span className={`text-[9px] font-black tracking-tight leading-none ${isDark ? "text-amber-400" : "text-amber-700"}`}>
            {current + 1}
          </span>
          <span className={`w-3.5 h-[1px] my-0.5 rounded-full ${isDark ? "bg-amber-400/40" : "bg-amber-700/30"}`} />
          <span className={`text-[8px] font-bold opacity-60 leading-none ${isDark ? "text-amber-200" : "text-amber-900"}`}>
            {total}
          </span>
        </div>

        {/* BOTTOM BUTTON (DOWN / NEXT SLIDE) */}
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className={`grid place-items-center size-7 rounded-full transition-all duration-200 cursor-pointer ${
            current === total - 1
              ? "opacity-25 cursor-not-allowed"
              : isDark
              ? "bg-white/10 hover:bg-amber-500/30 active:scale-75 text-amber-300"
              : "bg-amber-500/10 hover:bg-amber-500/25 active:scale-75 text-amber-800"
          }`}
          aria-label="Next Slide (DOWN)"
        >
          <ChevronDown className="size-4 stroke-[3px] block shrink-0" />
        </button>
      </div>
    </div>
  );
};
