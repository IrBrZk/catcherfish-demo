"""
Синхронизация товаров WB → PostgreSQL catcherfish_db
Запуск: python sync_wb.py
Cron:   */15 * * * * /usr/bin/python3 /path/to/sync_wb.py
"""

from __future__ import annotations

import os
import sys
import time
from datetime import datetime
from decimal import Decimal
from itertools import islice
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence

import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import Json
import requests


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
load_dotenv()

WB_CONTENT_URL = "https://content-api.wildberries.ru/content/v2/get/cards/list"
WB_PRICES_URL = "https://discounts-prices-api.wildberries.ru/api/v2/list/goods/filter"
WB_WAREHOUSES_URL = "https://marketplace-api.wildberries.ru/api/v3/warehouses"
WB_STOCKS_URL = "https://marketplace-api.wildberries.ru/api/v3/stocks/{warehouse_id}"
TELEGRAM_URL = "https://api.telegram.org/bot{token}/sendMessage"


class SyncError(RuntimeError):
    pass


def env(name: str, default: Optional[str] = None, required: bool = False) -> str:
    value = os.getenv(name, default)
    if required and not value:
        raise SyncError(f"Missing required environment variable: {name}")
    return value or ""


def now_text() -> str:
    return datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %Z")


def connect_db():
    return psycopg2.connect(
        host=env("DB_HOST", required=True),
        port=env("DB_PORT", "5432", required=True),
        dbname=env("DB_NAME", required=True),
        user=env("DB_USER", required=True),
        password=env("DB_PASSWORD", required=True),
    )


def send_telegram_message(message: str) -> None:
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return

    try:
        requests.post(
            TELEGRAM_URL.format(token=token),
            json={"chat_id": chat_id, "text": message},
            timeout=15,
        )
    except requests.RequestException:
        pass


def request_json(
    session: requests.Session,
    method: str,
    url: str,
    *,
    headers: Dict[str, str],
    payload: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None,
    max_retries: int = 4,
) -> Any:
    last_error: Optional[Exception] = None
    for attempt in range(max_retries):
        try:
            response = session.request(
                method,
                url,
                headers=headers,
                json=payload,
                params=params,
                timeout=60,
            )
            if response.status_code == 429:
                time.sleep(min(2**attempt, 15))
                continue
            response.raise_for_status()
            if not response.text.strip():
                return None
            return response.json()
        except (requests.RequestException, ValueError) as exc:
            last_error = exc
            if attempt < max_retries - 1:
                time.sleep(min(2**attempt, 15))
                continue
            raise SyncError(f"HTTP request failed for {url}: {exc}") from exc
    raise SyncError(f"HTTP request failed for {url}: {last_error}")


def ensure_tables(conn) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS products (
                sku BIGINT PRIMARY KEY,
                wb_nm_id BIGINT NOT NULL UNIQUE,
                name TEXT,
                description TEXT,
                brand TEXT,
                photos JSONB NOT NULL DEFAULT '[]'::jsonb,
                price NUMERIC(14, 2),
                source TEXT NOT NULL DEFAULT 'wb',
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS stocks (
                sku BIGINT NOT NULL,
                wb_nm_id BIGINT NOT NULL,
                warehouse_id BIGINT NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 0,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                PRIMARY KEY (sku, warehouse_id)
            );
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS sync_log (
                id BIGSERIAL PRIMARY KEY,
                source TEXT NOT NULL DEFAULT 'wb',
                status TEXT NOT NULL,
                products_updated INTEGER NOT NULL DEFAULT 0,
                stocks_updated INTEGER NOT NULL DEFAULT 0,
                message TEXT,
                error_message TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
    conn.commit()


def fetch_cards(session: requests.Session, token: str) -> List[Dict[str, Any]]:
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    cards: List[Dict[str, Any]] = []
    cursor: Dict[str, Any] = {"limit": 100}

    while True:
        payload = {
            "settings": {
                "sort": {"ascending": True},
                "cursor": cursor,
                "filter": {"withPhoto": -1},
            }
        }
        data = request_json(session, "POST", WB_CONTENT_URL, headers=headers, payload=payload)
        batch = (data or {}).get("cards") or []
        cards.extend(batch)

        response_cursor = (data or {}).get("cursor") or {}
        if len(batch) < cursor["limit"]:
            break
        if not response_cursor.get("updatedAt") or not response_cursor.get("nmID"):
            break
        cursor = {
            "limit": 100,
            "updatedAt": response_cursor["updatedAt"],
            "nmID": response_cursor["nmID"],
        }

    return cards


def chunked(values: Sequence[int], size: int) -> Iterable[List[int]]:
    iterator = iter(values)
    while True:
        chunk = list(islice(iterator, size))
        if not chunk:
            return
        yield chunk


def fetch_prices(session: requests.Session, token: str, nm_ids: Sequence[int]) -> Dict[int, Decimal]:
    headers = {"Authorization": token, "Content-Type": "application/json"}
    prices: Dict[int, Decimal] = {}
    unique_nm_ids = list(dict.fromkeys(int(nm_id) for nm_id in nm_ids))

    for batch in chunked(unique_nm_ids, 1000):
        data = request_json(session, "POST", WB_PRICES_URL, headers=headers, payload={"nmList": batch})
        items = (((data or {}).get("data") or {}).get("listGoods")) or []
        for item in items:
            nm_id = item.get("nmID")
            sizes = item.get("sizes") or []
            if nm_id is None or not sizes:
                continue
            size = sizes[0]
            price_value = size.get("discountedPrice")
            if price_value is None:
                price_value = size.get("price")
            if price_value is None:
                continue
            prices[int(nm_id)] = Decimal(str(price_value))

    return prices


def fetch_warehouses(session: requests.Session, token: str) -> List[int]:
    headers = {"Authorization": token, "Content-Type": "application/json"}
    data = request_json(session, "GET", WB_WAREHOUSES_URL, headers=headers)
    warehouse_ids: List[int] = []
    for item in data or []:
        warehouse_id = item.get("id")
        if warehouse_id is not None:
            warehouse_ids.append(int(warehouse_id))
    return warehouse_ids


def fetch_stocks_for_warehouse(
    session: requests.Session,
    token: str,
    warehouse_id: int,
    chrt_ids: Sequence[int],
) -> Dict[int, int]:
    if not chrt_ids:
        return {}
    headers = {"Authorization": token, "Content-Type": "application/json"}
    url = WB_STOCKS_URL.format(warehouse_id=warehouse_id)
    data = request_json(
        session,
        "POST",
        url,
        headers=headers,
        payload={"chrtIds": list(chrt_ids)},
    )
    stocks = (data or {}).get("stocks") or []
    result: Dict[int, int] = {}
    for item in stocks:
        chrt_id = item.get("chrtId")
        amount = item.get("amount", 0)
        if chrt_id is None:
            continue
        result[int(chrt_id)] = int(amount or 0)
    return result


def extract_size_quantity(size: Dict[str, Any]) -> int:
    for key in ("quantity", "stock", "amount", "remain", "available", "balance"):
        value = size.get(key)
        if value is not None:
            try:
                return max(0, int(value))
            except (TypeError, ValueError):
                continue
    return 0


def upsert_products(conn, cards: Sequence[Dict[str, Any]], price_map: Dict[int, Decimal]) -> int:
    updated = 0
    with conn.cursor() as cur:
        for card in cards:
            nm_id = card.get("nmID")
            if nm_id is None:
                continue

            photos = []
            for photo in card.get("photos") or []:
                if isinstance(photo, dict):
                    photos.append(
                        photo.get("big")
                        or photo.get("c516x688")
                        or photo.get("square")
                        or photo.get("tm")
                    )
            photos = [photo for photo in photos if photo]

            price = price_map.get(int(nm_id))
            if price is None:
                sizes = card.get("sizes") or []
                if sizes:
                    size = sizes[0]
                    fallback_price = size.get("discountedPrice") or size.get("price")
                    if fallback_price is not None:
                        price = Decimal(str(fallback_price))

            cur.execute(
                """
                INSERT INTO products (sku, wb_nm_id, name, description, brand, photos, price, source, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'wb', NOW())
                ON CONFLICT (sku) DO UPDATE SET
                    wb_nm_id = EXCLUDED.wb_nm_id,
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    brand = EXCLUDED.brand,
                    photos = EXCLUDED.photos,
                    price = EXCLUDED.price,
                    source = EXCLUDED.source,
                    updated_at = NOW()
                """,
                (
                    int(nm_id),
                    int(nm_id),
                    card.get("title"),
                    card.get("description"),
                    card.get("brand"),
                    Json(photos),
                    price,
                ),
            )
            updated += 1

    conn.commit()
    return updated


def upsert_stocks(
    conn,
    cards: Sequence[Dict[str, Any]],
    warehouses: Sequence[int],
    session: requests.Session,
    token: str,
) -> int:
    card_by_chrt_id: Dict[int, int] = {}
    card_fallback_qty: Dict[int, int] = {}
    for card in cards:
        nm_id = card.get("nmID")
        if nm_id is None:
            continue
        for size in card.get("sizes") or []:
            chrt_id = size.get("chrtID")
            if chrt_id is not None:
                chrt_id_int = int(chrt_id)
                card_by_chrt_id[chrt_id_int] = int(nm_id)
                card_fallback_qty[int(nm_id)] = card_fallback_qty.get(int(nm_id), 0) + extract_size_quantity(size)

    if not warehouses or not card_by_chrt_id:
        if not card_fallback_qty:
            return 0
        with conn.cursor() as cur:
            for nm_id, quantity in card_fallback_qty.items():
                cur.execute(
                    """
                    INSERT INTO stocks (sku, wb_nm_id, warehouse_id, quantity, updated_at)
                    VALUES (%s, %s, %s, %s, NOW())
                    ON CONFLICT (sku, warehouse_id) DO UPDATE SET
                        wb_nm_id = EXCLUDED.wb_nm_id,
                        quantity = EXCLUDED.quantity,
                        updated_at = NOW()
                    """,
                    (nm_id, nm_id, 0, quantity),
                )
        conn.commit()
        return len(card_fallback_qty)

    chrt_ids = list(card_by_chrt_id.keys())
    total_updated = 0
    total_nonzero = 0

    with conn.cursor() as cur:
        for warehouse_id in warehouses:
            stock_map = fetch_stocks_for_warehouse(session, token, warehouse_id, chrt_ids)
            for chrt_id, nm_id in card_by_chrt_id.items():
                quantity = stock_map.get(chrt_id, 0)
                if quantity > 0:
                    total_nonzero += 1
                cur.execute(
                    """
                    INSERT INTO stocks (sku, wb_nm_id, warehouse_id, quantity, updated_at)
                    VALUES (%s, %s, %s, %s, NOW())
                    ON CONFLICT (sku, warehouse_id) DO UPDATE SET
                        wb_nm_id = EXCLUDED.wb_nm_id,
                        quantity = EXCLUDED.quantity,
                        updated_at = NOW()
                    """,
                    (chrt_id, nm_id, warehouse_id, quantity),
                )
                total_updated += 1

    conn.commit()
    if total_nonzero == 0 and card_fallback_qty:
        with conn.cursor() as cur:
            for nm_id, quantity in card_fallback_qty.items():
                cur.execute(
                    """
                    INSERT INTO stocks (sku, wb_nm_id, warehouse_id, quantity, updated_at)
                    VALUES (%s, %s, %s, %s, NOW())
                    ON CONFLICT (sku, warehouse_id) DO UPDATE SET
                        wb_nm_id = EXCLUDED.wb_nm_id,
                        quantity = EXCLUDED.quantity,
                        updated_at = NOW()
                    """,
                    (nm_id, nm_id, 0, quantity),
                )
        conn.commit()
        return len(card_fallback_qty)
    return total_updated


def write_sync_log(
    conn,
    status: str,
    products_updated: int,
    stocks_updated: int,
    message: str = "",
    error_message: str = "",
) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO sync_log (source, status, products_updated, stocks_updated, message, error_message, created_at)
            VALUES ('wb', %s, %s, %s, %s, %s, NOW())
            """,
            (status, products_updated, stocks_updated, message, error_message),
        )
    conn.commit()


def main() -> int:
    token = env("WB_API_TOKEN", required=True)
    session = requests.Session()
    conn = None

    try:
        conn = connect_db()
    except Exception as exc:
        error_text = f"{type(exc).__name__}: {exc}"
        send_telegram_message(f"❌ Ошибка синхронизации WB\nВремя: {now_text()}\nОшибка: {error_text}")
        print(error_text, file=sys.stderr)
        return 1

    try:
        ensure_tables(conn)

        cards = fetch_cards(session, token)
        nm_ids = [int(card["nmID"]) for card in cards if card.get("nmID") is not None]
        price_map = fetch_prices(session, token, nm_ids)
        products_updated = upsert_products(conn, cards, price_map)

        warehouses = fetch_warehouses(session, token)
        stocks_updated = upsert_stocks(conn, cards, warehouses, session, token)

        write_sync_log(
            conn,
            "success",
            products_updated,
            stocks_updated,
            message=f"Обновлено карточек: {products_updated}; записей остатков: {stocks_updated}",
        )

        send_telegram_message(
            f"✅ WB синхронизация завершена\n"
            f"Товаров обновлено: {products_updated}\n"
            f"Время: {now_text()}"
        )
        return 0
    except Exception as exc:
        if conn is not None:
            conn.rollback()
        error_text = f"{type(exc).__name__}: {exc}"
        try:
            if conn is not None:
                write_sync_log(conn, "error", 0, 0, error_message=error_text)
        except Exception:
            pass
        send_telegram_message(f"❌ Ошибка синхронизации WB\nВремя: {now_text()}\nОшибка: {error_text}")
        print(error_text, file=sys.stderr)
        return 1
    finally:
        if conn is not None:
            conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
