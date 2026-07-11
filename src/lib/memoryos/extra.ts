export const allPacks = [
  { id: "parenting", name: "Parenting", subtitle: "Years 1–3", emoji: "👶", color: "#e8c5a0", premium: false },
  { id: "travel", name: "Travel", subtitle: "Trips & logistics", emoji: "✈️", color: "#a8c5e8", premium: true },
  { id: "work", name: "Work", subtitle: "Meetings & follow-ups", emoji: "💼", color: "#d4d4c8", premium: false },
  { id: "wellness", name: "Wellness", subtitle: "Habits & meds", emoji: "🌿", color: "#b8d4b8", premium: true },
  { id: "social", name: "Social", subtitle: "Names & details", emoji: "🫶", color: "#e8b8c8", premium: true },
  { id: "home", name: "Home", subtitle: "Maintenance & bills", emoji: "🏡", color: "#e8d4a8", premium: false },
];

export const forgetOptions = [
  { id: "parking", label: "Where I parked", emoji: "🅿️" },
  { id: "names", label: "People's names", emoji: "🪪" },
  { id: "tasks", label: "Small tasks", emoji: "✅" },
  { id: "ideas", label: "Random ideas", emoji: "💡" },
  { id: "meds", label: "Medications", emoji: "💊" },
  { id: "bills", label: "Bills & dates", emoji: "📅" },
];

export const kpis = [
  { label: "Daily active", value: "12,481", delta: "+4.2%" },
  { label: "Capture rate", value: "3.8 / user", delta: "+0.3" },
  { label: "Rule fires / hr", value: "27.4k", delta: "+12%" },
  { label: "Pack installs", value: "892", delta: "+18%" },
];

export const liveEvents = [
  { t: "2s ago", e: "rule.fire", d: "Semantic Association on capture #8412" },
  { t: "11s ago", e: "user.signup", d: "Premium · iOS · GB" },
  { t: "34s ago", e: "pack.install", d: "Parenting → user_9921" },
  { t: "1m ago", e: "rule.deploy", d: "v2.4.2 → 100% rollout" },
  { t: "2m ago", e: "config.update", d: "ui_beta toggled ON" },
];

export const mockUsers = [
  { id: "u1", name: "Ava Lin", email: "ava@hey.com", plan: "Premium", last: "2m ago" },
  { id: "u2", name: "Marcus Reid", email: "marcus@reid.io", plan: "Free", last: "14m ago" },
  { id: "u3", name: "Priya Shah", email: "priya@shah.co", plan: "Premium", last: "1h ago" },
  { id: "u4", name: "Tomás Beck", email: "t.beck@mail.com", plan: "Free", last: "3h ago" },
  { id: "u5", name: "Yuki Tanaka", email: "yuki@tnk.jp", plan: "Premium", last: "yesterday" },
];

export const experiments = [
  { id: "exp-1", name: "Capture pill copy", split: "50/50", metric: "captures/user", status: "running" },
  { id: "exp-2", name: "Onboarding length", split: "70/30", metric: "D1 retention", status: "running" },
  { id: "exp-3", name: "Paywall variant C", split: "33/33/33", metric: "free→paid", status: "concluded" },
];

export const auditLog = [
  { t: "09:42", who: "anya@mem.os", what: "Edited rule", target: "Semantic Association v2.4.1" },
  { t: "09:21", who: "system", what: "Auto-rollout", target: "v2.4.1 → 100%" },
  { t: "08:55", who: "raj@mem.os", what: "Created pack", target: "Wellness" },
  { t: "Yesterday", who: "anya@mem.os", what: "Toggled flag", target: "ui_beta = true" },
];
