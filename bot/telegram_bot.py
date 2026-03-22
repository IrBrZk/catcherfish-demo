"""
Telegram notifications for CatcherFish.

Used by sync jobs, checkout flow and admin alerts.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import requests

from config import settings


@dataclass
class TelegramBot:
    token: str = settings.telegram.bot_token
    chat_id: str = settings.telegram.chat_id
    timeout: int = 15

    @property
    def enabled(self) -> bool:
        return bool(self.token and self.chat_id)

    def send(self, text: str, *, chat_id: Optional[str] = None) -> bool:
        if not self.enabled:
            return False
        target_chat_id = chat_id or self.chat_id
        try:
            response = requests.post(
                f"https://api.telegram.org/bot{self.token}/sendMessage",
                json={
                    "chat_id": target_chat_id,
                    "text": text,
                    "disable_web_page_preview": True,
                },
                timeout=self.timeout,
            )
            response.raise_for_status()
            return True
        except requests.RequestException:
            return False

    def send_error(self, title: str, error: Exception | str, *, chat_id: Optional[str] = None) -> bool:
        return self.send(f"❌ {title}\nОшибка: {error}", chat_id=chat_id)

    def send_success(self, title: str, details: str = "", *, chat_id: Optional[str] = None) -> bool:
        message = f"✅ {title}"
        if details:
            message = f"{message}\n{details}"
        return self.send(message, chat_id=chat_id)

    def send_report(self, title: str, lines: list[str], *, chat_id: Optional[str] = None) -> bool:
        message = [f"📋 {title}"]
        message.extend(lines)
        return self.send("\n".join(message), chat_id=chat_id)


bot = TelegramBot()

