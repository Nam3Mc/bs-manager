# BS-Manager — Copilot Instructions

## Stack
- Next.js (latest) with App Router, TypeScript strict
- Tailwind CSS v4 — CSS-first config in `app/globals.css`. There is **no** `tailwind.config.js`.
- Fonts via `next/font/google`: Inter (body), Space Grotesk (headings), JetBrains Mono (codes/prices)

## Design tokens — HARD RULES
**Never** use raw palette utilities in components. Forbidden:
`bg-white`, `bg-black`, `bg-gray-*`, `text-slate-*`, `border-gray-*`, `bg-teal-*`.

Use only semantic utilities:

| Purpose              | Utility |
|----------------------|---------|
| Page background      | `bg-surface` |
| Card / modal / raised | `bg-raised` |
| Sidebar / table head | `bg-sunken` |
| Row / nav hover      | `bg-hover` |
| Default border       | `border-line` |
| Strong border        | `border-line-strong` |
| Body text            | `text-content` |
| Secondary text       | `text-muted` |
| Placeholder / meta   | `text-subtle` |
| Brand fill           | `bg-brand` |
| Brand text/icon      | `text-brand` |
| Brand tinted bg      | `bg-brand-soft` |
| Text on brand        | `text-brand-contrast` |
| Commerce CTA         | `bg-accent` |
| Text on accent       | `text-accent-contrast` |
| Status               | `text-success` `text-warning` `text-danger` `text-info` |
| Focus ring           | `ring-ring` |

The raw `brand-50…900`, `accent-*`, and `ink-*` ramps exist for admin
charts and one-off tints only. In components, use the semantic names.

## Color usage
- `brand` (teal) = identity, nav, links, focus, primary admin actions.
- `accent` (amber) = **ONLY** "Add to cart", "Checkout", and price highlights.
  Maximum two `accent` elements per screen. Never place brand and accent on the same element.
- Never signal state with color alone — pair with an icon or label.

## Dark mode
- Class-based on `<html>`. The inline script in `app/layout.tsx` sets it before paint.
- Every component must look correct in both modes **without** a single `dark:` color override.
  Semantic vars handle it. `dark:` is only for opacity/brightness tweaks on images
  (e.g. `dark:brightness-90`).
- Never assume white or black backgrounds. Never use `bg-white` / `text-black`.
- Elevation in dark mode comes from **lighter surfaces**, not shadows.
  Use `bg-raised` over `bg-surface`. Do not stack `shadow-*` for depth in dark mode.

## Layout
- Container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- Admin content: `max-w-6xl`, compact density — `text-sm`, table rows `h-12`
- Marketplace: comfortable density — `text-base`, section padding `py-16`
- Spacing uses the 4px scale. No arbitrary values (`p-[13px]` is a bug).
- Radius: `rounded-lg` for inputs/buttons, `rounded-xl` for cards,
  `rounded-2xl` for hero panels, `rounded-full` for badges/avatars.

## Typography
- Weights: **400 / 600 / 700 only**. Never 300, never 500 for headings.
- `font-display` on h1–h3, `font-sans` for everything else,
  `font-mono` for SKU / NIT / order ID / barcode.
- **All numbers** (prices, quantities, stock, totals) get `className="num"` for tabular figures.

## Components
- Server Components by default. `"use client"` only for state, effects, event handlers.
- Reuse before creating: `components/ui/*` primitives —
  `Button`, `Input`, `Select`, `Textarea`, `Card`, `Badge`, `Modal`,
  `Dropdown`, `Table`, `EmptyState`, `Toast`, `Skeleton`, `Avatar`,
  `PriceDisplay`.
- `PriceDisplay` is the **only** place currency is formatted. Never call `toFixed`,
  `Intl.NumberFormat`, or string-concatenate a currency symbol inline.
- Every list renders an `<EmptyState>` when empty.
- Every async view renders a `<Skeleton>` while loading.
- Every interactive element is keyboard reachable and shows the global focus ring
  (base style). Never remove it.

## Accessibility
- Every `<Image>` has meaningful `alt`; decorative images use `alt=""`.
- Every form input has a `<label>`; errors use `aria-describedby` and `text-danger`.
- Contrast minimums: 4.5:1 for text, 3:1 for UI borders and icons.
- Motion: `duration-150` (hover), `duration-200` (menus), `duration-300` (modals).
  Never animate `width` or `height` — use `transform` / `opacity`.

## Data
- PostgreSQL on Neon. Driver: `@neondatabase/serverless` via `lib/db.ts`.
- **There is no ORM.** Every query uses the `sql` tagged template from `lib/db.ts`:
  ```ts
  import { sql } from "@/lib/db";
  const rows = await sql`SELECT * FROM products WHERE store_id = ${storeId}`;

## Store theming
- Each `Store` carries `themePreset`, `backgroundStyle`, `heroImageUrl`,
  `heroHeadline`, `heroSubtext`.
- Apply on the store page wrapper only:
  `<main data-store-theme={preset} data-store-bg={bg}>`.
- Never apply store theming to admin or auth routes.
- Admins pick from 6 curated presets — there is no free color picker.

## Naming
- Files: `kebab-case.tsx` (components) / `camelCase.ts` (utils).
- Components: `PascalCase`. Hooks: `useThing`. Types: `PascalCase`, no `I` prefix.
- Server Actions: verb-first, e.g. `createProduct`, `updateItemStock`.