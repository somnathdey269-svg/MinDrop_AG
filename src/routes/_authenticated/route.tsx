import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { recordInstallCountry } from "@/lib/profile/install-country.functions";
import { installDriveAutoBackup } from "@/lib/drive/auto";
import { scheduleDailyBackupNotification } from "@/lib/memoryos/backup";
import { useOnboarding } from "@/lib/memoryos/store";

/**
 * App layout for consumer routes.
 *
 * Anonymous users are allowed — quotas are lower (see `plan_limits`),
 * and premium features (Drive backup, etc.) prompt sign-in when needed.
 *
 * ssr:false because Supabase session lives in localStorage (browser only)
 * and downstream components read it to decide what to show.
 */
const INSTALL_COUNTRY_LOCAL = "mindrop.install_country";
const INSTALL_COUNTRY_SYNCED = "mindrop.install_country.synced.v1";

function InstallCountryCapture() {
  useEffect(() => {
    // Anonymous fallback: cache from browser locale so it can be synced later.
    try {
      if (!window.localStorage.getItem(INSTALL_COUNTRY_LOCAL)) {
        const loc = (navigator.language || "").split("-")[1]?.toUpperCase();
        if (loc && /^[A-Z]{2}$/.test(loc)) {
          window.localStorage.setItem(INSTALL_COUNTRY_LOCAL, loc);
        }
      }
    } catch {}

    // Signed-in: sync once server-side (idempotent).
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) return;
        if (window.localStorage.getItem(INSTALL_COUNTRY_SYNCED) === "1") return;
        await recordInstallCountry();
        window.localStorage.setItem(INSTALL_COUNTRY_SYNCED, "1");
      } catch {}
    })();
  }, []);
  return null;
}

function DriveAutoBackup() {
  const { state } = useOnboarding();
  useEffect(() => {
    if (state.plan === "premium") {
      installDriveAutoBackup();
    } else {
      // Free users: schedule daily notification to remind them to export
      scheduleDailyBackupNotification().catch(() => {});
    }
  }, [state.plan]);
  return null;
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: () => (
    <>
      <InstallCountryCapture />
      <DriveAutoBackup />
      <Outlet />
    </>
  ),
});
