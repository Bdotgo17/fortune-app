require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { nanoid } = require("nanoid");
const { seededFortune } = require("./fortunes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const FORTUNE_PRICE_CENTS = Number(process.env.FORTUNE_PRICE_CENTS || 100);

// Optional: configure the exact product variant to charge via env
const SHOPIFY_VARIANT_GID = process.env.SHOPIFY_VARIANT_GID;

// In-memory store for pending purchases (demo only)
const purchases = new Map();

app.post("/api/create-checkout", async (req, res) => {
  // Create a Shopify checkout using the Storefront API if credentials exist.
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

  const id = nanoid(10);

  if (!storeDomain || !token) {
    // Simulate a checkout flow: return a local fake URL that the frontend can "complete".
    const fakeUrl = `${req.protocol}://${req.get("host")}/simulate-checkout/${id}`;
    purchases.set(id, { paid: false, price: FORTUNE_PRICE_CENTS });
    return res.json({ checkoutUrl: fakeUrl, checkoutId: id });
  }

  // TODO: Replace with real Storefront API call. This is a placeholder showing how you'd structure it.
  try {
    const storefrontUrl = `https://${storeDomain}/api/2024-10/graphql.json`;
    const mutation = `mutation checkoutCreate($input: CheckoutCreateInput!) { checkoutCreate(input: $input) { checkout { id webUrl } userErrors { field message } } }`;
    // Prefer a configured variant GID. If not provided, use a placeholder (likely to fail).
    const variantId = SHOPIFY_VARIANT_GID || "gid://shopify/ProductVariant/0";
    const variables = { input: { lineItems: [{ variantId, quantity: 1 }] } };

    const r = await axios.post(
      storefrontUrl,
      { query: mutation, variables },
      {
        headers: {
          "X-Shopify-Storefront-Access-Token": token,
          "Content-Type": "application/json",
        },
      },
    );

    const webUrl = r.data?.data?.checkoutCreate?.checkout?.webUrl;
    purchases.set(id, {
      paid: false,
      price: FORTUNE_PRICE_CENTS,
      shopifyResponse: r.data,
    });
    return res.json({ checkoutUrl: webUrl, checkoutId: id });
  } catch (err) {
    console.error("checkout error", err?.response?.data || err.message);
    return res.status(500).json({ error: "checkout_failed" });
  }
});

app.get("/simulate-checkout/:id", (req, res) => {
  // Simple HTML page to simulate payment completion for local testing.
  const id = req.params.id;
  if (!purchases.has(id)) return res.status(404).send("Checkout not found");
  return res.send(
    `<html><body><h1>Simulated Checkout</h1><p>Pay $${(FORTUNE_PRICE_CENTS / 100).toFixed(2)} to see your fortune.</p><form method="POST" action="/simulate-checkout/${id}/pay"><button type="submit">Pay $${(FORTUNE_PRICE_CENTS / 100).toFixed(2)}</button></form></body></html>`,
  );
});

app.post("/simulate-checkout/:id/pay", (req, res) => {
  const id = req.params.id;
  const p = purchases.get(id);
  if (!p) return res.status(404).send("Not found");
  p.paid = true;
  purchases.set(id, p);
  // redirect back to frontend success flow
  return res.redirect(`/success?checkoutId=${id}`);
});

app.post("/api/fortune", (req, res) => {
  // Accepts { checkoutId, seed } and returns fortune when paid.
  const { checkoutId, seed } = req.body;
  if (!checkoutId) return res.status(400).json({ error: "missing_checkoutId" });

  const p = purchases.get(checkoutId);
  if (!p) return res.status(404).json({ error: "checkout_not_found" });

  if (!p.paid) return res.status(402).json({ error: "payment_required" });

  const fortune = seededFortune(seed || checkoutId);
  return res.json({ fortune });
});

// Webhook placeholder
app.post("/api/webhook", (req, res) => {
  // TODO: verify HMAC and mark purchases as paid when Shopify notifies of completed payment
  res.status(200).send("ok");
});

app.listen(PORT, () =>
  console.log(`Fortune backend running on http://localhost:${PORT}`),
);
