import { jsPDF } from "jspdf";
import type { SummaryJson } from "./types";

interface PdfOpts {
  date: string;
  provider: string;
  model: string;
  presetName?: string;
}

const INK = "#1a1a1a";
const MUTED = "#6b6b6b";
const BRAND = "#4a5d4e";
const CANVAS = "#f9f7f2";

export function renderSummaryPdf(json: SummaryJson, opts: PdfOpts): Blob {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = M;

  function ensureSpace(need: number) {
    if (y + need > H - M) { doc.addPage(); y = M; }
  }
  function h(text: string, size = 18, color = INK) {
    ensureSpace(size + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(color);
    doc.text(text, M, y);
    y += size + 8;
  }
  function p(text: string, size = 10, color = INK, gap = 4) {
    ensureSpace(size + gap);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, W - 2 * M);
    for (const line of lines) {
      ensureSpace(size + gap);
      doc.text(line, M, y);
      y += size + gap;
    }
  }
  function rule() {
    ensureSpace(12);
    doc.setDrawColor(220, 220, 220);
    doc.line(M, y, W - M, y);
    y += 12;
  }
  function pill(text: string, x: number, color = BRAND) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    const w = doc.getTextWidth(text) + 12;
    doc.setFillColor(color);
    doc.roundedRect(x, y - 8, w, 14, 7, 7, "F");
    doc.setTextColor(CANVAS);
    doc.text(text, x + 6, y + 1);
    doc.setTextColor(INK);
    return w;
  }

  // Header band
  doc.setFillColor(BRAND);
  doc.rect(0, 0, W, 6, "F");

  // Title
  h("Your daily digest", 22);
  p(`${opts.date} · ${opts.presetName ?? "All sources"}`, 10, MUTED);
  y += 4;

  // Headline
  h(json.headline || "Today at a glance", 15, BRAND);

  // Highlights
  if (json.highlights?.length) {
    h("Highlights", 13);
    for (const hi of json.highlights) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(INK);
      ensureSpace(14);
      doc.text(`• ${hi.title}`, M, y);
      y += 14;
      p(`  ${hi.detail}`, 10, MUTED);
      y += 2;
    }
    rule();
  }

  // By app
  if (json.byApp?.length) {
    h("Per app", 13);
    for (const b of json.byApp) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      ensureSpace(14);
      doc.text(b.app, M, y);
      y += 12;
      p(b.insight, 10, MUTED);
      y += 2;
    }
    rule();
  }

  // Attention signals
  const sig = json.attentionSignals;
  if (sig && (sig.peakHour || sig.quietWindow)) {
    h("Attention signals", 13);
    if (sig.peakHour) p(`Peak hour: ${sig.peakHour}`, 10);
    if (sig.quietWindow) p(`Quiet window: ${sig.quietWindow}`, 10);
    if (typeof sig.distractionScore === "number") p(`Distraction score: ${sig.distractionScore}/10`, 10);
    rule();
  }

  // Action items
  if (json.actionItems?.length) {
    h("Action items", 13);
    for (const a of json.actionItems) {
      ensureSpace(14);
      const color = a.priority === "high" ? "#c85555" : a.priority === "med" ? "#c8975a" : BRAND;
      const w = pill(a.priority.toUpperCase(), M, color);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(INK);
      const lines = doc.splitTextToSize(a.text, W - 2 * M - w - 8);
      doc.text(lines[0], M + w + 8, y);
      y += 14;
      for (const l of lines.slice(1)) { ensureSpace(12); doc.text(l, M + w + 8, y); y += 12; }
      y += 4;
    }
    rule();
  }

  // Mood note
  if (json.moodNote) {
    h("Mood note", 13);
    p(json.moodNote, 10, MUTED);
    rule();
  }

  // ─── Conclusion (MindDrop) ───
  doc.addPage();
  y = M;
  doc.setFillColor(BRAND);
  doc.rect(0, 0, W, 6, "F");
  h("MindDrop Conclusion", 20, BRAND);
  p("How your reminders performed and what to set next.", 10, MUTED);
  y += 4;

  const rc = json.conclusion.reminderRecap;
  // Scorecard grid — 3 x 2
  const cells: Array<[string, string]> = [
    ["Active", String(rc.activeTotal)],
    ["Triggered today", String(rc.triggeredToday)],
    ["Missed today", String(rc.missedToday)],
    ["Created today", String(rc.createdToday)],
    ["Upcoming (7d)", String(rc.upcoming7d)],
    ["On-time rate", `${Math.round(rc.onTimeRate * 100)}%`],
  ];
  const cw = (W - 2 * M - 16) / 3;
  const ch = 56;
  cells.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = M + col * (cw + 8);
    const cy = y + row * (ch + 8);
    doc.setDrawColor(230, 230, 230); doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, cy, cw, ch, 8, 8, "FD");
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(MUTED);
    doc.text(c[0], x + 10, cy + 18);
    doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.setTextColor(INK);
    doc.text(c[1], x + 10, cy + 44);
  });
  y += 2 * (ch + 8) + 8;

  if (json.conclusion.wins?.length) {
    h("Wins", 13, BRAND);
    for (const w of json.conclusion.wins) p(`• ${w}`, 10);
    y += 4;
  }
  if (json.conclusion.misses?.length) {
    h("Misses & why", 13);
    for (const m of json.conclusion.misses) p(`• ${m}`, 10);
    y += 4;
  }

  if (json.conclusion.suggestedReminders?.length) {
    h("Suggested reminders", 13, BRAND);
    p("Open the digest inside MindDrop to create these with one tap.", 9, MUTED);
    y += 4;
    for (const s of json.conclusion.suggestedReminders) {
      ensureSpace(48);
      doc.setDrawColor(230, 230, 230); doc.setFillColor(255, 255, 255);
      doc.roundedRect(M, y, W - 2 * M, 44, 8, 8, "FD");
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(INK);
      doc.text(s.title, M + 12, y + 16);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(MUTED);
      doc.text(`${s.when} · ${s.kind}`, M + 12, y + 30);
      const lines = doc.splitTextToSize(s.why, W - 2 * M - 24);
      if (lines[0]) doc.text(lines[0], M + 12, y + 42);
      y += 52;
    }
  }

  if (json.conclusion.closingLine) {
    y += 4;
    ensureSpace(20);
    doc.setFont("helvetica", "italic"); doc.setFontSize(10); doc.setTextColor(BRAND);
    const lines = doc.splitTextToSize(json.conclusion.closingLine, W - 2 * M);
    for (const l of lines) { ensureSpace(12); doc.text(l, M, y); y += 14; }
  }

  // Footer on every page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8); doc.setTextColor(MUTED);
    doc.text(
      `MindDrop · ${opts.provider} · ${opts.model} · ${i}/${pages}`,
      M, H - 20,
    );
    doc.text("Generated on-device. Never sent to our servers.", W - M, H - 20, { align: "right" });
  }

  return doc.output("blob");
}
