# CatcherFish -> WooCommerce Migration

This document freezes the useful parts of the current custom project and maps them to a practical WooCommerce launch path.

## Goal

Move from the custom FastAPI/JS stack to a stable WooCommerce store while preserving:

- product catalog
- images
- categories and collections
- product copy and UI wording
- cart and checkout behavior
- order statuses and customer account flow
- SKU-based inventory mapping

## What to keep from the current project

- `index.html` copy and layout ideas
- product names and descriptions
- category structure
- hero text, banners, buttons, trust blocks
- card layout logic
- checkout fields
- account panel structure
- admin panel section names

## What not to carry over

- custom backend glue
- temporary CORS / cache-bust hacks
- browser-local fallback logic
- simulated analytics and test-only data
- ad-hoc sync scripts for the current custom API

## Suggested WooCommerce target structure

- WooCommerce store as the core shop system
- WordPress theme for storefront
- WooCommerce My Account for customer area
- WooCommerce admin for order management
- plugin-based integrations for payment, shipping, and notifications

## Field mapping

| Current project | WooCommerce |
| --- | --- |
| `sku` | SKU |
| `name` | Product name |
| `description` | Description |
| `price` | Regular price |
| `price_old` | Sale price or compare price |
| `stock` | Stock quantity |
| `photos` | Gallery images |
| `category` | Product category |
| `status` | Publish / draft |
| `is_published` | Catalog visibility |

## First 7 days plan

### Day 1

- choose hosting
- install WordPress
- install WooCommerce
- set permalinks and basic pages

### Day 2

- import a small test batch of products
- verify SKU, price, image, and stock mapping

### Day 3

- apply a theme
- rebuild the homepage and catalog sections

### Day 4

- configure cart and checkout
- configure customer account pages

### Day 5

- connect payment gateway
- connect shipping methods

### Day 6

- verify order statuses
- verify email notifications

### Day 7

- import the full catalog
- do a final smoke test

## Data export package to prepare

- products CSV
- categories CSV
- images folder or image URLs list
- stock export
- customer/order notes if needed

## Ozon test import

- Use [`ozon_to_woo_sample.py`](./ozon_to_woo_sample.py) to test the Ozon seller API connection.
- It fetches up to 5 products and exports a WooCommerce-ready CSV.
- Required env vars:
  - `OZON_CLIENT_ID`
  - `OZON_API_KEY`
- Output file:
  - `woo_ozon_sample.csv`

## Recommended launch strategy

1. Launch a clean WooCommerce base.
2. Run the Ozon sample export for 5 products.
3. Import 10-20 products first.
4. Check the cart and checkout.
5. Import the rest of the catalog.
6. Turn on payment and shipping.
7. Only after that add integrations and automation.

## Notes

- WooCommerce is the stable source of truth for the shop.
- Keep the custom project as an archive/reference, not as the production core.
- If a feature is not needed in week one, do not migrate it yet.
