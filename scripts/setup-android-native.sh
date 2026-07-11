#!/usr/bin/env bash
# scripts/setup-android-native.sh
# Copies MinDrop's custom Capacitor Kotlin plugins from native/android/ into
# the generated Android project at android/app/src/main/java/. Idempotent —
# safe to re-run after every `npx cap sync android`.
#
# Usage:  npm run android:native   (called automatically by ./rebuild.sh)
set -euo pipefail

SRC_ROOT="native/android"
DST_ROOT="android/app/src/main/java"

if [ ! -d "android" ]; then
  echo "❌  android/ directory not found."
  echo "    First-time setup:  npx cap add android"
  exit 1
fi

if [ ! -d "$SRC_ROOT" ]; then
  echo "❌  $SRC_ROOT not found — nothing to copy."
  exit 1
fi

copied=0
# For each package directory under native/android (e.g. places, notify),
# mirror its contents into android/app/src/main/java/app/getmindrop/<pkg>/.
for pkg_dir in "$SRC_ROOT"/*/; do
  pkg=$(basename "$pkg_dir")
  dst="$DST_ROOT/app/getmindrop/$pkg"
  mkdir -p "$dst"
  # Copy every .kt file, preserving contents. cp -f = idempotent overwrite.
  if compgen -G "$pkg_dir*.kt" > /dev/null; then
    cp -f "$pkg_dir"*.kt "$dst/"
    for f in "$pkg_dir"*.kt; do
      echo "  ✓ $(basename "$f")  →  $dst/"
      copied=$((copied+1))
    done
  fi
done

if [ "$copied" -eq 0 ]; then
  echo "  (no .kt files found under $SRC_ROOT)"
  exit 0
fi

echo ""
echo "── MainActivity registration reminder ──"
echo "Custom Capacitor plugins are NOT auto-discovered — they must be"
echo "registered in MainActivity.java. See docs/CAPACITOR_BUILD.md."
echo ""
echo "Quick check — this line must exist inside onCreate():"
echo "  registerPlugin(app.getmindrop.places.PlacesBridgePlugin.class);"
echo ""
