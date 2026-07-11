import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { ArrowLeft, Crosshair, Check } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlacePickerMap } from "@/components/places/PlacePickerMap";
import { AddressSearchField } from "@/components/places/AddressSearchField";
import { usePlaces, readPlaces } from "@/lib/places/store";
import { reverseGeocode } from "@/lib/places/geocode";
import type { Place } from "@/lib/places/types";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";
import { openPaywall, useTier } from "@/lib/tier";
import { SmartPermissionPrompt } from "@/components/permissions/SmartPermissionPrompt";
import { readPermissions, shouldPrompt } from "@/lib/permissions/state";

export const Route = createFileRoute("/_authenticated/places/new")({
  head: () => ({
    meta: [
      { title: "Save a place — MinDrop" },
      { name: "description", content: "Save a spot — the address book for your reminders." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewPlace,
});

const EMOJIS = ["📍","🏠","🏢","🛒","☕","🍔","🎁","💊","🏋️","🚉","✈️","🏥","🌳","🎬","📚"];
const nameSchema = z.string().trim().min(1, "Give this place a name").max(120);

function NewPlace() {
  const navigate = useNavigate();
  const { upsert } = usePlaces();
  const { accent3 } = useCountryTheme();

  const [lat, setLat] = useState<number>(37.7749);
  const [lng, setLng] = useState<number>(-122.4194);
  const [address, setAddress] = useState<string>("");
  const [locating, setLocating] = useState(true);

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📍");
  const [error, setError] = useState<string | null>(null);
  const [permPrompt, setPermPrompt] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await readPermissions();
        const need = snap.locationFg !== "granted";
        if (need && shouldPrompt("location")) { if (!cancelled) setPermPrompt(true); return; }
      } catch {}
      if (!("geolocation" in navigator)) { setLocating(false); return; }
      navigator.geolocation.getCurrentPosition(
        (p) => { if (!cancelled) { setLat(p.coords.latitude); setLng(p.coords.longitude); setLocating(false); } },
        () => { if (!cancelled) setLocating(false); },
        { enableHighAccuracy: true, timeout: 8_000 },
      );
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      const a = await reverseGeocode(lat, lng);
      if (!cancelled) setAddress(a);
    }, 600);
    return () => { cancelled = true; clearTimeout(t); };
  }, [lat, lng]);

  const canSave = useMemo(() => nameSchema.safeParse(name).success, [name]);
  const { tier, limits } = useTier();

  const save = () => {
    const nameRes = nameSchema.safeParse(name);
    if (!nameRes.success) { setError(nameRes.error.issues[0]?.message ?? "Invalid name"); return; }
    if (readPlaces().length >= limits.places) {
      openPaywall({ reason: "places", tier, limit: limits.places });
      return;
    }
    const place: Place = {
      id: `pl-${Date.now().toString(36)}`,
      name: nameRes.data,
      emoji,
      address: address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      lat, lng,
      paused: false,
      createdAt: new Date().toISOString(),
      // Legacy fields — kept present for backup shape; rules override at runtime.
      radiusM: 200,
      message: "",
      trigger: "enter",
      frequency: "always",
    };
    upsert(place);
    navigate({ to: "/places", search: { tab: "saved" } as any });
  };

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => { setLat(p.coords.latitude); setLng(p.coords.longitude); setLocating(false); },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8_000 },
    );
  };

  return (
    <PhoneFrame>
      <SmartPermissionPrompt
        kind="location"
        open={permPrompt}
        onResolved={(ok) => {
          setPermPrompt(false);
          if (ok && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (p) => { setLat(p.coords.latitude); setLng(p.coords.longitude); setLocating(false); },
              () => setLocating(false),
              { enableHighAccuracy: true, timeout: 8_000 },
            );
          } else {
            setLocating(false);
          }
        }}
      />
      <div className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
        <div className="flex-1 px-6 pt-6 pb-8">
          <button
            type="button"
            onClick={() => navigate({ to: "/places" })}
            className="t-button inline-flex items-center gap-1.5 mb-3 press"
            style={{ color: accent3 }}
            aria-label="Back to Places"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back
          </button>

          <PageHeader
            eyebrow="Save a place"
            title="Name it. Pin it."
            lede="Just the spot for now — set reminders under Rules."
            accent={accent3}
          />

          <div className="space-y-4">
            <div data-tour="place-search">
              <AddressSearchField
                onPick={(h) => { setLat(h.lat); setLng(h.lng); setAddress(h.displayName); }}
              />
            </div>

            <div className="relative">
              <PlacePickerMap
                lat={lat} lng={lng} radiusM={200}
                onMove={(la, ln) => { setLat(la); setLng(ln); }}
                height={220}
                interactive
              />
              <button
                type="button"
                onClick={useMyLocation}
                className="t-eyebrow absolute bottom-3 right-3 inline-flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full text-canvas press"
                style={{ background: accent3 }}
                aria-label="Use my location"
              >
                <Crosshair className="size-3.5" aria-hidden="true" />
                {locating ? "Locating…" : "Use my location"}
              </button>
            </div>

            <p className="t-meta text-ink/55 -mt-1 truncate">{address || "…"}</p>

            <div className="paper-card p-4 space-y-3">
              <label className="eyebrow block">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Home · Whole Foods · Gym"
                maxLength={120}
                className="t-body w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-ink/40"
                aria-label="Place name"
              />
              <div>
                <label className="eyebrow block mb-1.5">Icon</label>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      aria-label={`Icon ${e}`}
                      aria-pressed={emoji === e}
                      className={`size-8 rounded-full grid place-items-center text-[16px] press ${
                        emoji === e ? "text-canvas" : "bg-canvas border border-ink/10"
                      }`}
                      style={emoji === e ? { background: accent3 } : undefined}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                role="alert"
                className="t-meta text-center"
                style={{ color: accent3 }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="button"
              onClick={save}
              disabled={!canSave}
              data-tour="place-save"
              className="t-button w-full text-canvas py-4 rounded-2xl inline-flex items-center justify-center gap-2 press disabled:opacity-40"
              style={{ background: accent3 }}
            >
              <Check className="size-4" aria-hidden="true" />
              Save place
            </button>
            <p className="t-meta text-center text-ink/55">
              Then head to <b>Rules</b> to add a reminder for this spot.
            </p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
