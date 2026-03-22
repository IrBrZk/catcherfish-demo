"""
CatcherFish main entry point.

Use this file to run sync jobs from cron or manually from the VPS:

    python main.py --task stock
    python main.py --task price
    python main.py --task orders
    python main.py --task all
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from sync.orders_sync import main as orders_sync_main
from sync.price_sync import main as price_sync_main
from sync.stock_sync import main as stock_sync_main


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="CatcherFish sync runner")
    parser.add_argument(
        "--task",
        choices=("stock", "price", "orders", "all"),
        default="stock",
        help="Which sync task to run",
    )
    return parser


def run_task(task: str) -> int:
    if task == "stock":
        return stock_sync_main()
    if task == "price":
        return price_sync_main()
    if task == "orders":
        return orders_sync_main()
    if task == "all":
        rc = stock_sync_main()
        if rc != 0:
            return rc
        rc = price_sync_main()
        if rc != 0:
            return rc
        return orders_sync_main()
    raise ValueError(f"Unsupported task: {task}")


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return run_task(args.task)


if __name__ == "__main__":
    raise SystemExit(main())

