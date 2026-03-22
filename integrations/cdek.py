"""CDEK delivery helper for CatcherFish."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional

import requests

from config import settings


@dataclass
class CdekConfig:
    client_id: str = ""
    client_secret: str = ""


class CdekClient:
    def __init__(self, client_id: str = "", client_secret: str = "", timeout: int = 30) -> None:
        self.client_id = client_id or settings.cdek.client_id
        self.client_secret = client_secret or settings.cdek.client_secret
        self.timeout = timeout
        self.session = requests.Session()

    def _token(self) -> str:
        response = self.session.post(
            "https://api.cdek.ru/v2/oauth/token",
            data={
                "grant_type": "client_credentials",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
            },
            timeout=self.timeout,
        )
        response.raise_for_status()
        return response.json().get("access_token", "")

    def calc_tariff(self, from_location: Dict[str, Any], to_location: Dict[str, Any], packages: list[Dict[str, Any]]) -> Dict[str, Any]:
        token = self._token()
        response = self.session.post(
            "https://api.cdek.ru/v2/calculator/tariff",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "from_location": from_location,
                "to_location": to_location,
                "packages": packages,
            },
            timeout=self.timeout,
        )
        response.raise_for_status()
        return response.json()
