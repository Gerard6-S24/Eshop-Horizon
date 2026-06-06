import { pgTable, serial, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

export const ordersCjTable = pgTable("orders_cj", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(),
  customerEmail: text("customer_email").notNull(),
  cjOrderId: text("cj_order_id"),
  paymentToken: text("payment_token"),
  status: text("status").notNull().default("pending"),
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  shippingCarrier: text("shipping_carrier"),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  error: text("error"),
  retryCount: integer("retry_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type OrderCj = typeof ordersCjTable.$inferSelect;
