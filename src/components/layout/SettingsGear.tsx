import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";

/**
 * Small top-right settings gear used on consumer pages that don't have their
 * own header settings link (Home already has its own).
 * Absolute positioning — parent must be `relative`.
 */
export function SettingsGear({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/settings"
      aria-label="Settings"
      onClick={() => { try { sessionStorage.setItem("gmd:from", "gear"); } catch {} }}
      className={`absolute top-6 right-5 z-20 size-10 rounded-full bg-brand/10 border border-brand/20 grid place-items-center shrink-0 hover:bg-brand/20 transition-colors ${className}`}
    >
      <Settings className="size-4 text-brand" strokeWidth={2} aria-hidden="true" />
    </Link>
  );
}
