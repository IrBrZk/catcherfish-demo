"""Catalog helpers for CatcherFish."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from database.db import fetch_all, fetch_one


def list_catalog(limit: int = 100, offset: int = 0, category: Optional[str] = None) -> List[Dict[str, Any]]:
    params: List[Any] = [limit, offset]
    where = "WHERE is_published = TRUE"
    if category:
        where += " AND COALESCE(category_name, '') = %s"
        params = [category, limit, offset]
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
        tuple(params),
    )


def get_catalog_item(sku: str) -> Optional[Dict[str, Any]]:
    return fetch_one(
        """
        SELECT
            sku, name, description, category_id, category_name,
            price_buy, price_retail, price_ozon, price_wb,
            stock_total, stock_reserved, stock_available,
            wb_nmID, ozon_product_id, status, is_published, images,
            created_at, updated_at
        FROM products
        WHERE sku = %s AND is_published = TRUE
        """,
        (sku,),
    )


def search_catalog(query: str, limit: int = 100) -> List[Dict[str, Any]]:
    q = f"%{query.lower()}%"
    return fetch_all(
        """
        SELECT
            sku, name, description, category_id, category_name,
            price_buy, price_retail, price_ozon, price_wb,
            stock_total, stock_reserved, stock_available,
            wb_nmID, ozon_product_id, status, is_published, images,
            created_at, updated_at
        FROM products
        WHERE is_published = TRUE
          AND (
              LOWER(name) LIKE %s
              OR LOWER(description) LIKE %s
              OR LOWER(COALESCE(category_name, '')) LIKE %s
          )
        ORDER BY updated_at DESC, sku ASC
        LIMIT %s
        """,
        (q, q, q, limit),
    )

