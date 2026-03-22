"""
Ozon integration layer for CatcherFish.

The module mirrors the WB integration shape so the sync layer can treat
marketplaces uniformly. It intentionally keeps the logic lightweight and
API-focused.
"""

from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Sequence

import requests

from config import settings


@dataclass(frozen=True)
class OzonProduct:
    product_id: str
    sku: str
    name: str
    price: Optional[float] = None
    stock: int = 0


class OzonClient:
    def __init__(
        self,
        client_id: Optional[str] = None,
        api_key: Optional[str] = None,
        *,
        timeout: int = 60,
        max_retries: int = 4,
        session: Optional[requests.Session] = None,
    ) -> None:
        self.client_id = (client_id or settings.ozon.client_id or "").strip()
        self.api_key = (api_key or settings.ozon.api_key or "").strip()
        self.timeout = timeout
        self.max_retries = max_retries
        self.session = session or requests.Session()

    def _headers(self) -> Dict[str, str]:
        return {
            "Client-Id": self.client_id,
            "Api-Key": self.api_key,
            "Content-Type": "application/json",
        }

    def request_json(
        self,
        method: str,
        path: str,
        *,
        payload: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> Any:
        url = f"{settings.ozon.api_base}{path}"
        last_error: Optional[Exception] = None
        for attempt in range(self.max_retries):
            try:
                response = self.session.request(
                    method,
                    url,
                    headers=self._headers(),
                    json=payload,
                    params=params,
                    timeout=self.timeout,
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
                if attempt < self.max_retries - 1:
                    time.sleep(min(2**attempt, 15))
                    continue
                raise RuntimeError(f"Ozon request failed for {url}: {exc}") from exc
        raise RuntimeError(f"Ozon request failed for {url}: {last_error}")

    def list_products(self, limit: int = 100, offset: int = 0) -> Any:
        return self.request_json(
            "POST",
            "/v2/product/list",
            payload={"limit": limit, "offset": offset},
        )

    def product_info_list(self, product_ids: Sequence[str]) -> Any:
        return self.request_json(
            "POST",
            "/v2/product/info/list",
            payload={"product_id": list(product_ids)},
        )

    def stocks_info(self, product_ids: Sequence[str]) -> Any:
        return self.request_json(
            "POST",
            "/v1/product/info/stocks",
            payload={"product_id": list(product_ids)},
        )

    def fetch_products(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        response = self.list_products(limit=limit, offset=offset)
        items = (response or {}).get("result", {}).get("items") or []
        products: List[Dict[str, Any]] = []
        for item in items:
            products.append(
                {
                    "product_id": str(item.get("product_id") or item.get("id") or ""),
                    "sku": str(item.get("offer_id") or item.get("sku") or ""),
                    "name": str(item.get("name") or item.get("title") or ""),
                    "price": item.get("price"),
                    "stock": int(item.get("stock") or item.get("stocks") or 0),
                    "raw": item,
                }
            )
        return products

