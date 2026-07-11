// Per-chapter walkthroughs. Each chapter maps to N beats; each beat is a
// mini-tour that can span multiple app screens. When a step carries its own
// `screen`, the phone iframe swaps to that route before showing the tooltip.
//
// target: CSS selector inside the app iframe (usually a data-tour attr).
// If a target can't be resolved, the tooltip stays centered (no ring).

import type { ChapterSlug } from "./chapters";

export interface WalkStep {
  title: string;
  body: string;
  /** CSS selector inside the app iframe. Omit for intro/outro cards. */
  target?: string;
  /** If set, iframe swaps to this route before showing this step. */
  screen?: string;
}

export interface BeatWalkthrough {
  /** Default route the phone iframe loads for this beat. */
  screen: string;
  /** Short label shown in the step header. */
  label: string;
  steps: WalkStep[];
}

/** Per chapter, one BeatWalkthrough per story beat, in order. */
export const WALKTHROUGHS_BY_CHAPTER: Partial<Record<ChapterSlug, BeatWalkthrough[]>> = {
  overwhelm: [
    {
      screen: "/splash",
      label: "Splash",
      steps: [
        { title: "The Keeper opens", body: "First launch shows the mark. No account wall, no email, no sign-up — the vault is already on your phone.", target: "[data-tour=\"splash-note\"]" },
        { title: "Everything stays on-device", body: "MinDrop is offline-first. Nothing leaves the phone unless you turn on backup yourself.", target: "[data-tour=\"splash-note\"]" },
        { title: "Tap to begin", body: "One tap in and you're on the Later shelf.", target: "[data-tour=\"splash-cta\"]" },
      ],
    },
    {
      screen: "/splash",
      label: "About the app",
      steps: [
        { title: "A quiet second memory", body: "Not an assistant, not a chatbot. A calm inbox for the small things — chargers, birthdays, bills.", target: "[data-tour=\"splash-note\"]" },
        { title: "Built for the small stuff", body: "The things your brain wasn't built to carry. MinDrop holds them and slides them back at the right time.", target: "[data-tour=\"splash-note\"]" },
        { title: "Nothing more, nothing extra", body: "No ads, no tracking, no social. Just the shelf, the pings, the places.", target: "[data-tour=\"splash-cta\"]" },
      ],
    },
    {
      screen: "/home",
      label: "Home",
      steps: [
        { title: "Your quiet inbox", body: "Every captured thought lands in Later — newest first, nothing shouting at you.", target: "[data-tour=\"home-list\"]" },
        { title: "Capture in seconds", body: "The dark pill is always one tap away — drop a thought as text, voice, or a photo.", target: "[data-tour=\"capture-btn\"]" },
        { title: "Five rooms, one bar", body: "Later, Notify, Places, Recall, Settings. That's the whole app.", target: "[data-tour=\"bottom-tabs\"]" },
      ],
    },
  ],

  drop: [
    {
      screen: "/home",
      label: "Reminder",
      steps: [
        { title: "The Later shelf", body: "This is the room the app is named after — drop a thought, come back for it later.", target: "[data-tour=\"home-list\"]" },
        { title: "Each row is one drop", body: "Tap a row to expand: edit, snooze, mark done, or send it to a pack.", target: "[data-tour=\"home-list\"]" },
        { title: "Capture", body: "The dark pill is the drop button. Text, voice, or a photo of that scribbled sticky note.", target: "[data-tour=\"capture-btn\"]" },
      ],
    },
    {
      screen: "/packs",
      label: "Packs",
      steps: [
        { title: "Small buckets", body: "Packs are pre-built thought kits — Parenting, Errand, Meds, Pet — anything you'd otherwise juggle in your head.", target: "[data-tour=\"packs-grid\"]" },
        { title: "All / Installed / Custom", body: "All shows every pack, Installed is what you've added, Custom holds packs you built yourself.", target: "[data-tour=\"packs-tabs\"]" },
        { title: "Search fast", body: "Type to jump to a specific pack — parenting, gym, groceries, meds.", target: "[data-tour=\"packs-search\"]" },
      ],
    },
    {
      screen: "/recall",
      label: "Recall",
      steps: [
        { title: "Older thoughts, floated back", body: "Recall surfaces yesterday's captures so nothing rots at the bottom of the pile.", target: "[data-tour=\"recall-deck\"]" },
        { title: "One card at a time", body: "Each card is one drop. Keep it, snooze it, or mark it done — one gesture per card.", target: "[data-tour=\"recall-deck\"]" },
        { title: "Two minutes, then done", body: "Recall is intentionally short — a calm scan, not another feed to fall into.", target: "[data-tour=\"recall-deck\"]" },
      ],
    },
  ],

  ping: [
    {
      screen: "/notify",
      label: "Inbox",
      steps: [
        { title: "Every ping in one inbox", body: "Notify catches pings from your other apps so you decide what actually matters — later, calmly.", target: "[data-tour=\"notify-list\"]" },
        { title: "Tabs across the top", body: "Inbox, Rules, Archived, Erased. Jump between them without doom-scrolling.", target: "[data-tour=\"notify-tabs\"]" },
        { title: "One row per ping", body: "App icon, headline, timestamp. Nothing shouts — you scan, you decide.", target: "[data-tour=\"notify-list\"]" },
      ],
    },
    {
      screen: "/notify?tab=rules",
      label: "Rules",
      steps: [
        { title: "Write a rule once", body: "Rules auto-route future pings from the same app or keyword — you never triage the same thing twice.", target: "[data-tour=\"notify-list\"]" },
        { title: "See what's on", body: "Each row shows the trigger and where the ping is sent. Flip the switch to pause it.", target: "[data-tour=\"notify-list\"]" },
        { title: "Add a rule", body: "Pick an app or keyword, choose the action. It runs on the next matching ping.", target: "[data-tour=\"notify-tabs\"]" },
      ],
    },
    {
      screen: "/notify?tab=archived",
      label: "Archived",
      steps: [
        { title: "Handled, out of the way", body: "Archived rules go quiet without being deleted — the shelf stays honest.", target: "[data-tour=\"notify-list\"]" },
        { title: "Flip them back on", body: "Change your mind? Restore a rule in one tap; it starts routing pings again immediately.", target: "[data-tour=\"notify-list\"]" },
        { title: "Nothing is truly lost", body: "Erased pings sit here for a while too — because everyone deletes the wrong thing sometimes.", target: "[data-tour=\"notify-tabs\"]" },
      ],
    },
  ],

  walk: [
    {
      screen: "/places/new",
      label: "Save location",
      steps: [
        { title: "Save a place", body: "School gate, bakery, home. Attach thoughts that only matter there.", target: "[data-tour=\"place-search\"]" },
        { title: "Search or drop a pin", body: "Type an address, drag the pin, or hit \"use my location\" to save where you're standing.", target: "[data-tour=\"place-search\"]" },
        { title: "Name it and save", body: "Plain name, hit save. That spot is now on your map.", target: "[data-tour=\"place-save\"]" },
      ],
    },
    {
      screen: "/places",
      label: "Set rules",
      steps: [
        { title: "Set the geofence rule", body: "Each saved place has its own radius — 50m for a shop, 500m for a neighbourhood.", target: "[data-tour=\"places-list\"]" },
        { title: "One row per place", body: "Tap a row to edit its radius, its attached thoughts, or its little inbox.", target: "[data-tour=\"places-list\"]" },
        { title: "Add another", body: "The plus button opens the map so you can drop a fresh pin.", target: "[data-tour=\"places-add\"]" },
      ],
    },
    {
      screen: "/places?tab=archived",
      label: "Archived",
      steps: [
        { title: "Off-duty, not gone", body: "Archived places stop firing but stay one tap from restore.", target: "[data-tour=\"places-list\"]" },
        { title: "Bring one back", body: "Restore a place and its radius picks up right where it left off.", target: "[data-tour=\"places-list\"]" },
        { title: "Battery-friendly by design", body: "On Android the Keeper uses OS geofences — no constant GPS chewing your battery.", target: "[data-tour=\"places-list\"]" },
      ],
    },
  ],

  settings: [
    {
      screen: "/settings",
      label: "Theme",
      steps: [
        { title: "Colours from where you live", body: "Country themes pull warm, familiar palettes into every room of the app.", target: "[data-tour=\"settings-region\"]" },
        { title: "One tap swaps the palette", body: "Pick a country, and greens, warms and accents update across the whole app instantly.", target: "[data-tour=\"settings-region\"]" },
        { title: "Nothing else changes", body: "Only colour — layout, type and copy stay exactly where they were.", target: "[data-tour=\"settings-region\"]" },
      ],
    },
    {
      screen: "/settings",
      label: "Font",
      steps: [
        { title: "Type that fits your eyes", body: "Sans, serif, or mono — the whole app follows your pick.", target: "[data-tour=\"settings-appearance\"]" },
        { title: "Three sizes", body: "Small, medium, large. Great for tired evenings, small phones, and older eyes.", target: "[data-tour=\"settings-appearance\"]" },
        { title: "Reset any time", body: "Not sure? One tap returns to the default — sans, small — no harm done.", target: "[data-tour=\"settings-appearance\"]" },
      ],
    },
    {
      screen: "/settings",
      label: "Other",
      steps: [
        { title: "The small dials", body: "Permissions, memory packs, privacy, backup, diagnostics — one honest list.", target: "[data-tour=\"settings-menu\"]" },
        { title: "Every tile leads somewhere real", body: "No coming-soon fog. Tap a tile and you're on the exact page that controls it.", target: "[data-tour=\"settings-menu\"]" },
        { title: "Your plan sits at the top", body: "Free or Premium — the caps that apply are shown plainly, no hidden state.", target: "[data-tour=\"settings-plan\"]" },
      ],
    },
  ],

  why: [
    {
      screen: "/features",
      label: "The wall",
      steps: [
        { title: "Everything on one page", body: "This is MinDrop laid out honestly — every feature the app ships with today.", target: "main h1" },
        { title: "Grouped by room", body: "Later, Notify, Places, Recall — the same five rooms the bottom bar shows.", target: "[data-tour=\"features-list\"]" },
        { title: "No coming-soon fog", body: "If it's on this page, it's in the build you're about to install.", target: "[data-tour=\"features-list\"]" },
      ],
    },
    {
      screen: "/how-it-works",
      label: "Same, in shape",
      steps: [
        { title: "One clear flow", body: "Capture → shelf → nudge → done. Same shape most reminder apps use — done a bit more calmly.", target: "main h1" },
        { title: "Every step is optional", body: "Skip the shelf, skip the nudge, skip Recall — MinDrop still helps. Nothing is mandatory.", target: "[data-tour=\"how-steps\"]" },
      ],
    },
    {
      screen: "/faq",
      label: "Different, on purpose",
      steps: [
        { title: "Honest answers", body: "The questions we get most, answered without spin.", target: "main h1" },
        { title: "Why the 5/day cap", body: "Because 500 drops a day isn't a system — it's a landfill. The cap is the feature.", target: "[data-tour=\"faq-list\"]" },
        { title: "What's actually different", body: "Reading pings, capping the shelf, OS geofences — small choices that add up.", target: "[data-tour=\"faq-list\"]" },
      ],
    },
  ],

  free: [
    {
      screen: "/paywall",
      label: "Free column",
      steps: [
        { title: "5 drops, 3 rules, 3 places", body: "The free plan is the app enforcing its own promise. No tricks, no dark patterns.", target: "[data-tour=\"paywall-plans\"]" },
        { title: "Same shape, no cap", body: "Premium is the same rooms, the same rhythm — just no daily ceiling.", target: "[data-tour=\"paywall-plans\"]" },
        { title: "Unlock when you're ready", body: "Nothing nags you into upgrading — hit the button only if the cap gets in your way.", target: "[data-tour=\"paywall-cta\"]" },
      ],
    },
    {
      screen: "/packs/parenting",
      label: "What Premium unlocks",
      steps: [
        { title: "All packs, unlocked", body: "Every pack in the library — no locked cards, no upsells inside packs.", target: "[data-tour=\"pack-header\"]" },
        { title: "Drop into any section", body: "Add a thought straight into a pack section — it lands already tagged.", target: "[data-tour=\"pack-add\"]" },
        { title: "Photo & voice attachments", body: "Attach a photo to any drop. Voice notes get auto-transcribed on Premium.", target: "[data-tour=\"pack-add\"]" },
      ],
    },
    {
      screen: "/settings",
      label: "The promise",
      steps: [
        { title: "Your plan lives here", body: "Settings shows your current plan and the caps that apply — no hidden state anywhere.", target: "[data-tour=\"settings-plan\"]" },
        { title: "See what the app enforces", body: "The caps in Settings match the ones on the paywall. Same numbers, same behaviour.", target: "[data-tour=\"settings-caps\"]" },
        { title: "Everything else is optional", body: "Type, colour, packs — dress the app your way; the plan is the only rule that matters.", target: "[data-tour=\"settings-menu\"]" },
      ],
    },
  ],

  "take-home": [
    {
      screen: "/splash",
      label: "Goodnight",
      steps: [
        { title: "The mark, resting", body: "This is the launch screen — quiet, one drop, waiting.", target: "[data-tour=\"splash-note\"]" },
        { title: "Tap to begin", body: "One tap in and you're on the Later shelf.", target: "[data-tour=\"splash-cta\"]" },
      ],
    },
    {
      screen: "/diagnostics",
      label: "Local vault",
      steps: [
        { title: "Honest state", body: "Diagnostics shows what's stored on your phone right now — drop count, last sync, size on disk.", target: "main h1" },
        { title: "Nothing hidden", body: "Every number here is read straight from the device — no server, no telemetry.", target: "main h1" },
      ],
    },
    {
      screen: "/permissions",
      label: "Put it on your phone",
      steps: [
        { title: "One small step", body: "Grant what you want, skip the rest — every permission is optional and reversible.", target: "[data-tour=\"perm-list\"]" },
        { title: "Continue in", body: "You're two taps from your first drop.", target: "[data-tour=\"perm-cta\"]" },
      ],
    },
  ],

};

export function walkthroughForBeat(
  slug: ChapterSlug,
  beatIndex: number,
): BeatWalkthrough | null {
  const list = WALKTHROUGHS_BY_CHAPTER[slug];
  if (!list || !list.length) return null;
  return list[Math.min(beatIndex, list.length - 1)] ?? null;
}
