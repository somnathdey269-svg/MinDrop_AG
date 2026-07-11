import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AlarmSheet } from "../components/memory/AlarmSheet";
import { PaywallSheet } from "../components/paywall/PaywallSheet";
import { Toaster } from "../components/ui/sonner";
import { startScheduler } from "../lib/memoryos/scheduler";
import { startNotifyEngine } from "../lib/notify/engine";
import { bootAppearance } from "../lib/memoryos/appearance";
import { startPlacesRuntime } from "../lib/places/runtime";
import { ensureCountryDetected } from "../lib/theme/useCountryTheme";
import { TOUR_IFRAME_SCRIPT } from "../lib/marketing/tourBridge";
import { installNativeApiForwarder } from "../lib/platform";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MinDrop" },
      {
        name: "description",
        content: "A calm second brain that holds the small things you'd rather not carry.",
      },
      { property: "og:title", content: "MinDrop" },
      {
        property: "og:description",
        content: "A calm second brain that holds the small things you'd rather not carry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "MinDrop" },
      { name: "twitter:description", content: "A calm second brain that holds the small things you'd rather not carry." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e0c77ea9-182d-47e4-a60d-84bac42d3f34/id-preview-8fd0c0f1--48ee5021-0fda-4b4a-9d0c-8037e4d328cb.lovable.app-1782849096371.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e0c77ea9-182d-47e4-a60d-84bac42d3f34/id-preview-8fd0c0f1--48ee5021-0fda-4b4a-9d0c-8037e4d328cb.lovable.app-1782849096371.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=Lora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => { installNativeApiForwarder(); bootAppearance(); startScheduler(); startNotifyEngine(); startPlacesRuntime(); ensureCountryDetected(); }, []);

  // If ?tour=1 is present (marketing walkthrough iframe), install the
  // postMessage bridge so the parent overlay can highlight elements.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!/[?&]tour=1(?:&|$)/.test(window.location.search)) return;
    const s = document.createElement("script");
    s.textContent = TOUR_IFRAME_SCRIPT;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  // React to sign in / out / user update once at the root. Filter to identity
  // transitions to avoid a storm on TOKEN_REFRESHED / INITIAL_SESSION.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let unsub: (() => void) | undefined;
    // Dynamic import so SSR doesn't touch the browser-only supabase client.
    Promise.all([
      import("../integrations/supabase/client"),
      import("../lib/cloud/sync"),
    ]).then(([{ supabase }, { startCloudSync, stopCloudSync }]) => {
      // Kick off sync if already signed in on load.
      supabase.auth.getSession().then(({ data }) => {
        const uid = data.session?.user?.id;
        if (uid) startCloudSync(uid);
      });
      const sub = supabase.auth.onAuthStateChange((event, session) => {
        if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
        router.invalidate();
        if (event === "SIGNED_OUT") {
          stopCloudSync({ wipeLocal: true });
        } else if (session?.user?.id) {
          startCloudSync(session.user.id);
          queryClient.invalidateQueries();
        }
      });
      unsub = () => sub.data.subscription.unsubscribe();
    });
    return () => { if (unsub) unsub(); };
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <AlarmSheet />
      <PaywallSheet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

