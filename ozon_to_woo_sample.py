"""Export first Ozon products to a WooCommerce CSV sample.

This script is meant for the WooCommerce migration path:
1. test the Ozon seller API connection
2. fetch up to 5 products
3. export a WooCommerce-compatible CSV for import

Required env vars:
  OZON_CLIENT_ID
  OZON_API_KEY

Optional env vars:
  OZON_API_BASE=https://api-seller.ozon.ru
  OZON_SAMPLE_LIMIT=5
  OZON_OUT_CSV=woo_ozon_sample.csv
  OZON_OFFER_IDS=offer1,offer2,offer3,offer4,offer5
"""

from __future__ import annotations

import csv
import json
import os
from pathlib import Path
from typing import Any, Dict, Iterable, List

import requests
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
load_dotenv()


def env(name: str, default: str = "", required: bool = False) -> str:
    value = os.getenv(name, default)
    if required and not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value or ""


def api_headers() -> Dict[str, str]:
    return {
        "Client-Id": env("OZON_CLIENT_ID", required=True),
        "Api-Key": env("OZON_API_KEY", required=True),
        "Content-Type": "application/json",
    }


def api_base() -> str:
    return env("OZON_API_BASE", "https://api-seller.ozon.ru").rstrip("/")


def post_json(path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    resp = requests.post(
        f"{api_base()}{path}",
        headers=api_headers(),
        json=payload,
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def extract_items(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    result = data.get("result") if isinstance(data, dict) else None
    for container in (result, data):
        if isinstance(container, dict):
            for key in ("items", "products", "list"):
                value = container.get(key)
                if isinstance(value, list):
                    return [item for item in value if isinstance(item, dict)]
    return []


def first_of(item: Dict[str, Any], keys: Iterable[str], default: Any = "") -> Any:
    for key in keys:
        value = item.get(key)
        if value not in (None, "", [], {}):
            return value
    return default


def flatten_images(item: Dict[str, Any]) -> str:
    raw = first_of(item, ("images", "image", "photos"), [])
    urls: List[str] = []
    if isinstance(raw, str) and raw:
        urls.append(raw)
    elif isinstance(raw, list):
        for obj in raw:
            if isinstance(obj, str) and obj:
                urls.append(obj)
            elif isinstance(obj, dict):
                candidate = first_of(obj, ("url", "src", "big", "c516x688", "square", "tm"), "")
                if candidate:
                    urls.append(str(candidate))
    elif isinstance(raw, dict):
        candidate = first_of(raw, ("url", "src", "big", "c516x688", "square", "tm"), "")
        if candidate:
            urls.append(str(candidate))
    return ", ".join(dict.fromkeys(urls))


def guess_stock(item: Dict[str, Any]) -> int:
    raw = first_of(item, ("stocks", "stock", "quantity", "available", "quantity_left"), 0)
    if isinstance(raw, dict):
        raw = first_of(raw, ("present", "available", "quantity", "count"), 0)
    if isinstance(raw, list):
        for obj in raw:
            if isinstance(obj, dict):
                val = first_of(obj, ("present", "available", "quantity", "count"), 0)
                try:
                    return int(float(val))
                except Exception:
                    continue
        return 0
    try:
        return int(float(raw))
    except Exception:
        return 0


def guess_price(item: Dict[str, Any]) -> str:
    raw = first_of(item, ("price", "price_index", "offer_price", "old_price", "min_price"), "")
    if isinstance(raw, dict):
        raw = first_of(raw, ("value", "amount", "price"), "")
    if isinstance(raw, (int, float)):
        return f"{raw:.2f}".rstrip("0").rstrip(".")
    return str(raw) if raw else ""


def guess_description(item: Dict[str, Any]) -> str:
    return str(first_of(item, ("description", "text", "comment"), ""))


def guess_category(item: Dict[str, Any]) -> str:
    return str(first_of(item, ("category_name", "category", "category_name_path", "type"), "Ozon"))


def product_id_value(item: Dict[str, Any]) -> str:
    return str(first_of(item, ("product_id", "id", "offer_id", "sku"), "")).strip()


def fetch_first_products(limit: int) -> List[Dict[str, Any]]:
    offer_ids = [x.strip() for x in env("OZON_OFFER_IDS", "").split(",") if x.strip()]
    if not offer_ids:
        raise RuntimeError(
            "OZON_OFFER_IDS is not set. Ozon Seller API exposes product info methods by product identifiers; "
            "set OZON_OFFER_IDS=offer1,offer2,... for the 5 products you want to export."
        )
    selected = offer_ids[:limit]
    data = try_fetch_detail(
        "/v2/product/info/list",
        [
            {"offer_id": selected},
            {"filter": {"offer_id": selected}},
            {"product_id": selected},
            {"filter": {"product_id": selected}},
        ],
    )
    items = extract_items(data)
    if not items:
        raise RuntimeError("Ozon API returned no products for the provided offer IDs")
    return items[:limit]


def try_fetch_detail(path: str, payloads: List[Dict[str, Any]]) -> Dict[str, Any]:
    last_error: Exception | None = None
    for payload in payloads:
        try:
            return post_json(path, payload)
        except Exception as exc:
            last_error = exc
    if last_error:
        raise last_error
    return {}


def main() -> int:
    limit = int(env("OZON_SAMPLE_LIMIT", "5") or "5")
    out_csv = Path(env("OZON_OUT_CSV", str(BASE_DIR / "woo_ozon_sample.csv")))

    conn_test = post_json("/v1/warehouse/list", {})
    warehouse_count = len(extract_items(conn_test))
    print(f"Ozon API connection OK. Warehouses found: {warehouse_count}")

    products = fetch_first_products(limit)
    product_ids = [product_id_value(item) for item in products if product_id_value(item)]

    details: Dict[str, Dict[str, Any]] = {}
    stocks: Dict[str, int] = {}

    if product_ids:
        try:
            detail_data = try_fetch_detail(
                "/v2/product/info/list",
                [
                    {"product_id": product_ids},
                    {"filter": {"product_id": product_ids}},
                    {"offer_id": product_ids},
                ],
            )
            for item in extract_items(detail_data):
                key = product_id_value(item)
                if key:
                    details[key] = item
        except Exception:
            pass

        try:
            stock_data = try_fetch_detail(
                "/v1/product/info/stocks",
                [
                    {"product_id": product_ids},
                    {"filter": {"product_id": product_ids}},
                    {"sku": product_ids},
                ],
            )
            for item in extract_items(stock_data):
                key = product_id_value(item)
                if key:
                    stocks[key] = guess_stock(item)
        except Exception:
            pass

    rows: List[Dict[str, Any]] = []
    for item in products:
        key = product_id_value(item)
        merged = {**item, **details.get(key, {})}
        stock = stocks.get(key, guess_stock(merged))
        name = str(first_of(merged, ("name", "title", "offer_id", "product_name"), f"Ozon {key}"))
        sku = str(first_of(merged, ("offer_id", "sku", "product_id", "id"), key))
        rows.append(
            {
                "Type": "simple",
                "SKU": sku,
                "Name": name,
                "Published": 1,
                "Is featured?": 0,
                "Catalog visibility": "visible",
                "Short description": guess_description(merged)[:255],
                "Description": guess_description(merged),
                "Regular price": guess_price(merged),
                "Sale price": "",
                "Stock": stock,
                "In stock?": 1 if stock > 0 else 0,
                "Categories": guess_category(merged),
                "Images": flatten_images(merged),
            }
        )

    out_csv.parent.mkdir(parents=True, exist_ok=True)
    with out_csv.open("w", newline="", encoding="utf-8-sig") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    print(f"Fetched {len(products)} products from Ozon API")
    print(f"Exported WooCommerce CSV: {out_csv}")
    print(json.dumps(
        {
            "sample": rows[:3],
            "product_ids": product_ids,
        },
        ensure_ascii=False,
        indent=2,
    ))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
