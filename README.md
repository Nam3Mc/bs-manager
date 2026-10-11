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
- **Product images** — attach a photo URL per product

### For customers (Client role)
- **Marketplace** — browse a list of all active stores
- **Store page** — a themed storefront with hero image, description, and
  product grid
- **Cart** — add, update, and remove products
- **Checkout** — place an order; stock is reserved automatically
- **Order history** — view past orders and their status

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

## Getting Started

### Prerequisites

- Node.js 20+
- A Neon database (or the Vercel Neon integration)
- A Vercel account for deployment

### Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Nam3Mc/bs-manager.git
   cd bs-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Pull environment variables from Vercel (requires `vercel link`):

   ```bash
   vercel env pull .env.local
   ```

4. Apply the database schema (one time). Open the Neon SQL editor at
   [console.neon.tech](https://console.neon.tech), paste the contents of
   `db/schema.sql`, and run it.

5. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Pooled Neon connection string used by the app |
| `DATABASE_URL_UNPOOLED` | Direct connection, used for schema changes only |
| `AUTH_SECRET` | Secret used to sign JWT session tokens |

### Deployment

The project deploys automatically on Vercel:

1. Push to `main` → production deploy
2. Open a PR → preview deploy
3. Schema changes: edit `db/schema.sql`, commit, apply in the Neon SQL editor

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

```
User ──owns──> Business ──operates──> Store ──sells──> Product
                 │                                       │
                 └──stocks──> Item <──product_items──────┘
                                 │
User ──has──> CartItem ──────────┘
User ──places──> Order ──contains──> OrderLine ──references──> Product
```

| Entity | Purpose |
|---|---|
| `users` | Accounts with role `ADMIN` or `CLIENT` |
| `businesses` | Owned by an admin; holds the NIT and contact info |
| `stores` | Storefronts with slug, hero, and theme preset |
| `items` | Raw ingredients with unit, stock, and unit cost |
| `products` | Sellable SKUs with price and image |
| `product_items` | Recipe join table — product → item + quantity |
| `cart_items` | Per-user cart rows |
| `orders` | Placed orders with subtotal, tax, total, status |
| `order_lines` | Snapshot of product + quantity + price at purchase time |

The full schema lives in [`db/schema.sql`](./db/schema.sql) and is applied
directly in the Neon SQL editor.

## API Routes

All routes live under `app/api/**/route.ts` and follow the same pattern:
`export const dynamic = "force-dynamic"`, input validation up front,
`try/catch` around the query, generic error message to the client,
`RETURNING *` on writes.

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account and set a session cookie |
| POST | `/api/auth/login` | Sign in and set a session cookie |
| POST | `/api/auth/logout` | Clear the session cookie |
| GET | `/api/auth/me` | Return the current session user |

The admin CRUD operations (items, products, stores, orders) are implemented
as Server Actions rather than API routes. This is the modern Next.js
pattern — see `lib/actions/*.ts`.

## Design System

### Color palette

| Role | Value | Usage |
|---|---|---|
| Brand (teal) | `#0D9488` | Identity, nav, links, focus, primary actions |
| Commerce accent (amber) | `#F59E0B` | "Add to cart", "Checkout", prices — max 2 per screen |
| Neutrals | slate 50–950 | Everything else |
| Success | `#059669` | Stock OK |
| Warning | `#D97706` | Low stock |
| Danger | `#DC2626` | Out of stock, errors |

Store theme presets: bakery, butcher, produce, cafe, seafood, boutique.
Each preset overrides only the brand ramp — neutrals and text stay global
so contrast is guaranteed.

### Typography

| Role | Font | Weights |
|---|---|---|
| Display (h1–h3) | Space Grotesk | 600, 700 |
| Body / UI | Inter | 400, 600 |
| Codes (SKU, NIT, IDs) | JetBrains Mono | 400, 500 |

Weights are restricted to 400 / 600 / 700. All numeric content uses
`font-variant-numeric: tabular-nums`.

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

## Author

**Dreiser Morales**
- GitHub: [@Nam3Mc](https://github.com/Nam3Mc)
- Course: WDD 430 — Web Full-Stack Development, BYU-Idaho

## License

This project was created for coursework at BYU-Idaho.