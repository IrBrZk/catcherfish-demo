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

