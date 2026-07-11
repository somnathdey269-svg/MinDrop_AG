import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight, Check, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { runLocalMemoryMigration } from "@/lib/runLocalMigration";

const searchSchema = z.object({
  next: z.string().optional(),
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — MinDrop" },
      { name: "description", content: "Sign in or create your MinDrop account to sync memories across devices." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function safeNext(raw: string | undefined): string {
  if (!raw) return "/dashboard";
  try {
    if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
    const u = new URL(raw, typeof window !== "undefined" ? window.location.origin : "http://x");
    if (typeof window !== "undefined" && u.origin === window.location.origin) return u.pathname + u.search + u.hash;
  } catch {}
  return "/dashboard";
}

type Mode = "signin" | "signup" | "verify" | "forgot" | "forgot-verify" | "forgot-reset";

function AuthPage() {
  const { next, mode: initialMode } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const nextPath = safeNext(next);

  const [mode, setMode] = useState<Mode>(initialMode === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: nextPath, replace: true });
    });
  }, [navigate, nextPath]);

  useEffect(() => () => {
    if (resendTimerRef.current) clearInterval(resendTimerRef.current);
  }, []);

  function startResendCooldown() {
    setResendIn(30);
    if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    resendTimerRef.current = setInterval(() => {
      setResendIn((n) => {
        if (n <= 1) {
          if (resendTimerRef.current) clearInterval(resendTimerRef.current);
          return 0;
        }
        return n - 1;
      });
    }, 1000);
  }

  async function afterSignIn() {
    await runLocalMemoryMigration();
    navigate({ to: nextPath, replace: true });
  }

  async function onGoogle() {
    if (busy) return;
    setBusy(true);
    try {
      if (typeof window !== "undefined") sessionStorage.setItem("mindrop.next", nextPath);
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth/callback",
      });
      if (result.error) throw result.error;
      if (!result.redirected) await afterSignIn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  }

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back");
      await afterSignIn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign in");
    } finally { setBusy(false); }
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      // 1) Create the account with password (Supabase sends verification email).
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/auth/callback",
          data: { name },
        },
      });
      if (error) throw error;
      // 2) Also send an OTP so the user can verify in-app on this page.
      await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      startResendCooldown();
      setMode("verify");
      toast.success("Check your email for the 6-digit code");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create your account");
    } finally { setBusy(false); }
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email, token: code.trim(), type: "email",
      });
      if (error) throw error;
      toast.success("You're in — welcome to MinDrop");
      await afterSignIn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid or expired code");
    } finally { setBusy(false); }
  }

  async function resendCode() {
    if (busy || resendIn > 0) return;
    setBusy(true);
    try {
      await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
      startResendCooldown();
      toast.success("New code sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend");
    } finally { setBusy(false); }
  }

  async function sendForgotOtp(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email, options: { shouldCreateUser: false },
      });
      if (error) throw error;
      startResendCooldown();
      setMode("forgot-verify");
      toast.success("Reset code sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code");
    } finally { setBusy(false); }
  }

  async function verifyForgotOtp(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email, token: code.trim(), type: "email",
      });
      if (error) throw error;
      setMode("forgot-reset");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid or expired code");
    } finally { setBusy(false); }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated — you're signed in");
      await afterSignIn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally { setBusy(false); }
  }

  const heading =
    mode === "signup" ? "Create your account"
    : mode === "verify" ? "Verify your email"
    : mode === "forgot" ? "Reset your password"
    : mode === "forgot-verify" ? "Enter your code"
    : mode === "forgot-reset" ? "Choose a new password"
    : "Welcome back";

  const sub =
    mode === "signup" ? "10 seconds. No credit card. No spam."
    : mode === "verify" ? `We sent a 6-digit code to ${email}`
    : mode === "forgot" ? "We'll email you a one-time code."
    : mode === "forgot-verify" ? `Enter the 6-digit code we sent to ${email}`
    : mode === "forgot-reset" ? "Pick something you'll actually remember."
    : "Pick up right where you left off.";

  return (
    <div className="min-h-[100svh] w-full bg-canvas text-ink overflow-hidden relative">
      {/* Warm ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-32 -left-24 size-[520px] rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(closest-side, #E8DFCB, transparent 70%)" }} />
        <div className="absolute -bottom-32 -right-16 size-[560px] rounded-full blur-3xl opacity-50"
          style={{ background: "radial-gradient(closest-side, #C9D8CB, transparent 70%)" }} />
        <div className="absolute top-1/3 right-1/4 size-[280px] rounded-full blur-2xl opacity-40"
          style={{ background: "radial-gradient(closest-side, #F3D9B1, transparent 70%)" }} />
      </div>

      <div className="relative z-10 min-h-[100svh] flex flex-col">
        {/* Header */}
        <header className="px-6 pt-8 pb-2 flex items-center justify-center">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="size-9 rounded-2xl grid place-items-center bg-ink text-canvas shadow-sm group-hover:scale-105 transition">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <span className="t-title text-[20px]">MinDrop</span>
          </Link>
        </header>

        {/* Card */}
        <main className="flex-1 flex items-center justify-center px-5 py-6">
          <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[420px]"
          >
            <div className="rounded-[28px] bg-white/85 backdrop-blur-xl border border-hairline shadow-[0_8px_40px_-12px_rgba(26,26,26,0.15)] p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h1 className="t-display text-[26px] leading-tight mb-1.5">{heading}</h1>
                  <p className="t-body-sm text-ink/65 mb-6">{sub}</p>

                  {/* Google button only in primary modes */}
                  {(mode === "signin" || mode === "signup") && (
                    <>
                      <button
                        onClick={onGoogle}
                        disabled={busy}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-ink/12 hover:border-ink/25 py-3.5 rounded-2xl transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                      >
                        <GoogleGlyph />
                        <span className="t-button">Continue with Google</span>
                      </button>

                      <div className="flex items-center gap-3 my-5" aria-hidden="true">
                        <div className="flex-1 h-px bg-ink/10" />
                        <span className="t-meta text-ink/45 uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-ink/10" />
                      </div>
                    </>
                  )}

                  {mode === "signin" && (
                    <form onSubmit={onSignIn} className="space-y-3">
                      <IconInput icon={Mail} type="email" required autoComplete="email"
                        placeholder="you@email.com" value={email} onChange={setEmail} />
                      <IconInput icon={Lock} type="password" required minLength={8}
                        autoComplete="current-password"
                        placeholder="Password" value={password} onChange={setPassword} />
                      <PrimaryButton busy={busy} label="Sign in" />
                      <div className="flex items-center justify-between pt-1">
                        <button type="button"
                          className="t-meta text-ink/60 hover:text-ink underline underline-offset-4"
                          onClick={() => { setMode("forgot"); setPassword(""); }}>
                          Forgot password?
                        </button>
                        <button type="button"
                          className="t-meta text-ink hover:opacity-80 inline-flex items-center gap-1"
                          onClick={() => { setMode("signup"); setPassword(""); }}>
                          Create account <ArrowRight className="size-3" />
                        </button>
                      </div>
                    </form>
                  )}

                  {mode === "signup" && (
                    <form onSubmit={onSignUp} className="space-y-3">
                      <IconInput icon={Sparkles} type="text" placeholder="Your first name (optional)"
                        value={name} onChange={setName} />
                      <IconInput icon={Mail} type="email" required autoComplete="email"
                        placeholder="you@email.com" value={email} onChange={setEmail} />
                      <IconInput icon={Lock} type="password" required minLength={8}
                        autoComplete="new-password"
                        placeholder="Password (8+ characters)" value={password} onChange={setPassword} />
                      <PrimaryButton busy={busy} label="Create account" />
                      <button type="button"
                        className="t-meta text-ink/60 hover:text-ink underline underline-offset-4 pt-1"
                        onClick={() => { setMode("signin"); setPassword(""); }}>
                        Already have an account? Sign in
                      </button>
                    </form>
                  )}

                  {(mode === "verify" || mode === "forgot-verify") && (
                    <form onSubmit={mode === "verify" ? onVerify : verifyForgotOtp} className="space-y-3">
                      <OtpInput value={code} onChange={setCode} />
                      <PrimaryButton
                        busy={busy}
                        disabled={code.length < 6}
                        label={mode === "verify" ? "Verify & continue" : "Continue"}
                      />
                      <div className="flex items-center justify-between pt-1">
                        <button type="button"
                          className="t-meta text-ink/60 hover:text-ink underline underline-offset-4 disabled:no-underline disabled:opacity-40"
                          onClick={resendCode}
                          disabled={busy || resendIn > 0}>
                          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                        </button>
                        <button type="button"
                          className="t-meta text-ink/60 hover:text-ink"
                          onClick={() => { setCode(""); setMode(mode === "verify" ? "signup" : "forgot"); }}>
                          Change email
                        </button>
                      </div>
                    </form>
                  )}

                  {mode === "forgot" && (
                    <form onSubmit={sendForgotOtp} className="space-y-3">
                      <IconInput icon={Mail} type="email" required autoComplete="email"
                        placeholder="you@email.com" value={email} onChange={setEmail} />
                      <PrimaryButton busy={busy} label="Send reset code" />
                      <button type="button"
                        className="t-meta text-ink/60 hover:text-ink underline underline-offset-4 pt-1"
                        onClick={() => setMode("signin")}>
                        Back to sign in
                      </button>
                    </form>
                  )}

                  {mode === "forgot-reset" && (
                    <form onSubmit={resetPassword} className="space-y-3">
                      <div className="inline-flex items-center gap-2 t-meta text-brand mb-1">
                        <Check className="size-3.5" /> Code verified
                      </div>
                      <IconInput icon={KeyRound} type="password" required minLength={8}
                        autoComplete="new-password"
                        placeholder="New password (8+ characters)"
                        value={password} onChange={setPassword} />
                      <PrimaryButton busy={busy} label="Update password" />
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="t-meta text-ink/55 text-center mt-6 px-4">
              By continuing you agree to our{" "}
              <Link to="/terms" className="underline underline-offset-2 hover:text-ink">Terms</Link>
              {" "}and{" "}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy</Link>.
            </p>

            <div className="text-center mt-4">
              <Link to="/dashboard" className="t-meta text-ink/50 hover:text-ink underline underline-offset-4">
                Skip for now — I'll sign up later
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

/* ─── tiny UI primitives ─────────────────────────────────────── */

function IconInput({
  icon: Icon, value, onChange, ...props
}: {
  icon: typeof Mail;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div className="relative">
      <Icon className="size-4 text-ink/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="t-body w-full bg-white border border-ink/12 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-ink/50 focus:shadow-[0_0_0_4px_rgba(74,93,78,0.08)] transition-all placeholder:text-ink/35"
      />
    </div>
  );
}

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="one-time-code"
      autoFocus
      placeholder="••••••"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      className="t-display text-center tracking-[0.6em] w-full bg-white border border-ink/12 py-4 rounded-2xl outline-none focus:border-ink/50 focus:shadow-[0_0_0_4px_rgba(74,93,78,0.08)] transition-all"
      aria-label="6-digit code"
    />
  );
}

function PrimaryButton({ busy, disabled, label }: { busy: boolean; disabled?: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      className="w-full bg-ink text-canvas py-3.5 rounded-2xl t-button inline-flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-40 shadow-sm hover:shadow-md"
    >
      {busy ? (
        <span className="inline-flex gap-1">
          <span className="size-1.5 rounded-full bg-canvas animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="size-1.5 rounded-full bg-canvas animate-bounce" style={{ animationDelay: "120ms" }} />
          <span className="size-1.5 rounded-full bg-canvas animate-bounce" style={{ animationDelay: "240ms" }} />
        </span>
      ) : (
        <>{label} <ArrowRight className="size-4" /></>
      )}
    </button>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
