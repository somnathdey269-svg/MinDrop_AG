#!/usr/bin/env bash
# Thin wrapper around the shared validator, with toolchain probes enabled.
# Usage: ./android-doctor.sh   (or npm run android:doctor)
exec node scripts/validate-android.mjs --doctor --report-only "$@"
