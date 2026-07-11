#!/usr/bin/env node
// Regression harness — runs the four commands the pipeline must guarantee.
// Skips git/network in sandbox via --no-git --no-install passthrough env.
import { spawn } from "node:child_process";

const STEPS = [
  { name: "npm run build",         cmd: "npm",  args: ["run", "build"] },
  { name: "npm run build:android", cmd: "npm",  args: ["run", "build:android"] },
  { name: "./rebuild.sh (skip git/install)", cmd: "bash", args: ["rebuild.sh"], env: { REBUILD_SKIP_GIT: "1", REBUILD_SKIP_INSTALL: "1" } },
  { name: "npx cap sync android",  cmd: "npx",  args: ["cap", "sync", "android"] },
];

function run(step) {
  return new Promise((resolve) => {
    const c = spawn(step.cmd, step.args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, ...(step.env || {}) },
    });
    c.on("exit", (code) => resolve(code === 0));
    c.on("error", () => resolve(false));
  });
}

const results = [];
for (const step of STEPS) {
  console.log(`\n════ ${step.name} ════`);
  const ok = await run(step);
  results.push({ name: step.name, ok });
  if (!ok) break;
}

console.log("\n══════ Regression summary ══════");
for (const r of results) console.log(`  ${r.ok ? "✓" : "✗"} ${r.name}`);
const failed = results.find((r) => !r.ok);
if (failed) { console.error(`\nStopped at: ${failed.name}`); process.exit(1); }
console.log("\nAll green.");
