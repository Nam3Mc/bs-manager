# BS-Manager

**Easy Trakker for Professional Business Activities.**

BS-Manager is a web application that helps small business owners — bakeries,
fast-food shops, and food producers — manage inventory and production while
giving their customers a clean storefront to browse and order from.

Business owners track raw ingredients (items), define sellable products from
those ingredients (recipes), and publish a personalized storefront. Customers
browse a marketplace of stores, add products to a cart, and check out.

## Live Demo

- **Production:** https://bs-manager-psi.vercel.app/
- **Repository:** https://github.com/Nam3Mc/bs-manager
- **Project Board:** https://github.com/users/Nam3Mc/projects/3

## Team

Solo project for WDD 430 — Web Full-Stack Development, BYU-Idaho.

- **Dreiser Morales** — [@Nam3Mc](https://github.com/Nam3Mc)

## Features

### For business owners (Admin role)
- **Dashboard** — overview of items, products, and store status
- **Inventory management** — create, edit, and delete raw items (corn, flour,
  sugar) with units, current stock, and unit cost
- **Product builder** — compose sellable products from items. A "500 g Corn"
  product is defined by linking the Corn item with a quantity of 500.
  A "1000 g Corn" product uses the same item with a different quantity.
- **Store settings** — name, NIT, address, contact, hero image, headline,
  and a curated color theme preset for the storefront
- **Product images** — upload a photo per product

### For customers (Client role)
- **Marketplace** — browse a list of all active stores
- **Store page** — a themed storefront with hero image, description, and
  product grid
- **Cart** — add, update, and remove products
- **Checkout** — place an order
- **Order history** — view past orders

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Fonts | Space Grotesk (display), Inter (body), JetBrains Mono (codes) |
| Database | PostgreSQL on Neon |
| DB driver | `@neondatabase/serverless` (tagged-template SQL, no ORM) |
| Auth | JWT in httpOnly cookie, bcrypt password hashing |
| Deployment | Vercel |

## Architecture

### Three-layer design tokens

1. **Primitives** — raw color ramps (`brand-50…900`, `accent-*`, `ink-*`),
   defined in `@theme` inside `app/globals.css`
2. **Semantic tokens** — CSS variables (`--surface`, `--text`, `--brand`, …)
   that flip for dark mode and per-store themes
3. **Tailwind utilities** — `bg-surface`, `text-muted`, `border-line`,
   `bg-brand`, `bg-accent`

Components use **only layer-3 utilities**. There are no `bg-white`,
`text-slate-*`, or `border-gray-*` classes anywhere in the codebase. This
is what makes dark mode and per-store theming work without any
per-component overrides.

### Data model

## Known Issues & Opportunities

- **Image uploads are URL-based.** Items, products, and stores accept an image
  URL field. Real file upload (Vercel Blob or Cloudinary) is a planned
  enhancement.
- **Payment is simulated.** Checkout creates an order and reserves stock, but
  no payment processor is integrated. Real payment (Stripe) is a next step.
- **Reports window is fixed at 30 days.** A date-range picker is a natural
  improvement.
- **Out-of-stock products are visible.** Products with zero available stock
  still appear in the marketplace with an enabled Add button. The checkout
  guard catches the shortfall, but a UI hint would be better.
- **Order cancellation restores stock.** Handled automatically when an admin
  sets an order status to `Cancelled`.

## AI Agent Instructions

See [`.github/copilot-instructions.md`](./.github/copilot-instructions.md)
for the design system, data model, and coding conventions this project
follows. It is intended for GitHub Copilot and other AI coding assistants
so they generate project-consistent code.