#!/usr/bin/env node
// scripts/validate-toolchain.mjs
// Enforces the MinDrop Android toolchain compatibility matrix.
// Single source of truth: scripts/android-toolchain.json
// Mirrored (human-readable) in docs/ANDROID_TOOLCHAIN.md.
//
// Exports validateToolchain() so scripts/validate-android.mjs can call it and
// surface results in its dashboard. Also usable standalone:
//   node scripts/validate-toolchain.mjs           → prints report, exits 1 on drift
//   node scripts/validate-toolchain.mjs --report  → never exits non-zero
import { readFile, readdir, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

async function readSafe(p) { try { return await readFile(p, "utf8"); } catch { return null; } }
async function exists(p)   { try { await stat(p); return true; } catch { return false; } }

function parseVersion(s) {
  return String(s).split(".").map((n) => parseInt(n, 10) || 0);
}
export function cmpVersion(a, b) {
  const pa = parseVersion(a), pb = parseVersion(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d;
  }
  return 0;
}
// Bound comparison that pads missing components: min pads with 0 (already the
// default), max pads with a large number so "21" as max accepts "21.0.11".
// Without this, cmpVersion("21.0.11", "21") returns >0 and rejects a valid
// patch release of the recommended major.
function cmpBounded(v, bound, padHigh) {
  const pa = parseVersion(v);
  const pb = parseVersion(bound);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const a = pa[i] ?? 0;
    const b = i < pb.length ? pb[i] : (padHigh ? Number.MAX_SAFE_INTEGER : 0);
    if (a !== b) return a - b;
  }
  return 0;
}
function inRange(v, { min, max }) {
  return cmpBounded(v, min, false) >= 0 && cmpBounded(v, max, true) <= 0;
}
// semver "^8.4.0" / "~8.4.0" / "8.4.0" → { major, minor, patch, range }
function parseSemverSpec(spec) {
  const m = String(spec).match(/^\s*([\^~])?\s*(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return { range: m[1] || "", major: +m[2], minor: +m[3], patch: +m[4] };
}
function specSatisfies(installedRaw, wantSpec) {
  const installed = String(installedRaw).replace(/^[\^~]/, "");
  const want = parseSemverSpec(wantSpec);
  const got = parseSemverSpec(installed);
  if (!want || !got) return false;
  if (want.range === "^") return got.major === want.major &&
    (got.minor > want.minor || (got.minor === want.minor && got.patch >= want.patch));
  if (want.range === "~") return got.major === want.major && got.minor === want.minor && got.patch >= want.patch;
  return got.major === want.major && got.minor === want.minor && got.patch === want.patch;
}

export async function loadMatrix() {
  const raw = await readFile(path.join(ROOT, "scripts/android-toolchain.json"), "utf8");
  return JSON.parse(raw);
}

export async function validateToolchain() {
  const results = [];
  const rec = (name, status, hint = "") => results.push({ name, status, hint });
  const M = await loadMatrix();

  // ── Java ────────────────────────────────────────────────────────────
  const javaBin = process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, "bin/java") : "java";
  const j = spawnSync(javaBin, ["-version"], { encoding: "utf8", shell: process.platform === "win32" });
  const jline = (j.stderr || j.stdout || "").split("\n")[0] || "";
  const jver = (jline.match(/"(\d+(?:\.\d+)*)"/) || [])[1];
  if (!jver) rec("Java", "warn", `JAVA_HOME not resolvable — install JDK ${M.java.recommended}`);
  else rec("Java", inRange(jver, M.java) ? "pass" : "fail",
    `have ${jver}, need ${M.java.min}..${M.java.max} (recommend ${M.java.recommended})`);

  // ── Gradle wrapper ─────────────────────────────────────────────────
  const wrapper = (await readSafe(path.join(ROOT, "android/gradle/wrapper/gradle-wrapper.properties"))) || "";
  const gver = wrapper.match(/gradle-([\d.]+)-/)?.[1];
  if (!gver) rec("Gradle", "warn", "gradle-wrapper.properties missing — run `npx cap add android`");
  else rec("Gradle", inRange(gver, M.gradle) ? "pass" : "fail",
    `have ${gver}, need ${M.gradle.min}..${M.gradle.max} (recommend ${M.gradle.recommended})`);

  // ── Android Gradle Plugin ──────────────────────────────────────────
  const rootBuild = (await readSafe(path.join(ROOT, "android/build.gradle"))) || "";
  const agp = rootBuild.match(/com\.android\.tools\.build:gradle:([\d.]+)/)?.[1];
  if (!agp) rec("AGP", "warn", "AGP classpath not found in android/build.gradle");
  else rec("AGP", inRange(agp, M.androidGradlePlugin) ? "pass" : "fail",
    `have ${agp}, need ${M.androidGradlePlugin.min}..${M.androidGradlePlugin.max}`);

  // ── Kotlin (root + classpath + plugin defaults) ────────────────────
  const variables = (await readSafe(path.join(ROOT, "android/variables.gradle"))) || "";
  const rootKotlin = variables.match(/kotlin_version\s*=\s*['"]([^'"]+)['"]/)?.[1];
  const cpKotlin = rootBuild.match(/kotlin-gradle-plugin:([^'"\s]+)/)?.[1];
  if (!rootKotlin) rec("Kotlin pinned", "fail", "add kotlin_version to android/variables.gradle");
  else rec("Kotlin pinned", inRange(rootKotlin, M.kotlin) ? "pass" : "fail",
    `have ${rootKotlin}, need ${M.kotlin.min}..${M.kotlin.max}`);
  rec("Kotlin classpath match", rootKotlin && cpKotlin === rootKotlin ? "pass" : "fail",
    `variables=${rootKotlin} classpath=${cpKotlin}`);

  // Dynamically scan installed @capacitor/* plugins for their expected kotlin_version.
  const capDir = path.join(ROOT, "node_modules/@capacitor");
  const pluginKotlins = [];
  if (await exists(capDir)) {
    for (const name of await readdir(capDir)) {
      const g = await readSafe(path.join(capDir, name, "android/build.gradle"));
      const m = g?.match(/kotlin_version[^:]*:\s*['"]([^'"]+)['"]/);
      if (m) pluginKotlins.push({ name, want: m[1] });
    }
  }
  const highest = pluginKotlins.map((p) => p.want).sort(cmpVersion).pop();
  if (highest) {
    const ok = rootKotlin && cmpVersion(rootKotlin, highest) >= 0;
    rec("Kotlin ≥ plugin default", ok ? "pass" : "fail",
      `root=${rootKotlin} plugins want ≥${highest} (${pluginKotlins.map(p=>p.name).join(", ")})`);
  }

  // ── SDK levels ─────────────────────────────────────────────────────
  const compileSdk = +(variables.match(/compileSdkVersion\s*=\s*(\d+)/)?.[1] || 0);
  const minSdk     = +(variables.match(/minSdkVersion\s*=\s*(\d+)/)?.[1] || 0);
  rec("compileSdk", compileSdk >= M.compileSdk.min && compileSdk <= M.compileSdk.max ? "pass" : "fail",
    `have ${compileSdk}, need ${M.compileSdk.min}..${M.compileSdk.max}`);
  rec("minSdk", minSdk >= M.minSdk.min && minSdk <= M.minSdk.max ? "pass" : "fail",
    `have ${minSdk}, need ${M.minSdk.min}..${M.minSdk.max}`);

  // ── Capacitor package versions ────────────────────────────────────
  const pkg = JSON.parse((await readSafe(path.join(ROOT, "package.json"))) || "{}");
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const majors = new Set();
  for (const [name, wantSpec] of Object.entries(M.capacitor)) {
    const installed = deps[name];
    if (!installed) { rec(name, "warn", "not installed"); continue; }
    const ok = specSatisfies(installed, wantSpec);
    rec(name, ok ? "pass" : "fail", `have ${installed}, matrix wants ${wantSpec}`);
    // Track major for cross-plugin consistency (only @capacitor/*, not third-party).
    if (name.startsWith("@capacitor/")) {
      const p = parseSemverSpec(installed);
      if (p) majors.add(p.major);
    }
  }
  rec("@capacitor/* majors aligned", majors.size <= 1 ? "pass" : "fail",
    `found majors: [${[...majors].join(", ")}] — all @capacitor/* must share one major`);

  return results;
}

// ── Standalone runner ─────────────────────────────────────────────────
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const reportOnly = process.argv.includes("--report");
  const results = await validateToolchain();
  const ICON = { pass: "✓", warn: "!", fail: "✗" };
  const COLOR = { pass: "\x1b[32m", warn: "\x1b[33m", fail: "\x1b[31m", reset: "\x1b[0m" };
  console.log("\n── Android toolchain matrix ──");
  for (const r of results) {
    console.log(`  ${COLOR[r.status]}[${ICON[r.status]}]${COLOR.reset} ${r.name.padEnd(32)}  ${r.hint}`);
  }
  const fails = results.filter((r) => r.status === "fail").length;
  const warns = results.filter((r) => r.status === "warn").length;
  console.log(`\nSummary: ${results.length - fails - warns} pass, ${warns} warn, ${fails} fail`);
  if (fails > 0 && !reportOnly) {
    console.error("\n✗ Android toolchain is OUT OF THE SUPPORTED MATRIX.");
    console.error("  See docs/ANDROID_TOOLCHAIN.md for the supported versions and fix guidance.");
    process.exit(1);
  }
}
