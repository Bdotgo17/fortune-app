import { runMigrations } from "stripe-replit-sync";
import { getStripeSync } from "./stripeClient";
import app from "./app";
import { logger } from "./lib/logger";

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  logger.info("Initializing Stripe schema...");
  await runMigrations({ databaseUrl, schema: "stripe" });
  logger.info("Stripe schema ready");

  const stripeSync = await getStripeSync();

  const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
  if (domain) {
    const webhookUrl = `https://${domain}/api/stripe/webhook`;
    logger.info({ webhookUrl }, "Setting up managed webhook");
    await stripeSync.findOrCreateManagedWebhook(webhookUrl);
  }

  stripeSync.syncBackfill()
    .then(() => logger.info("Stripe data sync complete"))
    .catch((err) => logger.error({ err }, "Stripe sync error"));
}

const rawPort = process.env["PORT"];
if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

await initStripe();

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});
