"""
FastAPI REST API для catcherfish_db
Запуск: uvicorn api:app --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import os
import re
import uuid
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path
from typing import Any, Dict, List, Optional

import asyncpg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
load_dotenv()

app = FastAPI(title="CatcherFish API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pool: Optional[asyncpg.Pool] = None


def env(name: str, default: Optional[str] = None, required: bool = False) -> str:
    value = os.getenv(name, default)
    if required and not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value or ""


def normalize(value: Any) -> Any:
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, dict):
        return {k: normalize(v) for k, v in value.items()}
    if isinstance(value, list):
        return [normalize(v) for v in value]
    return value


def row_to_dict(row: asyncpg.Record) -> Dict[str, Any]:
    return normalize(dict(row))


def infer_category(product: Dict[str, Any]) -> str:
    text = " ".join(
        str(product.get(field) or "")
        for field in ("name", "description", "brand")
    ).lower()
    mapping = [
        ("gas", ["горел", "плитк", "gas", "ns 509", "ns 502", "ns100", "ns06", "m-100"]),
        ("tent", ["палат", "обогрев", "shelter", "camp", "турист"]),
        ("boat", ["лодк", "boat"]),
        ("lure", ["блесн", "снаст", "lure"]),
        ("fishing", ["грузил", "вертлюг", "карабин", "отводн", "fishing"]),
    ]
    for category, keywords in mapping:
        if any(keyword in text for keyword in keywords):
            return category
    return "other"


def first_photo_url(photos: Any) -> Optional[str]:
    if not photos:
        return None
    if isinstance(photos, str):
        text = photos.strip()
        if not text:
            return None
        if text.startswith("[") or text.startswith("{"):
            try:
                import json

                parsed = json.loads(text)
                return first_photo_url(parsed)
            except Exception:
                return text
        return text
    if isinstance(photos, list):
        for photo in photos:
            if isinstance(photo, str) and photo.strip():
                return photo.strip()
            if isinstance(photo, dict):
                for key in ("url", "src", "big", "c516x688", "square", "tm"):
                    value = photo.get(key)
                    if isinstance(value, str) and value.strip():
                        return value.strip()
        return None
    if isinstance(photos, dict):
        for key in ("url", "src", "big", "c516x688", "square", "tm"):
            value = photos.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
    return None


def source_group(source: Any) -> str:
    value = str(source or "").strip().lower()
    if value in {"wb", "ozon"}:
        return "marketplace"
    if value in {"local", "warehouse"}:
        return "warehouse"
    return "import"


def product_select_exprs(product_cols: set[str]) -> Dict[str, str]:
    wb_col = "wb_nm_id" if "wb_nm_id" in product_cols else "wb_nmID" if "wb_nmID" in product_cols else None
    category_col = "category" if "category" in product_cols else "category_name" if "category_name" in product_cols else None
    photos_col = "photos" if "photos" in product_cols else "images" if "images" in product_cols else None
    price_col = "price" if "price" in product_cols else "price_wb" if "price_wb" in product_cols else "price_retail" if "price_retail" in product_cols else None
    stock_col = "stock" if "stock" in product_cols else "stock_available" if "stock_available" in product_cols else "stock_total" if "stock_total" in product_cols else None
    price_buy_col = "price_buy" if "price_buy" in product_cols else None
    price_retail_col = "price_retail" if "price_retail" in product_cols else None
    price_ozon_col = "price_ozon" if "price_ozon" in product_cols else None
    price_wb_col = "price_wb" if "price_wb" in product_cols else None
    source_col = "source" if "source" in product_cols else None
    updated_col = "updated_at" if "updated_at" in product_cols else None
    return {
        "wb": wb_col or "NULL::text",
        "category": category_col or "NULL::text",
        "photos": photos_col or "NULL::jsonb",
        "price": price_col or "NULL::numeric",
        "stock": stock_col or "0",
        "price_buy": price_buy_col or "NULL::numeric",
        "price_retail": price_retail_col or "NULL::numeric",
        "price_ozon": price_ozon_col or "NULL::numeric",
        "price_wb": price_wb_col or "NULL::numeric",
        "source": source_col or "'manual'",
        "updated_at": updated_col or "NOW()",
    }


def order_select_exprs(order_cols: set[str]) -> Dict[str, str]:
    order_id_col = "order_id" if "order_id" in order_cols else "id" if "id" in order_cols else None
    status_col = "status" if "status" in order_cols else None
    total_col = coalesce_expr(order_cols, ["total_amount", "total", "amount"], "0::numeric")
    name_col = "customer_name" if "customer_name" in order_cols else "name" if "name" in order_cols else None
    phone_col = "customer_phone" if "customer_phone" in order_cols else "phone" if "phone" in order_cols else None
    email_col = "customer_email" if "customer_email" in order_cols else "email" if "email" in order_cols else None
    items_col = "items" if "items" in order_cols else None
    created_col = "created_at" if "created_at" in order_cols else "updated_at" if "updated_at" in order_cols else None
    marketplace_col = "marketplace" if "marketplace" in order_cols else None
    payment_method_col = "payment_method" if "payment_method" in order_cols else None
    payment_status_col = "payment_status" if "payment_status" in order_cols else None
    tracking_col = "tracking_number" if "tracking_number" in order_cols else None
    return {
        "order_id": order_id_col or "id::text",
        "status": status_col or "'new'",
        "total": total_col,
        "name": name_col or "NULL::text",
        "phone": phone_col or "NULL::text",
        "email": email_col or "NULL::text",
        "items": items_col or "'[]'::jsonb",
        "created_at": created_col or "NOW()",
        "marketplace": marketplace_col or "'website'",
        "payment_method": payment_method_col or "''",
        "payment_status": payment_status_col or "'pending'",
        "tracking_number": tracking_col or "''",
    }


def coalesce_expr(columns: set[str], candidates: List[str], default: str) -> str:
    present = [name for name in candidates if name in columns]
    if not present:
        return default
    if len(present) == 1:
        return present[0]
    return f"COALESCE({', '.join(present)}, {default})"


async def get_pool() -> asyncpg.Pool:
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(
            host=env("DB_HOST", "localhost"),
            port=int(env("DB_PORT", "5432")),
            database=env("DB_NAME", required=True),
            user=env("DB_USER", required=True),
            password=env("DB_PASSWORD", required=True),
            min_size=1,
            max_size=10,
        )
    return pool


async def table_exists(conn: asyncpg.Connection, table_name: str) -> bool:
    return bool(
        await conn.fetchval(
            """
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND table_name = $1
            )
            """,
            table_name,
        )
    )


async def table_columns(conn: asyncpg.Connection, table_name: str) -> set[str]:
    rows = await conn.fetch(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
        """,
        table_name,
    )
    return {row["column_name"] for row in rows}


@app.on_event("startup")
async def startup() -> None:
    await get_pool()


@app.on_event("shutdown")
async def shutdown() -> None:
    global pool
    if pool is not None:
        await pool.close()
        pool = None


@app.get("/products")
async def get_products(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    category: Optional[str] = None,
    search: Optional[str] = None,
):
    pool_ = await get_pool()
    async with pool_.acquire() as conn:
        product_cols = await table_columns(conn, "products")
        exprs = product_select_exprs(product_cols)
        query = f"""
            SELECT
                sku,
                {exprs['wb']} AS wb_nm_id,
                name,
                description,
                brand,
                {exprs['category']} AS category,
                {exprs['price_buy']} AS price_buy,
                {exprs['price_retail']} AS price_retail,
                {exprs['price_ozon']} AS price_ozon,
                {exprs['price_wb']} AS price_wb,
                {exprs['stock']} AS stock,
                {exprs['photos']} AS photos,
                {exprs['price']} AS price,
                {exprs['source']} AS source,
                {exprs['updated_at']} AS updated_at
            FROM products
            ORDER BY updated_at DESC, sku DESC
        """
        rows = await conn.fetch(query)
    items = []
    for row in rows:
        item = row_to_dict(row)
        item["category"] = item.get("category") or infer_category(item)
        item["photo_url"] = first_photo_url(item.get("photos"))
        item["source_group"] = source_group(item.get("source"))
        items.append(item)

    if category:
        items = [item for item in items if item["category"] == category]
    if search:
        q = search.lower()
        items = [
            item for item in items
            if q in str(item.get("name", "")).lower()
            or q in str(item.get("description", "")).lower()
            or q in str(item.get("brand", "")).lower()
        ]

    total = len(items)
    return {"items": items[offset:offset + limit], "total": total, "limit": limit, "offset": offset}


@app.get("/products/{sku}")
async def get_product(sku: str):
    pool_ = await get_pool()
    async with pool_.acquire() as conn:
        product_cols = await table_columns(conn, "products")
        exprs = product_select_exprs(product_cols)
        query = f"""
            SELECT
                sku,
                {exprs['wb']} AS wb_nm_id,
                name,
                description,
                brand,
                {exprs['category']} AS category,
                {exprs['price_buy']} AS price_buy,
                {exprs['price_retail']} AS price_retail,
                {exprs['price_ozon']} AS price_ozon,
                {exprs['price_wb']} AS price_wb,
                {exprs['stock']} AS stock,
                {exprs['photos']} AS photos,
                {exprs['price']} AS price,
                {exprs['source']} AS source,
                {exprs['updated_at']} AS updated_at
            FROM products
            WHERE sku = $1
        """
        row = await conn.fetchrow(query, sku)
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    item = row_to_dict(row)
    item["category"] = item.get("category") or infer_category(item)
    item["photo_url"] = first_photo_url(item.get("photos"))
    item["source_group"] = source_group(item.get("source"))
    return item


@app.get("/stocks")
async def get_stocks(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    category: Optional[str] = None,
    search: Optional[str] = None,
):
    pool_ = await get_pool()
    async with pool_.acquire() as conn:
        if not await table_exists(conn, "stocks"):
            return {"items": [], "by_source": {}, "total": 0, "limit": limit, "offset": offset}
        stock_cols = await table_columns(conn, "stocks")
        product_cols = await table_columns(conn, "products") if await table_exists(conn, "products") else set()
        if "sku" not in stock_cols:
            return {"items": [], "by_source": {}, "total": 0, "limit": limit, "offset": offset}
        qty_key = next((name for name in ("quantity", "stock", "balance", "qty") if name in stock_cols), None)
        upd_key = "updated_at" if "updated_at" in stock_cols else None
        warehouse_key = "warehouse" if "warehouse" in stock_cols else None
        source_key = "source" if "source" in stock_cols else None
        stock_type_key = "stock_type" if "stock_type" in stock_cols else None
        product_wb_key = "wb_nm_id" if "wb_nm_id" in product_cols else "wb_nmID" if "wb_nmID" in product_cols else None
        select_parts = [
            "s.sku AS sku",
            "s.wb_nm_id AS wb_nm_id" if "wb_nm_id" in stock_cols else "NULL::text AS wb_nm_id",
            f"s.{warehouse_key} AS warehouse" if warehouse_key else "NULL::text AS warehouse",
            f"s.{qty_key} AS quantity" if qty_key else "0 AS quantity",
            "s.moysklad_qty AS moysklad_qty" if "moysklad_qty" in stock_cols else "NULL::integer AS moysklad_qty",
            "s.warehouse_id AS warehouse_id" if "warehouse_id" in stock_cols else "NULL::bigint AS warehouse_id",
            f"s.{source_key} AS source" if source_key else "'manual' AS source",
            f"s.{stock_type_key} AS stock_type" if stock_type_key else "'fbs' AS stock_type",
            f"s.{upd_key} AS updated_at" if upd_key else "NOW() AS updated_at",
            "p.name AS product_name",
            "p.brand",
            "p.description",
            "p.price",
        ]
        rows = await conn.fetch(
            f"""
            SELECT {', '.join(select_parts)}
            FROM stocks s
            LEFT JOIN products p ON p.sku::text = s.sku{f' OR p.{product_wb_key}::text = s.wb_nm_id' if product_wb_key else ''}
            ORDER BY s.updated_at DESC, s.sku DESC
            """
        )
    items = []
    for row in rows:
        item = row_to_dict(row)
        item.setdefault("product_name", item.get("name") or item.get("sku"))
        item.setdefault("warehouse", item.get("warehouse") or item.get("warehouse_id") or "—")
        item.setdefault("source", item.get("source") or "manual")
        item["source_group"] = source_group(item.get("source"))
        item.setdefault("stock_type", item.get("stock_type") or "fbs")
        item.setdefault("moysklad_qty", item.get("moysklad_qty"))
        item.setdefault("quantity", item.get("quantity", item.get("stock", item.get("balance", item.get("qty", 0)))))
        item["category"] = infer_category(item)
        items.append(item)

    if category:
        items = [item for item in items if item["category"] == category]
    if search:
        q = search.lower()
        items = [
            item for item in items
            if q in str(item.get("product_name", "")).lower()
            or q in str(item.get("brand", "")).lower()
            or q in str(item.get("description", "")).lower()
        ]

    by_source: Dict[str, Dict[str, int]] = {}
    by_source_group: Dict[str, Dict[str, int]] = {}
    for item in items:
        src = str(item.get("source") or "manual").lower()
        bucket = by_source.setdefault(src, {"count": 0, "units": 0})
        bucket["count"] += 1
        bucket["units"] += int(item.get("quantity") or 0)
        group = str(item.get("source_group") or source_group(src))
        grouped_bucket = by_source_group.setdefault(group, {"count": 0, "units": 0})
        grouped_bucket["count"] += 1
        grouped_bucket["units"] += int(item.get("quantity") or 0)

    total = sum(int(item.get("quantity") or 0) for item in items)
    return {
        "items": items[offset:offset + limit],
        "by_source": by_source,
        "by_source_group": by_source_group,
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@app.get("/orders")
async def get_orders(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    status: Optional[str] = None,
):
    pool_ = await get_pool()
    async with pool_.acquire() as conn:
        if not await table_exists(conn, "orders"):
            return {"items": [], "total": 0, "limit": limit, "offset": offset}
        order_cols = await table_columns(conn, "orders")
        exprs = order_select_exprs(order_cols)
        rows = await conn.fetch(
            f"""
            SELECT
                {exprs['order_id']} AS order_id,
                {exprs['status']} AS status,
                {exprs['total']} AS total,
                {exprs['name']} AS customer_name,
                {exprs['phone']} AS customer_phone,
                {exprs['email']} AS customer_email,
                {exprs['items']} AS items,
                {exprs['created_at']} AS created_at,
                {exprs['marketplace']} AS marketplace,
                {exprs['payment_method']} AS payment_method,
                {exprs['payment_status']} AS payment_status,
                {exprs['tracking_number']} AS tracking_number
            FROM orders
            ORDER BY {exprs['created_at']} DESC, id DESC
            """
        )

    items = []
    for row in rows:
        item = row_to_dict(row)
        item["id"] = item.get("id") or item.get("order_id")
        item["name"] = item.get("customer_name") or item.get("name")
        item["phone"] = item.get("customer_phone") or item.get("phone")
        item["total"] = item.get("total") or item.get("total_amount") or item.get("amount") or 0
        item["date"] = item.get("created_at") or item.get("date")
        items.append(item)
    if status:
        items = [item for item in items if str(item.get("status", "")).lower() == status.lower()]
    total = len(items)
    return {"items": items[offset:offset + limit], "total": total, "limit": limit, "offset": offset}


@app.post("/orders")
async def create_order(payload: Dict[str, Any]):
    pool_ = await get_pool()
    order_id = str(payload.get("order_id") or payload.get("id") or f"CF-{uuid.uuid4().hex[:10].upper()}")
    marketplace = str(payload.get("marketplace") or "website")
    status = str(payload.get("status") or "new")
    customer_name = str(payload.get("customer_name") or payload.get("name") or "")
    customer_phone = str(payload.get("customer_phone") or payload.get("phone") or "")
    customer_email = str(payload.get("customer_email") or payload.get("email") or "")
    delivery_method = str(payload.get("delivery_method") or "")
    delivery_address = str(payload.get("delivery_address") or "")
    payment_method = str(payload.get("payment_method") or payload.get("pay") or "")
    payment_status = str(payload.get("payment_status") or "pending")
    tracking_number = str(payload.get("tracking_number") or "")
    items = payload.get("items") or []
    normalized_items: List[Dict[str, Any]] = []
    total_amount = payload.get("total_amount", payload.get("total"))
    computed_total = 0.0

    for item in items:
        if not isinstance(item, dict):
            continue
        qty = int(item.get("qty") or item.get("quantity") or 1)
        price = float(item.get("price") or 0)
        sku = str(item.get("sku") or item.get("product_sku") or item.get("id") or "").strip()
        name = str(item.get("name") or "Товар")
        computed_total += qty * price
        normalized_items.append({
            "sku": sku,
            "name": name,
            "qty": qty,
            "price": price,
        })

    total_amount = float(total_amount if total_amount is not None else computed_total)
    created_at = datetime.utcnow()

    async with pool_.acquire() as conn:
        if not await table_exists(conn, "orders"):
            raise HTTPException(status_code=503, detail="orders table is not available")
        order_cols = await table_columns(conn, "orders")
        insert_columns = [col for col in (
            "order_id", "marketplace", "status", "total_amount", "customer_name",
            "customer_phone", "customer_email", "delivery_method", "delivery_address",
            "payment_method", "payment_status", "items", "tracking_number", "created_at", "updated_at"
        ) if col in order_cols]
        if "order_id" not in insert_columns or "items" not in insert_columns:
            raise HTTPException(status_code=500, detail="orders table schema is not compatible")
        reserved_columns = {
            "order_id": order_id,
            "marketplace": marketplace,
            "status": status,
            "total_amount": total_amount,
            "customer_name": customer_name,
            "customer_phone": customer_phone,
            "customer_email": customer_email,
            "delivery_method": delivery_method,
            "delivery_address": delivery_address,
            "payment_method": payment_method,
            "payment_status": payment_status,
            "items": normalize(normalized_items),
            "tracking_number": tracking_number,
            "created_at": created_at,
            "updated_at": created_at,
        }
        values = [reserved_columns[col] for col in insert_columns]
        placeholders = ", ".join(f"${i}" for i in range(1, len(insert_columns) + 1))
        insert_cols_sql = ", ".join(insert_columns)
        update_sets = ", ".join(
            f"{col} = EXCLUDED.{col}"
            for col in insert_columns
            if col not in {"order_id", "created_at"}
        )
        async with conn.transaction():
            await conn.execute(
                f"""
                INSERT INTO orders ({insert_cols_sql})
                VALUES ({placeholders})
                ON CONFLICT (order_id) DO UPDATE SET
                    {update_sets}
                """,
                *values,
            )

            if await table_exists(conn, "products"):
                product_cols = await table_columns(conn, "products")
                if "sku" in product_cols and "stock_available" in product_cols and "stock_reserved" in product_cols:
                    for item in normalized_items:
                        sku = item.get("sku")
                        qty = int(item.get("qty") or 0)
                        if not sku or qty <= 0:
                            continue
                        await conn.execute(
                            """
                            UPDATE products
                            SET stock_reserved = COALESCE(stock_reserved, 0) + $2,
                                stock_available = GREATEST(COALESCE(stock_total, 0) - (COALESCE(stock_reserved, 0) + $2), 0),
                                updated_at = NOW()
                            WHERE sku = $1
                            """,
                            sku,
                            qty,
                        )

    return {
        "order_id": order_id,
        "marketplace": marketplace,
        "status": status,
        "total_amount": total_amount,
        "items": normalized_items,
        "customer_name": customer_name,
        "customer_phone": customer_phone,
        "created_at": created_at.isoformat(),
    }


@app.get("/sync/log")
async def get_sync_log():
    pool_ = await get_pool()
    async with pool_.acquire() as conn:
        if not await table_exists(conn, "sync_log"):
            return {"items": [], "total": 0}
        rows = await conn.fetch(
            """
            SELECT id, source, status, products_updated, stocks_updated, message, error_message, created_at
            FROM sync_log
            ORDER BY created_at DESC, id DESC
            LIMIT 50
            """
        )
    items = [row_to_dict(row) for row in rows]
    return {"items": items, "total": len(items)}


@app.get("/stats")
async def get_stats():
    pool_ = await get_pool()
    async with pool_.acquire() as conn:
        products_count = await conn.fetchval("SELECT COUNT(*) FROM products")
        stocks_count = 0
        stock_units = 0
        if await table_exists(conn, "stocks"):
            stocks_count = await conn.fetchval("SELECT COUNT(*) FROM stocks")
            stock_units = await conn.fetchval("SELECT COALESCE(SUM(quantity), 0) FROM stocks")
        orders_count = 0
        order_amount = 0
        if await table_exists(conn, "orders"):
            orders_count = await conn.fetchval("SELECT COUNT(*) FROM orders")
            order_cols = {col["column_name"] for col in await conn.fetch("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'orders'
            """)}
            if "total_amount" in order_cols:
                order_amount = await conn.fetchval("SELECT COALESCE(SUM(total_amount), 0) FROM orders")
            elif "total" in order_cols:
                order_amount = await conn.fetchval("SELECT COALESCE(SUM(total), 0) FROM orders")
            elif "amount" in order_cols:
                order_amount = await conn.fetchval("SELECT COALESCE(SUM(amount), 0) FROM orders")
    return {
        "products": {"count": int(products_count or 0)},
        "orders": {"count": int(orders_count or 0), "total_revenue": float(order_amount or 0)},
        "stocks": {"count": int(stocks_count or 0), "units": int(stock_units or 0)},
    }
