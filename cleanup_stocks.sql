-- Cleanup old stock noise while keeping real WB, Ozon and local rows.
-- Run on VPS:
--   psql -h localhost -U catcherfish_user -d catcherfish_db -f cleanup_stocks.sql

BEGIN;

DELETE FROM stocks
WHERE source = 'manual'
   OR COALESCE(quantity, 0) = 0;

COMMIT;
