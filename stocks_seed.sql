ALTER TABLE stocks ADD COLUMN IF NOT EXISTS warehouse TEXT NOT NULL DEFAULT 'manual';
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS source VARCHAR(20) NOT NULL DEFAULT 'manual';
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS stock_type VARCHAR(20) NOT NULL DEFAULT 'fbs';
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS moysklad_qty INTEGER DEFAULT NULL;

ALTER TABLE stocks ALTER COLUMN sku TYPE TEXT USING sku::text;
ALTER TABLE stocks ALTER COLUMN wb_nm_id TYPE TEXT USING wb_nm_id::text;
ALTER TABLE stocks ALTER COLUMN warehouse_id DROP NOT NULL;

ALTER TABLE stocks DROP CONSTRAINT IF EXISTS stocks_pkey;
ALTER TABLE stocks ADD PRIMARY KEY (sku, warehouse);

INSERT INTO stocks (sku, warehouse, quantity, source, stock_type) VALUES
('CF-001', 'WB Коледино', 120, 'wb', 'fbo'),
('CF-001', 'WB Электросталь', 80, 'wb', 'fbo'),
('CF-002', 'WB Коледино', 95, 'wb', 'fbo'),
('CF-003', 'WB Подольск', 200, 'wb', 'fbo'),
('CF-004', 'WB Коледино', 340, 'wb', 'fbo'),
('CF-001', 'Ozon Хоругвино', 50, 'ozon', 'fbo'),
('CF-002', 'Ozon Хоругвино', 30, 'ozon', 'fbo'),
('CF-003', 'Ozon Нижний Новгород', 150, 'ozon', 'fbo'),
('CF-001', 'Красногорск', 847, 'local', 'own'),
('CF-002', 'Красногорск', 312, 'local', 'own'),
('CF-003', 'Челябинск', 490, 'local', 'own'),
('CF-004', 'Челябинск', 500, 'local', 'own'),
('CF-005', 'Красногорск', 14, 'local', 'own')
ON CONFLICT (sku, warehouse) DO UPDATE SET
    quantity = EXCLUDED.quantity,
    source = EXCLUDED.source,
    stock_type = EXCLUDED.stock_type;
