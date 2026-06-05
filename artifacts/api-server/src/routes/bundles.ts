import { Router } from "express";
import { db } from "@workspace/db";
import { bundlesTable } from "@workspace/db";

const router = Router();

router.get("/bundles", async (req, res) => {
  try {
    const bundles = await db.select().from(bundlesTable);
    res.json(bundles.map(formatBundle));
  } catch (err) {
    req.log.error({ err }, "Failed to list bundles");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatBundle(b: typeof bundlesTable.$inferSelect) {
  return {
    id: b.id,
    name: b.name,
    description: b.description,
    price: parseFloat(b.price),
    originalPrice: parseFloat(b.originalPrice),
    discountPercent: b.discountPercent,
    popular: b.popular,
    bestValue: b.bestValue,
    items: b.items ?? [],
  };
}

export default router;
