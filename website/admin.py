"""
Admin helpers for CatcherFish.

Provides simple data access helpers for the future admin panel. This is
not a UI module; it is the backend logic the admin panel can reuse.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from database.db import execute, fetch_all, fetch_one


def list_products(limit: int = 100, offset: int = 0, *, published_only: bool = False) -> List[Dict[str, Any]]:
    where = "WHERE is_published = TRUE" if published_only else ""
    return fetch_all(
        f"""
        SELECT
            sku, name, description, category_id, category_name,
            price_buy, price_retail, price_ozon, price_wb,
            stock_total, stock_reserved, stock_available,
            wb_nmID, ozon_product_id, status, is_published, images,
            created_at, updated_at
        FROM products
        {where}
        ORDER BY updated_at DESC, sku ASC
        LIMIT %s OFFSET %s
        """,
        (limit, offset),
    )


def get_product(sku: str) -> Optional[Dict[str, Any]]:
    return fetch_one(
        """
        SELECT
            sku, name, description, category_id, category_name,
            price_buy, price_retail, price_ozon, price_wb,
            stock_total, stock_reserved, stock_available,
            wb_nmID, ozon_product_id, status, is_published, images,
            created_at, updated_at
        FROM products
        WHERE sku = %s
        """,
        (sku,),
    )


def save_product(product: Dict[str, Any]) -> None:
    execute(
        """
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
        """,
        product,
    )


def list_orders(limit: int = 100, offset: int = 0, status: Optional[str] = None) -> List[Dict[str, Any]]:
    params: List[Any] = [limit, offset]
    where = ""
    if status:
        where = "WHERE status = %s"
        params = [status, limit, offset]
    return fetch_all(
        f"""
        SELECT
            order_id, marketplace, status, total_amount,
            customer_name, customer_phone, customer_email,
            delivery_method, delivery_address, payment_method,
            payment_status, items, tracking_number,
            created_at, updated_at, completed_at
        FROM orders
        {where}
        ORDER BY created_at DESC, id DESC
        LIMIT %s OFFSET %s
        """,
        tuple(params),
    )


def get_stats() -> Dict[str, Any]:
    products_total = fetch_one("SELECT COUNT(*) AS count FROM products") or {"count": 0}
    orders_total = fetch_one("SELECT COUNT(*) AS count, COALESCE(SUM(total_amount), 0) AS revenue FROM orders") or {
        "count": 0,
        "revenue": 0,
    }
    stock_total = fetch_one(
        """
        SELECT
            COUNT(*) AS rows,
            COALESCE(SUM(stock_total), 0) AS total_stock,
            COALESCE(SUM(stock_available), 0) AS available_stock,
            COALESCE(SUM(stock_reserved), 0) AS reserved_stock
        FROM products
        """
    ) or {"rows": 0, "total_stock": 0, "available_stock": 0, "reserved_stock": 0}
    return {
        "products": {
            "count": int(products_total.get("count") or 0),
        },
        "orders": {
            "count": int(orders_total.get("count") or 0),
            "revenue": float(orders_total.get("revenue") or 0),
        },
        "stocks": {
            "rows": int(stock_total.get("rows") or 0),
            "total": int(stock_total.get("total_stock") or 0),
            "available": int(stock_total.get("available_stock") or 0),
            "reserved": int(stock_total.get("reserved_stock") or 0),
        },
    }


def set_product_publish_state(sku: str, is_published: bool) -> None:
    execute(
        """
        UPDATE products
        SET is_published = %s,
            updated_at = NOW()
        WHERE sku = %s
        """,
        (is_published, sku),
    )


def update_stock_totals(sku: str, stock_total: int, stock_reserved: Optional[int] = None) -> None:
    if stock_reserved is None:
        execute(
            """
            UPDATE products
            SET stock_total = %s,
                stock_available = GREATEST(%s - stock_reserved, 0),
                updated_at = NOW()
            WHERE sku = %s
            """,
            (stock_total, stock_total, sku),
        )
        return
    execute(
        """
        UPDATE products
        SET stock_total = %s,
            stock_reserved = %s,
            stock_available = GREATEST(%s - %s, 0),
            updated_at = NOW()
        WHERE sku = %s
        """,
        (stock_total, stock_reserved, stock_total, stock_reserved, sku),
    )

