# CatcherFish MVP

This document defines the smallest useful version of CatcherFish that we can ship
without turning the project into a fragmented multi-marketplace tangle.

## MVP Goal

- PostgreSQL is the single source of truth.
- Wildberries is the first live source.
- The website reads only from our API / database.
- Admin panel works against the same database.
- Telegram notifies about sync errors and daily summaries.

## In Scope

### Core data

- `products`
- `stocks`
- `orders`
- `product_mapping`
- `sync_log`

### Core flows

- WB product sync
- WB stock sync
- read-only API for the frontend
- admin panel views for products, stocks, sync log, stats
- Telegram error notifications

## Out of Scope for MVP

- Yandex Market integration
- full checkout/payment automation
- advanced queue orchestration
- complex shipping logic
- MySklad
- multi-region warehouse optimization

## MVP Milestones

### Phase 1: Database and WB sync

- Keep the schema stable.
- Sync the first live WB catalog subset.
- Store non-zero stocks only.
- Normalize photos and product metadata.

### Phase 2: Read-only API

- Expose products, stocks, orders, sync log, and stats.
- Return normalized photo URLs.
- Keep frontend and admin panel on the same source of truth.

### Phase 3: Admin panel and catalog

- Show products from PostgreSQL.
- Show grouped stocks by source.
- Keep the catalog limited to published items with real stock.

### Phase 4: Notifications

- Send Telegram messages for sync errors.
- Send a short success summary after sync.

### Phase 5: Expand later

- Add Ozon adapter using the same contract.
- Add Yandex Market after Ozon.
- Add checkout and payment only after catalog/stocks are stable.

## Operating Rule

If a feature does not help us ship a stable catalog, stock visibility, or order intake,
it stays outside the MVP.

