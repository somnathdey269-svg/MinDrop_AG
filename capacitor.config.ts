import type { CapacitorConfig } from "@capacitor/cli";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

// ────────────────────────────────────────────────────────────────────────
// Self-healing webDir guard.
//
// The Capacitor CLI loads this file for every `cap sync|copy|run|open|build`
// invocation. If the Android SPA shell hasn't been generated yet, we run
// `npm run build:android` automatically so the developer never has to
// remember a specific pre-step.
//
// Root cause this fixes permanently:
//   Error: "The web assets directory (.output/public) must contain an
//   index.html file."
//
// That error appears when a developer ran `npm run build` (which only
// builds the Cloudflare Worker bundle for the web deploy) and then
// `npx cap sync android`. `npm run build` does NOT emit an SPA shell —
// only `npm run build:android` does (it sets MINDROP_CAPACITOR_BUILD=1
// which activates TanStack Start's SPA mode in vite.config.ts).
//
// From now on, `npx cap sync android` will self-heal by building the
// shell on demand. `./rebuild.sh` continues to work end-to-end.
// ────────────────────────────────────────────────────────────────────────
const WEB_DIR = process.env.MINDROP_WEB_DIR ?? ".output/public";
const INDEX_HTML = path.resolve(process.cwd(), WEB_DIR, "index.html");
const CAP_CMD = (process.argv[2] ?? "").toLowerCase();
const NEEDS_ASSETS = ["sync", "copy", "run", "build", "open"].includes(CAP_CMD);
const SKIP_AUTOBUILD = process.env.MINDROP_SKIP_AUTOBUILD === "1";

if (NEEDS_ASSETS && !SKIP_AUTOBUILD && !existsSync(INDEX_HTML)) {
  // eslint-disable-next-line no-console
  console.log(
    `\n[capacitor.config] ${WEB_DIR}/index.html missing → running \`npm run build:android\` automatically…\n`,
  );
  try {
    execSync("npm run build:android", { stdio: "inherit" });
  } catch {
    console.error(
      `\n❌ Auto-build failed. Run manually:\n   npm run build:android\n\nThen re-run your Capacitor command. (Set MINDROP_SKIP_AUTOBUILD=1 to bypass.)\n`,
    );
    process.exit(1);
  }
  if (!existsSync(INDEX_HTML)) {
    console.error(
      `\n❌ Build finished but ${WEB_DIR}/index.html still missing. See scripts/build-android.mjs output above.\n`,
    );
    process.exit(1);
  }
}

const config: CapacitorConfig = {
  appId: "in.mindrop.app",
  appName: "MinDrop",
  webDir: WEB_DIR,
  server: {
    androidScheme: "https",
    // For dev/testing against Lovable preview, uncomment:
    // url: "https://id-preview--48ee5021-0fda-4b4a-9d0c-8037e4d328cb.lovable.app",
    // cleartext: true,
  },
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      // Default channel appearance; per-notification channelId still wins.
      iconColor: "#4a5d4e",
    },
  },
};

export default config;
