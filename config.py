"""
CatcherFish configuration.

Loads environment variables from `.env` in the project root and exposes
typed settings for the database, Wildberries, Ozon, Telegram and website.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
load_dotenv()


def _env(name: str, default: Optional[str] = None) -> str:
    value = os.getenv(name, default)
    return value if value is not None else ""


def _env_int(name: str, default: int) -> int:
    value = _env(name, str(default)).strip()
    try:
        return int(value)
    except ValueError:
        return default


def _env_float(name: str, default: float) -> float:
    value = _env(name, str(default)).strip()
    try:
        return float(value)
    except ValueError:
        return default


def _env_bool(name: str, default: bool) -> bool:
    value = _env(name, "1" if default else "0").strip().lower()
    return value in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class DatabaseConfig:
    host: str = _env("DB_HOST", "localhost")
    port: int = _env_int("DB_PORT", 5432)
    name: str = _env("DB_NAME", "catcherfish_db")
    user: str = _env("DB_USER", "catcherfish_user")
    password: str = _env("DB_PASSWORD", "")


@dataclass(frozen=True)
class TelegramConfig:
    bot_token: str = _env("TELEGRAM_BOT_TOKEN", "")
    chat_id: str = _env("TELEGRAM_CHAT_ID", "")
    daily_report_chat_id: str = _env("TELEGRAM_DAILY_REPORT_CHAT_ID", _env("TELEGRAM_CHAT_ID", ""))


@dataclass(frozen=True)
class WildberriesConfig:
    token: str = _env("WB_API_TOKEN", "")
    content_url: str = "https://content-api.wildberries.ru/content/v2/get/cards/list"
    prices_url: str = "https://discounts-prices-api.wildberries.ru/api/v2/list/goods/filter"
    warehouses_url: str = "https://marketplace-api.wildberries.ru/api/v3/warehouses"
    stocks_url: str = "https://marketplace-api.wildberries.ru/api/v3/stocks/{warehouse_id}"
    max_cards: int = _env_int("WB_MAX_CARDS", 60)
    sync_interval_minutes: int = _env_int("WB_SYNC_INTERVAL_MINUTES", 15)


@dataclass(frozen=True)
class OzonConfig:
    client_id: str = _env("OZON_CLIENT_ID", "")
    api_key: str = _env("OZON_API_KEY", "")
    api_base: str = "https://api-seller.ozon.ru"
    sync_interval_minutes: int = _env_int("OZON_SYNC_INTERVAL_MINUTES", 15)


@dataclass(frozen=True)
class YukassaConfig:
    shop_id: str = _env("YUKASSA_SHOP_ID", "")
    secret_key: str = _env("YUKASSA_SECRET_KEY", "")


@dataclass(frozen=True)
class CdekConfig:
    client_id: str = _env("CDEK_CLIENT_ID", "")
    client_secret: str = _env("CDEK_CLIENT_SECRET", "")


@dataclass(frozen=True)
class AppConfig:
    api_base: str = _env("API_BASE", "https://irbrzk.github.io/catcherfish-demo")
    site_url: str = _env("SITE_URL", "https://irbrzk.github.io/catcherfish-demo")
    debug: bool = _env_bool("DEBUG", False)
    request_timeout_seconds: int = _env_int("REQUEST_TIMEOUT_SECONDS", 60)
    rate_limit_wb_rps: float = _env_float("RATE_LIMIT_WB_RPS", 5.0)
    rate_limit_ozon_rps: float = _env_float("RATE_LIMIT_OZON_RPS", 10.0)


@dataclass(frozen=True)
class Settings:
    database: DatabaseConfig = DatabaseConfig()
    telegram: TelegramConfig = TelegramConfig()
    wildberries: WildberriesConfig = WildberriesConfig()
    ozon: OzonConfig = OzonConfig()
    yukassa: YukassaConfig = YukassaConfig()
    cdek: CdekConfig = CdekConfig()
    app: AppConfig = AppConfig()


settings = Settings()
