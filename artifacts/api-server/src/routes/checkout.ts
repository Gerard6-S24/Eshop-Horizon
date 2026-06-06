import { Router } from "express";
import { db } from "@workspace/db";
import { ordersCjTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createCjOrder, mapAddressToCj } from "../services/cjService";
import { verifyGeniusPayToken } from "../services/geniusPayService";

const router = Router();

interface CheckoutBody {
  orderId: string;
  paymentToken: string;
  amount: number;
  currency: string;
  customerEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  products: { vid: string; quantity: number }[];
}

router.post("/checkout", async (req, res) => {
  const body = req.body as CheckoutBody;

  const { orderId, paymentToken, amount, currency = "EUR", customerEmail, firstName, lastName, phone, address, city, postalCode, country, products } = body;

  if (!orderId || !paymentToken || !customerEmail || !products?.length) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // ── 1. Verify payment server-side using GENIUS_PAY_SECRET_KEY ─────────────
  const verification = await verifyGeniusPayToken(paymentToken, amount ?? 0, currency);
  if (!verification.verified) {
    req.log.warn({ orderId, paymentToken, error: verification.error }, "GeniusPay verification failed");
    res.status(402).json({ error: "Paiement non vérifié", detail: verification.error });
    return;
  }

  // ── 2. Idempotency guard ──────────────────────────────────────────────────
  const [existing] = await db.select().from(ordersCjTable).where(eq(ordersCjTable.orderId, orderId));
  if (existing?.status === "submitted") {
    res.json({ success: true, cjOrderId: existing.cjOrderId, orderId });
    return;
  }

  const [row] = await db.insert(ordersCjTable).values({
    orderId,
    customerEmail,
    paymentToken,
    status: "pending",
    payload: body as unknown as Record<string, unknown>,
  }).onConflictDoUpdate({
    target: ordersCjTable.orderId,
    set: { paymentToken, status: "pending", updatedAt: new Date() },
  }).returning();

  try {
    const shippingAddress = mapAddressToCj({ firstName, lastName, address, city, postalCode, country, phone, email: customerEmail });

    const { cjOrderId } = await createCjOrder({
      orderNumber: orderId,
      shippingAddress,
      products,
    });

    await db.update(ordersCjTable).set({
      cjOrderId,
      status: "submitted",
      error: null,
      retryCount: (row.retryCount ?? 0) + 1,
      updatedAt: new Date(),
    }).where(eq(ordersCjTable.orderId, orderId));

    req.log.info({ orderId, cjOrderId }, "CJ order created successfully");
    res.status(201).json({ success: true, cjOrderId, orderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    req.log.error({ err, orderId }, "CJ order creation failed");

    await db.update(ordersCjTable).set({
      status: "error",
      error: message,
      retryCount: (row.retryCount ?? 0) + 1,
      updatedAt: new Date(),
    }).where(eq(ordersCjTable.orderId, orderId)).catch(() => {});

    res.status(502).json({ error: "CJ order creation failed", detail: message });
  }
});

router.post("/checkout/retry/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const [row] = await db.select().from(ordersCjTable).where(eq(ordersCjTable.orderId, orderId));
  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const payload = row.payload as Record<string, unknown>;

  try {
    const shippingAddress = mapAddressToCj({
      firstName: String(payload.firstName ?? ""),
      lastName: String(payload.lastName ?? ""),
      address: String(payload.address ?? ""),
      city: String(payload.city ?? ""),
      postalCode: String(payload.postalCode ?? ""),
      country: String(payload.country ?? "FR"),
      phone: String(payload.phone ?? ""),
      email: row.customerEmail,
    });

    const rawProducts = Array.isArray(payload.products) ? payload.products as { vid: string; quantity: number }[] : [];

    const { cjOrderId } = await createCjOrder({
      orderNumber: orderId,
      shippingAddress,
      products: rawProducts,
    });

    await db.update(ordersCjTable).set({
      cjOrderId,
      status: "submitted",
      error: null,
      retryCount: (row.retryCount ?? 0) + 1,
      updatedAt: new Date(),
    }).where(eq(ordersCjTable.orderId, orderId));

    req.log.info({ orderId, cjOrderId }, "CJ order retried successfully");
    res.json({ success: true, cjOrderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await db.update(ordersCjTable).set({
      status: "error",
      error: message,
      retryCount: (row.retryCount ?? 0) + 1,
      updatedAt: new Date(),
    }).where(eq(ordersCjTable.orderId, orderId));
    res.status(502).json({ error: message });
  }
});

export default router;
