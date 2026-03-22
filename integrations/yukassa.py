"""YuKassa payment helper for CatcherFish."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional
from uuid import uuid4

import requests

from config import settings


@dataclass
class YuKassaConfig:
    shop_id: str
    secret_key: str


class YuKassaClient:
    def __init__(self, shop_id: str = "", secret_key: str = "", timeout: int = 30) -> None:
        self.shop_id = shop_id or settings.yukassa.shop_id
        self.secret_key = secret_key or settings.yukassa.secret_key
        self.timeout = timeout
        self.session = requests.Session()

    def create_payment(self, amount: float, return_url: str, description: str = "CatcherFish order") -> Dict[str, Any]:
        """
        Create a payment request.

        This is a lightweight wrapper. For production, wire the exact YuKassa
        API credentials via .env and expand with idempotency keys.
        """
        idempotence_key = uuid4().hex
        payload = {
            "amount": {"value": f"{amount:.2f}", "currency": "RUB"},
            "confirmation": {"type": "redirect", "return_url": return_url},
            "capture": True,
            "description": description,
        }
        response = self.session.post(
            "https://api.yookassa.ru/v3/payments",
            json=payload,
            auth=(self.shop_id, self.secret_key),
            headers={"Idempotence-Key": idempotence_key},
            timeout=self.timeout,
        )
        response.raise_for_status()
        return response.json()

    def payment_status(self, payment_id: str) -> Dict[str, Any]:
        response = self.session.get(
            f"https://api.yookassa.ru/v3/payments/{payment_id}",
            auth=(self.shop_id, self.secret_key),
            timeout=self.timeout,
        )
        response.raise_for_status()
        return response.json()
