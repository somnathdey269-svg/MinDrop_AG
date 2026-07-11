import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Loader2, KeyRound, ShieldCheck, Trash2, Save } from "lucide-react";
import { getGoogleMapsKey, setGoogleMapsKey } from "@/lib/settings.functions";
import { invalidateGoogleMapsKey } from "@/lib/places/geocode";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/settings")({ component: AdminSettings });

function mask(v: string) {
  if (!v) return "";
  if (v.length <= 8) return "••••" + v.slice(-2);
  return v.slice(0, 4) + "••••••••" + v.slice(-4);
}

function AdminSettings() {
  const [current, setCurrent] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const r = await getGoogleMapsKey();
      setCurrent(r.value ?? "");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await setGoogleMapsKey({ data: { value: value.trim() } });
      invalidateGoogleMapsKey();
      setValue("");
      await refresh();
      setMsg({ kind: "ok", text: "Key saved. Pushed to all browsers." });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setBusy(false);
    }
  };

  const clear = async () => {
    if (!confirm("Clear the Google Maps API key? Location search will fall back to OpenStreetMap.")) return;
    setBusy(true);
    setMsg(null);
    try {
      await setGoogleMapsKey({ data: { value: "" } });
      invalidateGoogleMapsKey();
      await refresh();
      setMsg({ kind: "ok", text: "Key cleared." });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Clear failed" });
    } finally {
      setBusy(false);
    }
  };

  const test = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const key = current.trim();
      if (!key) {
        setTestResult("No key set.");
        return;
      }
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent("1600 Amphitheatre Pkwy, Mountain View")}&key=${encodeURIComponent(key)}`,
      );
      const data = (await res.json()) as { status?: string; error_message?: string };
      if (data.status === "OK") setTestResult("✓ Key works.");
      else setTestResult(`✗ ${data.status ?? "Unknown"}${data.error_message ? " — " + data.error_message : ""}`);
    } catch (e) {
      setTestResult(e instanceof Error ? e.message : "Test failed");
    } finally {
      setTesting(false);
    }
  };

  return (
    <AdminShell title="Settings">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white border border-ink/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="size-4 text-brand" />
            <h3 className="text-sm font-medium uppercase tracking-widest">Google Maps API key</h3>
          </div>
          <p className="text-xs text-ink/60 mb-4 max-w-2xl">
            Powers location search for every user. Stored once here and pushed read-only to browsers.
            Restrict this key by HTTP referrer in Google Cloud Console so it can only be used from your
            domain(s). <strong>No user activity — searches, places, coordinates — ever comes back to
            this platform.</strong>
          </p>

          <div className="bg-canvas rounded-lg p-4 mb-4">
            <p className="text-[10px] uppercase tracking-widest text-ink/50 mb-1">Current</p>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-ink/60">
                <Loader2 className="size-3 animate-spin" /> Loading…
              </div>
            ) : current ? (
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-mono">{mask(current)}</code>
                <div className="flex gap-2">
                  <button
                    onClick={test}
                    disabled={testing}
                    className="text-[10px] uppercase tracking-widest text-brand font-bold disabled:opacity-40"
                  >
                    {testing ? "Testing…" : "Test key"}
                  </button>
                  <button
                    onClick={clear}
                    disabled={busy}
                    className="text-[10px] uppercase tracking-widest text-red-600 font-bold disabled:opacity-40 flex items-center gap-1"
                  >
                    <Trash2 className="size-3" /> Clear
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink/60">No key set — falling back to OpenStreetMap.</p>
            )}
            {testResult && <p className="text-xs mt-2 text-ink/70">{testResult}</p>}
          </div>

          <label className="block text-[10px] uppercase tracking-widest text-ink/60 mb-2">
            {current ? "Replace with new key" : "Paste your Google Maps key"}
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="AIza…"
              className="flex-1 bg-canvas border border-ink/15 px-3 py-2 rounded-lg text-sm font-mono outline-none focus:border-brand"
            />
            <button
              onClick={save}
              disabled={busy || !value.trim()}
              className="bg-ink text-canvas px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-40 flex items-center gap-2"
            >
              {busy ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />} Save
            </button>
          </div>
          {msg && (
            <p className={`text-xs mt-3 ${msg.kind === "ok" ? "text-brand" : "text-red-600"}`}>
              {msg.text}
            </p>
          )}
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="size-4 text-brand" />
            <h3 className="text-sm font-medium uppercase tracking-widest">How to get a key</h3>
          </div>
          <ol className="text-sm text-ink/75 space-y-2 list-decimal pl-5">
            <li>Open <a className="text-brand underline" href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">Google Cloud Console</a> and create (or pick) a project. Enable billing on it.</li>
            <li>APIs &amp; Services → Library → enable <strong>Maps JavaScript API</strong>, <strong>Geocoding API</strong>, and <strong>Places API (New)</strong>.</li>
            <li>APIs &amp; Services → Credentials → <strong>Create Credentials → API key</strong>.</li>
            <li>Edit the key → Application restrictions → <strong>HTTP referrers</strong>. Add your domains, e.g.<br/>
              <code className="text-xs">https://getmindrop.lovable.app/*</code><br/>
              <code className="text-xs">https://*.lovable.app/*</code><br/>
              <code className="text-xs">https://yourdomain.com/*</code> and <code className="text-xs">https://*.yourdomain.com/*</code>
            </li>
            <li>API restrictions → limit to the three APIs above.</li>
            <li>Copy the key and paste it above.</li>
          </ol>
        </div>
      </div>
    </AdminShell>
  );
}
