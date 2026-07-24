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
        className={`pointer-events-auto w-11 h-22 rounded-full flex flex-col items-center justify-between p-1 transition-all duration-300 backdrop-blur-2xl border shadow-2xl ${
          isDark
            ? "bg-[#18181B]/95 border-white/20 text-white shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
            : "bg-white/95 border-ink/20 text-ink shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
        }`}
      >
        {/* TOP BUTTON (UP) */}
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className={`size-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            current === 0
              ? "opacity-20 cursor-not-allowed"
              : isDark
              ? "bg-white/10 hover:bg-white/20 active:scale-90 text-white"
              : "bg-ink/5 hover:bg-ink/15 active:scale-90 text-ink"
          }`}
          aria-label="Previous Slide (UP)"
        >
          <ChevronUp className="size-4 stroke-[3px]" />
        </button>

        {/* CENTER SLIDE INDEX */}
        <span className={`text-[9px] font-black tracking-tighter opacity-60 leading-none`}>
          0{current + 1}
        </span>

        {/* BOTTOM BUTTON (DOWN) */}
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className={`size-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            current === total - 1
              ? "opacity-20 cursor-not-allowed"
              : isDark
              ? "bg-white/10 hover:bg-white/20 active:scale-90 text-white"
              : "bg-ink/5 hover:bg-ink/15 active:scale-90 text-ink"
          }`}
          aria-label="Next Slide (DOWN)"
        >
          <ChevronDown className="size-4 stroke-[3px]" />
        </button>
      </div>
    </div>
  );
};
