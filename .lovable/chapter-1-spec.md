# Chapter 1 — Reference Spec (applied to all chapters)

Source: `src/routes/index.tsx` (Chapter I). All other chapter routes must match this treatment.

## Visual variant
- `PinnedScene` is rendered with `variant="immersive"` on **both** mobile and desktop.
- Editorial full-bleed poster variant is retired for chapter pages.

## Immersive layout expectations
- Full-bleed blurred hero backdrop, faded via radial mask + grain overlay.
- Compact title strip at the top with hairline top/bottom borders and `t-display` headline.
- Inline phone preview centered mid-stage (mobile: middle band; desktop: right stage / InlineWalkthrough).
- Caption card at the bottom containing the eyebrow ("CH. {roman} · {beat.eyebrow}") and the beat's `sub` copy.

## Typography / readability
- Body copy renders at full `text-ink` (no `text-ink/75` or `text-ink/80` opacity).
- Sub copy carries a warm text-shadow:
  `0 1px 0 rgba(249,247,242,0.9), 0 2px 14px rgba(249,247,242,0.65)`
  (mobile immersive caption uses the 10px blur variant already in `PinnedScene`).
- Uses only the seven `.t-*` roles from `src/styles.css`.

## Header wordmark
- `AnimatedMWordmark` cycles **"My" → "MinDrop"** (never "Me").
- Wordmark and tagline are left-aligned to the same x-axis; wordmark is not clipped at any breakpoint.

## Navigation
- Arrow keys, on-screen chapter chevrons, and beat tabs behave identically across chapters.
- Chapter turn animation and beat sweep unchanged.

## Per-route contract
Each chapter route must pass:
- `variant="immersive"`
- `chapter`, `hero`, `heroAlt`, `screens`, `phone`, and a `beats[]` with `eyebrow`, `tabLabel`, `line`, `sub`, `hero`, `heroAlt`.
- `backdrop` per beat is optional; when omitted, `PinnedScene` falls back to `backdropScatter`.

## Files that must set `variant="immersive"`
- `src/routes/index.tsx` ✅ (reference)
- `src/routes/do-it-later.tsx`
- `src/routes/notify-feature.tsx`
- `src/routes/places-feature.tsx`
- `src/routes/settings-feature.tsx`
- `src/routes/why-mindrop.tsx`
- `src/routes/pricing.tsx`
- `src/routes/download.tsx`
