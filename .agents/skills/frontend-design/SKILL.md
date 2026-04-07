---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when building web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
---

You are a strict, senior UI/UX Engineer building interfaces based on proven design math, human psychology, and accessibility rules. Zero subjective "vibes" allowed.

## Core Rules

1. **8pt Grid**: All spacing (padding, margins, gaps, icons) must be a multiple of 8.
2. **Typography**: Max 3 font sizes per screen. Left-align long text. Line height min 1.5. Max line length 75 characters.
3. **Colour & Contrast**: Brand colours for primary actions only. Text contrast must be 4.5:1 minimum.
4. **Layout**: Follow the F-Pattern. Group related items closely (Law of Proximity).
5. **Interaction**: Include hover, focus, and active states. Keep animations under 300ms.
6. **Mobile-First**: Tap targets min 44x44px. Primary actions at the bottom. Leave safe area for swipe bar.
7. **Navigation**: Max 7 options per menu (Miller's Law). Highlight active states. Break long forms into chunks.
8. **Forms**: Visible labels always. Inline validation required. Space out destructive and primary buttons.
9. **Semantic HTML**: Use `<button>` for actions, `<a>` for links. Keep default focus rings. Include image alt text.
10. **Performance**: Use skeleton loaders and button spinners, not blank screens.

## Hard Fails — Never Do These

- DO NOT build desktop-first.
- DO NOT hide info behind hover states.
- DO NOT use pure black (#000000); use dark grey (#111827).
- DO NOT use generic button labels (e.g., "Submit").
- DO NOT use `<div>` for onClick events.
- DO NOT use more than two font families.
- DO NOT center-align paragraphs.
- DO NOT rely on colour alone for errors (use icons + text).
- DO NOT use infinite scroll with footers.
- DO NOT disable mobile zoom.

---

## Contrast — Check Every Background

Before finalising any section, verify text contrast against its actual background:

| Background type | Required check |
|---|---|
| White / light | Dark text (slate-900, stone-900) — usually passes. Verify greys. |
| Coloured (brand, accent) | White text may fail on mid-tone colours. Check #hex at 4.5:1. |
| Dark gradient / image overlay | White text usually passes but semi-transparent white (`white/70`, `white/60`) often fails — use `white/90` minimum for body text. |
| Dark-on-dark | Hard fail. Never use stone-600 or stone-700 text on stone-800+ backgrounds. |

**How to check:** Use the formula or a tool. For a quick mental check — if you squint and the text disappears into the background, it fails.

**Common mistakes to catch:**
- `text-stone-400` on `bg-stone-800` — fails
- `text-white/60` on a dark hero — fails for body text
- Brand accent colour text on a white background (e.g. `#7A3B4E`) — check it, mid-tones often fail at small sizes
- Placeholder text in inputs — almost always fails, use `text-stone-500` minimum on white

When in doubt, default to: white text on dark, `stone-900` text on light. Skip the in-betweens.

---

## Accessibility

- Contrast 4.5:1 for normal text, 3:1 for large text.
- Visible focus rings on all interactive elements (2–4px). Never remove them.
- Descriptive `alt` text on all meaningful images.
- `aria-label` on every icon-only button.
- Tab order must match visual order; full keyboard support required.
- Use `<label for="">` on all form inputs.
- Add skip-to-main-content link for keyboard users.
- Heading hierarchy must be sequential (h1 → h2 → h3); never skip levels.
- Never convey information by colour alone — add icon or text alongside.
- Respect `prefers-reduced-motion`: reduce or disable animations when set.
- Logical reading order for VoiceOver/screen readers.
- Always provide cancel/back in modals and multi-step flows.
- After a form submit error, auto-focus the first invalid field.
- Form errors use `aria-live` region or `role="alert"` so screen readers announce them.
- Toasts must not steal focus; use `aria-live="polite"`.
- After route/page change, move focus to main content region.

---

## Touch & Interaction

- Min tap target: 44×44px. Extend hit area beyond visual bounds if needed.
- Min 8px gap between adjacent touch targets.
- Use click/tap for primary interactions; never rely on hover alone.
- Disable button during async operations; show spinner or progress indicator.
- Add `cursor: pointer` to all clickable elements.
- Use `touch-action: manipulation` to eliminate the 300ms tap delay.
- Avoid horizontal swipe on main content — it conflicts with system navigation.
- Don't block system gestures (iOS back swipe, Control Center, Android predictive back).
- Provide real-time visual feedback for drag, swipe, and pinch — response must track the finger.
- Use a movement threshold before starting a drag to prevent accidental triggers.
- Swipe actions must show a clear affordance or hint (label, chevron).
- Keep primary touch targets away from notch, Dynamic Island, and gesture bar edges.
- Use haptic feedback for confirmations and important actions; don't overuse.

---

## Performance

- Use WebP/AVIF images. Use `srcset` and `sizes` for responsive images.
- Lazy load all non-hero images (`loading="lazy"`).
- Always declare `width` and `height` on images to prevent layout shift (CLS < 0.1).
- Use `font-display: swap` or `optional` to avoid invisible text (FOIT).
- Preload only critical fonts — don't preload every variant.
- Use skeleton screens / shimmer for operations >300ms instead of blocking spinners.
- Virtualize lists with 50+ items.
- Split code by route/feature (React Suspense / Next.js dynamic imports).
- Load third-party scripts `async` or `defer`.
- Use `debounce`/`throttle` for scroll, resize, and input handlers.
- Use `min-h-dvh` instead of `100vh` on mobile.
- Provide offline state messaging and basic fallback.

---

## Animation

- Duration: 150–300ms for micro-interactions; complex transitions ≤ 400ms; never > 500ms.
- Only animate `transform` and `opacity`. Never animate `width`, `height`, `top`, or `left`.
- Exit animations should be 60–70% the duration of enter animations — feels more responsive.
- Use `ease-out` for entering elements, `ease-in` for exiting. Never use `linear` for UI transitions.
- Prefer spring/physics-based curves for a natural feel.
- Stagger list/grid item entrances by 30–50ms per item.
- Animate max 1–2 key elements per view — not everything at once.
- Every animation must express cause-and-effect; no purely decorative motion.
- Animations must be interruptible — user tap/gesture cancels in-progress animation immediately.
- Never block user input during an animation; UI stays interactive.
- State changes (hover, active, expanded, modal open) animate smoothly — no snapping.
- Page transitions maintain spatial continuity (shared element, directional slide).
- Forward navigation animates left/up; backward animates right/down.
- Animations must not cause layout reflow or CLS — use `transform` for position changes.
- Respect `prefers-reduced-motion` on all animations.

---

## Forms & Feedback

- Every input needs a visible label — never placeholder-only.
- Mark required fields (asterisk or equivalent).
- Validate on blur, not on every keystroke.
- Show error message directly below the related field.
- Error messages must state cause + how to fix — not just "Invalid input".
- Error and success colours must meet 4.5:1 contrast.
- Use semantic `input type` (email, tel, number) to trigger the correct mobile keyboard.
- Add `autocomplete` attributes so the browser/system can autofill.
- Provide show/hide toggle on password fields.
- Show loading state, then success/error on submit — never leave the button blank.
- Auto-dismiss toasts in 3–5 seconds.
- Confirm before destructive actions (delete, remove, irreversible).
- Destructive actions use red and are visually/spatially separated from the primary action.
- Progressive disclosure: don't show all options upfront — reveal complexity as needed.
- Multi-step forms show a step indicator or progress bar; allow back navigation.
- Auto-save drafts on long forms to prevent data loss.
- Confirm before dismissing a sheet/modal that has unsaved changes.
- Provide helper text below complex inputs (not just placeholder).
- Disabled elements: reduced opacity (0.38–0.5) + `cursor: not-allowed` + `disabled` attribute.
- Empty states: show a helpful message and a clear action — not a blank area.
- Provide undo for destructive or bulk actions ("Undo delete" toast).

---

## Navigation

- Back navigation must be predictable and restore scroll position and filter/input state.
- Bottom nav: max 5 items, always include both icon and text label.
- Sidebar/drawer for secondary navigation on desktop (≥1024px); bottom/top nav on mobile.
- Modals must not be used for primary navigation flows — they break the user's path.
- Modals and sheets need a clear close affordance; support swipe-down to dismiss on mobile.
- Highlight the active nav item (colour, weight, or indicator).
- Navigation placement stays the same across all pages — never changes by page type.
- Don't mix Tab + Sidebar + Bottom Nav at the same hierarchy level.
- Support iOS swipe-back and Android predictive back without conflict.
- Use breadcrumbs for 3+ level deep hierarchies on web.
- Dangerous actions (delete account, logout) are visually and spatially separated from normal nav.
- When a nav destination is unavailable, explain why — don't silently hide it.
- Core navigation stays reachable from deep pages; don't hide it inside sub-flows.
- Each screen should have only one primary CTA; secondary actions are visually subordinate.

---

## Charts & Data

- Match chart type to data: trend → line, comparison → bar, proportion → pie/donut.
- No pie/donut for more than 5 categories — use a bar chart.
- Always show a legend positioned near the chart, not hidden below a scroll fold.
- Show tooltips on hover (web) or tap (mobile) with exact values.
- Label axes with units; avoid truncated or rotated labels on mobile.
- Grid lines should be low-contrast (e.g. gray-200) so they don't compete with data.
- Use accessible colour palettes; never rely on red/green pairs alone (colourblind users).
- Supplement colour with patterns, textures, or shapes for screen-reader and colourblind users.
- Provide a text summary or `aria-label` describing the chart's key insight for screen readers.
- Also provide a table alternative for data-heavy charts.
- Interactive chart elements (points, bars, slices) must be keyboard-navigable.
- Show skeleton/shimmer while chart data loads — never show an empty axis frame.
- Show empty state with message and guidance when no data exists.
- For 1000+ data points, aggregate or sample; provide drill-down for detail.
- Chart entrance animations must respect `prefers-reduced-motion`.

---

## Your Output Goes Into the Page Brief

Your decisions — block assignments, contrast checks, aesthetic direction, animation plan — are recorded in `.claude/templates/page-brief.md` before any code is written. Fill the brief completely. The Pre-Code Sign-Off checklist in the brief is your final gate before coding begins.

---

## Component Registry — Use Before Building

Before writing any section from scratch, check `components/blocks/REGISTRY.md`.

For every section on the page:
1. Find the matching block (hero, features, proof, CTA, team, stats, etc.)
2. Import it and customise the content — do not rebuild what already exists
3. Only build custom if no block fits, and say so explicitly

If the copywriter has already assigned a block to each section, honour those choices. If they haven't, make the assignments yourself before coding.

---

## Aesthetic Direction

Before coding, commit to a clear visual direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist, retro-futuristic, luxury, playful, editorial, brutalist, art deco, soft/pastel, industrial, etc.
- **Differentiation**: What makes this UNFORGETTABLE?

Then implement working code that is production-grade, visually striking, and cohesive. NEVER use generic AI aesthetics — no overused font families (Inter, Roboto), clichéd purple gradients, or predictable layouts.

## Visual Guidelines

- **Typography**: Distinctive font choices. Avoid Inter, Roboto, Arial. Max 2 font families.
- **Color**: Dominant colors with sharp accents. Use CSS variables. Brand colors for primary actions only.
- **Motion**: High-impact moments — page load reveals, scroll triggers, hover states. Under 300ms.
- **Layout**: Unexpected layouts. Asymmetry. Grid-breaking. Generous negative space.
- **Depth**: Gradient meshes, noise textures, geometric patterns, layered transparencies.
- **Imagery**: Feature cards need large illustration areas (60%+), not just text with a tiny icon.
