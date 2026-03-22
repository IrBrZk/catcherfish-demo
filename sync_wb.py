"""
Синхронизация товаров WB -> PostgreSQL catcherfish_db.

Legacy-compatible wrapper for the MVP WB sync flow.

Запуск:
  python sync_wb.py

Cron:
  */15 * * * * /usr/bin/python3 /path/to/sync_wb.py
"""

from __future__ import annotations

import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from sync.stock_sync import main as stock_sync_main


def main() -> int:
    return stock_sync_main()


if __name__ == "__main__":
    raise SystemExit(main())
