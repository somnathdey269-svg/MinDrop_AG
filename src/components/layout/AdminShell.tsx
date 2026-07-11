import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScrollText,
  Package,
  Sliders,
  Users,
  FlaskConical,
  History,
  Settings as SettingsIcon,
  Menu,
  X,
  Search,
  HelpCircle,
  Tag,
  Globe,
  Sparkles,
  Brain,
  Palette,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  FileText,
  Lightbulb,
  Languages,
  Wrench,
  ToggleRight,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useAdmin } from "@/lib/memoryos/store";

type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean };
type NavSection =
  | { kind: "link"; item: NavItem }
  | { kind: "group"; key: string; label: string; icon: LucideIcon; items: NavItem[] };

const sections: NavSection[] = [
  {
    kind: "link",
    item: { to: "/ctrl-vx9k2m7fq3z", label: "Dashboard", icon: LayoutDashboard, exact: true },
  },
  {
    kind: "group",
    key: "content",
    label: "Content",
    icon: FileText,
    items: [
      { to: "/ctrl-vx9k2m7fq3z/story", label: "Story CMS", icon: BookOpen },
      { to: "/ctrl-vx9k2m7fq3z/quiz", label: "Onboarding Quiz", icon: HelpCircle },
      { to: "/ctrl-vx9k2m7fq3z/packs", label: "Memory Packs", icon: Package },
      { to: "/ctrl-vx9k2m7fq3z/categories", label: "Categories", icon: Tag },
      { to: "/ctrl-vx9k2m7fq3z/recall", label: "Recall Drills", icon: Sparkles },
    ],
  },
  {
    kind: "group",
    key: "intelligence",
    label: "Intelligence",
    icon: Lightbulb,
    items: [
      { to: "/ctrl-vx9k2m7fq3z/rules", label: "Rule Catalog", icon: ScrollText },
      { to: "/ctrl-vx9k2m7fq3z/personality", label: "Personality Engine", icon: Brain },
      { to: "/ctrl-vx9k2m7fq3z/experiments", label: "Experiments", icon: FlaskConical },
    ],
  },
  {
    kind: "group",
    key: "localization",
    label: "Localization",
    icon: Languages,
    items: [
      { to: "/ctrl-vx9k2m7fq3z/greetings", label: "World Greetings", icon: Globe },
      { to: "/ctrl-vx9k2m7fq3z/country-themes", label: "Country Themes", icon: Palette },
    ],
  },
  {
    kind: "link",
    item: { to: "/ctrl-vx9k2m7fq3z/users", label: "Users", icon: Users },
  },
  {
    kind: "group",
    key: "commerce",
    label: "Commerce",
    icon: Tag,
    items: [
      { to: "/ctrl-vx9k2m7fq3z/pricing", label: "Pricing & Legal", icon: Tag },
      { to: "/ctrl-vx9k2m7fq3z/limits", label: "Plan Limits", icon: Sliders },
    ],
  },
  {
    kind: "group",
    key: "system",
    label: "System",
    icon: Wrench,
    items: [
      { to: "/ctrl-vx9k2m7fq3z/flags", label: "Feature Flags", icon: ToggleRight },
      { to: "/ctrl-vx9k2m7fq3z/config", label: "Remote Config", icon: Sliders },
      { to: "/ctrl-vx9k2m7fq3z/audit", label: "Audit log", icon: History },
      { to: "/ctrl-vx9k2m7fq3z/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

const COLLAPSE_KEY = "mindrop.admin.sidebar.collapsed";
const OPEN_GROUPS_KEY = "mindrop.admin.sidebar.openGroups";

function groupContainsActive(items: NavItem[], pathname: string) {
  return items.some((i) => (i.exact ? pathname === i.to : pathname.startsWith(i.to)));
}

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state, update, signOut } = useAdmin();

  const doSignOut = async () => {
    setSigningOut(true);
    try {
      signOut();
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.auth.signOut();
    } finally {
      window.location.href = "/ctrl-vx9k2m7fq3z/signin";
    }
  };

  // Load persisted UI state
  useEffect(() => {
    try {
      if (localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
      const raw = localStorage.getItem(OPEN_GROUPS_KEY);
      const stored = raw ? JSON.parse(raw) : {};
      // Auto-open the group containing the active route on mount
      const seeded: Record<string, boolean> = { ...stored };
      for (const s of sections) {
        if (s.kind === "group" && groupContainsActive(s.items, pathname)) {
          seeded[s.key] = true;
        }
      }
      setOpenGroups(seeded);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep active group open when route changes
  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const s of sections) {
        if (s.kind === "group" && groupContainsActive(s.items, pathname) && !next[s.key]) {
          next[s.key] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  const toggleGroup = (key: string) => {
    // Expanding a group in the collapsed rail also expands the rail
    if (collapsed) {
      setCollapsed(false);
      try {
        localStorage.setItem(COLLAPSE_KEY, "0");
      } catch {}
    }
    setOpenGroups((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const sidebarWidth = collapsed ? "lg:w-16" : "lg:w-64";

  const renderNav = () => (
    <nav className="flex-1 space-y-1">
      {sections.map((s) => {
        if (s.kind === "link") {
          const n = s.item;
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to as any}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? n.label : undefined}
              aria-label={n.label}
              className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active ? "bg-brand/10 text-brand font-medium" : "text-ink/70 hover:bg-ink/5"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{n.label}</span>}
            </Link>
          );
        }

        const Icon = s.icon;
        const hasActive = groupContainsActive(s.items, pathname);
        const open = !!openGroups[s.key];
        return (
          <div key={s.key}>
            <button
              type="button"
              onClick={() => toggleGroup(s.key)}
              title={collapsed ? s.label : undefined}
              aria-expanded={open}
              aria-controls={`admin-nav-group-${s.key}`}
              className={`w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                hasActive
                  ? "text-brand font-medium"
                  : "text-ink/75 hover:bg-ink/5"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-left">{s.label}</span>
                  <ChevronDown
                    className={`size-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>
            {!collapsed && open && (
              <div
                id={`admin-nav-group-${s.key}`}
                className="mt-1 ml-3 pl-3 border-l border-ink/10 space-y-0.5"
              >
                {s.items.map((n) => {
                  const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
                  const ItemIcon = n.icon;
                  return (
                    <Link
                      key={n.to}
                      to={n.to as any}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-brand/10 text-brand font-medium"
                          : "text-ink/65 hover:bg-ink/5"
                      }`}
                    >
                      <ItemIcon className="size-3.5 shrink-0" />
                      <span className="truncate">{n.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-canvas text-ink flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink/10 bg-white transition-all duration-200 lg:static lg:translate-x-0 ${sidebarWidth} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-3 lg:p-4 overflow-y-auto">
          <div className="flex items-start justify-between mb-4 px-1">
            <Link to="/ctrl-vx9k2m7fq3z" className="block min-w-0" title="MinDrop">
              {collapsed ? (
                <div className="t-display text-2xl">
                  M<span className="text-brand">.</span>
                </div>
              ) : (
                <>
                  <div className="t-display">
                    MinDrop<span className="text-brand">.</span>
                  </div>
                  <p className="t-eyebrow mt-1.5 text-ink/70">Remember less. Live more.</p>
                </>
              )}
            </Link>
            <button
              className="lg:hidden text-ink/75"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          {renderNav()}

          {!collapsed && (
            <div className="t-meta mt-6 pt-4 border-t border-ink/10 space-y-2 px-2">
              <Link to="/" className="block text-ink/70 hover:text-brand">
                ← Consumer app
              </Link>
              <button
                onClick={() => setSignOutOpen(true)}
                className="flex items-center gap-1.5 text-ink/70 hover:text-brand"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink/10 bg-canvas/95 backdrop-blur px-4 md:px-6 h-14">
          <button
            className="lg:hidden text-ink/70"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <button
            className="hidden lg:inline-flex text-ink/60 hover:text-ink transition-colors"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="size-5" /> : <ChevronsLeft className="size-5" />}
          </button>
          <h1 className="t-display md:text-xl truncate hidden md:block">{title}</h1>
          <span className="md:hidden text-ink/30">·</span>
          <h1 className="t-body md:text-xl truncate md:hidden">{title}</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="t-meta hidden md:flex items-center gap-2 rounded-full bg-white border border-ink/10 px-3 py-1.5 text-ink/75 w-56">
              <Search className="size-3.5" />
              <input
                placeholder="Search rules, users…"
                className="bg-transparent outline-none flex-1"
              />
            </div>
            <select
              value={state.workspace}
              onChange={(e) =>
                update({ workspace: e.target.value as "dev" | "staging" | "prod" })
              }
              className="t-eyebrow bg-white border border-ink/10 rounded-full px-3 py-1.5"
            >
              <option value="dev">Dev</option>
              <option value="staging">Staging</option>
              <option value="prod">Prod</option>
            </select>
            <div className="t-meta size-8 rounded-full bg-brand/20 text-brand grid place-items-center">
              AN
            </div>
            <button
              onClick={() => setSignOutOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1.5 t-eyebrow text-ink/75 hover:text-brand hover:border-brand/40 transition-colors"
              title="Sign out of the admin console"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">{children}</main>
      </div>

      {signOutOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-signout-title"
          onClick={() => !signingOut && setSignOutOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="size-9 rounded-full bg-brand/10 text-brand grid place-items-center">
                <LogOut className="size-4" />
              </div>
              <h2 id="admin-signout-title" className="t-title">Sign out?</h2>
            </div>
            <p className="t-body-sm text-ink/70 mb-5">
              You'll be returned to the operator sign-in page. Any unsaved changes in open editors will be lost.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSignOutOpen(false)}
                disabled={signingOut}
                className="px-4 py-2 rounded-full t-eyebrow text-ink/70 hover:bg-ink/5 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={doSignOut}
                disabled={signingOut}
                className="px-4 py-2 rounded-full t-eyebrow bg-ink text-canvas hover:bg-brand disabled:opacity-40"
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
