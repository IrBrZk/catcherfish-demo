"""
Price sync for CatcherFish.

Recalculates marketplace prices from the master retail price and stores
price history in PostgreSQL.
"""

from __future__ import annotations

import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from database.db import connection, fetch_all
from bot.telegram_bot import bot


def now_text() -> str:
    return datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %Z")


def ensure_tables() -> None:
    with connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS price_history (
                    id SERIAL PRIMARY KEY,
                    product_sku VARCHAR(50) NOT NULL,
                    marketplace VARCHAR(20),
                    price_before DECIMAL(10,2),
                    price_after DECIMAL(10,2),
                    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """
            )
            cur.execute(
                """
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
                """
            )


def load_products() -> List[Dict[str, Any]]:
    return fetch_all(
        """
        SELECT sku, price_retail, price_wb, price_ozon, is_published, status
        FROM products
        WHERE status = 'active' AND is_published = TRUE
        ORDER BY updated_at DESC, sku ASC
        """
    )


def recalculate_prices(products: List[Dict[str, Any]]) -> int:
    changed = 0
    with connection() as conn:
        with conn.cursor() as cur:
            for product in products:
                sku = str(product["sku"])
                base_price = float(product.get("price_retail") or 0)
                if base_price <= 0:
                    continue
                price_ozon = round(base_price * 1.10, 2)
                price_wb = round(base_price * 1.15, 2)
                before_wb = float(product.get("price_wb") or 0)
                before_ozon = float(product.get("price_ozon") or 0)
                if round(before_wb, 2) != price_wb:
                    cur.execute(
                        "UPDATE products SET price_wb = %s, updated_at = NOW() WHERE sku = %s",
                        (price_wb, sku),
                    )
                    cur.execute(
                        """
                        INSERT INTO price_history (product_sku, marketplace, price_before, price_after, changed_at)
                        VALUES (%s, %s, %s, %s, NOW())
                        """,
                        (sku, "wb", before_wb, price_wb),
                    )
                    changed += 1
                if round(before_ozon, 2) != price_ozon:
                    cur.execute(
                        "UPDATE products SET price_ozon = %s, updated_at = NOW() WHERE sku = %s",
                        (price_ozon, sku),
                    )
                    cur.execute(
                        """
                        INSERT INTO price_history (product_sku, marketplace, price_before, price_after, changed_at)
                        VALUES (%s, %s, %s, %s, NOW())
                        """,
                        (sku, "ozon", before_ozon, price_ozon),
                    )
                    changed += 1
    return changed


def write_sync_log(status: str, records_count: int, duration_ms: int, error_message: str = "") -> None:
    with connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO sync_log (task_type, source, target, status, records_count, duration_ms, error_message, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                """,
                ("price_sync", "database", "database", status, records_count, duration_ms, error_message),
            )


def main() -> int:
    start = time.time()
    try:
        ensure_tables()
        products = load_products()
        changed = recalculate_prices(products)
        elapsed_ms = int((time.time() - start) * 1000)
        write_sync_log("success", changed, elapsed_ms)
        bot.send_success(
            "Синхронизация цен",
            f"Обновлено изменений: {changed}\nВремя: {elapsed_ms} ms",
        )
        print({"changed": changed, "duration_ms": elapsed_ms})
        return 0
    except Exception as exc:
        elapsed_ms = int((time.time() - start) * 1000)
        write_sync_log("error", 0, elapsed_ms, error_message=f"{type(exc).__name__}: {exc}")
        bot.send_error("Синхронизация цен", exc)
        raise


if __name__ == "__main__":
    raise SystemExit(main())
