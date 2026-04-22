Backend — Fortune App

This Express backend provides two main flows:

1. Simulated local flow (no Shopify credentials):
   - POST /api/create-checkout -> returns a local simulated checkout URL and checkoutId
   - Visit the returned URL and click "Pay" to mark the checkout paid
   - POST /api/fortune with { checkoutId, seed } -> returns the fortune if paid

2. Real Shopify Storefront flow (requires env vars):
   - Set `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN` in `backend/.env`
   - POST /api/create-checkout -> server will call Shopify Storefront API to create a checkout and return the webUrl
   - After payment completes in Shopify, a webhook (not fully implemented) should mark the purchase as paid and allow /api/fortune to return a fortune

.env variables (see `.env.example`):

- SHOPIFY_STORE_DOMAIN
- SHOPIFY_STOREFRONT_TOKEN
- FORTUNE_PRICE_CENTS (default 100)
- PORT (default 4000)

Testing

- A tiny test runner is included at `backend/test/run-tests.js` which does a simulated create-checkout and pay flow.

Security

- This scaffold stores pending purchases in memory and does not validate webhooks. Do NOT use in production.
