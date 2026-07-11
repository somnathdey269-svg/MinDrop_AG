import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { getPublicSettings, updateSettings, type CurrencyPrice } from "@/lib/platformSettings.functions";
import { refreshPremiumFxRates } from "@/lib/fx.functions";
import { RefreshCw, Save } from "lucide-react";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/pricing")({
  component: PricingAdmin,
});

type PriceMap = Record<string, CurrencyPrice>;

function PricingAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [priceInr, setPriceInr] = useState<number>(499);
  const [prices, setPrices] = useState<PriceMap>({});
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [supportEmail, setSupportEmail] = useState("");
  const [officer, setOfficer] = useState("");
  const [officerEmail, setOfficerEmail] = useState("");
  const [legalName, setLegalName] = useState("");
  const [address, setAddress] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");

  const load = async () => {
    setLoading(true); setErr(null);
    try {
      const s = await getPublicSettings();
      setPriceInr(s.priceInr);
      setPrices(s.displayPrices || {});
      setUpdatedAt(s.currencyUpdatedAt);
      setSupportEmail(s.supportEmail);
      setOfficer(s.grievanceOfficerName);
      setOfficerEmail(s.grievanceOfficerEmail);
      setLegalName(s.companyLegalName);
      setAddress(s.companyAddress);
      setJurisdiction(s.companyJurisdiction);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const refresh = async () => {
    setRefreshing(true); setErr(null); setOk(null);
    try {
      const r = await refreshPremiumFxRates();
      setPrices(r.prices);
      setUpdatedAt(r.updatedAt);
      setOk("FX rates refreshed.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Refresh failed");
    } finally { setRefreshing(false); }
  };

  const savePricing = async () => {
    setSaving(true); setErr(null); setOk(null);
    try {
      await updateSettings({ data: { priceInr, displayPrices: prices } });
      setOk("Pricing saved.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  };

  const saveLegal = async () => {
    setSaving(true); setErr(null); setOk(null);
    try {
      await updateSettings({
        data: {
          supportEmail,
          grievanceOfficerName: officer,
          grievanceOfficerEmail: officerEmail,
          companyLegalName: legalName,
          companyAddress: address,
          companyJurisdiction: jurisdiction,
        },
      });
      setOk("Legal contact saved.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  };

  const currencies = Object.keys(prices).sort();

  return (
    <AdminShell title="Pricing & Legal">
      <div className="space-y-8 max-w-4xl">
        {err && <p className="text-xs text-red-600">{err}</p>}
        {ok && <p className="text-xs text-brand">{ok}</p>}

        <section className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest">Pricing</h2>
              <p className="text-xs text-ink/50 mt-1">Base INR price and displayed prices per currency.</p>
            </div>
            <button
              onClick={refresh}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-ink/15 hover:bg-ink/5 disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh FX rates
            </button>
          </div>

          <div>
            <label className="text-xs text-ink/60 block mb-1">Base price (INR)</label>
            <input
              type="number"
              value={priceInr}
              min={1}
              onChange={(e) => setPriceInr(Number(e.target.value))}
              className="w-40 border border-ink/15 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <p className="text-xs text-ink/60 mb-2">
              Displayed prices per currency {updatedAt && <span className="text-ink/40">· FX updated {new Date(updatedAt).toLocaleString()}</span>}
            </p>
            <div className="overflow-x-auto border border-ink/10 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-ink/5 text-xs uppercase tracking-widest text-ink/60">
                  <tr>
                    <th className="text-left px-3 py-2">Currency</th>
                    <th className="text-left px-3 py-2">Symbol</th>
                    <th className="text-right px-3 py-2">Raw (FX)</th>
                    <th className="text-right px-3 py-2">Displayed (customer pays)</th>
                  </tr>
                </thead>
                <tbody>
                  {currencies.length === 0 && (
                    <tr><td colSpan={4} className="px-3 py-4 text-center text-ink/40">No currencies configured. Click "Refresh FX rates".</td></tr>
                  )}
                  {currencies.map((cur) => (
                    <tr key={cur} className="border-t border-ink/5">
                      <td className="px-3 py-2 font-mono">{cur}</td>
                      <td className="px-3 py-2">
                        <input
                          value={prices[cur].symbol}
                          onChange={(e) =>
                            setPrices({ ...prices, [cur]: { ...prices[cur], symbol: e.target.value } })
                          }
                          className="w-16 border border-ink/15 rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 text-right text-ink/50">{prices[cur].raw.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          value={prices[cur].displayed}
                          onChange={(e) =>
                            setPrices({ ...prices, [cur]: { ...prices[cur], displayed: Number(e.target.value) } })
                          }
                          className="w-28 border border-ink/15 rounded px-2 py-1 text-sm text-right"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={savePricing}
            disabled={saving}
            className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-ink text-canvas hover:bg-ink/90 disabled:opacity-50"
          >
            <Save className="size-3.5" /> Save pricing
          </button>
        </section>

        <section className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-widest">Legal contact</h2>
            <p className="text-xs text-ink/50 mt-1">Used across Terms, Privacy, Refunds and Contact pages.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Support email" value={supportEmail} onChange={setSupportEmail} type="email" />
            <Field label="Grievance officer name" value={officer} onChange={setOfficer} />
            <Field label="Grievance officer email" value={officerEmail} onChange={setOfficerEmail} type="email" />
            <Field label="Company legal name" value={legalName} onChange={setLegalName} />
            <Field label="Company address" value={address} onChange={setAddress} className="md:col-span-2" />
            <Field label="Jurisdiction (city, state, country)" value={jurisdiction} onChange={setJurisdiction} />
          </div>
          <button
            onClick={saveLegal}
            disabled={saving}
            className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-ink text-canvas hover:bg-ink/90 disabled:opacity-50"
          >
            <Save className="size-3.5" /> Save legal
          </button>
        </section>
      </div>
    </AdminShell>
  );
}

function Field({
  label, value, onChange, type = "text", className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs text-ink/60 block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
