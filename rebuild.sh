#!/usr/bin/env bash
# MinDrop rebuild — framework-agnostic, self-validating Android pipeline.
# Usage:  ./rebuild.sh                        (full run)
#         REBUILD_SKIP_INSTALL=1 ./rebuild.sh (skip npm install)
#         APP_ENV=staging ./rebuild.sh        (load .env.staging)
set -euo pipefail
STEP="init"
trap 'echo ""; echo "❌  FAILED at step: ${STEP}"; exit 1' ERR

banner() { echo ""; echo "────────────────────────────────────"; echo " $1"; echo "────────────────────────────────────"; }
banner "🔄  MinDrop — rebuilding Android app"

APP_ENV="${APP_ENV:-production}"
ENV_FILE=".env.${APP_ENV}"
if [ -f "${ENV_FILE}" ]; then
  echo "🌱  Loading ${ENV_FILE}"
  set -a; . "./${ENV_FILE}"; set +a
elif [ -f ".env" ]; then
  echo "🌱  Loading .env"
  set -a; . "./.env"; set +a
fi

STEP="1/7 npm install"
if [ "${REBUILD_SKIP_INSTALL:-0}" = "1" ]; then
  echo "[$STEP] skipped (REBUILD_SKIP_INSTALL=1)"
else
  echo "[$STEP]"; npm install
fi

STEP="2/7 build:android"
echo "[$STEP] framework-agnostic web build + SPA shell"
npm run build:android

STEP="3/7 pre-sync validation"
echo "[$STEP]"
node scripts/validate-android.mjs --phase=pre-sync

STEP="4/7 ensure android/ platform"
if [ ! -d "android" ]; then
  echo "[$STEP] android/ missing → npx cap add android"
  npx cap add android
else
  echo "[$STEP] android/ present"
fi

STEP="5/7 self-heal capacitor webDir"
# If the build manifest reports a different discovered dir, we still mirror to
# .output/public inside build-android.mjs, so capacitor.config.ts stays stable.
# Nothing to rewrite unless the user manually changed webDir.
node -e "
const fs=require('fs'); const path=require('path');
const m=path.resolve('.output/android-build-manifest.json');
if(!fs.existsSync(m)){process.exit(0)}
const j=JSON.parse(fs.readFileSync(m,'utf8'));
const cfg=fs.readFileSync('capacitor.config.ts','utf8');
const match=cfg.match(/webDir\s*:\s*[\"'\`]([^\"'\`]+)[\"'\`]/);
if(match && match[1]!==j.webDir){
  console.log('  self-heal: capacitor.config.ts webDir '+match[1]+' → '+j.webDir);
  const patched=cfg.replace(match[0], 'webDir: \"'+j.webDir+'\"');
  fs.writeFileSync('capacitor.config.ts', patched);
} else { console.log('  webDir already matches ('+(match?match[1]:'?')+')'); }
"

STEP="6/7 npx cap sync android"
echo "[$STEP]"; npx cap sync android

STEP="6b/7 custom native plugins"
bash scripts/setup-android-native.sh

STEP="7/7 post-sync validation"
node scripts/validate-android.mjs --phase=post-sync

STEP="7b/7 gradle assembleDebug (native compile)"
if [ "${REBUILD_SKIP_GRADLE:-0}" = "1" ]; then
  echo "[$STEP] skipped (REBUILD_SKIP_GRADLE=1)"
elif ! command -v java >/dev/null 2>&1; then
  echo "[$STEP] ⚠️  skipped — no JDK on PATH. Install JDK 21 to enable the native compile guard."
else
  echo "[$STEP] compiling Android sources — this is the guard that catches Kotlin errors before Android Studio does"
  ( cd android && ./gradlew --no-daemon assembleDebug )
fi

banner "✅  DONE"
echo "Next: npx cap open android  →  Build → Build APK(s)"
