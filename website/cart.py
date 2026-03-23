"""
Cart persistence layer for CatcherFish.

The frontend currently keeps cart state in the browser, but this module
provides the master-server representation in PostgreSQL so checkout can
persist sessions and recover abandoned carts.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import uuid4

from database.db import execute, fetch_one


def _json_loads(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, (dict, list)):
        return value
    if isinstance(value, str):
        text = value.strip()
        if not text:
            return None
        try:
            return json.loads(text)
        except Exception:
            return value
    return value


def _first_image(images: Any) -> str:
    data = _json_loads(images)
    if isinstance(data, list):
        for item in data:
            if isinstance(item, str) and item.strip():
                return item.strip()
            if isinstance(item, dict):
                for key in ("url", "src", "big", "c516x688", "square", "tm"):
                    value = item.get(key)
                    if isinstance(value, str) and value.strip():
                        return value.strip()
    if isinstance(data, dict):
        for key in ("url", "src", "big", "c516x688", "square", "tm"):
            value = data.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
    if isinstance(data, str) and data.strip():
        return data.strip()
    return ""


def get_product_by_sku(sku: str) -> Optional[Dict[str, Any]]:
    return fetch_one(
        """
        SELECT
            sku,
            name,
            COALESCE(price_retail, price_wb, price_ozon, price_buy, price, 0) AS price_retail,
            COALESCE(stock_available, stock_total, stock, 0) AS stock_available,
            COALESCE(images, photos) AS images
        FROM products
        WHERE sku = %s
        """,
        (str(sku),),
    )


def normalize_guest_session_token(session_id: Optional[str]) -> str:
    token = str(session_id or "").strip()
    if token:
        return token
    return f"gst_{uuid4().hex}"


def get_or_create_guest_session(session_id: Optional[str]) -> Dict[str, Any]:
    token = normalize_guest_session_token(session_id)
    row = fetch_one(
        """
        SELECT session_token, customer_phone, customer_email, cart_items, created_at, expires_at
        FROM guest_sessions
        WHERE session_token = %s
        """,
        (token,),
    )
    if row:
        row["cart_items"] = _json_loads(row.get("cart_items")) or []
        return row

    execute(
        """
        INSERT INTO guest_sessions (
            session_token, customer_phone, customer_email, cart_items, created_at, expires_at
        )
        VALUES (%s, %s, %s, %s::jsonb, NOW(), NOW() + INTERVAL '24 hours')
        """,
        (token, "", "", json.dumps([])),
    )
    return {
        "session_token": token,
        "customer_phone": "",
        "customer_email": "",
        "cart_items": [],
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow(),
    }


def update_guest_session(session_id: Optional[str], cart_items: List[Dict[str, Any]]) -> Dict[str, Any]:
    token = normalize_guest_session_token(session_id)
    payload = json.dumps(cart_items or [])
    execute(
        """
        INSERT INTO guest_sessions (
            session_token, customer_phone, customer_email, cart_items, created_at, expires_at
        )
        VALUES (%s, %s, %s, %s::jsonb, NOW(), NOW() + INTERVAL '24 hours')
        ON CONFLICT (session_token) DO UPDATE SET
            cart_items = EXCLUDED.cart_items,
            expires_at = NOW() + INTERVAL '24 hours'
        """,
        (token, "", "", payload),
    )
    return get_or_create_guest_session(token)


def add_to_cart(session_id: Optional[str], sku: str, quantity: int):
    """
    Добавление товара в корзину для гостя
    """
    qty = max(1, int(quantity or 1))
    product = get_product_by_sku(sku)
    if not product:
        return {"error": "Товар не найден"}

    if int(product.get("stock_available") or 0) < qty:
        return {"error": "Недостаточно товара"}

    session = get_or_create_guest_session(session_id)
    cart_items = list(_json_loads(session.get("cart_items")) or [])

    for item in cart_items:
        if str(item.get("sku") or "") == str(sku):
            item["quantity"] = int(item.get("quantity") or 0) + qty
            break
    else:
        cart_items.append({
            "sku": str(sku),
            "name": product["name"],
            "price": float(product.get("price_retail") or 0),
            "quantity": qty,
            "image": _first_image(product.get("images")),
        })

    update_guest_session(session.get("session_token") or session_id, cart_items)

    return {"success": True, "cart_count": len(cart_items)}


@dataclass
class CartItem:
    sku: str
    name: str
    quantity: int
    price: float
    image: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "sku": self.sku,
            "name": self.name,
            "quantity": int(self.quantity),
            "price": float(self.price),
            "image": self.image,
        }


@dataclass
class CartSession:
    session_id: str = field(default_factory=lambda: uuid4().hex)
    customer_email: str = ""
    customer_phone: str = ""
    items: List[CartItem] = field(default_factory=list)
    total_amount: float = 0.0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @classmethod
    def load(cls, session_id: str) -> Optional["CartSession"]:
        row = fetch_one(
            """
            SELECT session_id, customer_email, customer_phone, items, total_amount, created_at, updated_at
            FROM cart_sessions
            WHERE session_id = %s
            """,
            (session_id,),
        )
        if not row:
            return None
        items = [
            CartItem(
                sku=str(item.get("sku") or ""),
                name=str(item.get("name") or ""),
                quantity=int(item.get("quantity") or 0),
                price=float(item.get("price") or 0),
                image=str(item.get("image") or ""),
            )
            for item in (row.get("items") or [])
        ]
        return cls(
            session_id=str(row["session_id"]),
            customer_email=str(row.get("customer_email") or ""),
            customer_phone=str(row.get("customer_phone") or ""),
            items=items,
            total_amount=float(row.get("total_amount") or 0),
            created_at=row.get("created_at"),
            updated_at=row.get("updated_at"),
        )

    def recalculate(self) -> None:
        self.total_amount = round(
            sum(item.price * item.quantity for item in self.items),
            2,
        )

    def add_item(self, item: CartItem) -> None:
        for existing in self.items:
            if existing.sku == item.sku:
                existing.quantity += item.quantity
                self.recalculate()
                return
        self.items.append(item)
        self.recalculate()

    def set_quantity(self, sku: str, quantity: int) -> None:
        for existing in self.items:
            if existing.sku == sku:
                existing.quantity = max(0, int(quantity))
        self.items = [item for item in self.items if item.quantity > 0]
        self.recalculate()

    def remove_item(self, sku: str) -> None:
        self.items = [item for item in self.items if item.sku != sku]
        self.recalculate()

    def clear(self) -> None:
        self.items.clear()
        self.total_amount = 0.0

    def save(self) -> None:
        self.recalculate()
        payload = [item.to_dict() for item in self.items]
        existing = fetch_one(
            "SELECT 1 FROM cart_sessions WHERE session_id = %s",
            (self.session_id,),
        )
        if existing:
            execute(
                """
                UPDATE cart_sessions
                SET customer_email = %s,
                    customer_phone = %s,
                    items = %s::jsonb,
                    total_amount = %s,
                    updated_at = NOW()
                WHERE session_id = %s
                """,
                (
                    self.customer_email,
                    self.customer_phone,
                    json.dumps(payload),
                    self.total_amount,
                    self.session_id,
                ),
            )
        else:
            execute(
                """
                INSERT INTO cart_sessions (
                    session_id, customer_email, customer_phone, items,
                    total_amount, created_at, updated_at
                )
                VALUES (%s, %s, %s, %s::jsonb, %s, NOW(), NOW())
                """,
                (
                    self.session_id,
                    self.customer_email,
                    self.customer_phone,
                    json.dumps(payload),
                    self.total_amount,
                ),
            )
