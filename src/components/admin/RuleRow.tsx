import type { Rule } from "@/lib/memoryos/types";

interface Props {
  rule: Rule;
  onEdit?: (r: Rule) => void;
}

export function RuleRow({ rule, onEdit }: Props) {
  const isActive = rule.status === "active";
  const isDeprecated = rule.status === "deprecated";
  return (
    <div
      className={`group flex items-center justify-between p-4 border border-ink/5 rounded-xl hover:border-brand/30 transition-colors ${
        isActive ? "bg-canvas/30" : ""
      } ${isDeprecated ? "opacity-50" : ""}`}
    >
      <div className="flex gap-6 items-center min-w-0">
        <div
          className={`size-2 rounded-full shrink-0 ${
            isActive ? "bg-green-500" : isDeprecated ? "bg-amber-500" : "bg-ink/30"
          }`}
        />
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${isDeprecated ? "text-ink/60" : ""}`}>
            {rule.name}
          </p>
          <p className="text-xs text-ink/40 truncate">{rule.description}</p>
        </div>
      </div>
      <div className="flex gap-4 items-center shrink-0">
        <span className="text-[10px] font-mono opacity-40 uppercase hidden sm:inline">
          Priority {String(rule.priority).padStart(2, "0")}
        </span>
        <span className="text-[10px] font-mono opacity-40 hidden md:inline">{rule.version}</span>
        <button
          onClick={() => onEdit?.(rule)}
          className={`text-[10px] font-bold uppercase tracking-tight ${
            isDeprecated ? "text-ink/60" : "text-brand"
          }`}
        >
          {isDeprecated ? "Restore" : "Edit Rule"}
        </button>
      </div>
    </div>
  );
}
