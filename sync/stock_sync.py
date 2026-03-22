"""
WB stock sync for CatcherFish.

This sync pulls WB cards with positive stock, normalizes them into the
master PostgreSQL schema and keeps stock totals as the source of truth.
"""

from __future__ import annotations

import json
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import requests

from config import settings
from database.db import connection, execute, fetch_all, fetch_one
from integrations.wb import WildberriesClient, extract_size_quantity, first_photo_url


def now_text() -> str:
    return datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %Z")


def send_telegram(message: str) -> None:
    token = settings.telegram.bot_token
    chat_id = settings.telegram.chat_id
    if not token or not chat_id:
        return
    try:
        requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={"chat_id": chat_id, "text": message},
            timeout=15,
        )
    except requests.RequestException:
        pass


def ensure_new_schema() -> None:
    with connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS products (
                    id SERIAL PRIMARY KEY,
                    sku VARCHAR(50) UNIQUE NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    category_id INTEGER,
                    category_name VARCHAR(100),
                    price_buy DECIMAL(10,2),
                    price_retail DECIMAL(10,2),
                    price_ozon DECIMAL(10,2),
                    price_wb DECIMAL(10,2),
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
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS product_mapping (
                    id SERIAL PRIMARY KEY,
                    sku VARCHAR(50) NOT NULL,
                    marketplace VARCHAR(20) NOT NULL,
                    external_id VARCHAR(100) NOT NULL,
                    last_sync TIMESTAMP,
                    UNIQUE(sku, marketplace)
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS stock_history (
                    id SERIAL PRIMARY KEY,
                    product_sku VARCHAR(50) NOT NULL,
                    marketplace VARCHAR(20),
                    stock_before INTEGER,
                    stock_after INTEGER,
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


def infer_category_name(card: Dict[str, Any]) -> str:
    text = " ".join(
        str(card.get(field) or "")
        for field in ("title", "description", "brand")
    ).lower()
    if any(k in text for k in ("горел", "плитк", "газ", "ns 509", "ns 502", "ns100", "ns06", "m-100")):
        return "Снаряжение"
    if any(k in text for k in ("палат", "обогрев", "shelter", "camp", "турист")):
        return "Туризм"
    if any(k in text for k in ("лодк", "boat")):
        return "Транспорт"
    if any(k in text for k in ("блесн", "снаст", "грузил", "вертлюг", "карабин", "отводн", "fishing")):
        return "Рыбалка"
    return "Каталог"


def card_total_stock(card: Dict[str, Any]) -> int:
    return sum(extract_size_quantity(size) for size in (card.get("sizes") or []))


def normalize_cards(cards: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    result: List[Dict[str, Any]] = []
    for card in cards:
        total_stock = card_total_stock(card)
        if total_stock <= 0:
            continue
        nm_id = card.get("nmID")
        if nm_id is None:
            continue
        photo_urls = []
        for photo in card.get("photos") or []:
            url = first_photo_url(photo)
            if url:
                photo_urls.append(url)
        price_candidates = []
        for size in card.get("sizes") or []:
            for key in ("discountedPrice", "price"):
                value = size.get(key)
                if value is not None:
                    price_candidates.append(value)
                    break
            if price_candidates:
                break
        price_wb = float(price_candidates[0]) if price_candidates else None
        result.append(
            {
                "sku": str(nm_id),
                "wb_nmID": int(nm_id),
                "name": str(card.get("title") or f"WB {nm_id}"),
                "description": str(card.get("description") or ""),
                "category_id": 1,
                "category_name": infer_category_name(card),
                "price_buy": None,
                "price_retail": price_wb,
                "price_ozon": None,
                "price_wb": price_wb,
                "stock_total": total_stock,
                "stock_reserved": 0,
                "stock_available": total_stock,
                "status": "active",
                "is_published": True,
                "images": photo_urls,
            }
        )
    return result


def upsert_products(items: List[Dict[str, Any]]) -> int:
    if not items:
        return 0
    query = """
        INSERT INTO products (
            sku, name, description, category_id, category_name,
            price_buy, price_retail, price_ozon, price_wb,
            stock_total, stock_reserved, stock_available,
            wb_nmID, ozon_product_id, status, is_published, images, updated_at
        )
        VALUES (
            %(sku)s, %(name)s, %(description)s, %(category_id)s, %(category_name)s,
            %(price_buy)s, %(price_retail)s, %(price_ozon)s, %(price_wb)s,
            %(stock_total)s, %(stock_reserved)s, %(stock_available)s,
            %(wb_nmID)s, %(ozon_product_id)s, %(status)s, %(is_published)s, %(images)s, NOW()
        )
        ON CONFLICT (sku) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            category_id = EXCLUDED.category_id,
            category_name = EXCLUDED.category_name,
            price_buy = EXCLUDED.price_buy,
            price_retail = EXCLUDED.price_retail,
            price_ozon = EXCLUDED.price_ozon,
            price_wb = EXCLUDED.price_wb,
            stock_total = EXCLUDED.stock_total,
            stock_reserved = EXCLUDED.stock_reserved,
            stock_available = EXCLUDED.stock_available,
            wb_nmID = EXCLUDED.wb_nmID,
            ozon_product_id = EXCLUDED.ozon_product_id,
            status = EXCLUDED.status,
            is_published = EXCLUDED.is_published,
            images = EXCLUDED.images,
            updated_at = NOW()
    """
    with connection() as conn:
        with conn.cursor() as cur:
            for item in items:
                payload = dict(item)
                payload["images"] = json.dumps(payload.get("images") or [])
                cur.execute(query, payload)
    return len(items)


def load_previous_totals(skus: List[str]) -> Dict[str, int]:
    if not skus:
        return {}
    placeholders = ",".join(["%s"] * len(skus))
    rows = fetch_all(
        f"""
        SELECT sku, stock_total
        FROM products
        WHERE sku IN ({placeholders})
        """,
        tuple(skus),
    )
    return {str(row["sku"]): int(row.get("stock_total") or 0) for row in rows}


def upsert_stock_history(items: List[Dict[str, Any]], previous_totals: Dict[str, int], marketplace: str = "wb") -> int:
    if not items:
        return 0
    rows = []
    for item in items:
        rows.append(
            (
                item["sku"],
                marketplace,
                int(previous_totals.get(str(item["sku"]), 0)),
                int(item.get("stock_total") or 0),
            )
        )
    with connection() as conn:
        with conn.cursor() as cur:
            cur.executemany(
                """
                INSERT INTO stock_history (product_sku, marketplace, stock_before, stock_after, changed_at)
                VALUES (%s, %s, %s, %s, NOW())
                """,
                rows,
            )
    return len(rows)


def upsert_sync_log(status: str, records_count: int, duration_ms: int, error_message: str = "") -> None:
    with connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO sync_log (task_type, source, target, status, records_count, duration_ms, error_message, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                """,
                ("stock_sync", "wb", "postgresql", status, records_count, duration_ms, error_message),
            )


def sync_wb(limit: Optional[int] = None) -> Dict[str, Any]:
    ensure_new_schema()
    start = time.time()
    client = WildberriesClient()
    cards = client.fetch_cards(max_cards=limit or settings.wildberries.max_cards, positive_stock_only=True)
    items = normalize_cards(cards)
    previous_totals = load_previous_totals([item["sku"] for item in items])
    products_updated = upsert_products(items)
    stock_history_rows = upsert_stock_history(items, previous_totals, marketplace="wb")
    duration_ms = int((time.time() - start) * 1000)
    upsert_sync_log("success", products_updated, duration_ms)
    send_telegram(
        f"✅ WB sync complete\n"
        f"Товаров обновлено: {products_updated}\n"
        f"История остатков: {stock_history_rows}\n"
        f"Время: {now_text()}"
    )
    return {
        "products_updated": products_updated,
        "stock_history_rows": stock_history_rows,
        "duration_ms": duration_ms,
    }


def main() -> int:
    try:
        result = sync_wb()
        print(result)
        return 0
    except Exception as exc:
        duration_ms = 0
        try:
            upsert_sync_log("error", 0, duration_ms, error_message=f"{type(exc).__name__}: {exc}")
        except Exception:
            pass
        send_telegram(
            f"❌ WB sync error\nВремя: {now_text()}\nОшибка: {type(exc).__name__}: {exc}"
        )
        print(f"{type(exc).__name__}: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
