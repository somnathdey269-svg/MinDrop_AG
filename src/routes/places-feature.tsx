import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { motion } from "framer-motion";
import { ArrowLeft, Navigation, Battery, Locate, ShieldAlert, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/places-feature")({
  head: () => ({
    meta: [
      { title: "Places Module — MinDrop Geolocation Reminders" },
      { name: "description", content: "Receive loop alerts and reminders exactly when you arrive or leave specified geofenced areas." },
    ],
  }),
  component: PlacesFeature,
});

function PlacesFeature() {
  return (
    <MarketingLayout>
      <section className="relative overflow-hidden bg-canvas py-16 md:py-24 border-b border-ink/5">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-purple-500/5 blur-[100px]" />
        
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-purple-600 hover:underline font-bold text-xs uppercase tracking-wider mb-6">
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>
          
          <span className="t-eyebrow inline-flex items-center gap-2 rounded-full bg-purple-50 px-3.5 py-1.5 text-[#8b5cf6] font-bold border border-purple-100 mb-5">
            📍 Places Module
          </span>

          <h1 className="t-display text-4xl sm:text-5xl font-black leading-tight text-ink">
            Reminders triggered <span className="text-[#8b5cf6]">exactly where they matter.</span>
          </h1>

          <p className="t-body mt-4 text-ink/75 max-w-xl mx-auto leading-relaxed">
            Thoughts only count when you can act on them. MinDrop's Places Module tracks geofence perimeters and triggers loud loop alarms the exact minute you cross the boundary.
          </p>

          <div className="mt-8 flex justify-center">
            <Link to="/download" className="t-button inline-flex items-center gap-2 bg-ink text-canvas rounded-2xl px-6 py-3.5 hover:opacity-90 font-bold transition">
              Get the App
            </Link>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-20 bg-[#f9f7f2]">
        <div className="mx-auto max-w-5xl px-5 md:px-8 grid gap-8 md:grid-cols-2">
          
          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-purple-50 text-purple-600 mb-4">
                <Locate className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">Radius Customization</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Set exact location perimeters. Select your workspace, home, grocery store, or pharmacy, and define custom radius sizes (e.g. 100 meters, 500 meters). Trigger drops upon entry or departure.
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-purple-50 text-purple-600 mb-4">
                <Battery className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">Zero-Drain Geofencing</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Most reminder apps drain battery by keeping GPS running. MinDrop uses native Android Geofencing hardware listeners that sweep coordinates only when cell towers indicate movement, keeping battery drain to 0%.
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-purple-50 text-purple-600 mb-4">
                <Navigation className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">Drop on Arrival Alarms</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Make sure you get the alarm. Instead of a silent notification banner that goes unnoticed, MinDrop triggers an active, looping alarm screen that rings when you enter the radius boundary.
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-purple-50 text-purple-600 mb-4">
                <CheckCircle className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">Full Offline Tracking</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Your location records are saved strictly on-device in a secure SQLite database. MinDrop never uploads your telemetry logs, locations, or coordinates to any external server—your movements stay yours.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-ink text-canvas text-center">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="t-display text-2xl md:text-3xl">Get triggered exactly where it matters.</h2>
          <p className="t-body mt-3 text-canvas/70 text-sm">Download the MinDrop APK for Android and never miss a location trigger again.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/download" className="t-button rounded-full bg-white text-ink px-6 py-3 font-semibold">
              Get the APK
            </Link>
            <Link to="/" className="t-button rounded-full bg-white/10 text-canvas px-6 py-3 border border-white/15">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
