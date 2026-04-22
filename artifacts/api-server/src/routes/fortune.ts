import { Router, type IRouter } from "express";
import { nanoid } from "nanoid";
import { getUncachableStripeClient, getStripePublishableKey } from "../stripeClient";

const FORTUNES = [
  "A surprise encounter will bring you joy.",
  "Soon you will make a valuable connection.",
  "An unexpected opportunity will present itself.",
  "Trust your instincts this week.",
  "A small risk will bring a large reward.",
  "You will find clarity in an unlikely place.",
  "A short trip will change your perspective.",
  "A new hobby will bring lasting happiness.",
  "Someone admires your dedication.",
  "You will rediscover an old passion.",
  "Your persistence will be rewarded soon.",
  "A kind word today will return tenfold tomorrow.",
  "Something lost will find its way back to you.",
  "The answer you seek is closer than you think.",
  "A creative spark will ignite something wonderful.",
];

function seededFortune(seed: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const idx = Math.abs(h) % FORTUNES.length;
  return FORTUNES[idx];
}

const ALLOWED_AMOUNTS_CENTS = [100, 200, 500, 1000];

const router: IRouter = Router();

router.get("/fortune/publishable-key", async (req, res) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (err: any) {
    req.log.error({ err }, "Failed to get publishable key");
    res.status(500).json({ error: "Failed to get publishable key" });
  }
});

router.post("/fortune/checkout", async (req, res) => {
  const { amountCents } = req.body;

  if (!ALLOWED_AMOUNTS_CENTS.includes(amountCents)) {
    return res.status(400).json({
      error: "Invalid amount. Choose $1, $2, $5, or $10.",
    });
  }

  try {
    const stripe = await getUncachableStripeClient();
    const fortuneSeed = nanoid(16);
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
    const baseUrl = domain ? `https://${domain}` : `${req.protocol}://${req.get("host")}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: "Fortune Reading",
              description: `A personal fortune revealed just for you — $${(amountCents / 100).toFixed(2)}`,
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { fortuneSeed },
      success_url: `${baseUrl}/fortune/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/fortune`,
    });

    res.json({ url: session.url });
  } catch (err: any) {
    req.log.error({ err }, "Failed to create checkout session");
    res.status(500).json({ error: "Failed to create checkout" });
  }
});

router.get("/fortune/reveal", async (req, res) => {
  const { session_id } = req.query;
  if (!session_id || typeof session_id !== "string") {
    return res.status(400).json({ error: "Missing session_id" });
  }

  try {
    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(402).json({ error: "Payment not completed" });
    }

    const seed = session.metadata?.fortuneSeed ?? session_id;
    const fortune = seededFortune(seed);
    const amountCents = session.amount_total ?? 0;

    res.json({ fortune, amountCents });
  } catch (err: any) {
    req.log.error({ err }, "Failed to reveal fortune");
    res.status(500).json({ error: "Failed to retrieve fortune" });
  }
});

export default router;
