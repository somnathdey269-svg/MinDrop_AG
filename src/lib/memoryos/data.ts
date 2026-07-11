import type { Memory, Rule, MemoryPack, ConfigEntry } from "./types";
import parkingImg from "@/assets/memory-parking.jpg";
import packParenting from "@/assets/pack-parenting.jpg";

export const seedMemories: Memory[] = [
  {
    id: "m1",
    time: "09:42",
    date: "Tuesday, 14 May",
    text: "Parked the car on level 4, section G. Near the blue pillar.",
    imageUrl: parkingImg,
  },
  {
    id: "m2",
    time: "12:15",
    date: "Tuesday, 14 May",
    text: "The name of the restaurant Sarah mentioned for the anniversary was 'Lumière' in the arts district.",
    highlight: true,
    tags: ["Actionable"],
  },
  {
    id: "m3",
    time: "16:30",
    date: "Tuesday, 14 May",
    text: "Dry cleaner closes early on Wednesdays. Pick up shirts before 5pm tomorrow.",
    tags: ["Actionable"],
  },
];

export const recoveryMemories: Memory[] = [
  { id: "r1", time: "Yesterday",  date: "Recovery", text: "Bin collection moved to Friday this week.", category: "Errand",     ageDays: 1 },
  { id: "r2", time: "2 days ago", date: "Recovery", text: "Library book 'Calm' due 21 May.",          category: "Read/Watch", ageDays: 2 },
  { id: "r3", time: "4 days ago", date: "Recovery", text: "Mum's new neighbour is called Priya.",     category: "Person",     ageDays: 4 },
  { id: "r4", time: "6 days ago", date: "Recovery", text: "Parked at Westfield P2, row C-14.",        category: "Parking",    ageDays: 6 },
  { id: "r5", time: "9 days ago", date: "Recovery", text: "Anniversary dinner at Lumière — book by Friday.", category: "Event", ageDays: 9 },
  { id: "r6", time: "12 days ago", date: "Recovery", text: "Aarav's birthday — he loves dinosaurs this year.", category: "Birthday", ageDays: 12 },
];

export const seedRules: Rule[] = [
  {
    id: "rule-1",
    name: "Semantic Association Engine",
    description: "Connects visual triggers to existing text nodes",
    status: "active",
    priority: 1,
    version: "v2.4.1",
    trigger: "OnCapture",
    conditions: ["content.density >= 0.85"],
    action: "ApplyVectorTagging",
  },
  {
    id: "rule-2",
    name: "Automatic Temporal Tagging",
    description: "Clusters memories based on circadian rhythms",
    status: "active",
    priority: 2,
    version: "v1.8.0",
    trigger: "OnMinuteTick",
    conditions: ["memory.age >= 6h"],
    action: "AssignCircadianCluster",
  },
  {
    id: "rule-3",
    name: "Visual Object Recognition (Legacy)",
    description: "Deprecated in favor of Neural Vision v3",
    status: "deprecated",
    priority: 9,
    version: "v0.9.2",
    trigger: "OnImageAttach",
    conditions: ["image.size > 0"],
    action: "DetectObjects",
  },
];

export const seedPacks: MemoryPack[] = [
  {
    id: "pack-1",
    name: "Parenting: Years 1-3",
    subtitle: "42 Prompt Templates",
    imageUrl: packParenting,
    active: true,
  },
  {
    id: "pack-2",
    name: "Executive Memory Recall",
    subtitle: "Professional CRM Expansion",
  },
  {
    id: "pack-3",
    name: "Legacy & Ancestry",
    subtitle: "Deep Genealogy Framework",
  },
];

export const seedConfig: ConfigEntry[] = [
  { key: "cache_ttl", label: "Global Cache TTL", type: "value", value: "3600ms" },
  { key: "ui_beta", label: "Experimental UI Beta", type: "toggle", value: true },
];
