"""
MoySklad sync stub for catcherfish_db.
TODO: MOYSKLAD_TOKEN in .env
Planned endpoints:
- GET https://api.moysklad.ru/api/remap/1.2/entity/product
- GET https://api.moysklad.ru/api/remap/1.2/entity/store
- GET https://api.moysklad.ru/api/remap/1.2/entity/stock/all
Logic:
- Compare MoySklad vs WB vs Ozon stock levels
- Discrepancy > 10% -> Telegram notification
"""

from __future__ import annotations


def main() -> int:
    print("sync_moysklad.py stub: TODO implement MoySklad sync")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
