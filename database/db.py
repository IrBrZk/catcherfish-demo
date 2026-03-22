"""
PostgreSQL helpers for CatcherFish.

This module keeps the database access layer tiny and explicit so the rest
of the project can stay focused on business logic.
"""

from __future__ import annotations

from contextlib import contextmanager
from typing import Any, Dict, Generator, Iterable, List, Optional, Sequence, Tuple

import psycopg2
from psycopg2.extras import RealDictCursor

from config import settings


def connect():
    return psycopg2.connect(
        host=settings.database.host,
        port=settings.database.port,
        dbname=settings.database.name,
        user=settings.database.user,
        password=settings.database.password,
    )


@contextmanager
def connection() -> Generator[Any, None, None]:
    conn = connect()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


@contextmanager
def cursor(commit: bool = True, dict_rows: bool = False) -> Generator[Any, None, None]:
    conn = connect()
    cur = conn.cursor(cursor_factory=RealDictCursor if dict_rows else None)
    try:
        yield cur
        if commit:
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()


def fetch_one(query: str, params: Optional[Sequence[Any]] = None) -> Optional[Dict[str, Any]]:
    with cursor(commit=False, dict_rows=True) as cur:
        cur.execute(query, params or ())
        row = cur.fetchone()
        return dict(row) if row else None


def fetch_all(query: str, params: Optional[Sequence[Any]] = None) -> List[Dict[str, Any]]:
    with cursor(commit=False, dict_rows=True) as cur:
        cur.execute(query, params or ())
        rows = cur.fetchall() or []
        return [dict(row) for row in rows]


def execute(query: str, params: Optional[Sequence[Any]] = None) -> None:
    with cursor(commit=True, dict_rows=False) as cur:
        cur.execute(query, params or ())


def execute_many(query: str, values: Iterable[Sequence[Any]]) -> None:
    with cursor(commit=True, dict_rows=False) as cur:
        cur.executemany(query, list(values))

