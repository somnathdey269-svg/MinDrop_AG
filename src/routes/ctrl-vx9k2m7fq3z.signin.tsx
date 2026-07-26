import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminSignInFn } from "@/lib/adminAuth.functions";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/signin")({
  head: () => ({
    meta: [
      { title: "Not Found" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSignIn,
});

function AdminSignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      // 1. First attempt server-side sign-in
      const res = await adminSignInFn({ data: { email, password } });

      if (res && res.success && res.session) {
        await supabase.auth.setSession({
          access_token: res.session.access_token,
          refresh_token: res.session.refresh_token,
        });
        navigate({ to: "/ctrl-vx9k2m7fq3z" });
        return;
      }

      // If server returned explicit error message
      if (res && !res.success && res.error) {
        setErr(res.error);
        return;
      }

      // 2. Fallback to client-side direct auth
      const { data: clientData, error: clientErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (clientErr) {
        setErr(clientErr.message || "Invalid credentials");
        return;
      }

      const uid = clientData.user?.id;
      if (!uid) throw new Error("Sign in failed");

      const { data: roles } = await (supabase as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "superadmin")
        .maybeSingle();

      if (!roles) {
        await supabase.auth.signOut();
        setErr("Access denied: Superadmin role required");
        return;
      }

      navigate({ to: "/ctrl-vx9k2m7fq3z" });
    } catch (e: any) {
      const raw = e?.message || e;
      setErr(typeof raw === "string" ? raw : JSON.stringify(raw));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-canvas grid place-items-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="size-5 text-brand" />
          <p className="text-[10px] uppercase tracking-widest text-canvas/60">Operator console</p>
        </div>
        <h1 className="font-serif text-4xl mb-2">
          MinDrop<span className="text-brand">.</span>
        </h1>
        <p className="text-sm text-canvas/60 mb-6">Restricted access.</p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            autoComplete="username"
            placeholder="operator@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none placeholder:text-canvas/30"
          />
          <input
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none placeholder:text-canvas/30"
          />
          {err && <p className="text-xs text-red-400 font-bold leading-relaxed">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-canvas text-ink py-3 rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
          >
            {busy && <Loader2 className="size-3 animate-spin" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
