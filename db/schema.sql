-- ============================================================
-- BS-Manager — initial schema
-- Target: PostgreSQL 15+ (Neon default)
-- ============================================================

-- gen_random_uuid() is built into PG13+, no extension needed.
-- (If your Neon instance is older, run: CREATE EXTENSION IF NOT EXISTS pgcrypto;)

-- ---------- ENUMS ----------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ADMIN', 'CLIENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE item_unit AS ENUM ('G', 'KG', 'ML', 'L', 'UNIT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'CLIENT',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (lower(email));

-- ---------- BUSINESSES ----------
-- One admin owns one or more businesses.
CREATE TABLE IF NOT EXISTS businesses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  nit         TEXT,
  address     TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS businesses_owner_idx ON businesses (owner_id);

-- ---------- STORES ----------
-- One business has one or more storefronts.
CREATE TABLE IF NOT EXISTS stores (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id    UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  slug           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  description    TEXT,
  address        TEXT,
  nit            TEXT,
  contact_email  TEXT,
  contact_phone  TEXT,

  -- design customization (curated, never free-form hex)
  theme_preset     TEXT NOT NULL DEFAULT 'default',
  background_style TEXT NOT NULL DEFAULT 'plain',
  hero_image_url   TEXT,
  hero_headline    TEXT,
  hero_subtext     TEXT,

  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stores_business_idx ON stores (business_id);
CREATE INDEX IF NOT EXISTS stores_slug_idx ON stores (slug);

-- ---------- ITEMS (raw ingredients / stock) ----------
-- Belong to a business (shared across all its stores).
CREATE TABLE IF NOT EXISTS items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id    UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  unit           item_unit NOT NULL DEFAULT 'G',
  current_stock  NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  unit_cost      NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  image_url      TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS items_business_idx ON items (business_id);

-- ---------- PRODUCTS (sellable SKUs) ----------
-- Belong to a store. Price is what the client pays.
CREATE TABLE IF NOT EXISTS products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id     UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  image_url    TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_store_idx ON products (store_id) WHERE is_active;

-- ---------- PRODUCT ↔ ITEM (recipe / bill of materials) ----------
-- 500g corn product = 1 item (corn) × quantity 500 (in g).
CREATE TABLE IF NOT EXISTS product_items (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  item_id    UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
  quantity   NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (product_id, item_id)
);

CREATE INDEX IF NOT EXISTS product_items_item_idx ON product_items (item_id);

-- ---------- CART ----------
CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  added_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS cart_items_user_idx ON cart_items (user_id);

-- ---------- ORDERS ----------
CREATE TABLE IF NOT EXISTS orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  store_id    UUID NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
  status      order_status NOT NULL DEFAULT 'PENDING',
  subtotal    NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax         NUMERIC(12,2) NOT NULL DEFAULT 0,
  total       NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_idx  ON orders (user_id);
CREATE INDEX IF NOT EXISTS orders_store_idx ON orders (store_id);

-- ---------- ORDER LINES ----------
CREATE TABLE IF NOT EXISTS order_lines (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_lines_order_idx ON order_lines (order_id);

-- ---------- updated_at trigger ----------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','businesses','stores','items','products','orders'] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %I_set_updated_at ON %I;
       CREATE TRIGGER %I_set_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
      t, t, t, t
    );
  END LOOP;
END $$;