import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateOrderBody } from "@workspace/api-zod";

const router = Router();

router.post("/orders", async (req, res) => {
  try {
    const parsed = CreateOrderBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed" }); return;
    }
    const body = parsed.data;

    const items = body.items.map((item) => ({
      productId: item.productId,
      productName: `Product #${item.productId}`,
      quantity: item.quantity,
      price: item.price,
    }));

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const [order] = await db.insert(ordersTable).values({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      postalCode: body.postalCode,
      country: body.country,
      status: "confirmed",
      total: total.toFixed(2),
      currency: body.currency ?? "EUR",
      items,
    }).returning();

    res.status(201).json(formatOrder(order));
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) res.status(400).json({ error: "Invalid order ID" }); return;

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) res.status(404).json({ error: "Order not found" }); return;

    res.json(formatOrder(order));
  } catch (err) {
    req.log.error({ err }, "Failed to get order");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatOrder(o: typeof ordersTable.$inferSelect) {
  return {
    id: o.id,
    firstName: o.firstName,
    lastName: o.lastName,
    email: o.email,
    phone: o.phone,
    address: o.address,
    city: o.city,
    postalCode: o.postalCode,
    country: o.country,
    status: o.status,
    total: parseFloat(o.total),
    currency: o.currency,
    items: (o.items as any[]).map((item, idx) => ({
      id: idx + 1,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
    })),
    createdAt: o.createdAt.toISOString(),
  };
}

export default router;
