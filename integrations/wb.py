"""
Wildberries integration layer for CatcherFish.

This module wraps the WB Seller APIs that we use as a marketplace source:
- Content API for cards
- Discounts/Prices API for prices
- Marketplace API for warehouses and stock balances

The module is intentionally side-effect free: it only talks to WB and
returns plain Python structures that the sync layer can persist into
PostgreSQL.
"""

from __future__ import annotations

import json
import time
from dataclasses import dataclass
from decimal import Decimal
from itertools import islice
from typing import Any, Dict, Iterable, List, Optional, Sequence

import requests

from config import settings


@dataclass(frozen=True)
class WBCard:
    nm_id: int
    title: str
    description: str = ""
    brand: str = ""
    photos: List[Any] = None  # type: ignore[assignment]
    sizes: List[Dict[str, Any]] = None  # type: ignore[assignment]


def chunked(values: Sequence[int], size: int) -> Iterable[List[int]]:
    iterator = iter(values)
    while True:
        chunk = list(islice(iterator, size))
        if not chunk:
            return
        yield chunk


def first_photo_url(photos: Any) -> str:
    if not photos:
        return ""
    if isinstance(photos, str):
        text = photos.strip()
        if not text:
            return ""
        if text[:1] in {"[", "{"}:
            try:
                return first_photo_url(json.loads(text))
            except Exception:
                return text
        return text
    if isinstance(photos, list):
        for photo in photos:
            if isinstance(photo, str) and photo.strip():
                return photo.strip()
            if isinstance(photo, dict):
                for key in ("big", "c516x688", "square", "tm", "url", "src"):
                    value = photo.get(key)
                    if isinstance(value, str) and value.strip():
                        return value.strip()
    if isinstance(photos, dict):
        for key in ("big", "c516x688", "square", "tm", "url", "src"):
            value = photos.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
    return ""


def extract_size_quantity(size: Dict[str, Any]) -> int:
    for key in ("quantity", "stock", "amount", "remain", "available", "balance"):
        value = size.get(key)
        if value is None:
            continue
        try:
            return max(0, int(value))
        except (TypeError, ValueError):
            continue
    return 0


def card_total_stock(card: Dict[str, Any]) -> int:
    return sum(extract_size_quantity(size) for size in (card.get("sizes") or []))


class WildberriesClient:
    def __init__(
        self,
        token: Optional[str] = None,
        *,
        timeout: int = 60,
        max_retries: int = 4,
        session: Optional[requests.Session] = None,
    ) -> None:
        self.token = (token or settings.wildberries.token or "").strip()
        self.timeout = timeout
        self.max_retries = max_retries
        self.session = session or requests.Session()

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

    def request_json(
        self,
        method: str,
        url: str,
        *,
        payload: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> Any:
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
                raise RuntimeError(f"WB request failed for {url}: {exc}") from exc
        raise RuntimeError(f"WB request failed for {url}: {last_error}")

    def fetch_cards(
        self,
        max_cards: Optional[int] = None,
        *,
        positive_stock_only: bool = True,
    ) -> List[Dict[str, Any]]:
        cards: List[Dict[str, Any]] = []
        cursor: Dict[str, Any] = {"limit": 100}
        limit = max_cards or settings.wildberries.max_cards

        while True:
            payload = {
                "settings": {
                    "sort": {"ascending": True},
                    "cursor": cursor,
                    "filter": {"withPhoto": -1},
                }
            }
            data = self.request_json("POST", settings.wildberries.content_url, payload=payload)
            batch = (data or {}).get("cards") or []
            for card in batch:
                if positive_stock_only and card_total_stock(card) <= 0:
                    continue
                cards.append(card)
                if len(cards) >= limit:
                    return cards[:limit]

            response_cursor = (data or {}).get("cursor") or {}
            if len(batch) < cursor["limit"]:
                break
            if not response_cursor.get("updatedAt") or not response_cursor.get("nmID"):
                break
            cursor = {
                "limit": 100,
                "updatedAt": response_cursor["updatedAt"],
                "nmID": response_cursor["nmID"],
            }

        return cards[:limit]

    def fetch_prices(self, nm_ids: Sequence[int]) -> Dict[int, Decimal]:
        prices: Dict[int, Decimal] = {}
        unique_nm_ids = list(dict.fromkeys(int(nm_id) for nm_id in nm_ids))

        for batch in chunked(unique_nm_ids, 1000):
            data = self.request_json(
                "POST",
                settings.wildberries.prices_url,
                payload={"nmList": batch},
            )
            items = (((data or {}).get("data") or {}).get("listGoods")) or []
            for item in items:
                nm_id = item.get("nmID")
                sizes = item.get("sizes") or []
                if nm_id is None or not sizes:
                    continue
                size = sizes[0]
                price_value = size.get("discountedPrice")
                if price_value is None:
                    price_value = size.get("price")
                if price_value is None:
                    continue
                prices[int(nm_id)] = Decimal(str(price_value))

        return prices

    def fetch_warehouses(self) -> List[Dict[str, Any]]:
        data = self.request_json("GET", settings.wildberries.warehouses_url)
        warehouses: List[Dict[str, Any]] = []
        for item in data or []:
            warehouse_id = item.get("id")
            if warehouse_id is None:
                continue
            warehouses.append(
                {
                    "id": int(warehouse_id),
                    "name": str(item.get("name") or item.get("title") or f"WB {warehouse_id}"),
                }
            )
        return warehouses

    def fetch_stocks_for_warehouse(
        self,
        warehouse_id: int,
        chrt_ids: Sequence[int],
    ) -> Dict[int, int]:
        if not chrt_ids:
            return {}
        url = settings.wildberries.stocks_url.format(warehouse_id=warehouse_id)
        data = self.request_json(
            "POST",
            url,
            payload={"chrtIds": list(chrt_ids)},
        )
        stocks = (data or {}).get("stocks") or []
        result: Dict[int, int] = {}
        for item in stocks:
            chrt_id = item.get("chrtId")
            amount = item.get("amount", 0)
            if chrt_id is None:
                continue
            result[int(chrt_id)] = int(amount or 0)
        return result

    @staticmethod
    def nonzero_cards(cards: Sequence[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return [card for card in cards if card_total_stock(card) > 0]
