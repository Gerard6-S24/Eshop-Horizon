/**
 * Meta Pixel — PetCare Horizon
 * Pixel ID : 2810431351295885
 *
 * Toutes les fonctions vérifient silencieusement que fbq est chargé avant
 * d'appeler quoi que ce soit, donc aucune erreur si le script est bloqué
 * par un adblocker.
 */

declare global {
  interface Window {
    fbq: (
      action: string,
      event: string,
      params?: Record<string, unknown>,
    ) => void;
    _fbq: unknown;
  }
}

function fbq(...args: Parameters<Window["fbq"]>): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

/** Déclenché automatiquement à chaque changement de page (route). */
export function trackPageView(): void {
  fbq("track", "PageView");
}

/** Déclenché quand un article est ajouté au panier. */
export function trackAddToCart(params: {
  contentId: string;
  contentName: string;
  value: number;
  quantity?: number;
  currency?: string;
}): void {
  fbq("track", "AddToCart", {
    content_ids: [params.contentId],
    content_name: params.contentName,
    content_type: "product",
    value: params.value,
    currency: params.currency ?? "EUR",
    quantity: params.quantity ?? 1,
  });
}

/** Déclenché quand le client commence la saisie de ses infos de livraison. */
export function trackInitiateCheckout(params: {
  value: number;
  numItems: number;
  currency?: string;
}): void {
  fbq("track", "InitiateCheckout", {
    value: params.value,
    num_items: params.numItems,
    currency: params.currency ?? "EUR",
  });
}

/** Déclenché après confirmation de paiement réussie. */
export function trackPurchase(params: {
  orderId: string;
  value: number;
  currency?: string;
}): void {
  fbq("track", "Purchase", {
    content_type: "product",
    transaction_id: params.orderId,
    value: params.value,
    currency: params.currency ?? "EUR",
  });
}
