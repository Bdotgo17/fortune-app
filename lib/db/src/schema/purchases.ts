import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const purchasesTable = pgTable("purchases", {
  id: text("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").unique(),
  amountCents: integer("amount_cents").notNull(),
  fortuneSeed: text("fortune_seed").notNull(),
  paid: boolean("paid").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPurchaseSchema = createInsertSchema(purchasesTable).omit({ createdAt: true });
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchasesTable.$inferSelect;
