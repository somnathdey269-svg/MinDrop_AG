import { Link } from "@tanstack/react-router";

/**
 * Small footer strip with links to legal pages. Mount only on
 * pages where legal reachability is required (auth, pricing, settings).
 * Do NOT mount on home/index or the main memory surface.
 */
export function LegalFooter({ className = "" }: { className?: string }) {
  return (
    <nav
      aria-label="Legal"
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 t-meta text-ink/50 ${className}`}
    >
      <Link to="/terms" className="hover:text-ink/80 underline-offset-2 hover:underline">
        Terms
      </Link>
      <span aria-hidden="true">·</span>
      <Link to="/privacy" className="hover:text-ink/80 underline-offset-2 hover:underline">
        Privacy
      </Link>
      <span aria-hidden="true">·</span>
      <Link to="/refunds" className="hover:text-ink/80 underline-offset-2 hover:underline">
        Refunds
      </Link>
      <span aria-hidden="true">·</span>
      <Link to="/contact" className="hover:text-ink/80 underline-offset-2 hover:underline">
        Contact
      </Link>
    </nav>
  );
}
