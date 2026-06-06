export interface GeniusPayCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface GeniusPayOrderInfo {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  customer: GeniusPayCustomer;
}

export interface GeniusPayResult {
  success: boolean;
  paymentToken: string;
  transactionId: string;
  error?: string;
}

const GENIUS_PAY_PUBLIC_KEY = import.meta.env.VITE_GENIUS_PAY_PUBLIC_KEY ?? "";

declare global {
  interface Window {
    GeniusPay?: {
      init: (publicKey: string) => void;
      createPayment: (order: GeniusPayOrderInfo) => Promise<GeniusPayResult>;
    };
  }
}

let initialized = false;

export function initGeniusPay(): void {
  if (initialized || !GENIUS_PAY_PUBLIC_KEY) return;
  if (window.GeniusPay) {
    window.GeniusPay.init(GENIUS_PAY_PUBLIC_KEY);
    initialized = true;
  }
}

export async function processPayment(order: GeniusPayOrderInfo): Promise<GeniusPayResult> {
  if (!GENIUS_PAY_PUBLIC_KEY) {
    return simulatePayment(order);
  }

  if (!initialized) initGeniusPay();

  if (!window.GeniusPay) {
    console.warn("GeniusPay SDK not loaded — running in simulation mode");
    return simulatePayment(order);
  }

  return window.GeniusPay.createPayment(order);
}

async function simulatePayment(order: GeniusPayOrderInfo): Promise<GeniusPayResult> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    success: true,
    paymentToken: `SIMULATED_${Date.now()}`,
    transactionId: `TXN_${order.orderId}_${Date.now()}`,
  };
}

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PC-${ts}-${rand}`;
}
