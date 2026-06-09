import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const products = await db.select().from(productsTable);
    res.json(products.map(formatProduct));
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/featured", async (req, res) => {
  try {
    const products = await db.select().from(productsTable).where(eq(productsTable.featured, true));
    res.json(products.map(formatProduct));
  } catch (err) {
    req.log.error({ err }, "Failed to list featured products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:slug", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, req.params.slug));
    if (!product) {
      res.status(404).json({ error: "Product not found" }); return;
    }
    res.json(formatProduct(product));
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: parseFloat(p.price),
    originalPrice: parseFloat(p.originalPrice),
    description: p.description,
    shortDescription: p.shortDescription,
    featured: p.featured,
    isNew: p.isNew,
    isTrending: p.isTrending,
    badge: p.badge,
    imageUrl: p.imageUrl,
    benefits: p.benefits ?? [],
    emotionalBenefits: p.emotionalBenefits ?? [],
    ingredients: p.ingredients,
    usage: p.usage,
    reviews: p.reviews ?? [],
    faq: p.faq ?? [],
    relatedProductSlugs: p.relatedProductSlugs ?? [],
  };
}

export default router;
