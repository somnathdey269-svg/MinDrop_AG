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
        className={`pointer-events-auto w-10 h-20 rounded-full flex flex-col items-center justify-between p-1 transition-all duration-300 backdrop-blur-2xl border shadow-xl ${
          isDark
            ? "bg-[#18181B]/90 border-white/20 text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            : "bg-white/95 border-ink/15 text-ink shadow-[0_10px_25px_rgba(0,0,0,0.15)]"
        }`}
      >
        {/* TOP BUTTON (UP) */}
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className={`size-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            current === 0
              ? "opacity-20 cursor-not-allowed"
              : isDark
              ? "hover:bg-white/20 active:scale-85 text-white"
              : "hover:bg-ink/10 active:scale-85 text-ink"
          }`}
          aria-label="Previous Slide (UP)"
        >
          <ChevronUp className="size-4 stroke-[3px]" />
        </button>

        {/* SUBTLE SEPARATOR LINE */}
        <span className={`w-4 h-[1px] shrink-0 opacity-25 ${isDark ? "bg-white" : "bg-ink"}`} />

        {/* BOTTOM BUTTON (DOWN) */}
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className={`size-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            current === total - 1
              ? "opacity-20 cursor-not-allowed"
              : isDark
              ? "hover:bg-white/20 active:scale-85 text-white"
              : "hover:bg-ink/10 active:scale-85 text-ink"
          }`}
          aria-label="Next Slide (DOWN)"
        >
          <ChevronDown className="size-4 stroke-[3px]" />
        </button>
      </div>
    </div>
  );
};
