import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AddToCartBody, UpdateCartItemBody } from "@workspace/api-zod";
import crypto from "crypto";

const router = Router();

// In-memory session-based cart (keyed by session ID from cookie)
const carts = new Map<string, CartData>();

interface CartItemData {
  id: string;
  productId: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartData {
  items: CartItemData[];
}

const FREE_SHIPPING_THRESHOLD = 45;
const SHIPPING_COST = 4.99;

function getSessionId(req: any, res: any): string {
  let sessionId = req.cookies?.cartSession;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    res.cookie("cartSession", sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
  return sessionId;
}

function computeCart(items: CartItemData[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : SHIPPING_COST;
  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    shipping,
    total: Math.round((subtotal + shipping) * 100) / 100,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    freeShipping,
  };
}

router.get("/cart", (req, res) => {
  const sessionId = getSessionId(req, res);
  const cart = carts.get(sessionId) ?? { items: [] };
  res.json(computeCart(cart.items));
});

router.post("/cart", async (req, res) => {
  try {
    const parsed = AddToCartBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" }); return;
    }
    const { productId, quantity } = parsed.data;

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));
    if (!product) {
      res.status(404).json({ error: "Product not found" }); return;
    }

    const sessionId = getSessionId(req, res);
    const cart = carts.get(sessionId) ?? { items: [] };

    const existing = cart.items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        id: crypto.randomUUID(),
        productId,
        slug: product.slug,
        name: product.name,
        price: parseFloat(product.price),
        quantity,
      });
    }
    carts.set(sessionId, cart);
    res.json(computeCart(cart.items));
  } catch (err) {
    req.log.error({ err }, "Failed to add to cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/cart/:itemId", (req, res) => {
  try {
    const parsed = UpdateCartItemBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" }); return;
    }
    const sessionId = getSessionId(req, res);
    const cart = carts.get(sessionId) ?? { items: [] };
    const item = cart.items.find((i) => i.id === req.params.itemId);
    if (!item) {
      res.status(404).json({ error: "Cart item not found" }); return;
    }
    item.quantity = parsed.data.quantity;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== req.params.itemId);
    }
    carts.set(sessionId, cart);
    res.json(computeCart(cart.items));
  } catch (err) {
    req.log.error({ err }, "Failed to update cart item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart/:itemId", (req, res) => {
  const sessionId = getSessionId(req, res);
  const cart = carts.get(sessionId) ?? { items: [] };
  cart.items = cart.items.filter((i) => i.id !== req.params.itemId);
  carts.set(sessionId, cart);
  res.json(computeCart(cart.items));
});

router.delete("/cart", (req, res) => {
  const sessionId = getSessionId(req, res);
  carts.set(sessionId, { items: [] });
  res.json(computeCart([]));
});

export default router;
