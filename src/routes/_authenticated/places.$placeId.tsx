import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlacePickerMap } from "@/components/places/PlacePickerMap";
import { usePlaces } from "@/lib/places/store";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

export const Route = createFileRoute("/_authenticated/places/$placeId")({
  head: () => ({
    meta: [
      { title: "Edit place — MinDrop" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditPlace,
});

const nameSchema = z.string().trim().min(1).max(120);

function EditPlace() {
  const { placeId } = Route.useParams();
  const navigate = useNavigate();
  const { list, patch, remove } = usePlaces();
  const place = useMemo(() => list.find((p) => p.id === placeId), [list, placeId]);
  const { accent3 } = useCountryTheme();

  const [name, setName] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(() => {
    if (!place) return;
    setName(place.name);
    setLat(place.lat);
    setLng(place.lng);
  }, [place]);

  if (!place) {
    return (
      <PhoneFrame>
        <div className="p-8 text-center">
          <p className="text-ink/70">Place not found.</p>
          <button
            className="mt-4 underline text-ink"
            onClick={() => navigate({ to: "/places" })}
          >
            Back to Places
          </button>
        </div>
      </PhoneFrame>
    );
  }

  const canSave = nameSchema.safeParse(name).success;

  const save = () => {
    if (!canSave) return;
    patch(place.id, { name: name.trim(), lat, lng });
    navigate({ to: "/places" });
  };

  const del = () => {
    if (!window.confirm("Erase this place and all its rules forever?")) return;
    remove(place.id);
    navigate({ to: "/places" });
  };

  return (
    <PhoneFrame>
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
            eyebrow="Edit place"
            title={place.name}
            lede={place.address}
            accent={accent3}
          />

          <div className="space-y-4">
            <PlacePickerMap
              lat={lat} lng={lng} radiusM={200}
              onMove={(la, ln) => { setLat(la); setLng(ln); }}
              height={200}
            />

            <div className="paper-card p-4 space-y-3">
              <label className="eyebrow block">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                className="t-body w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-ink/40"
              />
            </div>

            <motion.button
              type="button"
              onClick={save}
              disabled={!canSave}
              className="t-button w-full text-canvas py-4 rounded-2xl inline-flex items-center justify-center gap-2 press disabled:opacity-40"
              style={{ background: accent3 }}
            >
              <Check className="size-4" aria-hidden="true" />
              Save changes
            </motion.button>

            <button
              type="button"
              onClick={del}
              className="t-button w-full py-3 rounded-2xl inline-flex items-center justify-center gap-2 press"
              style={{ color: accent3 }}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Erase place
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
