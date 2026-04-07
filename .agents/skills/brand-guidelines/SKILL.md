---
name: brand-guidelines
description: Brand identity and visual styling guide. Customize these colors and fonts for your project.
---

# Brand Guidelines

## Overview

Customize these values for your project's brand identity.

## Colors

**Main Colors:**
- Primary: `hsl(191, 82%, 30%)` — `#0E768C` teal (change to your brand color)
- Background: `#FFFFFF` white / `#1A1A1A` dark
- Foreground: `#1A1A1A` dark / `#FAFAFA` light
- Muted: `#F5F5F0` warm beige
- Border: `#E5E5E0` light beige-gray

**Accent Colors:**
- Destructive: `hsl(0, 65%, 50%)` — red for errors
- Customize accent-warm and accent-cool in globals.css

## Typography

- **Headings**: Bricolage Grotesque (display font, loaded from Google Fonts)
- **Body Text**: Geist Sans (system-quality sans-serif)
- **Code**: Geist Mono (monospace)

## How to Customize

1. Edit CSS variables in `app/globals.css` under `:root` and `.dark`
2. Change the heading font in `app/layout.tsx` (replace Bricolage_Grotesque import)
3. Update `tailwind.config.ts` fontFamily if changing font variable names
4. Replace `/public/favicon.svg` with your logo

## Design Principles

- Clean, minimal aesthetic with intentional color accents
- Dark mode support via CSS variables
- Consistent spacing with Tailwind's spacing scale
- Rounded corners via `--radius` variable
- Subtle shadows and borders, never heavy drop shadows
