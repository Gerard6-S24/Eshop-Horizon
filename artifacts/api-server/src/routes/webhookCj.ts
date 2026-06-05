import { Router } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { ordersCjTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { updateWooOrderTracking } from "../services/woocommerceService";
import { sendTrackingEmail, sendAdminAlert } from "../services/resendService";

const router = Router();

function verifyCjSignature(secret: string, rawBody: Buffer, signature: string): boolean {
  if (!secret || !signature) return true; // skip if not configured
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

interface CjStatusUpdate {
  orderNum?: string;
  cjOrderId?: string;
  status?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  logisticsName?: string;
}

router.post("/webhook/cj/status-update", async (req, res) => {
  const secret = process.env.CJ_WEBHOOK_SECRET ?? "";
  const signature = req.headers["x-cj-signature"] as string ?? "";
  const rawBody: Buffer = (req as any).rawBody ?? Buffer.from(JSON.stringify(req.body));

  if (secret && !verifyCjSignature(secret, rawBody, signature)) {
    req.log.warn("CJ webhook signature mismatch");
    res.status(401).json({ error: "Invalid signature" }); return;
  }

  const payload = req.body as CjStatusUpdate;
  const cjOrderId = payload.cjOrderId ?? "";
  const wooOrderNum = payload.orderNum ?? "";

  // Derive wooOrderId from orderNum (format: "WOO-123")
  const wooOrderId = wooOrderNum.replace(/^WOO-/, "");

  req.log.info({ cjOrderId, wooOrderId, status: payload.status }, "CJ status webhook received");

  res.status(200).json({ received: true });

  void (async () => {
    try {
      const [row] = await db
        .select()
        .from(ordersCjTable)
        .where(eq(ordersCjTable.wooOrderId, wooOrderId));

      if (!row) {
        req.log.warn({ wooOrderId, cjOrderId }, "CJ webhook: order not found in DB");
        return;
      }

      const trackingNumber = payload.trackingNumber ?? "";
      const trackingUrl = payload.trackingUrl ?? "";
      const carrier = payload.logisticsName ?? "Unknown";
      const newStatus = payload.status ?? row.status;

      await db.update(ordersCjTable).set({
        status: newStatus,
        trackingNumber: trackingNumber || row.trackingNumber,
        trackingUrl: trackingUrl || row.trackingUrl,
        shippingCarrier: carrier || row.shippingCarrier,
        updatedAt: new Date(),
      }).where(eq(ordersCjTable.id, row.id));

      // Only propagate to WooCommerce + email when we have a tracking number
      if (trackingNumber) {
        await updateWooOrderTracking(wooOrderId, trackingNumber, trackingUrl, carrier);
        await sendTrackingEmail(row.customerEmail, wooOrderId, trackingNumber, trackingUrl, carrier);
        req.log.info({ wooOrderId, trackingNumber }, "Tracking propagated to WooCommerce and customer");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      req.log.error({ err, wooOrderId, cjOrderId }, "Failed to process CJ status update");
      await sendAdminAlert(wooOrderId, message, "webhook/cj/status-update").catch(() => {});
    }
  })();
});

export default router;
