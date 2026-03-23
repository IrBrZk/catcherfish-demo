"""
Guest checkout flow for CatcherFish.

This module creates guest orders without mandatory registration, reserves
stock in PostgreSQL, sends Telegram notifications and optionally opens a
YuKassa payment session.
"""

from __future__ import annotations

import json
import random
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional

from bot.notifications import notify_error, notify_success
from database.db import connection
from integrations.yukassa import YuKassaClient
from config import settings


@dataclass
class GuestOrderResult:
    order_id: str
    total_amount: float
    delivery_cost: float
    final_total: float
    reserved_items: int
    is_guest: bool = True
    payment_url: Optional[str] = None


def normalize_phone(phone: str) -> str:
    digits = "".join(ch for ch in str(phone or "") if ch.isdigit())
    if len(digits) == 10:
        digits = "7" + digits
    elif len(digits) == 11 and digits.startswith("8"):
        digits = "7" + digits[1:]
    return f"+{digits}" if digits else ""


def make_order_id() -> str:
    return f"CF-{datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"


def _first_image(images: Any) -> str:
    if not images:
        return ""
    if isinstance(images, str):
        text = images.strip()
        if not text:
            return ""
        if text.startswith("[") or text.startswith("{"):
            try:
                return _first_image(json.loads(text))
            except Exception:
                return text
        return text
    if isinstance(images, list):
        for item in images:
            if isinstance(item, str) and item.strip():
                return item.strip()
            if isinstance(item, dict):
                for key in ("url", "src", "big", "c516x688", "square", "tm"):
                    value = item.get(key)
                    if isinstance(value, str) and value.strip():
                        return value.strip()
    if isinstance(images, dict):
        for key in ("url", "src", "big", "c516x688", "square", "tm"):
            value = images.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
    return ""


def calculate_delivery_cost(delivery_method: str, delivery_address: str = "") -> float:
    method = str(delivery_method or "").strip().lower()
    address = str(delivery_address or "").strip().lower()
    if "самовывоз" in method or "pickup" in method or method in {"self", "self_pickup"}:
        return 0.0
    if "cdek" in method or "сдэк" in method:
        if "door" in method or "двер" in method:
            return 350.0
        if "pvz" in method or "пвз" in method or "point" in method:
            return 180.0
        return 250.0 if address else 180.0
    if "делов" in method or "dl" in method:
        return 0.0
    return 0.0


def _load_product(cur, sku: str) -> Optional[Dict[str, Any]]:
    cur.execute(
        """
        SELECT
            sku,
            name,
            COALESCE(price_retail, price_wb, price_ozon, price_buy, price, 0) AS price_retail,
            COALESCE(stock_available, stock_total, stock, 0) AS stock_available,
            COALESCE(images, photos) AS images,
            COALESCE(stock_reserved, 0) AS stock_reserved,
            COALESCE(stock_total, 0) AS stock_total
        FROM products
        WHERE sku = %s
        FOR UPDATE
        """,
        (str(sku),),
    )
    row = cur.fetchone()
    return dict(row) if row else None


def _reserve_items(cur, items: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    reserved: List[Dict[str, Any]] = []
    for raw in items:
        sku = str(raw.get("sku") or raw.get("product_sku") or raw.get("id") or "").strip()
        if not sku:
            continue
        qty = int(raw.get("quantity") or raw.get("qty") or 0)
        if qty <= 0:
            continue
        product = _load_product(cur, sku)
        if not product:
            raise ValueError(f"Product not found: {sku}")
        available = int(product.get("stock_available") or 0)
        if available < qty:
            raise ValueError(f"Недостаточно товара: {sku}")
        stock_reserved = int(product.get("stock_reserved") or 0) + qty
        stock_total = int(product.get("stock_total") or 0)
        stock_available = max(0, stock_total - stock_reserved)
        cur.execute(
            """
            UPDATE products
            SET stock_reserved = %s,
                stock_available = %s,
                updated_at = NOW()
            WHERE sku = %s
            """,
            (stock_reserved, stock_available, sku),
        )
        reserved.append(
            {
                "sku": sku,
                "name": raw.get("name") or product.get("name") or "Товар",
                "quantity": qty,
                "price": float(raw.get("price") or product.get("price_retail") or 0),
                "image": raw.get("image") or _first_image(product.get("images")),
            }
        )
    return reserved


def send_customer_confirmation(order: Dict[str, Any]) -> bool:
    name = order.get("customer_name") or "Покупатель"
    order_id = order.get("order_id") or order.get("id") or "—"
    total = float(order.get("total_amount") or order.get("final_total") or 0)
    message = (
        f"Заказ {order_id}\n"
        f"Клиент: {name}\n"
        f"Сумма: {total:.2f} ₽\n"
        f"Статус: {order.get('status') or 'new'}"
    )
    return notify_success("Заказ принят", message)


def send_admin_notification(order: Dict[str, Any]) -> bool:
    order_id = order.get("order_id") or order.get("id") or "—"
    lines = [
        f"Заказ: {order_id}",
        f"Клиент: {order.get('customer_name') or '—'}",
        f"Телефон: {order.get('customer_phone') or '—'}",
        f"Email: {order.get('customer_email') or '—'}",
        f"Сумма: {float(order.get('final_total') or order.get('total_amount') or 0):.2f} ₽",
    ]
    return notify_success("Новый гостевой заказ", "\n".join(lines))


def create_yukassa_payment(order_id: str, amount: float, email: str = "") -> str:
    client = YuKassaClient()
    return_url = settings.app.site_url.rstrip("/") + "/"
    description = f"CatcherFish order {order_id}"
    response = client.create_payment(amount=amount, return_url=return_url, description=description)
    confirmation = response.get("confirmation") or {}
    return str(confirmation.get("confirmation_url") or confirmation.get("url") or "")


def create_guest_order(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Создание гостевого заказа.

    data = {
        'customer_name': 'Иван',
        'customer_phone': '+79036163935',
        'customer_email': 'ivan@example.com',
        'delivery_method': 'cdek_door',
        'delivery_address': 'г. Москва, ул. Примерная, д. 1',
        'payment_method': 'yukassa',
        'items': [...],
        'comment': '...'
    }
    """
    order_id = make_order_id()
    customer_name = str(data.get("customer_name") or data.get("name") or "").strip()
    customer_phone = normalize_phone(data.get("customer_phone") or data.get("phone") or "")
    customer_email = str(data.get("customer_email") or data.get("email") or "").strip()
    delivery_method = str(data.get("delivery_method") or "").strip()
    delivery_address = str(data.get("delivery_address") or "").strip()
    payment_method = str(data.get("payment_method") or "").strip()
    payment_method_key = payment_method.lower()
    comment = str(data.get("comment") or "").strip()
    items = list(data.get("items") or [])

    if not customer_name or not customer_phone or not customer_email:
        raise ValueError("customer_name, customer_phone and customer_email are required")
    if not items:
        raise ValueError("items are required")

    with connection() as conn:
        with conn.cursor() as cur:
            reserved_items = _reserve_items(cur, items)
            total_amount = round(
                sum(float(item["price"]) * int(item["quantity"]) for item in reserved_items),
                2,
            )
            delivery_cost = float(
                data.get("delivery_cost")
                or calculate_delivery_cost(delivery_method, delivery_address)
            )
            final_total = round(total_amount + delivery_cost, 2)
            cur.execute(
                """
                INSERT INTO orders (
                    order_id, user_id, marketplace, status, total_amount,
                    delivery_cost, customer_name, customer_phone, customer_email,
                    delivery_method, delivery_address, payment_method, payment_status,
                    items, comment, is_guest, registered_after_order, created_at, updated_at
                )
                VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s::jsonb, %s, %s, %s, NOW(), NOW()
                )
                """,
                (
                    order_id,
                    None,
                    "website",
                    "new",
                    final_total,
                    delivery_cost,
                    customer_name,
                    customer_phone,
                    customer_email,
                    delivery_method,
                    delivery_address,
                    payment_method,
                    "pending",
                    json.dumps(reserved_items, ensure_ascii=False),
                    comment,
                    True,
                    bool(data.get("registered_after_order", False)),
                ),
            )

    order = {
        "success": True,
        "order_id": order_id,
        "customer_name": customer_name,
        "customer_phone": customer_phone,
        "customer_email": customer_email,
        "delivery_method": delivery_method,
        "delivery_address": delivery_address,
        "payment_method": payment_method,
        "items": reserved_items,
        "total_amount": total_amount,
        "delivery_cost": delivery_cost,
        "final_total": final_total,
        "comment": comment,
        "is_guest": True,
        "status": "new",
    }

    send_customer_confirmation(order)
    send_admin_notification(order)

    if "yukassa" in payment_method_key or "юкassa" in payment_method_key or "юкасса" in payment_method_key:
        try:
            payment_url = create_yukassa_payment(order_id, final_total, customer_email)
        except Exception as exc:
            notify_error("YuKassa payment error", exc)
            payment_url = ""
        if payment_url:
            order["payment_url"] = payment_url

    return order
