BEGIN;

ALTER TABLE IF EXISTS orders
    ADD COLUMN IF NOT EXISTS user_id INTEGER,
    ADD COLUMN IF NOT EXISTS delivery_cost NUMERIC(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS comment TEXT,
    ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS registered_after_order BOOLEAN DEFAULT FALSE;

ALTER TABLE IF EXISTS orders
    ALTER COLUMN total_amount TYPE NUMERIC(10,2);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'orders_user_id_fkey'
    ) THEN
        ALTER TABLE orders
            ADD CONSTRAINT orders_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES users(id);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS guest_sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(100) UNIQUE NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    cart_items JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_orders_guest ON orders(customer_phone, customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

COMMIT;
