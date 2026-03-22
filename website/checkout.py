"""
Checkout logic for CatcherFish.

Creates website orders in PostgreSQL and reserves stock in the master
products table. The frontend can call this service after validating the
customer form.
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
from uuid import uuid4

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from bot.telegram_bot import bot
from database.db import connection, fetch_one
from website.cart import CartItem, CartSession


@dataclass
class CheckoutResult:
    order_id: str
    reserved_items: int
    total_amount: float
    status: str = "new"


def make_order_id(prefix: str = "CF") -> str:
    stamp = datetime.now().strftime("%Y%m%d%H%M%S")
    suffix = uuid4().hex[:6].upper()
    return f"{prefix}-{stamp}-{suffix}"


def _load_product(cursor, sku: str) -> Optional[Dict[str, Any]]:
    cursor.execute(
        """
        SELECT sku, name, stock_total, stock_reserved, stock_available, price_retail
        FROM products
        WHERE sku = %s
        FOR UPDATE
        """,
        (sku,),
    )
    row = cursor.fetchone()
    return dict(row) if row else None


def _reserve_items(cursor, cart: CartSession) -> List[Dict[str, Any]]:
    reserved: List[Dict[str, Any]] = []
    for item in cart.items:
        product = _load_product(cursor, item.sku)
        if not product:
            raise ValueError(f"Product not found: {item.sku}")

        available = int(product.get("stock_available") or 0)
        if available < item.quantity:
            raise ValueError(
                f"Not enough stock for {item.sku}: requested {item.quantity}, available {available}"
            )

        stock_reserved = int(product.get("stock_reserved") or 0) + item.quantity
        stock_total = int(product.get("stock_total") or 0)
        stock_available = max(0, stock_total - stock_reserved)
        cursor.execute(
            """
            UPDATE products
            SET stock_reserved = %s,
                stock_available = %s,
                updated_at = NOW()
            WHERE sku = %s
            """,
            (stock_reserved, stock_available, item.sku),
        )
        reserved.append(
            {
                "sku": item.sku,
                "name": item.name,
                "quantity": item.quantity,
                "price": item.price,
            }
        )
    return reserved


def reserve_items(cart: CartSession) -> List[Dict[str, Any]]:
    with connection() as conn:
        with conn.cursor() as cur:
            return _reserve_items(cur, cart)


def create_order_from_cart(
    cart: CartSession,
    *,
    customer_name: str,
    customer_phone: str,
    customer_email: str = "",
    delivery_method: str = "",
    delivery_address: str = "",
    payment_method: str = "",
    marketplace: str = "website",
) -> CheckoutResult:
    if not cart.items:
        raise ValueError("Cart is empty")

    order_id = make_order_id()
    with connection() as conn:
        with conn.cursor() as cur:
            reserved_items = _reserve_items(cur, cart)
            total_amount = round(sum(item["price"] * item["quantity"] for item in reserved_items), 2)
            payload = json.dumps([item.to_dict() for item in cart.items])
            cur.execute(
                """
                INSERT INTO orders (
                    order_id, marketplace, status, total_amount,
                    customer_name, customer_phone, customer_email,
                    delivery_method, delivery_address, payment_method,
                    payment_status, items, created_at, updated_at
                )
                VALUES (
                    %s, %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s::jsonb, NOW(), NOW()
                )
                """,
                (
                    order_id,
                    marketplace,
                    "new",
                    total_amount,
                    customer_name,
                    customer_phone,
                    customer_email,
                    delivery_method,
                    delivery_address,
                    payment_method,
                    "pending",
                    payload,
                ),
            )

    bot.send_success(
        "Новый заказ",
        f"Заказ {order_id}\nКлиент: {customer_name}\nСумма: {total_amount:.2f} ₽",
    )

    return CheckoutResult(
        order_id=order_id,
        reserved_items=len(reserved_items),
        total_amount=total_amount,
    )


def cancel_order(order_id: str) -> None:
    order = fetch_one(
        """
        SELECT order_id, items
        FROM orders
        WHERE order_id = %s
        """,
        (order_id,),
    )
    if not order:
        raise ValueError(f"Order not found: {order_id}")

    items = order.get("items") or []
    with connection() as conn:
        with conn.cursor() as cur:
            for item in items:
                sku = str(item.get("sku") or "")
                qty = int(item.get("quantity") or 0)
                if not sku or qty <= 0:
                    continue
                cur.execute(
                    """
                    UPDATE products
                    SET stock_reserved = GREATEST(stock_reserved - %s, 0),
                        stock_available = GREATEST(stock_available + %s, 0),
                        updated_at = NOW()
                    WHERE sku = %s
                    """,
                    (qty, qty, sku),
                )
            cur.execute(
                """
                UPDATE orders
                SET status = 'cancelled',
                    payment_status = 'cancelled',
                    updated_at = NOW()
                WHERE order_id = %s
                """,
                (order_id,),
            )

    bot.send_success("Заказ отменён", f"Заказ {order_id} отменён и резерв снят")
