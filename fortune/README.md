# Fortune App — Scaffold

[![build](https://img.shields.io/github/actions/workflow/status/Bdotgo17/fortune/ci.yml?branch=main&label=build&style=for-the-badge)](https://github.com/Bdotgo17/fortune/actions/workflows/ci.yml)
[![backend](https://img.shields.io/github/actions/workflow/status/Bdotgo17/fortune/ci.yml?branch=main&label=backend&job=Backend%20tests&style=for-the-badge)](https://github.com/Bdotgo17/fortune/actions/workflows/ci.yml)
[![frontend](https://img.shields.io/github/actions/workflow/status/Bdotgo17/fortune/ci.yml?branch=main&label=frontend&job=Frontend%20build&style=for-the-badge)](https://github.com/Bdotgo17/fortune/actions/workflows/ci.yml)

A small demo web app (Vite + React frontend, Express backend) that returns a short fortune after a $1 checkout. The repository includes a simulated local checkout flow and optional Shopify Storefront wiring.

Repository structure

- `backend/` — Express API with endpoints to create checkouts, simulate payment, and return fortunes
- `frontend/` — Vite + React single-page app that starts a checkout and reveals the purchased fortune

Quick start (developer)

1. Copy environment variables into `backend/.env` from `backend/.env.example` and set real values if you have a Shopify store.
2. Start the backend:

```bash
cd backend
npm install
npm run dev
```

3. Start the frontend in a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

4. Open the app at http://localhost:5173 and follow the UI. Without Shopify credentials the app uses a simulated checkout flow (local "pay" page).

Shopify notes

- To enable real payments you must set the following in `backend/.env`:
  - `SHOPIFY_STORE_DOMAIN` (e.g. `your-store.myshopify.com`)
  - `SHOPIFY_STOREFRONT_TOKEN` (Storefront API access token)
  - `SHOPIFY_VARIANT_GID` (Product variant GID to charge for)
- The backend includes a webhook skeleton; in production you must verify HMAC signatures and persist purchases to a database.

Security and limitations

- This scaffold stores pending purchases in memory and uses simulated flows when credentials are missing. Do not use as-is in production.
- Keep secrets out of git. Use `backend/.env` (already in `.gitignore`) or a secrets manager.

Development & CI

- A GitHub Actions workflow lives at `.github/workflows/ci.yml` and runs backend tests and builds the frontend on pushes to `main`.

License & next steps

- This scaffold is provided as-is. Next steps: add persistent storage, secure webhooks, and a proper payment/product flow with Shopify.

See `backend/README.md` and `frontend/README.md` for more detailed instructions.
