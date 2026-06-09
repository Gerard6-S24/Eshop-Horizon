import { pgTable, serial, text, numeric, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  featured: boolean("featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  badge: text("badge"),
  imageUrl: text("image_url"),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  benefits: jsonb("benefits").$type<string[]>().notNull().default([]),
  emotionalBenefits: jsonb("emotional_benefits").$type<string[]>().notNull().default([]),
  ingredients: text("ingredients"),
  usage: text("usage"),
  reviews: jsonb("reviews").$type<Array<{ id: number; author: string; city: string; rating: number; comment: string }>>().notNull().default([]),
  faq: jsonb("faq").$type<Array<{ question: string; answer: string }>>().notNull().default([]),
  relatedProductSlugs: jsonb("related_product_slugs").$type<string[]>().notNull().default([]),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
