/**
 * Fixed registry of app routes the admin can pick as a phone screen for
 * walkthrough beats. Kept in code (not the DB) so admin cannot type a bad
 * path and break the phone iframe.
 */
export const PHONE_SCREEN_REGISTRY: { path: string; label: string }[] = [
  { path: "/splash", label: "Splash" },
  { path: "/home", label: "Home (Later)" },
  { path: "/do-it-later", label: "Do it later" },
  { path: "/packs", label: "Packs — all" },
  { path: "/packs/parenting", label: "Packs — parenting" },
  { path: "/recall", label: "Recall" },
  { path: "/notify", label: "Notify inbox" },
  { path: "/notify?tab=rules", label: "Notify — rules" },
  { path: "/notify?tab=archived", label: "Notify — archived" },
  { path: "/places", label: "Places" },
  { path: "/places/new", label: "Places — save location" },
  { path: "/places?tab=archived", label: "Places — archived" },
  { path: "/settings", label: "Settings" },
  { path: "/permissions", label: "Permissions" },
  { path: "/diagnostics", label: "Diagnostics" },
  { path: "/paywall", label: "Paywall" },
  { path: "/features", label: "Features" },
  { path: "/how-it-works", label: "How it works" },
  { path: "/faq", label: "FAQ" },
];
