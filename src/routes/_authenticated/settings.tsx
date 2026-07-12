import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { ChangelogSheet } from "@/components/settings/ChangelogSheet";

import { supabase } from "@/integrations/supabase/client";
import { deleteMyAccount } from "@/lib/auth/account.functions";
import { useOnboarding } from "@/lib/memoryos/store";
import {
  useAppearance,
  FONT_LABELS,
  SIZE_LABELS,
  type FontChoice,
  type SizeChoice,
} from "@/lib/memoryos/appearance";
import { buildBackup, downloadBackup, downloadCsvBackup, importBackupFromFile, importBackupFromCsvFile, importBackupFromText } from "@/lib/memoryos/backup";
import {
  getDriveAuthUrl,
  disconnectDrive,
  getDriveStatus,
  backupToDrive,
  restoreFromDrive,
} from "@/lib/drive/drive.functions";
import { getMyPlan } from "@/lib/plan.functions";
import { Activity, AlarmClock, Bell, BookOpen, ChevronLeft, ChevronRight, Clock, Cloud, Crown, Download, Eye, EyeOff, Globe, KeyRound, Layers, Lock, LogOut, ShieldCheck, Sparkles, Trash2, Type, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountryTheme, useCountryThemes, setCountryOverride, getCountryOverride } from "@/lib/theme/useCountryTheme";
import { padPalette, INDIA_SAFFRON, INDIA_GREEN, INDIA_BLUE, getReadableAccent } from "@/lib/theme/palette";
import { CHANGELOG, hasUnseenChangelog } from "@/lib/changelog";
import { toast } from "sonner";
import { LegalFooter } from "@/components/legal/LegalFooter";

// AI and digest configurations imports
import { getActiveProvider, getKey, saveKey, deleteKey, setActiveProvider } from "@/lib/notify/summary/keyring";
import { getProvider } from "@/lib/notify/summary/providers";
import { readSchedule, writeSchedule } from "@/lib/notify/summary/scheduler";
import type { ProviderId } from "@/lib/notify/summary/types";
import { getEnabledModelsForProvider } from "@/lib/notify/summary/adminConfig";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MinDrop" },
      { name: "description", content: "Manage your MinDrop preferences, packs, appearance and backups." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Settings,
});


type Tile = {
  label: string;
  hint?: string;
  icon: typeof Bell;
  to?: string;
  onClick?: () => void;
  color: string;
};

function Settings() {
  const { state, reset } = useOnboarding();
  const navigate = useNavigate();
  const search = useSearch({ from: "/_authenticated/settings" }) as { drive?: string; message?: string };
  const isPremium = state.plan === "premium";
  const [sheet, setSheet] = useState<null | "privacy" | "export" | "changelog" | "drive" | "ai-keys" | "digest-sched">(null);

  useEffect(() => {
    if (search.drive === "connected") {
      toast.success("Google Drive connected");
      navigate({ to: "/settings", search: {} as any, replace: true });
    } else if (search.drive === "error") {
      toast.error(search.message || "Google Drive connection failed");
      navigate({ to: "/settings", search: {} as any, replace: true });
    }
  }, [search.drive, search.message, navigate]);

  const [permHint, setPermHint] = useState<string>("Tap to review");
  useEffect(() => {
    let cancelled = false;
    import("@/lib/permissions/state").then(async ({ readPermissions, summarizePermissions }) => {
      const snap = await readPermissions();
      if (!cancelled) setPermHint(summarizePermissions(snap));
    }).catch(() => {});
    const onVis = () => { if (document.visibilityState === "visible") {
      import("@/lib/permissions/state").then(async ({ readPermissions, summarizePermissions }) => {
        const snap = await readPermissions();
        if (!cancelled) setPermHint(summarizePermissions(snap));
      }).catch(() => {});
    }};
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelled = true; document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const tiles: Tile[] = [
    { label: "Permission", hint: permHint, icon: Bell, to: "/permissions", color: INDIA_SAFFRON },
    { label: "Alarm & sound", hint: "Ringtone, vibration, snooze", icon: AlarmClock, to: "/alarm-sound", color: INDIA_BLUE },
    { label: "Backup & restore", hint: "Export or import JSON", icon: Download, onClick: () => setSheet("export"), color: INDIA_GREEN },
    { label: "Google Drive", hint: "Back up to your Drive", icon: Cloud, onClick: () => setSheet("drive"), color: INDIA_SAFFRON },
  ];


  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
        <div className="flex-1 px-5 sm:px-6 pt-8 pb-36">
          <p className="t-eyebrow text-ink/70 mb-1">Account</p>
          <h1 className="t-display mb-5">Settings.</h1>

          {/* Profile card */}
          <div className="relative overflow-hidden rounded-3xl p-5 mb-6 bg-gradient-to-br from-ink to-[#1f1f1f] text-canvas shadow-lg shadow-ink/10">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-brand/20 blur-2xl" />
            <div className="relative flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-brand/30 text-canvas grid place-items-center text-[24px] leading-none">
                {(state.name || state.email || "Y")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="t-title truncate">{state.name || "Friend of MinDrop"}</p>
                <p className="t-eyebrow text-canvas/60 mt-0.5 flex items-center gap-1.5">
                  {isPremium ? <><Crown className="size-3 text-brand" /> Premium plan</> : <>Free plan</>}
                </p>
              </div>
            </div>
          </div>

          {/* Plan CTA */}
          {!isPremium ? (
            <Link to="/paywall" data-tour="settings-plan" className="block mb-6">

              <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#FFD8A8] via-[#FFC58A] to-[#FFAE6B] border border-[#E89A56]/40">
                <div className="flex items-center gap-3 mb-1">
                  <Crown className="size-5 text-[#8A4A12]" />
                  <p className="t-title text-ink">Go Premium</p>
                </div>
                <p className="t-body-sm text-ink/70 max-w-[260px]">Unlimited memories, future dates, photos, longer Recovery vault.</p>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 t-button text-ink/70">See plan →</span>
              </div>
            </Link>
          ) : (
            <Link to="/paywall" className="block mb-6">
              <div className="rounded-3xl p-4 bg-white border border-ink/10 flex items-center justify-between">
                <div>
                  <p className="t-title">Manage Premium</p>
                  <p className="t-meta">Billing, plan, perks</p>
                </div>
                <ChevronRight className="size-4 text-ink/70" />
              </div>
            </Link>
          )}
          {/* Tiles grid - responsive */}
          <p className="t-eyebrow text-ink/70 mb-3">App</p>
          <div data-tour="settings-menu" className="grid grid-cols-2 gap-3 mb-6">
            <div data-tour="settings-caps" className="contents">

            {tiles.map((t) => {
              const Icon = t.icon;
              const accent = t.color;
              const bg = `linear-gradient(145deg, color-mix(in oklab, ${accent} 8%, var(--canvas)) 0%, color-mix(in oklab, ${accent} 20%, var(--canvas)) 100%)`;
              const border = `color-mix(in oklab, ${accent} 22%, transparent)`;
              const iconBg = `color-mix(in oklab, ${accent} 12%, var(--canvas))`;
              const readable = getReadableAccent(accent);

              const className = "group block w-full h-full text-left rounded-3xl p-4 border hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none";
              const style = { background: bg, borderColor: border };

              const content = (
                <>
                  <div className="size-10 rounded-xl grid place-items-center mb-3 backdrop-blur border" style={{ background: iconBg, borderColor: border }}>
                    <Icon className="size-5" style={{ color: readable }} />
                  </div>
                  <p className="t-title text-ink">{t.label}</p>
                  {t.hint && <p className="t-meta text-ink/75 mt-0.5">{t.hint}</p>}
                </>
              );

              if (t.to) {
                return (
                  <Link 
                    key={t.label} 
                    to={t.to as any} 
                    onClick={() => { try { sessionStorage.setItem("gmd:from", "settings"); } catch {} }}
                    className={className}
                    style={style}
                  >
                    {content}
                  </Link>
                );
              }
              return (
                <button 
                  key={t.label} 
                  onClick={t.onClick} 
                  className={className}
                  style={style}
                >
                  {content}
                </button>
              );
            })}
            </div>
          </div>

          {/* AI Model Integration */}
          <div>
            <AICard onOpen={() => setSheet("ai-keys")} />
          </div>

          {/* Digests & automation */}
          <div>
            <DigestCard onOpen={() => setSheet("digest-sched")} />
          </div>

          {/* Region / country theme */}
          <div data-tour="settings-region">
            <RegionCard />
          </div>

          {/* Appearance — font + size */}
          <div data-tour="settings-appearance">
            <AppearanceCard />
          </div>

          {/* Sign-in hook for free users */}
          {!isPremium && (
            <div className="mt-6 rounded-3xl p-4 bg-white border border-dashed border-ink/15 flex items-start gap-3">
              <Lock className="size-4 text-ink/70 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="t-title">Your account is synced.</p>
                <p className="t-body-sm text-ink/75 mt-0.5">Signed in and syncing across devices.</p>
              </div>
            </div>
          )}

          <AccountActions />

          <div className="mt-6 flex items-center justify-center gap-1.5 t-meta text-ink/30">
            <BookOpen className="size-3" />
            MinDrop · v1.0
          </div>
        </div>
        <div className="px-6 pt-6 pb-3">
          <LegalFooter />
        </div>
        <div aria-hidden="true" className="h-40 shrink-0" />
        <BottomTabs />
      </div>

      <AnimatePresence>
        {sheet === "changelog" && <ChangelogSheet onClose={() => setSheet(null)} />}
        {(sheet === "privacy" || sheet === "export") && (
          <InfoSheet kind={sheet} isPremium={isPremium} onClose={() => setSheet(null)} />
        )}
        {sheet === "drive" && <DriveBackupSheet onClose={() => setSheet(null)} />}
        {sheet === "ai-keys" && <AISettingsSheet onClose={() => setSheet(null)} />}
        {sheet === "digest-sched" && (
          <DigestAutomationSheet
            onClose={() => setSheet(null)}
            onLinkApi={() => setSheet("ai-keys")}
          />
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}

function InfoSheet({ kind, isPremium, onClose }: { kind: "privacy" | "export"; isPremium: boolean; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Google Drive state
  const getAuthUrl = useServerFn(getDriveAuthUrl);
  const disconnect = useServerFn(disconnectDrive);
  const getStatus = useServerFn(getDriveStatus);
  const backup = useServerFn(backupToDrive);
  const restore = useServerFn(restoreFromDrive);

  const [driveStatus, setDriveStatus] = useState<{ connected: boolean; connectedAt: string | null; updatedAt: string | null } | null>({ connected: false, connectedAt: null, updatedAt: null });
  const [driveBusy, setDriveBusy] = useState<null | "connect" | "backup" | "restore" | "disconnect">(null);

  useEffect(() => {
    if (kind === "export" && isPremium) {
      let mounted = true;
      getStatus()
        .then((s) => { if (mounted) setDriveStatus(s); })
        .catch(() => {
          if (mounted) {
            setDriveStatus({ connected: false, connectedAt: null, updatedAt: null });
          }
        });
      return () => { mounted = false; };
    }
  }, [kind, isPremium, getStatus]);

  async function connect() {
    setDriveBusy("connect");
    setMsg(null);
    try {
      const { url } = await getAuthUrl();
      window.location.href = url;
    } catch (err: any) {
      setMsg(err?.message || "Could not start Google Drive connection");
      setDriveBusy(null);
    }
  }

  async function doBackup() {
    setDriveBusy("backup");
    setMsg(null);
    try {
      const payload = JSON.stringify(buildBackup());
      const { filename } = await backup({ data: { payload, format: "json" } });
      setMsg(`Backed up to ${filename}`);
      const s = await getStatus();
      setDriveStatus(s);
    } catch (err: any) {
      setMsg(err?.message || "Backup failed");
    } finally {
      setDriveBusy(null);
    }
  }

  async function doRestore() {
    setDriveBusy("restore");
    setMsg(null);
    try {
      const { content, filename } = await restore();
      const { imported } = importBackupFromText(content);
      setMsg(`Restored ${imported} item${imported === 1 ? "" : "s"} from ${filename}. Reopen tabs to refresh.`);
    } catch (err: any) {
      setMsg(err?.message || "Restore failed");
    } finally {
      setDriveBusy(null);
    }
  }

  async function doDisconnect() {
    if (!confirm("Disconnect Google Drive? Backups already in your Drive will stay there.")) return;
    setDriveBusy("disconnect");
    setMsg(null);
    try {
      await disconnect();
      setDriveStatus({ connected: false, connectedAt: null, updatedAt: null });
      setMsg("Google Drive disconnected");
    } catch (err: any) {
      setMsg(err?.message || "Disconnect failed");
    } finally {
      setDriveBusy(null);
    }
  }

  const handleImport = async (f: File) => {
    setMsg(null);
    try {
      const isCsv = f.name.toLowerCase().endsWith(".csv");
      if (isCsv) {
        const { imported } = await importBackupFromCsvFile(f);
        setMsg(`Restored ${imported} item${imported === 1 ? "" : "s"} from CSV. Reopen tabs to refresh.`);
      } else {
        const { imported } = await importBackupFromFile(f);
        setMsg(`Restored ${imported} item${imported === 1 ? "" : "s"}. Reopen tabs to refresh.`);
      }
    } catch (e: any) {
      setMsg(e?.message || "Couldn't read that file.");
    }
  };

  const isDriveConnected = driveStatus?.connected ?? false;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-ink/40 z-40" />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-canvas border-t border-ink/10 max-h-[88%] overflow-y-auto"
      >
        <div className="sticky top-0 flex items-center justify-between px-5 py-3 bg-canvas border-b border-ink/5">
          <span className="t-eyebrow text-ink/70">{kind === "privacy" ? "Privacy" : "Backup & restore"}</span>
          <button onClick={onClose} className="size-8 rounded-full grid place-items-center hover:bg-ink/5"><X className="size-4" /></button>
        </div>

        {kind === "privacy" ? (
          <div className="px-6 py-6">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-[#DDEBFF] to-[#BFD9FF] grid place-items-center mb-4">
              <ShieldCheck className="size-7 text-[#1E508F]" />
            </div>
            <h2 className="t-display mb-2">Your memories never leave you.</h2>
            <p className="t-body-sm text-ink/65 mb-5">Whether you're on Free or Premium — we never store, read, or sell your data. Ever.</p>

            <ul className="space-y-3">
              <Bullet emoji="📱" title="On-device storage" body="Everything lives on this phone. Nothing is sent to a MinDrop server." />
              <Bullet emoji="☁️" title="Premium = your cloud" body="When Premium ships, sync goes to your own Google Drive folder — yours, revocable." />
              <Bullet emoji="🙈" title="No tracking, no ads" body="No analytics SDKs, no fingerprinting, no third-party scripts on your captures." />
              <Bullet emoji="🗑️" title="Delete = gone" body="Uninstall and the device forgets. There's no shadow copy to chase." />
            </ul>

            <button onClick={onClose} className="mt-6 w-full bg-ink text-canvas py-4 rounded-2xl t-button">Got it</button>
          </div>
        ) : (
          <div className="px-6 py-6">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-[#FFE3EE] to-[#FFC9DC] grid place-items-center mb-4">
              <Download className="size-7 text-[#A33361]" />
            </div>
            <h1 className="t-display mb-1">Backup & restore.</h1>
            <p className="t-meta text-ink/75 mb-4 leading-relaxed">Export your data as JSON or CSV, or restore from a previous backup file.</p>

            <ul className="space-y-3 mb-6">
              <Bullet emoji="📦" title="What's inside" body="Your captures, categories, installed packs, personality, app preferences." />
              <Bullet emoji="🔐" title="Where it goes" body="Straight to your downloads folder. No upload step — we never see it." />
              <Bullet emoji="🔄" title="Switching device" body="Export from the old device, install on the new one, then Import here." />
            </ul>

            <p className="t-eyebrow text-ink/50 mb-1">Export</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={downloadBackup}
                style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                className="bg-white border py-3.5 rounded-2xl t-button flex flex-col items-center justify-center gap-1.5 hover:bg-[#046A38]/5 transition-colors cursor-pointer shadow-sm"
              >
                <Download className="size-4 text-[#046A38]/70" />
                <span className="t-meta font-semibold">JSON</span>
              </button>

              <button
                onClick={downloadCsvBackup}
                style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                className="bg-white border py-3.5 rounded-2xl t-button flex flex-col items-center justify-center gap-1.5 hover:bg-[#046A38]/5 transition-colors cursor-pointer shadow-sm"
              >
                <Download className="size-4 text-[#046A38]/70" />
                <span className="t-meta font-semibold">CSV</span>
              </button>

              {!isPremium ? (
                <Link
                  to="/paywall"
                  onClick={onClose}
                  style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                  className="bg-white border py-3.5 rounded-2xl t-button flex flex-col items-center justify-center gap-1.5 hover:bg-[#046A38]/5 transition-colors cursor-pointer shadow-sm relative"
                >
                  <Crown className="size-3 text-amber-500 absolute top-1 right-1.5" />
                  <Cloud className="size-4 text-[#046A38]/70" />
                  <span className="t-meta font-semibold">Drive</span>
                </Link>
              ) : !isDriveConnected ? (
                <button
                  onClick={connect}
                  disabled={driveBusy === "connect"}
                  style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                  className="bg-white border py-3.5 rounded-2xl t-button flex flex-col items-center justify-center gap-1.5 hover:bg-[#046A38]/5 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Cloud className="size-4 text-[#046A38]/70" />
                  <span className="t-meta font-semibold truncate w-full px-0.5 text-center">Link</span>
                </button>
              ) : (
                <button
                  onClick={doBackup}
                  disabled={!!driveBusy}
                  style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                  className="bg-white border py-3.5 rounded-2xl t-button flex flex-col items-center justify-center gap-1.5 hover:bg-[#046A38]/5 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Cloud className={`size-4 text-[#046A38]/70 ${driveBusy === "backup" ? "animate-bounce" : ""}`} />
                  <span className="t-meta font-semibold truncate w-full px-0.5 text-center">
                    {driveBusy === "backup" ? "Syncing" : "Drive"}
                  </span>
                </button>
              )}
            </div>

            <p className="t-eyebrow text-ink/50 mb-1 mt-4">Import</p>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = ""; }}
            />
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.accept = "application/json,.json";
                    fileRef.current.click();
                  }
                }}
                style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                className="bg-white border py-3.5 rounded-2xl t-button flex flex-col items-center justify-center gap-1.5 hover:bg-[#046A38]/5 transition-colors cursor-pointer shadow-sm"
              >
                <Upload className="size-4 text-[#046A38]/70" />
                <span className="t-meta font-semibold">JSON</span>
              </button>

              <button
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.accept = ".csv,text/csv";
                    fileRef.current.click();
                  }
                }}
                style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                className="bg-white border py-3.5 rounded-2xl t-button flex flex-col items-center justify-center gap-1.5 hover:bg-[#046A38]/5 transition-colors cursor-pointer shadow-sm"
              >
                <Upload className="size-4 text-[#046A38]/70" />
                <span className="t-meta font-semibold">CSV</span>
              </button>

              {!isPremium ? (
                <Link
                  to="/paywall"
                  onClick={onClose}
                  style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                  className="bg-white border py-3.5 rounded-2xl t-button flex flex-col items-center justify-center gap-1.5 hover:bg-[#046A38]/5 transition-colors cursor-pointer shadow-sm relative"
                >
                  <Crown className="size-3 text-amber-500 absolute top-1 right-1.5" />
                  <Cloud className="size-4 text-[#046A38]/70" />
                  <span className="t-meta font-semibold">Drive</span>
                </Link>
              ) : !isDriveConnected ? (
                <button
                  onClick={connect}
                  disabled={driveBusy === "connect"}
                  style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                  className="bg-white border py-3.5 rounded-2xl t-button flex flex-col items-center justify-center gap-1.5 hover:bg-[#046A38]/5 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Cloud className="size-4 text-[#046A38]/70" />
                  <span className="t-meta font-semibold truncate w-full px-0.5 text-center">Link</span>
                </button>
              ) : (
                <button
                  onClick={doRestore}
                  disabled={!!driveBusy}
                  style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                  className="bg-white border py-3.5 rounded-2xl t-button flex flex-col items-center justify-center gap-1.5 hover:bg-[#046A38]/5 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Cloud className={`size-4 text-[#046A38]/70 ${driveBusy === "restore" ? "animate-bounce" : ""}`} />
                  <span className="t-meta font-semibold truncate w-full px-0.5 text-center">
                    {driveBusy === "restore" ? "Restoring" : "Drive"}
                  </span>
                </button>
              )}
            </div>

            {/* Google Drive Integration for Premium Users */}
            {isPremium && (
              <>
                <div className="my-6 border-t border-ink/10" />
                <p className="t-eyebrow text-ink/50 mb-2 flex items-center gap-1.5">
                  <Cloud className="size-3.5" /> Google Drive Cloud Backup
                </p>
                {driveStatus === null ? (
                  <p className="t-body-sm text-ink/60 text-center py-4">Loading Drive settings…</p>
                ) : isDriveConnected ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-2xl border border-ink/5">
                      <p className="t-title">Google Drive Connected</p>
                      {driveStatus.connectedAt && (
                        <p className="t-body-sm text-ink/60 mt-0.5">
                          Linked since {new Date(driveStatus.connectedAt).toLocaleDateString()}
                        </p>
                      )}
                      {driveStatus.updatedAt && driveStatus.updatedAt !== driveStatus.connectedAt && (
                        <p className="t-body-sm text-ink/60 mt-0.5">
                          Last auto-sync: {new Date(driveStatus.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={doBackup}
                        disabled={!!driveBusy}
                        style={{ backgroundColor: "color-mix(in oklab, #046A38 10%, #fff)", color: "#046A38", borderColor: "rgba(4, 106, 56, 0.2)" }}
                        className="py-3.5 rounded-2xl t-button border flex items-center justify-center gap-2 disabled:opacity-50 active:bg-ink/[0.04] transition-colors"
                      >
                        {driveBusy === "backup" ? "Syncing…" : "Sync to Drive"}
                      </button>
                      <button
                        onClick={doRestore}
                        disabled={!!driveBusy}
                        style={{ borderColor: "rgba(4, 106, 56, 0.2)", color: "#046A38" }}
                        className="bg-white border py-3.5 rounded-2xl t-button flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#046A38]/5 transition-colors"
                      >
                        {driveBusy === "restore" ? "Restoring…" : "Restore from Drive"}
                      </button>
                    </div>
                    <button
                      onClick={doDisconnect}
                      disabled={!!driveBusy}
                      className="w-full mt-1 py-3.5 t-button text-red-600 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-50"
                    >
                      {driveBusy === "disconnect" ? "Disconnecting…" : "Disconnect Google Drive"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connect}
                    disabled={!!driveBusy}
                    style={{ backgroundColor: "color-mix(in oklab, #046A38 10%, #fff)", color: "#046A38", borderColor: "rgba(4, 106, 56, 0.2)" }}
                    className="w-full border py-3.5 rounded-2xl t-button flex items-center justify-center gap-2 disabled:opacity-50 active:bg-ink/[0.04] transition-colors"
                  >
                    {driveBusy === "connect" ? "Connecting…" : "Link Google Drive"}
                  </button>
                )}
              </>
            )}

            {msg && <p className="mt-3 t-body-sm text-ink/70 text-center">{msg}</p>}
          </div>
        )}
      </motion.div>
    </>
  );
}

function Bullet({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <li className="flex gap-3 p-3 bg-white rounded-2xl border border-ink/5">
      <span className="text-[20px] leading-none mt-0.5" aria-hidden="true">{emoji}</span>
      <div className="min-w-0">
        <p className="t-body-sm font-semibold">{title}</p>
        <p className="t-meta text-ink/70 mt-0.5">{body}</p>
      </div>
    </li>
  );
}

function DriveBackupSheet({ onClose }: { onClose: () => void }) {
  const getAuthUrl = useServerFn(getDriveAuthUrl);
  const disconnect = useServerFn(disconnectDrive);
  const getStatus = useServerFn(getDriveStatus);
  const backup = useServerFn(backupToDrive);
  const restore = useServerFn(restoreFromDrive);
  const fetchPlan = useServerFn(getMyPlan);

  const [status, setStatus] = useState<{ connected: boolean; connectedAt: string | null; updatedAt: string | null } | null>({ connected: false, connectedAt: null, updatedAt: null });
  const [plan, setPlan] = useState<"free" | "premium" | null>("free");
  const [busy, setBusy] = useState<null | "connect" | "backup" | "restore" | "disconnect">(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchPlan()
      .then((p) => { if (mounted) setPlan(p.plan); })
      .catch(() => { if (mounted) setPlan("free"); });
    getStatus()
      .then((s) => { if (mounted) setStatus(s); })
      .catch(() => {
        if (mounted) {
          setStatus({ connected: false, connectedAt: null, updatedAt: null });
          setPlan("free");
        }
      });
    return () => { mounted = false; };
  }, [getStatus, fetchPlan]);

  async function connect() {
    setBusy("connect");
    setMsg(null);
    try {
      const { url } = await getAuthUrl();
      window.location.href = url;
    } catch (err: any) {
      setMsg(err?.message || "Could not start Google Drive connection");
      setBusy(null);
    }
  }

  async function doBackup() {
    setBusy("backup");
    setMsg(null);
    try {
      const payload = JSON.stringify(buildBackup());
      const { filename } = await backup({ data: { payload } });
      setMsg(`Backed up to ${filename}`);
      const s = await getStatus();
      setStatus(s);
    } catch (err: any) {
      setMsg(err?.message || "Backup failed");
    } finally {
      setBusy(null);
    }
  }

  async function doRestore() {
    setBusy("restore");
    setMsg(null);
    try {
      const { content, filename } = await restore();
      const { imported } = importBackupFromText(content);
      setMsg(`Restored ${imported} item${imported === 1 ? "" : "s"} from ${filename}. Reopen tabs to refresh.`);
    } catch (err: any) {
      setMsg(err?.message || "Restore failed");
    } finally {
      setBusy(null);
    }
  }

  async function doDisconnect() {
    if (!confirm("Disconnect Google Drive? Backups already in your Drive will stay there.")) return;
    setBusy("disconnect");
    setMsg(null);
    try {
      await disconnect();
      setStatus({ connected: false, connectedAt: null, updatedAt: null });
      setMsg("Google Drive disconnected");
    } catch (err: any) {
      setMsg(err?.message || "Disconnect failed");
    } finally {
      setBusy(null);
    }
  }

  const connected = status?.connected ?? false;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-ink/40 z-40" />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-canvas border-t border-ink/10 max-h-[88%] overflow-y-auto"
      >
        <div className="sticky top-0 flex items-center justify-between px-5 py-3 bg-canvas border-b border-ink/5">
          <span className="t-eyebrow text-ink/70">Google Drive backup</span>
          <button onClick={onClose} className="size-8 rounded-full grid place-items-center hover:bg-ink/5" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] grid place-items-center mb-4">
            <Cloud className="size-7 text-[#0369A1]" />
          </div>
          <h1 className="t-display mb-1">Your personal cloud.</h1>
          <p className="t-meta text-ink/75 mb-4 leading-relaxed">Securely sync your memory catalog straight to your private Google Drive. You hold the keys. We never see your files.</p>

          <ul className="space-y-3 mb-6">
            <Bullet emoji="🛡️" title="100% Private & Secure" body="Your data stays on your Google Drive under your encryption keys. Complete custody." />
            <Bullet emoji="📱" title="Seamless Restore & Sync" body="Restore your entire memory collection instantly on any new phone or device with a single click." />
            <Bullet emoji="💖" title="Safety & Peace of Mind" body="Never worry about lost phones or accidental uninstalls. Your memory journal is safe forever." />
          </ul>

          {status === null || plan === null ? (
            <p className="t-body-sm text-ink/60 text-center py-4">Loading…</p>
          ) : plan === "free" ? (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA] border border-[#FDBA74]/40">
                <div className="flex items-center gap-2 mb-1.5">
                  <Crown className="size-4 text-[#B45309]" />
                  <p className="t-body-sm font-bold text-[#7C2D12] uppercase tracking-wider">Unlock Cloud Backup</p>
                </div>
                <p className="t-meta text-ink/75 leading-relaxed">Google Drive linkage is a Premium feature. Secure your memories now and enjoy unlimited cloud backups, photo attachments, and device sync.</p>
              </div>
              <Link
                to="/paywall"
                onClick={onClose}
                style={{ backgroundColor: "rgba(255, 103, 31, 0.1)", color: "#FF671F", borderColor: "rgba(255, 103, 31, 0.2)" }}
                className="w-full border py-3.5 rounded-2xl t-button flex items-center justify-center gap-2 active:bg-[#FF671F]/5 transition-colors text-center font-bold"
              >
                <Crown className="size-4" /> Secure Your Memories
              </Link>
            </div>
          ) : connected ? (
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-ink/5">
                <p className="t-title">Connected</p>
                {status.connectedAt && (
                  <p className="t-body-sm text-ink/60 mt-0.5">
                    Since {new Date(status.connectedAt).toLocaleDateString()}
                  </p>
                )}
                {status.updatedAt && status.updatedAt !== status.connectedAt && (
                  <p className="t-body-sm text-ink/60 mt-0.5">
                    Last backup {new Date(status.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={doBackup}
                disabled={!!busy}
                style={{ backgroundColor: "color-mix(in oklab, #FF671F 10%, #fff)", color: "#FF671F", borderColor: "rgba(255, 103, 31, 0.2)" }}
                className="w-full border py-3.5 rounded-2xl t-button flex items-center justify-center gap-2 disabled:opacity-50 active:bg-ink/[0.04] transition-colors"
              >
                {busy === "backup" ? "Backing up…" : <><Upload className="size-4" /> Back up now</>}
              </button>
              <button
                onClick={doRestore}
                disabled={!!busy}
                style={{ borderColor: "rgba(255, 103, 31, 0.2)", color: "#FF671F" }}
                className="w-full bg-white border py-3.5 rounded-2xl t-button flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#FF671F]/5 transition-colors"
              >
                {busy === "restore" ? "Restoring…" : <><Download className="size-4" /> Restore latest backup</>}
              </button>
              <button
                onClick={doDisconnect}
                disabled={!!busy}
                className="w-full py-3.5 t-button text-ink/70 hover:text-red-600 disabled:opacity-50"
              >
                {busy === "disconnect" ? "Disconnecting…" : "Disconnect Google Drive"}
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={!!busy}
              style={{ backgroundColor: "color-mix(in oklab, #FF671F 10%, #fff)", color: "#FF671F", borderColor: "rgba(255, 103, 31, 0.2)" }}
              className="w-full border py-3.5 rounded-2xl t-button flex items-center justify-center gap-2 disabled:opacity-50 active:bg-ink/[0.04] transition-colors"
            >
              {busy === "connect" ? "Connecting…" : <><Cloud className="size-4" /> Connect Google Drive</>}
            </button>
          )}

          {msg && <p className="mt-3 t-body-sm text-ink/70 text-center">{msg}</p>}
        </div>
      </motion.div>
    </>
  );
}

function AppearanceCard() {
  const { appearance, set, reset, hydrated } = useAppearance();
  if (!hydrated) return null;

  const fonts: FontChoice[] = ["sans", "serif", "mono"];
  const sizes: SizeChoice[] = ["s", "m", "l", "xl"];
  const isDefault = appearance.font === "sans" && appearance.size === "s";

  const fontPreview: Record<FontChoice, string> = {
    sans: `"Inter", ui-sans-serif, system-ui, sans-serif`,
    serif: `"Lora", "Instrument Serif", Georgia, serif`,
    mono: `"JetBrains Mono", ui-monospace, Menlo, monospace`,
  };

  return (
    <div className="mb-6 rounded-3xl bg-white border border-ink/8 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-ink/[0.06] grid place-items-center">
            <Type className="size-4 text-ink/70" aria-hidden="true" />
          </div>
          <div>
            <p className="t-title">Appearance</p>
            <p className="t-meta text-ink/60">Font + size, applied everywhere</p>
          </div>
        </div>
        {!isDefault && (
          <button
            onClick={reset}
            className="t-eyebrow text-ink/50 hover:text-ink px-2 py-1"
          >
            Reset
          </button>
        )}
      </div>

      {/* Live preview */}
      <div className="mx-5 mb-3 rounded-2xl bg-canvas border border-ink/8 px-4 py-3">
        <p className="t-eyebrow text-ink/45 mb-1">Preview</p>
        <p className="t-body text-ink" style={{ fontFamily: fontPreview[appearance.font] }}>
          Remember less. Live more.
        </p>
      </div>

      {/* Font family */}
      <div className="px-5 pb-3">
        <p className="t-eyebrow text-ink/50 mb-2">Font</p>
        <div className="grid grid-cols-3 gap-2">
          {fonts.map((f) => {
            const active = appearance.font === f;
            return (
              <button
                key={f}
                onClick={() => set({ font: f })}
                aria-pressed={active}
                className={`relative rounded-xl px-3 py-2.5 border transition-all ${
                  active
                    ? "bg-ink text-canvas border-ink shadow-sm"
                    : "bg-canvas text-ink border-ink/10 hover:border-ink/25"
                }`}
                style={{ fontFamily: fontPreview[f] }}
              >
                <span className="block text-[15px] leading-tight">Aa</span>
                <span className="block text-[9.5px] uppercase tracking-widest mt-0.5 opacity-70">
                  {FONT_LABELS[f]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size */}
      <div className="px-5 pb-5">
        <p className="t-eyebrow text-ink/50 mb-2">Size</p>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((s) => {
            const active = appearance.size === s;
            const scale = { s: 12, m: 14, l: 16, xl: 18 }[s];
            return (
              <button
                key={s}
                onClick={() => set({ size: s })}
                aria-pressed={active}
                className={`rounded-xl px-2 py-2.5 border transition-all flex flex-col items-center justify-center gap-0.5 ${
                  active
                    ? "bg-ink text-canvas border-ink shadow-sm"
                    : "bg-canvas text-ink border-ink/10 hover:border-ink/25"
                }`}
              >
                <span style={{ fontSize: scale }} className="leading-none font-medium">A</span>
                <span className="text-[9.5px] uppercase tracking-widest opacity-70">{SIZE_LABELS[s]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RegionCard() {
  const theme = useCountryTheme();
  const { data: themes } = useCountryThemes();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const isOverride = typeof window !== "undefined" && !!getCountryOverride();

  const preview = padPalette(theme.raw);
  const list = (themes ?? []).filter((t) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return t.name.toLowerCase().includes(term) || t.code.toLowerCase().includes(term);
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full mb-6 text-left rounded-3xl border border-ink/8 bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
      >
        <div className="flex items-center gap-4 p-4">
          <div className="size-11 rounded-2xl grid place-items-center text-[22px] leading-none shrink-0"
            style={{ background: `color-mix(in oklab, ${preview.accent1} 14%, var(--canvas))` }}
            aria-hidden="true"
          >
            {theme.flag}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="t-title truncate">{theme.name}</p>
              <span className="t-eyebrow text-ink/50">
                {isOverride ? "Manual" : "Auto"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              {[preview.accent1, preview.accent2, preview.accent3].map((c, i) => (
                <span key={i} className="size-4 rounded-md border border-ink/10" style={{ background: c }} aria-hidden="true" />
              ))}
              <p className="t-meta text-ink/60 ml-1.5">Flag colors themed across your rooms</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-ink/40 shrink-0" />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-ink/40 z-40"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-canvas border-t border-ink/10 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-ink/5">
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-ink/70" />
                  <span className="t-eyebrow text-ink/70">Choose region</span>
                </div>
                <button onClick={() => setOpen(false)} className="size-8 rounded-full grid place-items-center hover:bg-ink/5" aria-label="Close">
                  <X className="size-4" />
                </button>
              </div>
              <div className="px-5 pt-3">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search country"
                  className="w-full px-3 py-2 rounded-xl border border-ink/15 bg-white t-body-sm"
                />
                {isOverride && (
                  <button
                    onClick={() => { setCountryOverride(null); setOpen(false); }}
                    className="mt-2 w-full t-button text-ink/60 hover:text-ink py-2"
                  >
                    Reset to auto-detected
                  </button>
                )}
              </div>
              <ul className="flex-1 overflow-y-auto px-3 pb-6">
                {list.map((t) => {
                  const active = t.code === theme.code;
                  const pv = padPalette(t.colors);
                  return (
                    <li key={t.code}>
                      <button
                        onClick={() => { setCountryOverride(t.code); setOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-ink/5 ${active ? "bg-ink/[0.04]" : ""}`}
                      >
                        <span className="text-[20px] leading-none shrink-0" aria-hidden="true">{t.code === "IN" ? "🇮🇳" : String.fromCodePoint(t.code.charCodeAt(0) - 65 + 0x1f1e6, t.code.charCodeAt(1) - 65 + 0x1f1e6)}</span>
                        <span className="t-body-sm flex-1 truncate">{t.name}</span>
                        <span className="flex items-center gap-1">
                          {[pv.accent1, pv.accent2, pv.accent3].map((c, i) => (
                            <span key={i} className="size-3.5 rounded-sm border border-ink/10" style={{ background: c }} />
                          ))}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function AccountActions() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteFn = useServerFn(deleteMyAccount);
  const [busy, setBusy] = useState<null | "signout" | "delete">(null);

  async function signOut() {
    if (busy) return;
    if (!confirm("Sign out of this device?")) return;
    setBusy("signout");
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      toast.success("Signed out");
      navigate({ to: "/auth", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign out failed");
    } finally {
      setBusy(null);
    }
  }

  async function deleteAccount() {
    if (busy) return;
    const confirm1 = confirm("Delete your account? Every memory, place, rule and setting will be permanently erased. This cannot be undone.");
    if (!confirm1) return;
    const confirm2 = prompt('Type DELETE (in capitals) to confirm.');
    if (confirm2 !== "DELETE") { toast.error("Cancelled"); return; }
    setBusy("delete");
    try {
      await deleteFn();
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      toast.success("Account deleted");
      navigate({ to: "/", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete account");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-6 space-y-2">
      <button
        onClick={signOut}
        disabled={!!busy}
        className="w-full flex items-center justify-center gap-2 t-button text-ink/70 hover:text-ink py-3 rounded-xl border border-ink/10 disabled:opacity-50"
      >
        <LogOut className="size-4" /> Sign out
      </button>
      <button
        onClick={deleteAccount}
        disabled={!!busy}
        className="w-full flex items-center justify-center gap-2 t-button text-red-600 hover:bg-red-50 py-3 rounded-xl disabled:opacity-50"
      >
        <Trash2 className="size-4" /> Delete account
      </button>
    </div>
  );
}

function AICard({ onOpen }: { onOpen: () => void }) {
  const activeProvider = getActiveProvider();
  const hintText = activeProvider
    ? `Active: ${activeProvider === "gemini" ? "Gemini" : activeProvider === "openai" ? "OpenAI" : "Anthropic"}`
    : "Configure AI API keys";

  return (
    <button
      onClick={onOpen}
      className="w-full mb-6 text-left rounded-3xl border border-ink/8 bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-center gap-4 p-4">
        <div
          className="size-11 rounded-2xl grid place-items-center shrink-0"
          style={{ background: "color-mix(in oklab, #8B5CF6 12%, var(--canvas))", color: "#8B5CF6" }}
          aria-hidden="true"
        >
          <Sparkles className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="t-title">AI model integration</p>
          <p className="t-meta text-ink/60 mt-1">{hintText}</p>
        </div>
        <ChevronRight className="size-4 text-ink/40 shrink-0" />
      </div>
    </button>
  );
}

function DigestCard({ onOpen }: { onOpen: () => void }) {
  const sched = readSchedule();
  const hintText = sched.enabled
    ? `${sched.interval === "weekly" ? "Weekly" : "Daily"} digest at ${sched.hhmm}`
    : "Schedule notification summaries & triggers";

  return (
    <button
      onClick={onOpen}
      className="w-full mb-6 text-left rounded-3xl border border-ink/8 bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-center gap-4 p-4">
        <div
          className="size-11 rounded-2xl grid place-items-center shrink-0"
          style={{ background: "color-mix(in oklab, #0D9488 12%, var(--canvas))", color: "#0D9488" }}
          aria-hidden="true"
        >
          <Clock className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="t-title">Digests & triggers</p>
          <p className="t-meta text-ink/60 mt-1">{hintText}</p>
        </div>
        <ChevronRight className="size-4 text-ink/40 shrink-0" />
      </div>
    </button>
  );
}

function AISettingsSheet({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"provider" | "key" | "model">("provider");
  const [activeTab, setActiveTab] = useState<ProviderId>("gemini");
  const [keyInput, setKeyInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [showKey, setShowKey] = useState(false);

  // Sync state whenever activeTab changes
  useEffect(() => {
    const stored = getKey(activeTab);
    setKeyInput(stored?.key ?? "");
    setSelectedModel(stored?.model ?? getDefaultModel(activeTab));
    setShowKey(false);
  }, [activeTab]);

  function getDefaultModel(p: ProviderId) {
    const enabledModels = getEnabledModelsForProvider(p);
    const rec = enabledModels.find((m) => m.recommended);
    return rec?.id || enabledModels[0]?.id || "";
  }

  const storedKey = getKey(activeTab);
  const isActive = getActiveProvider() === activeTab;

  function doSave() {
    if (!keyInput.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    saveKey(activeTab, keyInput.trim(), selectedModel);
    setActiveProvider(activeTab);
    toast.success(`${activeTab === "gemini" ? "Gemini" : activeTab === "openai" ? "OpenAI" : "Anthropic"} integration updated successfully!`);
    onClose();
  }

  function doDelete() {
    deleteKey(activeTab);
    setKeyInput("");
    toast.success("API key deleted");
    setStep("provider");
  }

  const modelsList = getEnabledModelsForProvider(activeTab);

  const keyGuides: Record<ProviderId, { title: string; url: string; label: string }> = {
    gemini: {
      title: "Get Gemini API Key",
      url: "https://aistudio.google.com/app/apikey",
      label: "Google AI Studio console"
    },
    openai: {
      title: "Get OpenAI API Key",
      url: "https://platform.openai.com/api-keys",
      label: "OpenAI Developer Platform"
    },
    anthropic: {
      title: "Get Anthropic API Key",
      url: "https://console.anthropic.com/settings/keys",
      label: "Anthropic Console dashboard"
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-ink/40 z-40" />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-canvas border-t border-ink/10 max-h-[88%] overflow-y-auto"
      >
        <div className="sticky top-0 flex items-center justify-between px-5 py-3 bg-canvas border-b border-ink/5">
          <div className="flex items-center">
            {step !== "provider" && (
              <button
                onClick={() => {
                  if (step === "model") setStep("key");
                  else if (step === "key") setStep("provider");
                }}
                className="size-8 rounded-full grid place-items-center hover:bg-ink/5 mr-2"
                aria-label="Back"
              >
                <ChevronLeft className="size-4 text-ink/70" />
              </button>
            )}
            <span className="t-eyebrow text-ink/70">AI model integration</span>
          </div>
          <button onClick={onClose} className="size-8 rounded-full grid place-items-center hover:bg-ink/5" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        {/* Subtle step progress indicator */}
        <div className="flex gap-1.5 px-6 pt-5">
          {[1, 2, 3].map((num) => {
            const currentNum = step === "provider" ? 1 : step === "key" ? 2 : 3;
            const isFilled = num <= currentNum;
            return (
              <div
                key={num}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isFilled ? "#7C3AED" : "color-mix(in oklab, var(--color-ink) 10%, transparent)"
                }}
              />
            );
          })}
        </div>

        <div className="px-6 py-6">
          {step === "provider" && (
            <div className="space-y-4">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-[#F5F3FF] to-[#DDD6FE] grid place-items-center mb-4">
                <Sparkles className="size-7 text-[#7C3AED]" />
              </div>
              <h1 className="t-display mb-1">AI models & keys.</h1>
              <p className="t-meta text-ink/75 mb-6 leading-relaxed">
                Connect your own API key to power digest summaries. All keys are encrypted and stored locally on your device.
              </p>

              <div className="space-y-3">
                {([
                  { id: "gemini", title: "Google Gemini", desc: "Recommended. Extremely fast, lightweight, and cost-effective.", color: "#8B5CF6", bg: "#F5F3FF" },
                  { id: "openai", title: "OpenAI GPT", desc: "Industry standard performance with GPT-4o and GPT-4o mini.", color: "#10B981", bg: "#ECFDF5" },
                  { id: "anthropic", title: "Anthropic Claude", desc: "Advanced summarization capabilities with Claude 3.5 Sonnet.", color: "#D97706", bg: "#FEF3C7" }
                ] as const).map((p) => {
                  const hasKey = !!getKey(p.id);
                  const isCurrentActive = getActiveProvider() === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveTab(p.id);
                        setStep("key");
                      }}
                      className="w-full p-4 text-left rounded-2xl border border-ink/8 hover:border-ink/20 hover:shadow-sm transition-all bg-white flex items-center justify-between group"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="t-body font-semibold text-ink">{p.title}</p>
                          {isCurrentActive && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] uppercase tracking-wider">Active</span>
                          )}
                        </div>
                        <p className="t-meta text-ink/60 leading-relaxed">{p.desc}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {hasKey ? (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700 flex items-center gap-1 border border-green-200">
                            <span className="size-1.5 rounded-full bg-green-500" /> Linked
                          </span>
                        ) : (
                          <ChevronRight className="size-4 text-ink/30 group-hover:text-ink/65 transition-colors" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "key" && (
            <div className="space-y-4">
              <h1 className="t-display mb-1 capitalize">Link {activeTab} key.</h1>
              <p className="t-meta text-ink/75 mb-5 leading-relaxed">
                Provide your authentication token below.
              </p>

              {/* Get key guide link */}
              <a
                href={keyGuides[activeTab].url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-2xl border border-[#7C3AED]/20 bg-[#F5F3FF]/45 hover:bg-[#EDE9FE]/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-white grid place-items-center shrink-0 shadow-sm border border-[#DDD6FE]">
                    <KeyRound className="size-4.5 text-[#7C3AED]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="t-body-sm font-semibold text-[#6D28D9]">{keyGuides[activeTab].title}</p>
                    <p className="t-meta text-[#7C3AED]/90 mt-0.5">Generate a key safely in the {keyGuides[activeTab].label} ↗</p>
                  </div>
                </div>
              </a>

              <div className="pt-2">
                <label className="block t-meta font-semibold text-ink/70 mb-2">API Key Value</label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder={storedKey ? "••••••••••••••••" : "Paste your key here"}
                    className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-canvas text-ink t-body-sm focus:outline-none focus:border-[#7C3AED] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-ink/40 hover:text-ink/70"
                  >
                    {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                {storedKey && (
                  <button
                    onClick={doDelete}
                    className="px-4 py-3.5 rounded-2xl t-button border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete Key
                  </button>
                )}
                <button
                  onClick={() => setStep("model")}
                  disabled={!keyInput.trim()}
                  style={{
                    backgroundColor: keyInput.trim() ? "color-mix(in oklab, #7C3AED 10%, #fff)" : "transparent",
                    color: keyInput.trim() ? "#7C3AED" : "var(--color-ink-30)",
                    borderColor: keyInput.trim() ? "rgba(124, 58, 237, 0.2)" : "var(--color-ink-10)"
                  }}
                  className="flex-1 border py-3.5 rounded-2xl t-button text-center font-bold active:bg-ink/[0.04] transition-colors disabled:opacity-40"
                >
                  Continue to Models
                </button>
              </div>
            </div>
          )}

          {step === "model" && (
            <div className="space-y-4">
              <h1 className="t-display mb-1 capitalize">Choose model size.</h1>
              <p className="t-meta text-ink/75 mb-5 leading-relaxed">
                Select your default text model size. Larger models are smarter but cost slightly more in token billing.
              </p>

              <div className="space-y-3">
                {modelsList.map((m) => {
                  const isSel = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      style={{
                        borderColor: isSel ? "#7C3AED" : "color-mix(in oklab, var(--color-ink) 8%, transparent)",
                        backgroundColor: isSel ? "rgba(124, 58, 237, 0.03)" : "white"
                      }}
                      className="w-full p-4 text-left rounded-2xl border transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="t-body font-semibold text-ink">{m.label}</p>
                          {m.recommended && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#047857] uppercase tracking-wider">Recommended</span>
                          )}
                        </div>
                        <p className="t-meta text-ink/50 mt-1">
                          Estimated cost: ${m.inPerM.toFixed(2)} input / ${m.outPerM.toFixed(2)} output per 1M tokens.
                        </p>
                      </div>
                      <div className="shrink-0 size-5 rounded-full border border-ink/20 grid place-items-center">
                        {isSel && (
                          <span className="size-3 rounded-full bg-[#7C3AED]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setStep("key")}
                  className="px-4 py-3.5 rounded-2xl t-button border border-ink/10 hover:bg-ink/[0.02]"
                >
                  Back
                </button>
                <button
                  onClick={doSave}
                  style={{ backgroundColor: "color-mix(in oklab, #7C3AED 10%, #fff)", color: "#7C3AED", borderColor: "rgba(124, 58, 237, 0.2)" }}
                  className="flex-1 border py-3.5 rounded-2xl t-button text-center font-bold active:bg-[#7C3AED]/5 transition-colors"
                >
                  Activate & Save
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

function DigestAutomationSheet({ onClose, onLinkApi }: { onClose: () => void; onLinkApi: () => void }) {
  const [step, setStep] = useState<"model" | "schedule" | "threshold">("model");
  const [sched, setSched] = useState(readSchedule());

  // Check integrated APIs
  const hasGemini = !!getKey("gemini");
  const hasOpenAI = !!getKey("openai");
  const hasAnthropic = !!getKey("anthropic");
  const hasAnyApi = hasGemini || hasOpenAI || hasAnthropic;

  // Track active provider & model for scheduling
  // Default to the first integrated one, or getActiveProvider() or fallback to gemini
  const activeIntegratedProvider = (sched.providerId && getKey(sched.providerId))
    ? sched.providerId
    : (getActiveProvider() || (hasGemini ? "gemini" : hasOpenAI ? "openai" : hasAnthropic ? "anthropic" : "gemini"));

  const enabledModels = getEnabledModelsForProvider(activeIntegratedProvider);

  // Sync providerId and modelId inside state if empty or invalid
  useEffect(() => {
    if (!sched.providerId || sched.providerId !== activeIntegratedProvider) {
      setSched((prev) => ({
        ...prev,
        providerId: activeIntegratedProvider,
        modelId: prev.modelId && enabledModels.some((m) => m.id === prev.modelId)
          ? prev.modelId
          : (enabledModels[0]?.id || "")
      }));
    } else if (!sched.modelId || !enabledModels.some((m) => m.id === sched.modelId)) {
      setSched((prev) => ({
        ...prev,
        modelId: enabledModels[0]?.id || ""
      }));
    }
  }, [activeIntegratedProvider, enabledModels]);

  function handleProviderChange(pid: ProviderId) {
    const models = getEnabledModelsForProvider(pid);
    setSched((prev) => ({
      ...prev,
      providerId: pid,
      modelId: models[0]?.id || ""
    }));
  }

  function handleSave() {
    writeSchedule(sched);
    toast.success("Digest automation settings saved!");
    onClose();
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-ink/40 z-40" />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-canvas border-t border-ink/10 max-h-[88%] overflow-y-auto flex flex-col"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 flex items-center justify-between px-5 py-3 bg-canvas border-b border-ink/5 z-10">
          <div className="flex items-center">
            {step !== "model" && (
              <button
                onClick={() => {
                  if (step === "threshold") setStep("schedule");
                  else if (step === "schedule") setStep("model");
                }}
                className="size-8 rounded-full grid place-items-center hover:bg-ink/5 mr-2"
                aria-label="Back"
              >
                <ChevronLeft className="size-4 text-ink/70" />
              </button>
            )}
            <span className="t-eyebrow text-ink/70">Digests & automation</span>
          </div>
          <button onClick={onClose} className="size-8 rounded-full grid place-items-center hover:bg-ink/5" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex gap-1.5 px-6 pt-5">
          {[1, 2, 3].map((num) => {
            const currentNum = step === "model" ? 1 : step === "schedule" ? 2 : 3;
            const isFilled = num <= currentNum;
            return (
              <div
                key={num}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isFilled ? "#0D9488" : "color-mix(in oklab, var(--color-ink) 10%, transparent)"
                }}
              />
            );
          })}
        </div>

        <div className="px-6 py-6 overflow-y-auto flex-1">
          {/* STEP 1: AI Model size Selection */}
          {step === "model" && (
            <div className="space-y-5">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-[#E0F2FE] to-[#CCFBF1] grid place-items-center mb-1">
                <Clock className="size-7 text-[#0D9488]" />
              </div>
              <h1 className="t-display mb-1">AI Model for Digest.</h1>
              <p className="t-meta text-ink/75 mb-4 leading-relaxed">
                Choose which integrated AI provider and model size compiles your automated daily/weekly notification summaries.
              </p>

              {!hasAnyApi ? (
                <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100/80 text-center space-y-3">
                  <p className="t-body font-semibold text-red-700">No active AI integrations found</p>
                  <p className="t-meta text-red-600/90 leading-normal">
                    You need to link at least one AI key (Google Gemini, OpenAI, or Anthropic) in settings before scheduling automatic digests.
                  </p>
                  <button
                    type="button"
                    onClick={onLinkApi}
                    className="inline-flex items-center gap-1.5 px-5 py-3 bg-red-600 text-white rounded-2xl t-button font-bold hover:bg-red-700 transition-all shadow-sm"
                  >
                    Link AI Key in Settings ↗
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-ink/50 font-bold block mb-1">API Provider</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(["gemini", "openai", "anthropic"] as ProviderId[]).map((pid) => {
                        const isIntegrated = pid === "gemini" ? hasGemini : pid === "openai" ? hasOpenAI : hasAnthropic;
                        const isSelected = sched.providerId === pid;

                        return (
                          <button
                            key={pid}
                            type="button"
                            disabled={!isIntegrated}
                            onClick={() => handleProviderChange(pid)}
                            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center min-h-[72px] ${
                              isSelected
                                ? "border-[#0D9488] bg-[#0D9488]/5 text-ink font-semibold shadow-sm"
                                : isIntegrated
                                ? "border-ink/10 bg-white text-ink/75 hover:bg-ink/[0.02]"
                                : "border-ink/5 bg-ink/[0.01] text-ink/35 cursor-not-allowed opacity-60"
                            }`}
                          >
                            <span className="text-xs capitalize block">{pid}</span>
                            {!isIntegrated && (
                              <span className="text-[8px] text-red-500 font-bold mt-1 bg-red-50 px-1 py-0.2 rounded">Off</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {sched.providerId && (
                    <div className="space-y-2 pt-1">
                      <label className="text-[10px] uppercase tracking-wider text-ink/50 font-bold block mb-1">Model Size</label>
                      <select
                        value={sched.modelId || ""}
                        onChange={(e) => setSched({ ...sched, modelId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-canvas text-ink t-body-sm focus:outline-none focus:border-[#0D9488] transition-all"
                      >
                        {getEnabledModelsForProvider(sched.providerId).map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={onLinkApi}
                      className="px-4 py-3.5 rounded-2xl t-button border border-ink/10 text-ink/70 hover:bg-ink/[0.02] transition-colors"
                    >
                      Manage Keys
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("schedule")}
                      style={{ backgroundColor: "#0D9488", color: "#fff" }}
                      className="flex-1 py-3.5 rounded-2xl t-button text-center font-bold active:opacity-90 transition-opacity shadow-sm"
                    >
                      Continue to Schedule
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Time-based Schedule */}
          {step === "schedule" && (
            <div className="space-y-5">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-[#E0F2FE] to-[#CCFBF1] grid place-items-center mb-1">
                <Clock className="size-7 text-[#0D9488]" />
              </div>
              <h1 className="t-display mb-1">Automation schedule.</h1>
              <p className="t-meta text-ink/75 mb-4 leading-relaxed">
                Configure when MinDrop should compile summaries automatically in the background.
              </p>

              <div className="p-4 rounded-2xl bg-white border border-ink/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="t-body font-semibold text-ink">Time-based Summary</p>
                    <p className="t-meta text-ink/60">Generate summaries on a regular schedule</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={sched.enabled}
                    onChange={(e) => setSched({ ...sched, enabled: e.target.checked })}
                    className="rounded-lg text-[#0D9488] focus:ring-[#0D9488] size-5"
                  />
                </div>

                {sched.enabled && (
                  <div className="space-y-4 pt-4 border-t border-ink/5">
                    <div className="flex items-center justify-between">
                      <span className="t-meta text-ink/70">Interval:</span>
                      <select
                        value={sched.interval || "daily"}
                        onChange={(e) => setSched({ ...sched, interval: e.target.value as "daily" | "weekly" })}
                        className="px-3 py-1.5 rounded-lg border border-ink/10 bg-canvas text-ink t-meta font-medium focus:outline-none"
                      >
                        <option value="daily">Daily digest</option>
                        <option value="weekly">Weekly digest</option>
                      </select>
                    </div>

                    {sched.interval === "weekly" && (
                      <div className="flex items-center justify-between">
                        <span className="t-meta text-ink/70">Day of Week:</span>
                        <select
                          value={sched.weeklyDay ?? 0}
                          onChange={(e) => setSched({ ...sched, weeklyDay: Number(e.target.value) })}
                          className="px-3 py-1.5 rounded-lg border border-ink/10 bg-canvas text-ink t-meta font-medium focus:outline-none"
                        >
                          <option value={0}>Sunday</option>
                          <option value={1}>Monday</option>
                          <option value={2}>Tuesday</option>
                          <option value={3}>Wednesday</option>
                          <option value={4}>Thursday</option>
                          <option value={5}>Friday</option>
                          <option value={6}>Saturday</option>
                        </select>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="t-meta text-ink/70">Time of Day:</span>
                      <input
                        type="time"
                        value={sched.hhmm}
                        onChange={(e) => setSched({ ...sched, hhmm: e.target.value })}
                        className="px-3 py-1.5 rounded-lg border border-ink/10 bg-canvas text-ink t-meta font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("model")}
                  className="px-4 py-3.5 rounded-2xl t-button border border-ink/10 text-ink/70 hover:bg-ink/[0.02] transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep("threshold")}
                  style={{ backgroundColor: "#0D9488", color: "#fff" }}
                  className="flex-1 py-3.5 rounded-2xl t-button text-center font-bold active:opacity-90 transition-opacity shadow-sm"
                >
                  Continue to Triggers
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Count-based Trigger Threshold */}
          {step === "threshold" && (
            <div className="space-y-5">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-[#E0F2FE] to-[#CCFBF1] grid place-items-center mb-1">
                <Clock className="size-7 text-[#0D9488]" />
              </div>
              <h1 className="t-display mb-1">Unread trigger limits.</h1>
              <p className="t-meta text-ink/75 mb-4 leading-relaxed">
                Set if unread pings should trigger a compilation immediately before the schedule.
              </p>

              <div className="p-4 rounded-2xl bg-white border border-ink/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="t-body font-semibold text-ink">Count-based Trigger</p>
                    <p className="t-meta text-ink/60">Generate when unread pings exceed limit</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={sched.thresholdEnabled ?? true}
                    onChange={(e) => setSched({ ...sched, thresholdEnabled: e.target.checked })}
                    className="rounded-lg text-[#0D9488] focus:ring-[#0D9488] size-5"
                  />
                </div>

                {(sched.thresholdEnabled ?? true) && (
                  <div className="flex items-center justify-between pt-4 border-t border-ink/5">
                    <span className="t-meta text-ink/70">Unread notifications count:</span>
                    <select
                      value={sched.thresholdCount ?? 3}
                      onChange={(e) => setSched({ ...sched, thresholdCount: Number(e.target.value) })}
                      className="px-3 py-1.5 rounded-lg border border-ink/10 bg-canvas text-ink t-meta font-medium focus:outline-none"
                    >
                      <option value={3}>3 unread (Default)</option>
                      <option value={5}>5 unread</option>
                      <option value={10}>10 unread</option>
                      <option value={15}>15 unread</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("schedule")}
                  className="px-4 py-3.5 rounded-2xl t-button border border-ink/10 text-ink/70 hover:bg-ink/[0.02] transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{ backgroundColor: "#0D9488", color: "#fff" }}
                  className="flex-1 py-3.5 rounded-2xl t-button text-center font-bold active:opacity-90 transition-opacity shadow-sm"
                >
                  Activate & Save
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

