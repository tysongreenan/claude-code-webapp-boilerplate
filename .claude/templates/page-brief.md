# Page Brief — [Page Name]

Fill this out completely before writing any code. Every blank is a decision that must be made consciously. Do not skip fields.

---

## 1. Intent (Copywriter)

| Field | Value |
|---|---|
| Page type | e.g. Service page, Landing page, About page |
| Primary keyword intent | The one search phrase this page targets |
| Target reader | Who lands here and what are they afraid of? |
| One-line promise | What the page guarantees the reader |
| Primary CTA | The single action you want them to take |

---

## 2. Section Plan (Copywriter + Designer)

For every section: write the copy intent, assign a block from the registry, declare the background, choose the text colour, and verify contrast passes 4.5:1 before moving on.

| # | Section | Copy intent | Block | Background | Text colour | Contrast ✓/✗ |
|---|---------|-------------|-------|------------|-------------|--------------|
| 1 | Hero | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |
| 6 | FAQ | | Custom accordion | | | |
| 7 | Final CTA | | | | | |

**Rules for this table:**
- Block must be a real path from `components/blocks/REGISTRY.md` or `Custom (reason: …)`
- Background must be a specific colour or Tailwind class (e.g. `bg-stone-900`, `#7A3B4E`, `bg-white`)
- Text colour must be specific (e.g. `text-white`, `text-stone-900`, `text-stone-600`)
- Contrast column: write ✓ if it passes 4.5:1, ✗ if it fails. If ✗, fix it before proceeding — do not move to coding with a failing row.

**Common failures to watch:**
- `text-white/70` or lower on dark backgrounds → use `text-white/90` minimum
- `text-stone-400` on `bg-stone-800` → fails
- Mid-tone brand colour text on white → check it
- Any grey text on a coloured background → check it

---

## 3. Design Decisions (Designer)

| Field | Value |
|---|---|
| Aesthetic direction | e.g. Luxury editorial, Minimal brutalist, Warm professional |
| Primary font | |
| Accent colour | Hex value |
| Max font sizes used | Must be ≤ 3 |
| Animation plan | What animates, duration, easing |
| Any blocks being customised | List deviations from default block |

---

## 4. Button Labels (Copywriter)

List every CTA button on the page. No generic labels allowed.

| Location | Label | ✓ Specific? |
|---|---|---|
| Hero primary | | |
| Hero secondary | | |
| Section CTA | | |
| Final CTA primary | | |
| Final CTA secondary | | |

**Hard fails:** Submit, Learn More, Click Here, Get Started (alone), See More, All [nouns]

---

## 5. Pre-Code Sign-Off

Work through this checklist. Do not begin coding until every item is checked.

- [ ] Every section has a block assigned (or `Custom` with a reason)
- [ ] Every row in the section table has a contrast check — no ✗ rows remain
- [ ] No generic button labels
- [ ] FAQ section included (mandatory for service/tool pages)
- [ ] Final CTA section included — page does not end with FAQ or footer
- [ ] Primary CTA appears in hero AND final CTA (minimum)
- [ ] Max 3 font sizes confirmed
- [ ] Mobile-first layout confirmed for each section
- [ ] No info hidden behind hover-only states
- [ ] Agitation / Problem section present (service pages)
- [ ] Process / How it works section present (service pages)
