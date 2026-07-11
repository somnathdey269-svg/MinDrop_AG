import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { runLocalMemoryMigration } from "@/lib/runLocalMigration";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Signing you in — MinDrop" }, { name: "robots", content: "noindex" }] }),
  component: Callback,
});

function Callback() {
  const navigate = useNavigate();
  useEffect(() => {
    let cancelled = false;

    const go = async () => {
      if (cancelled) return;
      const next = (typeof window !== "undefined" && sessionStorage.getItem("mindrop.next")) || "/dashboard";
      sessionStorage.removeItem("mindrop.next");
      try { await runLocalMemoryMigration(); } catch {}
      navigate({ to: next, replace: true });
    };

    // wait briefly for the SDK to finish setting session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) return go();
      const sub = supabase.auth.onAuthStateChange((evt, session) => {
        if (session && (evt === "SIGNED_IN" || evt === "INITIAL_SESSION")) {
          sub.data.subscription.unsubscribe();
          go();
        }
      });
      // fallback: if nothing happens in 4s, send to /auth
      setTimeout(() => {
        if (cancelled) return;
        supabase.auth.getSession().then(({ data }) => {
          if (!data.session) navigate({ to: "/auth", replace: true });
        });
      }, 4000);
    });

    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <PhoneFrame>
      <div className="p-8 text-center">
        <p className="t-body text-ink/70 mt-24">Signing you in…</p>
      </div>
    </PhoneFrame>
  );
}
