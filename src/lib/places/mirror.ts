import { pushToInbox } from "@/lib/notify/store";
import type { Place, PlaceRule } from "./types";

/**
 * Mirror a place trigger into the Notify inbox so it shows up alongside
 * captured phone notifications.
 */
export function mirrorPlaceFireToInbox(
  place: Place,
  rule: PlaceRule | null,
  kind: "enter" | "exit",
  at: number,
) {
  const verb = kind === "enter" ? "You arrived at" : "You left";
  const message = rule
    ? (kind === "enter" ? (rule.remindNote || rule.message) : (rule.exitMessage || rule.remindNote || rule.message))
    : (kind === "enter" ? place.message : (place.exitMessage || place.message));
  pushToInbox({
    id: `place-${place.id}-${rule?.id ?? "legacy"}-${at}`,
    pkg: "app.getmindrop.places",
    appName: "Places",
    title: `${verb} ${place.name}`,
    text: message || "",
    timestamp: at,
  });
}
