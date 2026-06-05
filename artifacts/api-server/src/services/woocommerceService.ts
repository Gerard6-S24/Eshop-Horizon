import { logger } from "../lib/logger";

const WOO_URL = process.env.WOOCOMMERCE_STORE_URL ?? "";
const WOO_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY ?? "";
const WOO_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET ?? "";

function wooAuthHeader(): string {
  return "Basic " + Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString("base64");
}

export async function updateWooOrderTracking(
  wooOrderId: string,
  trackingNumber: string,
  trackingUrl: string,
  carrier: string,
): Promise<void> {
  if (!WOO_URL || !WOO_KEY) {
    logger.warn("WooCommerce credentials not configured — skipping order update");
    return;
  }

  const url = `${WOO_URL}/wp-json/wc/v3/orders/${wooOrderId}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: wooAuthHeader(),
    },
    body: JSON.stringify({
      status: "completed",
      meta_data: [
        { key: "_tracking_number", value: trackingNumber },
        { key: "_tracking_url", value: trackingUrl },
        { key: "_shipping_provider", value: carrier },
      ],
      customer_note: `Votre commande est expédiée 🚚\nTransporteur : ${carrier}\nNuméro de suivi : ${trackingNumber}\nSuivi : ${trackingUrl}`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WooCommerce PUT /orders/${wooOrderId} failed: ${res.status} ${body}`);
  }

  logger.info({ wooOrderId, trackingNumber }, "WooCommerce order updated with tracking");
}

export async function getWooOrder(wooOrderId: string): Promise<{ billing_email?: string; id: number } | null> {
  if (!WOO_URL || !WOO_KEY) return null;
  try {
    const res = await fetch(`${WOO_URL}/wp-json/wc/v3/orders/${wooOrderId}`, {
      headers: { Authorization: wooAuthHeader() },
    });
    if (!res.ok) return null;
    return await res.json() as { billing_email?: string; id: number };
  } catch {
    return null;
  }
}
