import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — MinDrop" }, { name: "robots", content: "noindex" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase recovery flow: the URL hash carries the recovery token; the
    // SDK exchanges it and emits PASSWORD_RECOVERY.
    const sub = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // If session already exists (returning user with recovery hash), also allow.
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.data.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PhoneFrame>
      <div className="p-8">
        <h1 className="t-display mb-1">New password</h1>
        <p className="t-body text-ink/75 mb-6">Choose a new password to finish signing in.</p>
        {!ready ? (
          <p className="t-body text-ink/70">Verifying recovery link…</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="password" required minLength={8} autoComplete="new-password"
              placeholder="New password (8+ chars)" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="t-body w-full bg-white border border-ink/15 px-4 py-3 rounded-xl outline-none focus:border-brand"
            />
            <button type="submit" disabled={busy} className="t-button w-full bg-ink text-canvas py-3 rounded-xl disabled:opacity-50">
              {busy ? "…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </PhoneFrame>
  );
}
