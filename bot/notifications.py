"""Telegram notification helpers for CatcherFish."""

from __future__ import annotations

from typing import Iterable

from bot.telegram_bot import bot


def notify(text: str) -> bool:
    return bot.send(text)


def notify_error(title: str, error: Exception | str) -> bool:
    return bot.send_error(title, error)


def notify_success(title: str, details: str = "") -> bool:
    return bot.send_success(title, details)


def notify_report(title: str, lines: Iterable[str]) -> bool:
    return bot.send_report(title, list(lines))

