"""
Импорт товаров и остатков из Excel/CSV в catcherfish_db
Использование:
  python import_excel.py products.xlsx --type products
  python import_excel.py stocks.xlsx --type stocks
  python import_excel.py data.csv --type products
"""

from __future__ import annotations

import argparse
import json
import os
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

import pandas as pd
import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import Json

from sync_wb import ensure_tables, send_telegram_message, write_sync_log


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
load_dotenv()


def env(name: str, default: Optional[str] = None, required: bool = False) -> str:
    value = os.getenv(name, default)
    if required and not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value or ""


def connect_db():
    return psycopg2.connect(
        host=env("DB_HOST", "localhost"),
        port=env("DB_PORT", "5432"),
        dbname=env("DB_NAME", required=True),
        user=env("DB_USER", required=True),
        password=env("DB_PASSWORD", required=True),
    )


def read_table(path: Path) -> pd.DataFrame:
    suffix = path.suffix.lower()
    if suffix == ".csv":
        return pd.read_csv(path, dtype=str, keep_default_na=False)
    if suffix in {".xlsx", ".xlsm", ".xls"}:
        return pd.read_excel(path, dtype=str)
    raise ValueError("Формат файла должен быть .csv или .xlsx")


def norm_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [str(col).strip().lower() for col in df.columns]
    return df


def clean_text(value: Any) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, float) and pd.isna(value):
        return None
    text = str(value).strip()
    return text or None


def clean_decimal(value: Any) -> Optional[Decimal]:
    text = clean_text(value)
    if text is None:
        return None
    try:
        return Decimal(text.replace(",", "."))
    except (InvalidOperation, ValueError):
        return None


def clean_int(value: Any) -> Optional[int]:
    text = clean_text(value)
    if text is None:
        return None
    try:
        return int(float(text.replace(",", ".")))
    except (TypeError, ValueError):
        return None


def parse_photos(value: Any) -> List[str]:
    text = clean_text(value)
    if not text:
        return []
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            items: List[str] = []
            for item in parsed:
                if isinstance(item, str) and item.strip():
                    items.append(item.strip())
                elif isinstance(item, dict):
                    candidate = item.get("big") or item.get("c516x688") or item.get("square") or item.get("tm") or item.get("url") or item.get("src")
                    if candidate:
                        items.append(str(candidate).strip())
            return [item for item in items if item]
        if isinstance(parsed, dict):
            candidate = parsed.get("big") or parsed.get("c516x688") or parsed.get("square") or parsed.get("tm") or parsed.get("url") or parsed.get("src")
            return [str(candidate).strip()] if candidate else []
    except json.JSONDecodeError:
        pass
    parts = [part.strip() for part in text.replace(";", ",").split(",")]
    return [part for part in parts if part]


def iter_rows(df: pd.DataFrame) -> Iterable[Dict[str, Any]]:
    for _, row in df.iterrows():
        yield {k: row.get(k) for k in df.columns}


def upsert_products(conn, df: pd.DataFrame) -> Dict[str, int]:
    added = updated = errors = 0
    with conn.cursor() as cur:
        for row in iter_rows(df):
            sku = clean_text(row.get("sku"))
            if not sku:
                errors += 1
                continue
            name = clean_text(row.get("name"))
            description = clean_text(row.get("description"))
            brand = clean_text(row.get("brand"))
            category = clean_text(row.get("category"))
            price = clean_decimal(row.get("price"))
            price_old = clean_decimal(row.get("price_old"))
            stock = clean_int(row.get("stock"))
            wb_nm_id = clean_text(row.get("wb_nm_id"))
            photos = parse_photos(row.get("photos"))
            source = clean_text(row.get("source")) or "import"

            cur.execute("SELECT 1 FROM products WHERE sku = %s", (sku,))
            existed = cur.fetchone() is not None
            cur.execute(
                """
                INSERT INTO products (
                    sku, wb_nm_id, name, description, brand, category, price_old, stock, photos, price, source, updated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (sku) DO UPDATE SET
                    wb_nm_id = COALESCE(EXCLUDED.wb_nm_id, products.wb_nm_id),
                    name = COALESCE(EXCLUDED.name, products.name),
                    description = COALESCE(EXCLUDED.description, products.description),
                    brand = COALESCE(EXCLUDED.brand, products.brand),
                    category = COALESCE(EXCLUDED.category, products.category),
                    price_old = COALESCE(EXCLUDED.price_old, products.price_old),
                    stock = COALESCE(EXCLUDED.stock, products.stock),
                    photos = COALESCE(EXCLUDED.photos, products.photos),
                    price = COALESCE(EXCLUDED.price, products.price),
                    source = EXCLUDED.source,
                    updated_at = NOW()
                """,
                (
                    sku,
                    wb_nm_id,
                    name,
                    description,
                    brand,
                    category,
                    price_old,
                    stock,
                    Json(photos),
                    price,
                    source,
                ),
            )
            if existed:
                updated += 1
            else:
                added += 1
    conn.commit()
    return {"added": added, "updated": updated, "errors": errors}


def upsert_stocks(conn, df: pd.DataFrame) -> Dict[str, int]:
    added = updated = errors = 0
    with conn.cursor() as cur:
        for row in iter_rows(df):
            sku = clean_text(row.get("sku"))
            warehouse = clean_text(row.get("warehouse"))
            quantity = clean_int(row.get("quantity"))
            if not sku or not warehouse or quantity is None:
                errors += 1
                continue
            source = clean_text(row.get("source")) or "manual"
            stock_type = clean_text(row.get("stock_type")) or "fbs"
            wb_nm_id = clean_text(row.get("wb_nm_id")) or sku
            moysklad_qty = clean_int(row.get("moysklad_qty"))

            cur.execute("SELECT 1 FROM stocks WHERE sku = %s AND warehouse = %s", (sku, warehouse))
            existed = cur.fetchone() is not None
            cur.execute(
                """
                INSERT INTO stocks (
                    sku, wb_nm_id, warehouse, quantity, source, stock_type, moysklad_qty, updated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (sku, warehouse) DO UPDATE SET
                    wb_nm_id = EXCLUDED.wb_nm_id,
                    quantity = EXCLUDED.quantity,
                    source = EXCLUDED.source,
                    stock_type = EXCLUDED.stock_type,
                    moysklad_qty = COALESCE(EXCLUDED.moysklad_qty, stocks.moysklad_qty),
                    updated_at = NOW()
                """,
                (sku, wb_nm_id, warehouse, quantity, source, stock_type, moysklad_qty),
            )
            if existed:
                updated += 1
            else:
                added += 1
    conn.commit()
    return {"added": added, "updated": updated, "errors": errors}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("file", help="Путь к .xlsx или .csv файлу")
    parser.add_argument("--type", choices=["products", "stocks"], required=True)
    args = parser.parse_args()

    path = Path(args.file)
    if not path.exists():
        raise SystemExit(f"Файл не найден: {path}")

    df = norm_columns(read_table(path))
    conn = None
    try:
        conn = connect_db()
        ensure_tables(conn)

        if args.type == "products":
            result = upsert_products(conn, df)
        else:
            result = upsert_stocks(conn, df)

        added = result["added"]
        updated = result["updated"]
        errors = result["errors"]
        status = "success" if errors == 0 else "partial"
        message = f"Импорт {args.type}: добавлено {added}, обновлено {updated}, ошибок {errors}"

        write_sync_log(
            conn,
            status,
            added + updated if args.type == "products" else 0,
            added + updated if args.type == "stocks" else 0,
            message=message,
            source="import",
        )
        send_telegram_message(f"✅ {message}")
        print(message)
        return 0 if errors == 0 else 1
    except Exception as exc:
        if conn is not None:
            conn.rollback()
            try:
                write_sync_log(conn, "error", 0, 0, error_message=f"{type(exc).__name__}: {exc}", source="import")
            except Exception:
                pass
        send_telegram_message(f"❌ Ошибка импорта\nФайл: {path.name}\nОшибка: {type(exc).__name__}: {exc}")
        raise
    finally:
        if conn is not None:
            conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
