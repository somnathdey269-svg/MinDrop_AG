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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFBEB] p-6 text-center">
      <div className="bg-white border-3 border-ink rounded-[2.5rem] p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full flex flex-col items-center">
        <span className="text-5xl mb-3">📍</span>
        <h1 className="text-3xl font-black text-ink">Page Not Found</h1>
        <p className="mt-2 text-sm font-semibold text-ink/75 leading-relaxed">
          The page you're looking for was moved or doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 px-8 py-3.5 bg-ink text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF671F] hover:border-[#FF671F] transition cursor-pointer"
        >
          Return to Home Deck
        </Link>
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFBEB] p-6 text-center">
      <div className="bg-white border-3 border-ink rounded-[2.5rem] p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full flex flex-col items-center">
        <span className="text-5xl mb-3">⚡</span>
        <h1 className="text-2xl sm:text-3xl font-black text-ink leading-tight">
          MinDrop Deck Reload
        </h1>
        <p className="mt-2 text-sm font-semibold text-ink/75 leading-relaxed">
          A temporary network update occurred. Click below to reload the deck seamlessly.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/";
              } else {
                router.invalidate();
                reset();
              }
            }}
            className="flex-1 px-6 py-3.5 bg-ink text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#10B981] hover:border-[#10B981] transition cursor-pointer"
          >
            Reload Deck
          </button>
          <a
            href="/"
            className="flex-1 px-6 py-3.5 bg-white text-ink font-black text-xs uppercase tracking-wider rounded-xl border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100 transition text-center"
          >
            Back Home
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

