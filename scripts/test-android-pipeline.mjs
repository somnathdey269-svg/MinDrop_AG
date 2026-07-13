#!/usr/bin/env node
// Regression harness — runs the four commands the pipeline must guarantee.
// Now powered with pacing and retry handles to gracefully handle host saturations.
// Skips git/network in sandbox via --no-git --no-install passthrough env.
import { spawn } from "node:child_process";

const STEPS = [
  { name: "npm run build",         cmd: "npm",  args: ["run", "build"] },
  { name: "npm run build:android", cmd: "npm",  args: ["run", "build:android"] },
  { name: "./rebuild.sh (skip git/install)", cmd: "bash", args: ["rebuild.sh"], env: { REBUILD_SKIP_GIT: "1", REBUILD_SKIP_INSTALL: "1" } },
  { name: "npx cap sync android",  cmd: "npx",  args: ["cap", "sync", "android"] },
];

// Parse command line arguments
const args = process.argv.slice(2);
let pacingMs = 2000;       // default pacing delay between steps in ms
let maxRetries = 2;        // default retries for failed steps
let retryDelayMs = 1500;   // default delay before retrying a failed step in ms

for (const arg of args) {
  if (arg.startsWith("--pacing=")) {
    pacingMs = parseInt(arg.split("=")[1], 10) || 0;
  } else if (arg.startsWith("--retries=")) {
    maxRetries = parseInt(arg.split("=")[1], 10) || 0;
  } else if (arg.startsWith("--retry-delay=")) {
    retryDelayMs = parseInt(arg.split("=")[1], 10) || 0;
  }
}

console.log("╔══════════════════════════════════════════════════════════════╗");
optionsLog();
console.log("╚══════════════════════════════════════════════════════════════╝");

function optionsLog() {
  console.log(`║ Android Pipeline Test Run Settings:                         ║`);
  console.log(`║   • Pacing Inter-step Delay: ${String(pacingMs + 'ms').padEnd(31)} ║`);
  console.log(`║   • Step Max Retries: ${String(maxRetries).padEnd(38)} ║`);
  console.log(`║   • Base Retry Delay: ${String(retryDelayMs + 'ms').padEnd(38)} ║`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function main() {
  const results = [];
  let index = 0;

  for (const step of STEPS) {
    // Implement pacing delay between separate steps (except before the first step)
    if (index > 0 && pacingMs > 0) {
      console.log(`\n⏸️  Pacing interval: resting for ${pacingMs}ms...`);
      await sleep(pacingMs);
    }
    index++;

    console.log(`\n════ STEP: ${step.name} ════`);
    let ok = false;
    let attempts = 0;

    while (attempts <= maxRetries) {
      if (attempts > 0) {
        const currentDelay = retryDelayMs * Math.pow(2, attempts - 1);
        console.log(`\n⚠️  Step failed. Retrying in ${currentDelay}ms (Attempt ${attempts}/${maxRetries})...`);
        await sleep(currentDelay);
      }

      ok = await run(step);
      if (ok) {
        if (attempts > 0) {
          console.log(`✓ Step succeeded on retry attempt ${attempts}!`);
        }
        break;
      }
      attempts++;
    }

    results.push({ name: step.name, ok });
    if (!ok) {
      console.error(`\n✗ Step "${step.name}" failed after ${attempts - 1} retry attempts.`);
      break; // stop early if a step has failed all retries
    }
  }

  console.log("\n══════ Regression summary ══════");
  for (const r of results) console.log(`  ${r.ok ? "✓" : "✗"} ${r.name}`);
  const failed = results.find((r) => !r.ok);
  if (failed) {
    console.error(`\nStopped at failed step: ${failed.name}`);
    process.exit(1);
  }
  console.log("\nAll green. All steps successfully completed!");
}

main().catch((err) => {
  console.error("Fatal pipeline error:", err);
  process.exit(1);
});
