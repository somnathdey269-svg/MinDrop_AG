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
        className={`pointer-events-auto w-9 h-[76px] rounded-full flex flex-col items-center justify-between py-1.5 px-0.5 transition-all duration-300 backdrop-blur-2xl border shadow-2xl ${
          isDark
            ? "bg-[#121215]/95 border-white/20 text-white shadow-[0_8px_30px_rgba(0,0,0,0.65)]"
            : "bg-white/95 border-ink/20 text-ink shadow-[0_8px_25px_rgba(0,0,0,0.16)]"
        }`}
      >
        {/* TOP BUTTON (UP / PREVIOUS SLIDE) */}
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className={`grid place-items-center size-7 rounded-full transition-all duration-150 cursor-pointer ${
            current === 0
              ? "opacity-20 cursor-not-allowed"
              : isDark
              ? "hover:bg-white/20 active:scale-80 text-white active:bg-white/30"
              : "hover:bg-ink/10 active:scale-80 text-ink active:bg-ink/15"
          }`}
          aria-label="Previous Slide (UP)"
        >
          <ChevronUp className="size-4 stroke-[2.5px] block shrink-0" />
        </button>

        {/* ELEGANT CENTER SEPARATOR LINE */}
        <span
          className={`w-3 h-[1.5px] rounded-full shrink-0 transition-opacity duration-300 ${
            isDark ? "bg-white/30" : "bg-ink/25"
          }`}
        />

        {/* BOTTOM BUTTON (DOWN / NEXT SLIDE) */}
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className={`grid place-items-center size-7 rounded-full transition-all duration-150 cursor-pointer ${
            current === total - 1
              ? "opacity-20 cursor-not-allowed"
              : isDark
              ? "hover:bg-white/20 active:scale-80 text-white active:bg-white/30"
              : "hover:bg-ink/10 active:scale-80 text-ink active:bg-ink/15"
          }`}
          aria-label="Next Slide (DOWN)"
        >
          <ChevronDown className="size-4 stroke-[2.5px] block shrink-0" />
        </button>
      </div>
    </div>
  );
};
