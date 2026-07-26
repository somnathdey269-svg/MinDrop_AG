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
}) => {
  return (
    <div className="md:hidden fixed bottom-5 right-4 z-50 pointer-events-none select-none">
      <div className="pointer-events-auto flex flex-col gap-1.5 p-1 rounded-full bg-black/80 backdrop-blur-2xl border border-amber-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.65),0_0_20px_rgba(245,158,11,0.2)]">
        {/* UP BUTTON */}
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className={`grid place-items-center size-9 rounded-full transition-all duration-200 cursor-pointer ${
            current === 0
              ? "opacity-20 cursor-not-allowed text-amber-200/40"
              : "bg-amber-500/15 hover:bg-amber-500/30 active:scale-75 text-amber-400 border border-amber-500/30 shadow-xs"
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
          className={`grid place-items-center size-9 rounded-full transition-all duration-200 cursor-pointer ${
            current === total - 1
              ? "opacity-20 cursor-not-allowed text-amber-200/40"
              : "bg-amber-500/15 hover:bg-amber-500/30 active:scale-75 text-amber-400 border border-amber-500/30 shadow-xs"
          }`}
          aria-label="Next Slide"
        >
          <ChevronDown className="size-5 stroke-[3px]" />
        </button>
      </div>
    </div>
  );
};
