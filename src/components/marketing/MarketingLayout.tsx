import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/do-it-later", label: "Do-It-Later" },
  { to: "/notify-feature", label: "Notify" },
  { to: "/places-feature", label: "Places" },
  { to: "/why-mindrop", label: "Why MinDrop" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
] as const;

export function MarketingLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-[100dvh] bg-canvas text-ink">
      <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur border-b border-hairline">
        <div className="mx-auto max-w-6xl px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="MinDrop home">
            <span className="inline-grid place-items-center size-9 rounded-2xl bg-brand text-canvas font-bold">M</span>
            <span className="t-title text-lg">MinDrop</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            {NAV.slice(1).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="t-body-sm text-ink/75 hover:text-ink transition-colors"
                activeProps={{ className: "text-ink font-semibold" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="hidden sm:inline-flex t-button items-center rounded-full border border-ink/15 text-ink px-4 py-2 hover:bg-ink/5 transition"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="hidden sm:inline-flex t-button items-center rounded-full bg-ink text-canvas px-4 py-2 hover:opacity-90 transition"
            >
              Get started
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden grid place-items-center size-10 rounded-full border border-hairline"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-hairline bg-canvas">
            <nav className="mx-auto max-w-6xl px-5 py-3 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="t-body py-2.5 px-2 rounded-xl hover:bg-secondary"
                  activeProps={{ className: "font-semibold" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/download"
                onClick={() => setOpen(false)}
                className="t-button mt-2 text-center rounded-full bg-ink text-canvas px-4 py-3"
              >
                Get the app
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-hairline mt-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-10 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-grid place-items-center size-9 rounded-2xl bg-brand text-canvas font-bold">M</span>
              <span className="t-title text-lg">MinDrop</span>
            </div>
            <p className="t-body-sm text-ink/70 mt-3 max-w-sm">
              A calm second brain. Drop a thought, get gently nudged, recall it later.
            </p>
          </div>
          <div>
            <p className="t-eyebrow text-ink/50 mb-2">Product</p>
            <ul className="space-y-1.5">
              {NAV.slice(1).map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="t-body-sm text-ink/80 hover:text-ink">{n.label}</Link>
                </li>
              ))}
              <li><Link to="/download" className="t-body-sm text-ink/80 hover:text-ink">Download</Link></li>
            </ul>
          </div>
          <div>
            <p className="t-eyebrow text-ink/50 mb-2">Legal</p>
            <ul className="space-y-1.5">
              <li><Link to="/privacy" className="t-body-sm text-ink/80 hover:text-ink">Privacy</Link></li>
              <li><Link to="/terms" className="t-body-sm text-ink/80 hover:text-ink">Terms</Link></li>
              <li><Link to="/refunds" className="t-body-sm text-ink/80 hover:text-ink">Refunds</Link></li>
              <li><Link to="/contact" className="t-body-sm text-ink/80 hover:text-ink">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-hairline">
          <div className="mx-auto max-w-6xl px-5 md:px-8 py-5 t-meta text-ink/60 flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} MinDrop. Made with care.</span>
            <span>India · Web + Android</span>
          </div>
        </div>


      </footer>
    </div>
  );
}
