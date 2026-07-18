import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/later-feature", label: "Later" },
  { to: "/notify-feature", label: "Notify" },
  { to: "/places-feature", label: "Places" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
] as const;

export function MarketingLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-[100dvh] bg-canvas text-ink font-sans flex flex-col justify-between">
      <div>
        <header className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-md border-b border-ink/8">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 h-16 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="MinDrop home">
              <span className="inline-grid place-items-center size-9 rounded-2xl bg-[#FF671F] text-white font-bold select-none text-lg">M</span>
              <span className="t-title text-lg font-bold tracking-tight text-ink">MinDrop</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="t-body-sm text-ink/75 hover:text-ink transition-colors font-semibold"
                  activeProps={{ className: "text-[#FF671F] font-bold" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link
                to="/download"
                className="hidden sm:inline-flex t-button items-center rounded-full bg-ink text-canvas px-6 py-2.5 hover:opacity-90 transition shadow-sm font-semibold text-xs uppercase tracking-wider"
              >
                Get App
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="md:hidden grid place-items-center size-10 rounded-full border border-ink/10"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
          {open && (
            <div className="md:hidden border-t border-ink/8 bg-canvas">
              <nav className="mx-auto max-w-7xl px-5 py-3 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="t-body py-2.5 px-2 rounded-xl hover:bg-ink/[0.03] transition"
                    activeProps={{ className: "font-semibold" }}
                  >
                    {n.label}
                  </Link>
                ))}
                <Link
                  to="/download"
                  onClick={() => setOpen(false)}
                  className="t-button mt-2 text-center rounded-full bg-ink text-canvas px-4 py-3 font-semibold text-sm"
                >
                  Download the App
                </Link>
              </nav>
            </div>
          )}
        </header>

        <main className="w-full">{children}</main>
      </div>

      <footer className="border-t border-ink/8 bg-[#f9f7f2] mt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 py-14 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-grid place-items-center size-9 rounded-2xl bg-[#FF671F] text-white font-bold select-none text-lg">M</span>
              <span className="t-title text-lg font-bold tracking-tight text-ink">MinDrop</span>
            </div>
            <p className="t-body-sm text-ink/75 mt-3 max-w-md leading-relaxed">
              A quiet second brain that holds the small things you'd rather not carry. Clear the background noise and let your mind rest.
            </p>
          </div>
          <div>
            <p className="t-eyebrow text-ink/50 mb-3 uppercase tracking-wider font-semibold">Product</p>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="t-body-sm text-ink/85 hover:text-ink font-semibold transition-colors">{n.label}</Link>
                </li>
              ))}
              <li><Link to="/download" className="t-body-sm text-ink/85 hover:text-ink font-semibold transition-colors">Download</Link></li>
            </ul>
          </div>
          <div>
            <p className="t-eyebrow text-ink/50 mb-3 uppercase tracking-wider font-semibold">Legal & Support</p>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="t-body-sm text-ink/85 hover:text-ink font-semibold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="t-body-sm text-ink/85 hover:text-ink font-semibold transition-colors">Terms of Service</Link></li>
              <li><Link to="/refunds" className="t-body-sm text-ink/85 hover:text-ink font-semibold transition-colors">Refund Policy</Link></li>
              <li><Link to="/contact" className="t-body-sm text-ink/85 hover:text-ink font-semibold transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink/8">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 py-5 t-meta text-ink/50 flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} MinDrop. Made with care for crowded minds.</span>
            <span>India · Web + Android</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
