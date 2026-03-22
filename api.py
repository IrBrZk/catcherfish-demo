"""
FastAPI REST API для catcherfish_db
Запуск: uvicorn api:app --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import os
import re
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
    allow_origins=[
        "https://irbrzk.github.io",
        "http://localhost",
        "http://127.0.0.1",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
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
        rows = await conn.fetch(
            """
            SELECT sku, wb_nm_id, name, description, brand, photos, price, source, updated_at
            FROM products
            ORDER BY updated_at DESC, sku DESC
            """
        )
    items = []
    for row in rows:
        item = row_to_dict(row)
        item["category"] = infer_category(item)
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
async def get_product(sku: int):
    pool_ = await get_pool()
    async with pool_.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT sku, wb_nm_id, name, description, brand, photos, price, source, updated_at
            FROM products
            WHERE sku = $1
            """,
            sku,
        )
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    item = row_to_dict(row)
    item["category"] = infer_category(item)
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
        rows = await conn.fetch(
            """
            SELECT s.sku, s.wb_nm_id, s.warehouse_id, s.quantity, s.updated_at,
                   p.name AS product_name, p.brand, p.description, p.price
            FROM stocks s
            LEFT JOIN products p ON p.sku = s.sku
            ORDER BY s.updated_at DESC, s.sku DESC
            """
        )
    items = []
    for row in rows:
        item = row_to_dict(row)
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

    total = len(items)
    return {"items": items[offset:offset + limit], "total": total, "limit": limit, "offset": offset}


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
        rows = await conn.fetch("SELECT * FROM orders ORDER BY 1 DESC")

    items = [row_to_dict(row) for row in rows]
    if status:
        items = [item for item in items if str(item.get("status", "")).lower() == status.lower()]
    total = len(items)
    return {"items": items[offset:offset + limit], "total": total, "limit": limit, "offset": offset}


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
            if "total" in {col["column_name"] for col in await conn.fetch("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'orders'
            """)}:
                order_amount = await conn.fetchval("SELECT COALESCE(SUM(total), 0) FROM orders")
    return {
        "products": {"count": int(products_count or 0)},
        "orders": {"count": int(orders_count or 0), "total_revenue": float(order_amount or 0)},
        "stocks": {"count": int(stocks_count or 0), "units": int(stock_units or 0)},
    }
