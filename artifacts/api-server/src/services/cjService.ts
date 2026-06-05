import { logger } from "../lib/logger";

const CJ_BASE = process.env.CJ_API_BASE_URL ?? "https://api.cjdropshipping.com";
const CJ_APP_KEY = process.env.CJ_APP_KEY ?? "";
const CJ_APP_SECRET = process.env.CJ_APP_SECRET ?? "";

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

export async function getCjToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }

  const res = await fetch(`${CJ_BASE}/api2.0/v1/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CJ_APP_KEY, password: CJ_APP_SECRET }),
  });

  if (!res.ok) {
    throw new Error(`CJ auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json() as { code: number; message: string; data: { accessToken: string; accessTokenExpiryDate: string } };
  if (data.code !== 200) {
    throw new Error(`CJ auth error: ${data.message}`);
  }

  const expiresAt = new Date(data.data.accessTokenExpiryDate).getTime();
  tokenCache = { token: data.data.accessToken, expiresAt };
  logger.info("CJ token refreshed");
  return tokenCache.token;
}

export interface CjOrderItem {
  vid: string;
  quantity: number;
}

export interface CjShippingAddress {
  countryCode: string;
  country: string;
  province: string;
  city: string;
  address: string;
  zip: string;
  name: string;
  phone: string;
  email: string;
}

export interface CjCreateOrderPayload {
  orderNumber: string;
  shippingAddress: CjShippingAddress;
  products: CjOrderItem[];
  shippingNameId?: string;
  payType?: string;
}

export async function createCjOrder(payload: CjCreateOrderPayload): Promise<{ cjOrderId: string }> {
  const token = await getCjToken();

  const res = await fetch(`${CJ_BASE}/api2.0/v1/shopping/order/createOrderV3`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": token,
    },
    body: JSON.stringify({
      ...payload,
      payType: payload.payType ?? "PAYPAL",
    }),
  });

  if (!res.ok) {
    throw new Error(`CJ createOrder failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json() as { code: number; message: string; data: { orderId: string } };
  if (data.code !== 200) {
    throw new Error(`CJ order error: ${data.message}`);
  }

  return { cjOrderId: data.data.orderId };
}

export function mapWooAddressToCj(
  shipping: WooShipping,
  billing: WooBilling,
): CjShippingAddress {
  return {
    countryCode: shipping.country || billing.country,
    country: shipping.country || billing.country,
    province: shipping.state || billing.state,
    city: shipping.city || billing.city,
    address: [shipping.address_1, shipping.address_2].filter(Boolean).join(", ") ||
             [billing.address_1, billing.address_2].filter(Boolean).join(", "),
    zip: shipping.postcode || billing.postcode,
    name: [shipping.first_name, shipping.last_name].filter(Boolean).join(" ") ||
          [billing.first_name, billing.last_name].filter(Boolean).join(" "),
    phone: billing.phone,
    email: billing.email,
  };
}

export interface WooShipping {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface WooBilling extends WooShipping {
  email: string;
  phone: string;
}

export interface WooLineItem {
  id: number;
  product_id: number;
  quantity: number;
  sku: string;
  name: string;
  price: number;
}

export interface WooOrder {
  id: number;
  number: string;
  status: string;
  billing: WooBilling;
  shipping: WooShipping;
  line_items: WooLineItem[];
  total: string;
  currency: string;
  customer_note?: string;
}
