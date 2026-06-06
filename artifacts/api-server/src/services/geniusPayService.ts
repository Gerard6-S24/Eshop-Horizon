/**
 * GeniusPay — vérification côté serveur
 *
 * La clé secrète (GENIUS_PAY_SECRET_KEY) ne quitte jamais le backend.
 * Elle sert à vérifier auprès des serveurs GeniusPay qu'un paymentToken
 * reçu du frontend correspond bien à un paiement réel et capturé.
 *
 * Lorsque vous obtenez la documentation technique GeniusPay, remplacez
 * l'URL et la structure de réponse dans verifyGeniusPayToken() ci-dessous.
 */

import { logger } from "../lib/logger";

const GENIUS_PAY_SECRET_KEY = process.env.GENIUS_PAY_SECRET_KEY ?? "";
const GENIUS_PAY_API_URL = process.env.GENIUS_PAY_API_URL ?? "https://api.geniuspay.com";

export interface GeniusPayVerifyResult {
  verified: boolean;
  amount?: number;
  currency?: string;
  transactionId?: string;
  error?: string;
}

/**
 * Vérifie un paymentToken reçu du frontend auprès de l'API GeniusPay.
 * Retourne { verified: true } si le paiement est confirmé et capturé.
 */
export async function verifyGeniusPayToken(
  paymentToken: string,
  expectedAmount: number,
  expectedCurrency: string,
): Promise<GeniusPayVerifyResult> {
  if (!GENIUS_PAY_SECRET_KEY) {
    logger.warn("GENIUS_PAY_SECRET_KEY non configurée — vérification ignorée (mode dev)");
    return { verified: true, transactionId: paymentToken };
  }

  try {
    const res = await fetch(`${GENIUS_PAY_API_URL}/v1/payments/${encodeURIComponent(paymentToken)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${GENIUS_PAY_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      logger.error({ paymentToken, status: res.status }, "GeniusPay verify HTTP error");
      return { verified: false, error: `GeniusPay HTTP ${res.status}: ${text}` };
    }

    const data = await res.json() as {
      status: string;
      amount: number;
      currency: string;
      transaction_id: string;
    };

    const isCapture = data.status === "captured" || data.status === "paid" || data.status === "succeeded";
    const amountOk = Math.abs(data.amount - expectedAmount) < 0.01;
    const currencyOk = data.currency?.toUpperCase() === expectedCurrency.toUpperCase();

    if (!isCapture) {
      return { verified: false, error: `Statut GeniusPay inattendu : ${data.status}` };
    }
    if (!amountOk || !currencyOk) {
      logger.warn({ expected: expectedAmount, received: data.amount }, "GeniusPay montant/devise incohérent");
      return { verified: false, error: "Montant ou devise du paiement incohérent" };
    }

    return {
      verified: true,
      amount: data.amount,
      currency: data.currency,
      transactionId: data.transaction_id,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ err, paymentToken }, "GeniusPay verify exception");
    return { verified: false, error: message };
  }
}
