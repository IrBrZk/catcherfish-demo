"""
Order sync for CatcherFish.

Processes pending order tasks from sync_queue and persists them into the
master orders table. This keeps website, WB and Ozon order data in one place.
"""

from __future__ import annotations

import json
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from bot.telegram_bot import bot
from database.db import connection, fetch_all


def now_text() -> str:
    return datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %Z")


def ensure_tables() -> None:
    with connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS orders (
                    id SERIAL PRIMARY KEY,
                    order_id VARCHAR(50) UNIQUE NOT NULL,
                    marketplace VARCHAR(20) NOT NULL,
                    status VARCHAR(30) DEFAULT 'new',
                    total_amount DECIMAL(10,2),
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
                """
            )
            cur.execute(
                """
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


def load_pending_tasks(limit: int = 100) -> List[Dict[str, Any]]:
    return fetch_all(
        """
        SELECT id, task_type, target_system, priority, retry_count, data
        FROM sync_queue
        WHERE status = 'pending'
        ORDER BY priority ASC, created_at ASC, id ASC
        LIMIT %s
        """,
        (limit,),
    )


def process_task(task: Dict[str, Any]) -> bool:
    data = task.get("data") or {}
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            data = {}

    order_id = str(data.get("order_id") or data.get("id") or "")
    marketplace = str(data.get("marketplace") or task.get("target_system") or "website")
    if not order_id:
        order_id = f"{marketplace.upper()}-{task['id']}"

    items = data.get("items") or []
    total_amount = data.get("total_amount") or data.get("total") or 0

    with connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO orders (
                    order_id, marketplace, status, total_amount,
                    customer_name, customer_phone, customer_email,
                    delivery_method, delivery_address, payment_method,
                    payment_status, items, tracking_number,
                    created_at, updated_at
                )
                VALUES (
                    %s, %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s::jsonb, %s,
                    NOW(), NOW()
                )
                ON CONFLICT (order_id) DO UPDATE SET
                    marketplace = EXCLUDED.marketplace,
                    status = EXCLUDED.status,
                    total_amount = EXCLUDED.total_amount,
                    customer_name = EXCLUDED.customer_name,
                    customer_phone = EXCLUDED.customer_phone,
                    customer_email = EXCLUDED.customer_email,
                    delivery_method = EXCLUDED.delivery_method,
                    delivery_address = EXCLUDED.delivery_address,
                    payment_method = EXCLUDED.payment_method,
                    payment_status = EXCLUDED.payment_status,
                    items = EXCLUDED.items,
                    tracking_number = EXCLUDED.tracking_number,
                    updated_at = NOW()
                """,
                (
                    order_id,
                    marketplace,
                    str(data.get("status") or "new"),
                    total_amount,
                    data.get("customer_name"),
                    data.get("customer_phone"),
                    data.get("customer_email"),
                    data.get("delivery_method"),
                    data.get("delivery_address"),
                    data.get("payment_method"),
                    data.get("payment_status") or "pending",
                    json.dumps(items),
                    data.get("tracking_number"),
                ),
            )
            cur.execute(
                """
                UPDATE sync_queue
                SET status = 'done',
                    completed_at = NOW(),
                    error_message = NULL
                WHERE id = %s
                """,
                (task["id"],),
            )
    return True


def write_sync_log(status: str, records_count: int, duration_ms: int, error_message: str = "") -> None:
    with connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO sync_log (task_type, source, target, status, records_count, duration_ms, error_message, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                """,
                ("orders_sync", "queue", "postgresql", status, records_count, duration_ms, error_message),
            )


def main() -> int:
    start = time.time()
    try:
        ensure_tables()
        tasks = load_pending_tasks()
        processed = 0
        for task in tasks:
            try:
                process_task(task)
                processed += 1
            except Exception as exc:
                with connection() as conn:
                    with conn.cursor() as cur:
                        cur.execute(
                            """
                            UPDATE sync_queue
                            SET status = 'error',
                                retry_count = retry_count + 1,
                                error_message = %s
                            WHERE id = %s
                            """,
                            (f"{type(exc).__name__}: {exc}", task["id"]),
                        )
        elapsed_ms = int((time.time() - start) * 1000)
        write_sync_log("success", processed, elapsed_ms)
        bot.send_success(
            "Синхронизация заказов",
            f"Обработано задач: {processed}\nВремя: {elapsed_ms} ms",
        )
        print({"processed": processed, "duration_ms": elapsed_ms})
        return 0
    except Exception as exc:
        elapsed_ms = int((time.time() - start) * 1000)
        write_sync_log("error", 0, elapsed_ms, error_message=f"{type(exc).__name__}: {exc}")
        bot.send_error("Синхронизация заказов", exc)
        raise


if __name__ == "__main__":
    raise SystemExit(main())
