import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyRole } from "@/lib/settings.functions";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z")({
  head: () => ({
    meta: [
      { title: "MinDrop Control Centre" },
      { name: "description", content: "No-code intelligence cockpit for MinDrop." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isSignIn = pathname.startsWith("/ctrl-vx9k2m7fq3z/signin");
  const [status, setStatus] = useState<"checking" | "ok" | "denied">(
    isSignIn ? "ok" : "checking",
  );

  useEffect(() => {
    if (isSignIn) {
      setStatus("ok");
      return;
    }
    let cancelled = false;
    (async () => {
      // Give Supabase a tick to hydrate the persisted session on cold load.
      let session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        await new Promise((r) => setTimeout(r, 250));
        session = (await supabase.auth.getSession()).data.session;
      }
      if (!session) {
        if (!cancelled) navigate({ to: "/ctrl-vx9k2m7fq3z/signin" });
        return;
      }
      try {
        const role = await getMyRole();
        if (cancelled) return;
        if (role.isSuperadmin) setStatus("ok");
        else setStatus("denied");
      } catch {
        // Never auto-logout on transient/network errors — assume access is OK
        // if the session is still present. Admins log out only via the button.
        if (cancelled) return;
        setStatus("ok");
      }
    })();

    return () => {
      cancelled = true;
    };
    // Verify once per mount; do NOT listen for cross-tab SIGNED_OUT events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignIn]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-ink text-canvas grid place-items-center">
        <p className="text-xs uppercase tracking-widest text-canvas/50">Verifying access…</p>
      </div>
    );
  }
  if (status === "denied") {
    return (
      <div className="min-h-screen bg-ink text-canvas grid place-items-center p-6 text-center">
        <div className="max-w-sm">
          <p className="text-[10px] uppercase tracking-widest text-canvas/50 mb-2">Access denied</p>
          <h1 className="font-serif text-3xl mb-3">Not a superadmin</h1>
          <p className="text-sm text-canvas/60 mb-6">
            This console is limited to platform operators. Ask an existing superadmin to grant your account access, or sign out and try a different account.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/ctrl-vx9k2m7fq3z/signin" });
            }}
            className="text-xs uppercase tracking-widest text-brand hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
