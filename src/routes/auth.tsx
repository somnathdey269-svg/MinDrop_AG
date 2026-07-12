import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight, Check, KeyRound, ArrowLeft, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getPublicSettings } from "@/lib/platformSettings.functions";
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
  const [sheet, setSheet] = useState<null | "terms" | "privacy">(null);
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

      <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-6 flex items-center justify-center shrink-0">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <AnimatedMWordmark />
          </Link>
        </header>

        {/* Card */}
        <main className="w-full max-w-[420px] shrink-0">
          <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
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
              <button type="button" onClick={() => setSheet("terms")} className="underline underline-offset-2 hover:text-ink">Terms</button>
              {" "}and{" "}
              <button type="button" onClick={() => setSheet("privacy")} className="underline underline-offset-2 hover:text-ink">Privacy</button>.
            </p>

            <div className="text-center mt-4">
              <Link to="/dashboard" className="t-meta text-ink/50 hover:text-ink underline underline-offset-4">
                Skip for now — I'll sign up later
              </Link>
            </div>
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {sheet !== null && (
          <LegalPageSheet kind={sheet} onClose={() => setSheet(null)} />
        )}
      </AnimatePresence>
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

function AnimatedMWordmark() {
  const reduce = useReducedMotion();
  const words = ["My", "MinDrop"] as const;
  const [i, setI] = useState(1);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setI((v) => (v + 1) % words.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  const word = words[i];

  return (
    <span className="flex items-center gap-2.5 min-w-0">
      <span
        aria-hidden="true"
        className="inline-grid place-items-center size-9 rounded-2xl border border-ink/10 text-canvas font-bold text-lg bg-ink shadow-sm shrink-0"
      >
        M
      </span>
      <span
        aria-hidden="true"
        className="flex items-baseline gap-1.5 text-ink min-w-0"
        style={{ fontWeight: 700, letterSpacing: "-0.015em" }}
      >
        <span className="text-ink/40" style={{ fontSize: "0.9rem", fontWeight: 400 }}>
          for
        </span>
        <span className="relative inline-block h-[1.5em] overflow-hidden shrink-0 min-w-max">
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={word}
              initial={reduce ? false : { y: "70%", opacity: 0 }}
              animate={reduce ? {} : { y: 0, opacity: 1 }}
              exit={reduce ? {} : { y: "-70%", opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block whitespace-nowrap text-xl"
              style={{ fontWeight: 700 }}
            >
              {word}
              <span
                className="ml-0.5 align-middle inline-block rounded-full bg-brand"
                style={{ width: 4.5, height: 4.5 }}
              />
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </span>
  );
}

/* ── Legal Page Sheet for Auth ──────────────────────────── */

const LEGAL_TITLES: Record<string, string> = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
};

function LegalPageSheet({ kind, onClose }: { kind: "terms" | "privacy"; onClose: () => void }) {
  const fetchSettings = useServerFn(getPublicSettings);
  const [s, setS] = useState<any>({
    companyLegalName: "MinDrop",
    companyJurisdiction: "Kolkata, West Bengal",
    companyAddress: "",
    supportEmail: "support@getmindrop.com",
    grievanceOfficerName: "",
    grievanceOfficerEmail: "",
  });

  useEffect(() => {
    let alive = true;
    fetchSettings().then((d) => { if (alive && d) setS(d); }).catch(() => {});
    return () => { alive = false; };
  }, [fetchSettings]);

  const company = s.companyLegalName || "MinDrop";
  const jur = s.companyJurisdiction || "";

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-ink/40 z-40" />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-canvas border-t border-ink/10 flex flex-col"
        style={{ height: "80%" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-ink/5 shrink-0">
          <span className="t-eyebrow text-ink/70">{LEGAL_TITLES[kind]}</span>
          <button onClick={onClose} className="size-8 rounded-full grid place-items-center hover:bg-ink/5" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 text-left">
          <div className="space-y-5 t-body-sm text-ink/85 leading-relaxed">
            {kind === "terms" && <TermsContent company={company} jur={jur} email={s.supportEmail} />}
            {kind === "privacy" && <PrivacyContent s={s} />}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function TermsContent({ company, jur, email }: { company: string; jur: string; email: string }) {
  return (
    <>
      <p className="t-meta text-ink/55">Last updated: November 2025</p>
      <p>These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("User", "you", "your") and {company} ("MinDrop", "we", "us", "our"), operator of the MinDrop mobile and web application and any related services (collectively, the "Service"). By accessing, downloading, installing, registering for, or using the Service in any manner, you unconditionally accept these Terms in their entirety. If you do not agree, you must immediately discontinue all use of the Service.</p>

      <div><h3 className="t-title text-sm mb-1">1. Eligibility</h3><p>You represent and warrant that you are at least eighteen (18) years of age and have the legal capacity to enter into a binding contract, or that you are using the Service under the supervision and with the express consent of a parent or legal guardian who accepts these Terms on your behalf.</p></div>

      <div><h3 className="t-title text-sm mb-1">2. Account & security</h3><p>You are solely and exclusively responsible for maintaining the confidentiality of your login credentials and for every activity that occurs under your account. You agree to immediately notify us of any unauthorised access.</p></div>

      <div><h3 className="t-title text-sm mb-1">3. Licence to use the Service</h3><p>Subject to your continuing compliance with these Terms, we grant you a personal, limited, revocable, non-exclusive, non-transferable, non-sublicensable licence to install and use the Service on devices you own or control, solely for your personal, non-commercial use.</p></div>

      <div><h3 className="t-title text-sm mb-1">4. Acceptable use</h3><p>You agree that you will not: (a) copy, modify, reverse engineer, or create derivative works based on the Service; (b) rent, lease, sell, or commercially exploit the Service; (c) use automated systems to access the Service; (d) attempt to gain unauthorised access to any portion of the Service; (e) use the Service to store unlawful or defamatory content; (f) use the Service in any manner that violates applicable law; or (g) interfere with or disrupt the Service.</p></div>

      <div><h3 className="t-title text-sm mb-1">5. User content & licence</h3><p>You retain ownership of your content. By submitting content, you grant MinDrop a worldwide, royalty-free licence to host, store, reproduce, process, and use such content solely for providing and improving the Service.</p></div>

      <div><h3 className="t-title text-sm mb-1">6. Third-party services</h3><p>The Service may integrate with third-party services including Google Sign-in, Google Drive backup, Firebase Cloud Messaging, and Cashfree Payments. Your use of any third-party service is governed by that third party's own terms.</p></div>

      <div><h3 className="t-title text-sm mb-1">7. Paid plans</h3><p>MinDrop offers a paid "Premium" plan for a term of one (1) year from the date of successful payment. Pricing may be changed at any time on a prospective basis.</p></div>

      <div><h3 className="t-title text-sm mb-1">8. Payments</h3><p>All payments are processed by Cashfree Payments or another designated processor. MinDrop does not store your card, UPI, or bank account credentials. All applicable taxes are your responsibility.</p></div>

      <div><h3 className="t-title text-sm mb-1">9. No auto-renewal</h3><p>The Premium plan does <strong>not</strong> auto-renew. On expiry, your account will automatically revert to the free tier.</p></div>

      <div><h3 className="t-title text-sm mb-1">10. Notifications</h3><p>By using the Service, you expressly consent to receive service-related and transactional communications from MinDrop, including push notifications, reminder notifications, and email.</p></div>

      <div><h3 className="t-title text-sm mb-1">11. Reminder accuracy</h3><p>The Service is a best-effort personal reminder utility. Reminders may be delayed, delivered out of order, or fail to deliver entirely. <strong>MinDrop expressly disclaims all liability for any missed, late, or non-delivered notification.</strong></p></div>

      <div><h3 className="t-title text-sm mb-1">12. Disclaimers</h3><p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, MINDROP DISCLAIMS ALL WARRANTIES.</p></div>

      <div><h3 className="t-title text-sm mb-1">13. Limitation of liability</h3><p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, MINDROP'S AGGREGATE LIABILITY SHALL NOT EXCEED THE LOWER OF (A) THE AMOUNT PAID BY YOU IN THE PRIOR 12 MONTHS, OR (B) INR 1,000.</p></div>

      <div><h3 className="t-title text-sm mb-1">14. Indemnity</h3><p>You agree to defend, indemnify, and hold harmless MinDrop from any claims arising out of your use of the Service, your content, or your violation of these Terms.</p></div>

      <div><h3 className="t-title text-sm mb-1">15. Suspension & termination</h3><p>MinDrop may at its sole discretion suspend or terminate your account. On termination, no refund shall be owed.</p></div>

      <div><h3 className="t-title text-sm mb-1">16. Modification of Terms</h3><p>MinDrop may modify these Terms at any time. Your continued use constitutes acceptance.</p></div>

      <div><h3 className="t-title text-sm mb-1">17. Governing law</h3><p>These Terms are governed by the laws of India. The courts at {jur} shall have exclusive jurisdiction.</p></div>

      <div><h3 className="t-title text-sm mb-1">18. Dispute resolution</h3><p>Disputes shall be settled by arbitration under the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be {jur}.</p></div>

      <div><h3 className="t-title text-sm mb-1">19. Force majeure</h3><p>MinDrop shall not be liable for any failure caused by circumstances beyond its reasonable control.</p></div>

      <div><h3 className="t-title text-sm mb-1">20. General</h3><p>These Terms, together with our Privacy Policy and Refund & Cancellation Policy, constitute the entire agreement between you and MinDrop.</p></div>

      <div><h3 className="t-title text-sm mb-1">21. Contact</h3><p>Questions about these Terms may be sent to <a href={`mailto:${email}`} className="underline">{email}</a>.</p></div>
    </>
  );
}

function PrivacyContent({ s }: { s: any }) {
  return (
    <>
      <p className="t-meta text-ink/55">Last updated: November 2025</p>
      <p>This Privacy Policy describes how MinDrop ("MinDrop", "we", "us", "our") collects, uses, discloses, retains, and protects personal data when you access or use the MinDrop mobile and web application and related services (the "Service").</p>

      <div><h3 className="t-title text-sm mb-1">1. Scope</h3><p>This Policy applies to the MinDrop application and website and to all personal data we process as data fiduciary in the course of providing the Service.</p></div>

      <div>
        <h3 className="t-title text-sm mb-1">2. Personal data we collect</h3>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li><strong>Account data:</strong> name, email address, avatar.</li>
          <li><strong>User content:</strong> memories, notes, tags, reminders, notification rules, saved places.</li>
          <li><strong>Device & technical data:</strong> device identifier, OS, app version, timezone, push notification token.</li>
          <li><strong>Usage data:</strong> feature interactions, session info, crash reports.</li>
          <li><strong>Payment data:</strong> we do <em>not</em> store your card, UPI, or bank details. We store only the payment gateway's transaction reference.</li>
          <li><strong>Location data:</strong> only if you grant permission, for place-based reminders.</li>
          <li><strong>Communications:</strong> support correspondence.</li>
        </ul>
      </div>

      <div><h3 className="t-title text-sm mb-1">3. Purposes of processing</h3><p>We process your data to: provide, operate, and secure the Service; authenticate you; deliver notifications; process payments; back up your data; detect fraud; provide support; improve the Service; comply with law; and enforce our rights.</p></div>

      <div><h3 className="t-title text-sm mb-1">4. Legal basis</h3><p>We process your data on the basis of your consent and legitimate uses permitted under the DPDP Act.</p></div>

      <div>
        <h3 className="t-title text-sm mb-1">5. How we share your data</h3>
        <p>We do not sell your personal data. We share data only with:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li><strong>Cashfree Payments</strong> — for processing payments.</li>
          <li><strong>Google</strong> — for authentication and optional backup.</li>
          <li><strong>Firebase Cloud Messaging</strong> — to deliver push notifications.</li>
          <li><strong>Cloud infrastructure providers</strong> — for hosting and compute.</li>
          <li><strong>Analytics providers</strong> — in de-identified form.</li>
          <li><strong>Law enforcement</strong> — where required by law.</li>
        </ul>
      </div>

      <div><h3 className="t-title text-sm mb-1">6. International transfers</h3><p>Our processors may store data outside India in jurisdictions permitted under the DPDP Act.</p></div>

      <div><h3 className="t-title text-sm mb-1">7. Retention</h3><p>We retain data for as long as your account is active and up to three (3) years thereafter. Backups are purged on a rolling 90-day cycle.</p></div>

      <div><h3 className="t-title text-sm mb-1">8. Security</h3><p>We employ commercially reasonable safeguards including encryption in transit (TLS), row-level access controls, and least-privilege access.</p></div>

      <div><h3 className="t-title text-sm mb-1">9. Your rights</h3><p>You have the right to: access, correct, or erase your data; withdraw consent; nominate another person in case of incapacity; and grievance redress.</p></div>

      <div><h3 className="t-title text-sm mb-1">10. Children</h3><p>The Service is not directed at persons under 18. We do not knowingly collect data from children.</p></div>

      <div><h3 className="t-title text-sm mb-1">11. Cookies & local storage</h3><p>We use cookies and local storage to keep you signed in, remember preferences, and gather anonymous usage statistics.</p></div>

      <div><h3 className="t-title text-sm mb-1">12. Third-party links</h3><p>The Service may contain links to third-party websites. We are not responsible for their privacy practices.</p></div>

      <div><h3 className="t-title text-sm mb-1">13. Changes to this Policy</h3><p>We may amend this Policy from time to time. Your continued use constitutes acceptance.</p></div>

      <div>
        <h3 className="t-title text-sm mb-1">14. Grievance Officer</h3>
        <ul className="mt-1 space-y-1">
          <li><strong>Name:</strong> {s.grievanceOfficerName}</li>
          <li><strong>Email:</strong> <a href={`mailto:${s.grievanceOfficerEmail}`} className="underline">{s.grievanceOfficerEmail}</a></li>
          <li><strong>Address:</strong> {s.companyAddress}</li>
        </ul>
        <p className="t-meta text-ink/60 mt-1">Complaints acknowledged within 48 hours and resolved within 15 days.</p>
      </div>
    </>
  );
}

