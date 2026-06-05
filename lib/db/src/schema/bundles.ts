import { pgTable, serial, text, numeric, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bundlesTable = pgTable("bundles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }).notNull(),
  discountPercent: integer("discount_percent").notNull(),
  popular: boolean("popular").notNull().default(false),
  bestValue: boolean("best_value").notNull().default(false),
  items: jsonb("items").$type<string[]>().notNull().default([]),
});

export const insertBundleSchema = createInsertSchema(bundlesTable).omit({ id: true });
export type InsertBundle = z.infer<typeof insertBundleSchema>;
export type Bundle = typeof bundlesTable.$inferSelect;
