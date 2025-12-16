DO $$ BEGIN CREATE TYPE role AS ENUM ('MANAGER', 'EMPLOYEE', 'PURCHASER');

EXCEPTION
WHEN duplicate_object THEN NULL;

END $$;

--User table
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    name text NOT NULL,
    role role NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- ITEMS TABLE (inventory items)
CREATE TABLE IF NOT EXISTS items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sku text UNIQUE NOT NULL,
    name text NOT NULL,
    description text,
    unit text NOT NULL,
    cost numeric(12, 2) NOT NULL,
    in_stock integer NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- ORDER STATUS ENUM (state of an order)
DO $$ BEGIN CREATE TYPE order_status AS ENUM (
    'DRAFT',
    'SENT_TO_PURCHASER',
    'PARTIALLY_PURCHASED',
    'COMPLETED'
);

EXCEPTION
WHEN duplicate_object THEN NULL;

END $$;

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by_id uuid NOT NULL REFERENCES users(id),
    status order_status NOT NULL DEFAULT 'DRAFT',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- ORDER ITEMS TABLE (items within an order)
CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES items(id),
    quantity integer NOT NULL CHECK (quantity > 0)
);

-- PURCHASE BATCHES TABLE (one purchase action)
CREATE TABLE IF NOT EXISTS purchase_batches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- PURCHASE LINES TABLE (what was bought)
CREATE TABLE IF NOT EXISTS purchase_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id uuid NOT NULL REFERENCES purchase_batches(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES items(id),
    ordered_qty integer NOT NULL DEFAULT 0,
    purchased_qty integer NOT NULL CHECK (purchased_qty >= 0),
    order_item_id uuid REFERENCES order_items(id)
);

-- RECEIPTS TABLE (confirmation when things arrive)
CREATE TABLE IF NOT EXISTS receipts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by_id uuid NOT NULL REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- RECEIPT LINES TABLE (items + quantities received)
CREATE TABLE IF NOT EXISTS receipt_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id uuid NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES items(id),
    received_qty integer NOT NULL CHECK (received_qty >= 0),
    purchase_line_id uuid REFERENCES purchase_lines(id)
);

-- INDEXES to improve the performance of queries
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_item ON order_items(item_id);
CREATE INDEX IF NOT EXISTS idx_purchase_lines_item ON purchase_lines(item_id);
CREATE INDEX IF NOT EXISTS idx_receipt_lines_item ON receipt_lines(item_id);