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
        <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b-3 border-ink">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 h-16 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="MinDrop home">
              <span className="inline-grid place-items-center size-9 rounded-xl bg-[#FF671F] text-white font-black border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none text-lg">M</span>
              <span className="text-lg font-black tracking-tight text-ink uppercase">MinDrop</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="text-xs uppercase tracking-wider text-ink/70 hover:text-ink transition-colors font-bold"
                  activeProps={{ className: "text-[#FF671F] font-black underline decoration-2 decoration-ink" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link
                to="/download"
                className="hidden sm:inline-flex items-center rounded-xl bg-ink text-canvas border-2 border-ink px-5 py-2 hover:bg-[#FF671F] hover:text-white transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold text-xs uppercase tracking-wider active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                Get App
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="md:hidden grid place-items-center size-10 rounded-xl border-2 border-ink bg-white active:scale-95 transition"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
          {open && (
            <div className="md:hidden border-t-3 border-ink bg-canvas">
              <nav className="mx-auto max-w-7xl px-5 py-3 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="py-2.5 px-3 rounded-xl hover:bg-ink/[0.04] transition text-sm font-bold uppercase tracking-wider"
                    activeProps={{ className: "text-[#FF671F]" }}
                  >
                    {n.label}
                  </Link>
                ))}
                <Link
                  to="/download"
                  onClick={() => setOpen(false)}
                  className="mt-2 text-center rounded-xl bg-ink text-canvas border-2 border-ink px-4 py-3 font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  Download the App
                </Link>
              </nav>
            </div>
          )}
        </header>

        <main className="w-full">{children}</main>
      </div>

      <footer className="border-t-3 border-ink bg-[#f9f7f2] mt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 py-14 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-grid place-items-center size-9 rounded-xl bg-[#FF671F] text-white font-black border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none text-lg">M</span>
              <span className="text-lg font-black tracking-tight text-ink uppercase">MinDrop</span>
            </div>
            <p className="t-body-sm text-ink/75 mt-3 max-w-md leading-relaxed font-semibold">
              A quiet second brain that holds the small things you'd rather not carry. Clear the background noise and let your mind rest.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-black text-ink/40 mb-3 tracking-wider">Product</p>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="t-body-sm text-ink/85 hover:text-[#FF671F] font-bold transition-colors">{n.label}</Link>
                </li>
              ))}
              <li><Link to="/download" className="t-body-sm text-ink/85 hover:text-[#FF671F] font-bold transition-colors">Download</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase font-black text-ink/40 mb-3 tracking-wider">Legal & Support</p>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="t-body-sm text-ink/85 hover:text-[#FF671F] font-bold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="t-body-sm text-ink/85 hover:text-[#FF671F] font-bold transition-colors">Terms of Service</Link></li>
              <li><Link to="/refunds" className="t-body-sm text-ink/85 hover:text-[#FF671F] font-bold transition-colors">Refund Policy</Link></li>
              <li><Link to="/contact" className="t-body-sm text-ink/85 hover:text-[#FF671F] font-bold transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t-3 border-ink">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 py-5 text-xs text-ink/50 font-bold flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} MinDrop. Made with care for crowded minds.</span>
            <span>India · Web + Android</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
