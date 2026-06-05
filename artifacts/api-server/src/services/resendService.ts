import { logger } from "../lib/logger";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_FROM = process.env.EMAIL_FROM ?? "no-reply@eshophorizon.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) {
    logger.warn({ to, subject }, "RESEND_API_KEY not set — email skipped");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    logger.error({ to, subject, status: res.status, body }, "Resend email failed");
    throw new Error(`Resend failed: ${res.status} ${body}`);
  }

  logger.info({ to, subject }, "Email sent via Resend");
}

export async function sendOrderConfirmation(
  customerEmail: string,
  wooOrderId: string,
  cjOrderId: string,
): Promise<void> {
  await sendEmail(
    customerEmail,
    "Votre commande est en cours de préparation — PetCare",
    `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;padding:24px;color:#2D2D2D">
      <h1 style="font-family:Georgia,serif;color:#4A7C59">Commande confirmée ✅</h1>
      <p>Bonjour,</p>
      <p>Votre commande <strong>#${wooOrderId}</strong> a bien été transmise à notre entrepôt et est en cours de préparation.</p>
      <p>Référence expéditeur : <code>${cjOrderId}</code></p>
      <p>Vous recevrez un email dès que votre colis est expédié avec votre numéro de suivi.</p>
      <hr style="border:none;border-top:1px solid #E8DFC8;margin:24px 0"/>
      <p style="color:#7D9B76;font-size:13px">L'équipe PetCare · E-Shop Horizon</p>
    </div>
    `,
  );
}

export async function sendTrackingEmail(
  customerEmail: string,
  wooOrderId: string,
  trackingNumber: string,
  trackingUrl: string,
  carrier: string,
): Promise<void> {
  await sendEmail(
    customerEmail,
    "Votre commande est expédiée 🚚 — PetCare",
    `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;padding:24px;color:#2D2D2D">
      <h1 style="font-family:Georgia,serif;color:#4A7C59">Votre colis est en route !</h1>
      <p>Bonjour,</p>
      <p>Votre commande <strong>#${wooOrderId}</strong> vient d'être expédiée.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;background:#F5EDD7;font-weight:600">Transporteur</td><td style="padding:8px">${carrier}</td></tr>
        <tr><td style="padding:8px;background:#F5EDD7;font-weight:600">Numéro de suivi</td><td style="padding:8px"><code>${trackingNumber}</code></td></tr>
      </table>
      <a href="${trackingUrl}" style="display:inline-block;background:#4A7C59;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
        Suivre mon colis →
      </a>
      <hr style="border:none;border-top:1px solid #E8DFC8;margin:24px 0"/>
      <p style="color:#7D9B76;font-size:13px">L'équipe PetCare · E-Shop Horizon</p>
    </div>
    `,
  );
}

export async function sendAdminAlert(
  wooOrderId: string,
  errorMessage: string,
  context?: string,
): Promise<void> {
  if (!ADMIN_EMAIL) return;
  await sendEmail(
    ADMIN_EMAIL,
    `⚠️ Erreur commande WooCommerce #${wooOrderId}`,
    `
    <div style="font-family:monospace;max-width:600px;margin:auto;padding:24px">
      <h2 style="color:#c0392b">Erreur traitement commande</h2>
      <p><strong>Commande WooCommerce :</strong> #${wooOrderId}</p>
      <p><strong>Erreur :</strong></p>
      <pre style="background:#fdf2f2;padding:12px;border-left:4px solid #c0392b;overflow-x:auto">${errorMessage}</pre>
      ${context ? `<p><strong>Contexte :</strong> ${context}</p>` : ""}
      <p style="color:#888;font-size:13px">Consultez l'interface admin : /admin/gateway</p>
    </div>
    `,
  );
}
