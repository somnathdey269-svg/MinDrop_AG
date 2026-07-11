import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";
import { getGoogleMapsKey } from "@/lib/settings.functions";

interface Props {
  lat: number;
  lng: number;
  radiusM: number;
  onMove?: (lat: number, lng: number) => void;
  height?: number;
  interactive?: boolean;
}

/* ---------------- Google Maps JS loader (shared) ---------------- */

declare global {
  interface Window {
    google?: any;
    __mindropGmapsCb?: () => void;
  }
}

let gmapsPromise: Promise<any> | null = null;
function loadGoogleMaps(apiKey: string): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve(window.google);
  if (gmapsPromise) return gmapsPromise;
  gmapsPromise = new Promise((resolve, reject) => {
    const cbName = "__mindropGmapsCb";
    (window as any)[cbName] = () => resolve(window.google);
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&callback=${cbName}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => {
      gmapsPromise = null;
      reject(new Error("Failed to load Google Maps"));
    };
    document.head.appendChild(s);
  });
  return gmapsPromise;
}

/* ---------------- Google Maps renderer ---------------- */

function GoogleMap({
  lat, lng, radiusM, onMove, height, interactive, apiKey, accent, onFail,
}: Props & { apiKey: string; accent: string; height: number; onFail: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps(apiKey)
      .then((google) => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        const map = new google.maps.Map(containerRef.current, {
          center: { lat, lng }, zoom: 15,
          disableDefaultUI: true,
          gestureHandling: interactive ? "greedy" : "none",
          clickableIcons: false, keyboardShortcuts: false,
        });
        const marker = new google.maps.Marker({ position: { lat, lng }, map, draggable: !!interactive });
        const circle = new google.maps.Circle({
          map, center: { lat, lng }, radius: radiusM,
          strokeColor: accent, strokeWeight: 2, fillColor: accent, fillOpacity: 0.14, clickable: false,
        });
        if (interactive && onMove) {
          marker.addListener("dragend", () => {
            const p = marker.getPosition(); if (!p) return;
            circle.setCenter(p); onMove(p.lat(), p.lng());
          });
          map.addListener("click", (e: any) => {
            if (!e.latLng) return;
            marker.setPosition(e.latLng); circle.setCenter(e.latLng);
            onMove(e.latLng.lat(), e.latLng.lng());
          });
        }
        mapRef.current = map; markerRef.current = marker; circleRef.current = circle;
      })
      .catch(() => { if (!cancelled) onFail(); });
    return () => {
      cancelled = true;
      if (markerRef.current) markerRef.current.setMap(null);
      if (circleRef.current) circleRef.current.setMap(null);
      markerRef.current = null; circleRef.current = null; mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !circleRef.current) return;
    const pos = { lat, lng };
    markerRef.current.setPosition(pos);
    circleRef.current.setCenter(pos);
    circleRef.current.setRadius(radiusM);
    circleRef.current.setOptions({ strokeColor: accent, fillColor: accent });
    mapRef.current.panTo(pos);
  }, [lat, lng, radiusM, accent]);

  return (
    <div className="relative paper-card overflow-hidden" style={{ borderRadius: "var(--radius-2xl)" }}>
      <div ref={containerRef} style={{ height, width: "100%" }} aria-label="Map picker" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 0 1px var(--hairline)", borderRadius: "inherit" }} />
    </div>
  );
}

/* ---------------- Leaflet + OpenStreetMap fallback (keyless) ---------------- */

function LeafletMap({ lat, lng, radiusM, onMove, height, interactive, accent }: Props & { accent: string; height: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      // CSS is small — inject once from the JSDelivr copy so we don't need a bundler asset.
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.crossOrigin = "";
        document.head.appendChild(link);
      }
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center: [lat, lng], zoom: 15, zoomControl: false, attributionControl: false,
        dragging: !!interactive, scrollWheelZoom: !!interactive, doubleClickZoom: !!interactive,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:20px;height:20px;border-radius:50%;background:${accent};box-shadow:0 0 0 3px rgba(255,255,255,.9),0 2px 6px rgba(0,0,0,.25)"></div>`,
        iconSize: [20, 20], iconAnchor: [10, 10],
      });
      const marker = L.marker([lat, lng], { icon, draggable: !!interactive }).addTo(map);
      const circle = L.circle([lat, lng], { radius: radiusM, color: accent, weight: 2, fillColor: accent, fillOpacity: 0.14 }).addTo(map);
      if (interactive && onMove) {
        marker.on("dragend", () => {
          const p = marker.getLatLng(); circle.setLatLng(p); onMove(p.lat, p.lng);
        });
        map.on("click", (e: any) => {
          marker.setLatLng(e.latlng); circle.setLatLng(e.latlng); onMove(e.latlng.lat, e.latlng.lng);
        });
      }
      mapRef.current = map; markerRef.current = marker; circleRef.current = circle;
    })();
    return () => {
      cancelled = true;
      try { mapRef.current?.remove(); } catch {}
      mapRef.current = null; markerRef.current = null; circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !circleRef.current) return;
    markerRef.current.setLatLng([lat, lng]);
    circleRef.current.setLatLng([lat, lng]);
    circleRef.current.setRadius(radiusM);
    circleRef.current.setStyle({ color: accent, fillColor: accent });
    mapRef.current.panTo([lat, lng]);
  }, [lat, lng, radiusM, accent]);

  return (
    <div className="relative paper-card overflow-hidden" style={{ borderRadius: "var(--radius-2xl)" }}>
      <div ref={containerRef} style={{ height, width: "100%" }} aria-label="Map picker" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 0 1px var(--hairline)", borderRadius: "inherit" }} />
      <span aria-hidden="true" className="absolute bottom-1 right-2 t-meta text-ink/50">© OpenStreetMap</span>
    </div>
  );
}

/* ---------------- Public component ---------------- */

function envKey(): string | null {
  try {
    const v = (import.meta as any).env?.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    return typeof v === "string" && v.trim() ? v.trim() : null;
  } catch { return null; }
}

export function PlacePickerMap(props: Props) {
  const { accent3 } = useCountryTheme();
  const [apiKey, setApiKey] = useState<string | null>(envKey());
  const [resolved, setResolved] = useState<boolean>(!!envKey());
  const [googleFailed, setGoogleFailed] = useState(false);

  useEffect(() => {
    if (envKey()) return; // already resolved from env
    let cancelled = false;
    getGoogleMapsKey()
      .then((r) => { if (!cancelled) { setApiKey((r.value ?? "").trim() || null); setResolved(true); } })
      .catch(() => { if (!cancelled) { setApiKey(null); setResolved(true); } });
    return () => { cancelled = true; };
  }, []);

  const height = props.height ?? 260;

  if (!resolved) {
    return (
      <div className="relative paper-card overflow-hidden"
        style={{ borderRadius: "var(--radius-2xl)", height, width: "100%" }}
        aria-label="Map loading" />
    );
  }

  // Prefer Google when we have a working key; fall back to Leaflet otherwise.
  if (apiKey && !googleFailed) {
    return (
      <GoogleMap {...props} height={height} apiKey={apiKey} accent={accent3} onFail={() => setGoogleFailed(true)} />
    );
  }
  return <LeafletMap {...props} height={height} accent={accent3} />;
}

// Retained export so future callers can render a plain error card.
export function _MapErrorCard({ height, title, message }: { height: number; title: string; message: string }) {
  return (
    <div className="relative paper-card overflow-hidden flex flex-col items-center justify-center p-6 text-center gap-3"
      style={{ borderRadius: "var(--radius-2xl)", height, width: "100%" }} role="alert">
      <div className="flex items-center justify-center"
        style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-muted)" }}>
        <MapPin className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="max-w-[16rem]">
        <div className="t-title text-foreground mb-1">{title}</div>
        <div className="t-meta text-muted-foreground">{message}</div>
      </div>
    </div>
  );
}
