import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface MobileFeatureDockProps {
  current: number;
  total: number;
  goTo: (index: number) => void;
  backHash?: string;
  isDark?: boolean;
  activeColorClass?: string;
}

export const MobileFeatureDock: React.FC<MobileFeatureDockProps> = ({
  current,
  total,
  goTo,
  isDark = false,
  activeColorClass,
}) => {
  const buttonTheme = activeColorClass
    ? activeColorClass
    : isDark
    ? "bg-white text-ink border-white hover:bg-amber-400"
    : "bg-[#D97706] text-white border-[#D97706] hover:bg-[#78350F]";

  return (
    <div className="md:hidden fixed bottom-5 right-4 z-50 pointer-events-none select-none">
      <div
        className={`pointer-events-auto flex flex-col gap-2 p-1.5 rounded-full backdrop-blur-2xl border transition-all duration-300 ${
          isDark
            ? "bg-black/80 border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            : "bg-white/90 border-slate-900/15 shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
        }`}
      >
        {/* UP BUTTON */}
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className={`grid place-items-center size-9 rounded-full transition-all duration-200 cursor-pointer shadow-sm ${
            current === 0
              ? "opacity-20 cursor-not-allowed bg-gray-400/20 text-gray-400 border border-transparent"
              : `${buttonTheme} active:scale-75`
          }`}
          aria-label="Previous Slide"
        >
          <ChevronUp className="size-5 stroke-[3px]" />
        </button>

        {/* DOWN BUTTON */}
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className={`grid place-items-center size-9 rounded-full transition-all duration-200 cursor-pointer shadow-sm ${
            current === total - 1
              ? "opacity-20 cursor-not-allowed bg-gray-400/20 text-gray-400 border border-transparent"
              : `${buttonTheme} active:scale-75`
          }`}
          aria-label="Next Slide"
        >
          <ChevronDown className="size-5 stroke-[3px]" />
        </button>
      </div>
    </div>
  );
};
