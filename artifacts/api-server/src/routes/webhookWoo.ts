import { Router } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { webhookLogsTable, ordersCjTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createCjOrder, mapWooAddressToCj, type WooOrder } from "../services/cjService";
import { sendOrderConfirmation, sendAdminAlert } from "../services/resendService";

const router = Router();

function verifyWooSignature(secret: string, rawBody: Buffer, signature: string): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

router.post(
  "/webhook/woocommerce/order-created",
  async (req, res) => {
    const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET ?? "";
    const signature = req.headers["x-wc-webhook-signature"] as string ?? "";
    const rawBody: Buffer = (req as any).rawBody ?? Buffer.from(JSON.stringify(req.body));

    if (secret && !verifyWooSignature(secret, rawBody, signature)) {
      req.log.warn("WooCommerce webhook signature mismatch");
      res.status(401).json({ error: "Invalid signature" }); return;
    }

    const order = req.body as WooOrder;
    const wooOrderId = String(order.id);

    // Audit log
    const [log] = await db.insert(webhookLogsTable).values({
      wooOrderId,
      event: "order.created",
      payload: req.body as Record<string, unknown>,
      status: "received",
    }).returning();

    req.log.info({ wooOrderId, logId: log.id }, "WooCommerce webhook received");

    // Ack immediately — process async
    res.status(200).json({ received: true, logId: log.id });

    // Async processing
    void (async () => {
      try {
        // Check for duplicate
        const existing = await db
          .select()
          .from(ordersCjTable)
          .where(eq(ordersCjTable.wooOrderId, wooOrderId));

        if (existing.length > 0) {
          req.log.info({ wooOrderId }, "Duplicate WooCommerce order — skipping");
          await db.update(webhookLogsTable)
            .set({ status: "duplicate" })
            .where(eq(webhookLogsTable.id, log.id));
          return;
        }

        // Map and create CJ order
        const shippingAddress = mapWooAddressToCj(order.shipping, order.billing);
        const products = order.line_items.map(item => ({
          vid: item.sku,          // CJ variant ID = WooCommerce SKU
          quantity: item.quantity,
        }));

        const [cjOrder] = await db.insert(ordersCjTable).values({
          wooOrderId,
          customerEmail: order.billing.email,
          status: "pending",
          payload: req.body as Record<string, unknown>,
        }).returning();

        const { cjOrderId } = await createCjOrder({
          orderNumber: `WOO-${wooOrderId}`,
          shippingAddress,
          products,
        });

        await db.update(ordersCjTable)
          .set({ cjOrderId, status: "submitted", updatedAt: new Date() })
          .where(eq(ordersCjTable.id, cjOrder.id));

        await db.update(webhookLogsTable)
          .set({ status: "processed" })
          .where(eq(webhookLogsTable.id, log.id));

        req.log.info({ wooOrderId, cjOrderId }, "Order submitted to CJ");

        await sendOrderConfirmation(order.billing.email, wooOrderId, cjOrderId);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        req.log.error({ err, wooOrderId }, "Failed to process WooCommerce order");

        await db.update(webhookLogsTable)
          .set({ status: "error", error: message })
          .where(eq(webhookLogsTable.id, log.id));

        await db.update(ordersCjTable)
          .set({ status: "error", error: message, updatedAt: new Date() })
          .where(eq(ordersCjTable.wooOrderId, wooOrderId))
          .catch(() => {});

        await sendAdminAlert(wooOrderId, message, "webhook/woocommerce/order-created").catch(() => {});
      }
    })();
  },
);

export default router;
