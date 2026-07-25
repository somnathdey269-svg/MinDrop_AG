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
    <div className="md:hidden fixed bottom-4 right-4 z-50 pointer-events-none select-none">
      <div
        className={`pointer-events-auto w-9 h-[4.5rem] rounded-full flex flex-col items-center justify-between p-1 transition-all duration-300 backdrop-blur-2xl border shadow-xl ${
          isDark
            ? "bg-[#18181B]/90 border-white/25 text-white shadow-[0_8px_30px_rgba(0,0,0,0.65)]"
            : "bg-white/95 border-ink/20 text-ink shadow-[0_8px_25px_rgba(0,0,0,0.18)]"
        }`}
      >
        {/* TOP BUTTON (UP) */}
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className={`size-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            current === 0
              ? "opacity-20 cursor-not-allowed"
              : isDark
              ? "hover:bg-white/25 active:scale-85 text-white"
              : "hover:bg-ink/10 active:scale-85 text-ink"
          }`}
          aria-label="Previous Slide (UP)"
        >
          <ChevronUp className="size-3.5 stroke-[3px]" />
        </button>

        {/* ELEGANT CENTER GLOW DOT */}
        <span className={`size-1 rounded-full shrink-0 ${isDark ? "bg-white/40" : "bg-ink/30"}`} />

        {/* BOTTOM BUTTON (DOWN) */}
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className={`size-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            current === total - 1
              ? "opacity-20 cursor-not-allowed"
              : isDark
              ? "hover:bg-white/25 active:scale-85 text-white"
              : "hover:bg-ink/10 active:scale-85 text-ink"
          }`}
          aria-label="Next Slide (DOWN)"
        >
          <ChevronDown className="size-3.5 stroke-[3px]" />
        </button>
      </div>
    </div>
  );
};
