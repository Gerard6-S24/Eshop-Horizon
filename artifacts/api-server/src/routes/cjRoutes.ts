import { Router } from "express";
import { db } from "@workspace/db";
import { ordersCjTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createCjOrder, mapWooAddressToCj, type CjCreateOrderPayload } from "../services/cjService";
import { sendOrderConfirmation, sendAdminAlert } from "../services/resendService";

const router = Router();

router.post("/cj/create-order", async (req, res) => {
  const { wooOrderId, customerEmail, shippingAddress, products, orderNumber } = req.body as {
    wooOrderId: string;
    customerEmail: string;
    orderNumber?: string;
    shippingAddress: CjCreateOrderPayload["shippingAddress"];
    products: CjCreateOrderPayload["products"];
  };

  if (!wooOrderId || !customerEmail || !shippingAddress || !products?.length) {
    res.status(400).json({ error: "Missing required fields: wooOrderId, customerEmail, shippingAddress, products" }); return;
  }

  try {
    let row = await db
      .select()
      .from(ordersCjTable)
      .where(eq(ordersCjTable.wooOrderId, String(wooOrderId)))
      .then(rows => rows[0] ?? null);

    if (!row) {
      [row] = await db.insert(ordersCjTable).values({
        wooOrderId: String(wooOrderId),
        customerEmail,
        status: "pending",
        payload: req.body as Record<string, unknown>,
      }).returning();
    }

    const { cjOrderId } = await createCjOrder({
      orderNumber: orderNumber ?? `WOO-${wooOrderId}`,
      shippingAddress,
      products,
    });

    await db.update(ordersCjTable).set({
      cjOrderId,
      status: "submitted",
      error: null,
      retryCount: (row.retryCount ?? 0) + 1,
      updatedAt: new Date(),
    }).where(eq(ordersCjTable.wooOrderId, String(wooOrderId)));

    req.log.info({ wooOrderId, cjOrderId }, "CJ order created via manual endpoint");
    await sendOrderConfirmation(customerEmail, String(wooOrderId), cjOrderId);

    res.status(201).json({ success: true, cjOrderId, wooOrderId }); return;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    req.log.error({ err, wooOrderId }, "CJ create-order failed");

    await db.update(ordersCjTable).set({
      status: "error",
      error: message,
      retryCount: 1,
      updatedAt: new Date(),
    }).where(eq(ordersCjTable.wooOrderId, String(wooOrderId))).catch(() => {});

    await sendAdminAlert(String(wooOrderId), message, "POST /api/cj/create-order").catch(() => {});

    res.status(502).json({ error: "Failed to create CJ order", detail: message }); return;
  }
});

router.post("/cj/retry/:wooOrderId", async (req, res) => {
  const { wooOrderId } = req.params;
  const [row] = await db.select().from(ordersCjTable).where(eq(ordersCjTable.wooOrderId, wooOrderId));
  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const payload = row.payload as Record<string, unknown>;
  const lineItems = Array.isArray((payload as any)?.line_items) ? (payload as any).line_items as any[] : [];
  const products = lineItems.map((item: any) => ({ vid: item.sku as string, quantity: item.quantity as number }));
  const shippingAddress = mapWooAddressToCj((payload as any)?.shipping ?? {}, (payload as any)?.billing ?? {});

  try {
    const { cjOrderId } = await createCjOrder({
      orderNumber: `WOO-${wooOrderId}`,
      shippingAddress,
      products,
    });

    await db.update(ordersCjTable).set({
      cjOrderId,
      status: "submitted",
      error: null,
      retryCount: (row.retryCount ?? 0) + 1,
      updatedAt: new Date(),
    }).where(eq(ordersCjTable.wooOrderId, wooOrderId));

    await sendOrderConfirmation(row.customerEmail, wooOrderId, cjOrderId);
    req.log.info({ wooOrderId, cjOrderId }, "CJ order retried successfully");
    res.json({ success: true, cjOrderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await db.update(ordersCjTable).set({
      status: "error",
      error: message,
      retryCount: (row.retryCount ?? 0) + 1,
      updatedAt: new Date(),
    }).where(eq(ordersCjTable.wooOrderId, wooOrderId));
    res.status(502).json({ error: message });
  }
});

export default router;
