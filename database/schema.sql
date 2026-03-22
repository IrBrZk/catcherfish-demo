-- CatcherFish Database Schema v2.0
-- PostgreSQL master database for website, admin panel, Telegram bot,
-- Wildberries sync, Ozon sync and site orders.
-- MySklad is intentionally excluded from this architecture.

BEGIN;

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER,
    category_name VARCHAR(100),
    price_buy NUMERIC(10,2),
    price_retail NUMERIC(10,2),
    price_ozon NUMERIC(10,2),
    price_wb NUMERIC(10,2),
    stock_total INTEGER DEFAULT 0,
    stock_reserved INTEGER DEFAULT 0,
    stock_available INTEGER DEFAULT 0,
    wb_nmID BIGINT,
    ozon_product_id BIGINT,
    status VARCHAR(20) DEFAULT 'active',
    is_published BOOLEAN DEFAULT TRUE,
    images JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    marketplace VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'new',
    total_amount NUMERIC(10,2),
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    delivery_method VARCHAR(50),
    delivery_address TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    items JSONB NOT NULL,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sync_queue (
    id SERIAL PRIMARY KEY,
    task_type VARCHAR(30) NOT NULL,
    target_system VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    priority INTEGER DEFAULT 5,
    retry_count INTEGER DEFAULT 0,
    data JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sync_log (
    id SERIAL PRIMARY KEY,
    task_type VARCHAR(30),
    source VARCHAR(30),
    target VARCHAR(30),
    status VARCHAR(20),
    records_count INTEGER,
    duration_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_mapping (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL,
    marketplace VARCHAR(20) NOT NULL,
    external_id VARCHAR(100) NOT NULL,
    last_sync TIMESTAMP,
    UNIQUE(sku, marketplace)
);

CREATE TABLE IF NOT EXISTS stock_history (
    id SERIAL PRIMARY KEY,
    product_sku VARCHAR(50) NOT NULL,
    marketplace VARCHAR(20),
    stock_before INTEGER,
    stock_after INTEGER,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    product_sku VARCHAR(50) NOT NULL,
    marketplace VARCHAR(20),
    price_before NUMERIC(10,2),
    price_after NUMERIC(10,2),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    items JSONB,
    total_amount NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_telegram_id BIGINT,
    event_type VARCHAR(50),
    message TEXT,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'customer',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketplace_settings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    api_key TEXT,
    client_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_sync TIMESTAMP,
    sync_interval_minutes INTEGER DEFAULT 5
);

CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_marketplace ON orders(marketplace);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_stock_history_sku ON stock_history(product_sku);

COMMIT;
