import { Router } from "express";
import { db } from "@workspace/db";
import { webhookLogsTable, ordersCjTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    received: "background:#3498db;color:white",
    processed: "background:#27ae60;color:white",
    duplicate: "background:#95a5a6;color:white",
    error: "background:#e74c3c;color:white",
    pending: "background:#f39c12;color:white",
    submitted: "background:#2980b9;color:white",
    completed: "background:#27ae60;color:white",
  };
  const style = map[status] ?? "background:#bdc3c7;color:white";
  return `<span style="padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;${style}">${status}</span>`;
}

function formatDate(d: Date | string): string {
  return new Date(d).toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false });
}

router.get("/admin/gateway", async (req, res) => {
  const [logs, orders] = await Promise.all([
    db.select().from(webhookLogsTable).orderBy(desc(webhookLogsTable.createdAt)).limit(50),
    db.select().from(ordersCjTable).orderBy(desc(ordersCjTable.createdAt)).limit(50),
  ]);

  const errorOrders = orders.filter(o => o.status === "error");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>WooCommerce × CJ Gateway — Admin</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Inter,system-ui,sans-serif;background:#f5f5f5;color:#2d2d2d}
    header{background:#2d2d2d;color:white;padding:16px 24px;display:flex;align-items:center;gap:12px}
    header h1{font-size:18px;font-weight:600}
    .badge{background:#4A7C59;color:white;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:700}
    .container{max-width:1200px;margin:24px auto;padding:0 16px}
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:24px}
    .stat{background:white;border-radius:8px;padding:16px;border-left:4px solid #4A7C59;box-shadow:0 1px 4px rgba(0,0,0,.06)}
    .stat .num{font-size:28px;font-weight:700;color:#4A7C59}
    .stat .label{font-size:13px;color:#888;margin-top:4px}
    .stat.error{border-left-color:#e74c3c}.stat.error .num{color:#e74c3c}
    section{background:white;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,.06);margin-bottom:24px;overflow:hidden}
    section h2{padding:14px 20px;font-size:15px;font-weight:600;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:8px}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{text-align:left;padding:10px 16px;background:#fafafa;color:#666;font-weight:600;border-bottom:1px solid #f0f0f0}
    td{padding:10px 16px;border-bottom:1px solid #f8f8f8;vertical-align:middle}
    tr:last-child td{border-bottom:none}
    tr:hover td{background:#fafaf7}
    code{background:#f0f0f0;padding:2px 6px;border-radius:4px;font-size:12px;font-family:monospace}
    .error-text{color:#e74c3c;font-size:12px;max-width:280px;word-break:break-all}
    .retry-btn{background:#4A7C59;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600}
    .retry-btn:hover{background:#3d6649}
    .refresh{font-size:12px;color:#aaa;margin-left:auto}
    .alert{background:#fdf2f2;border:1px solid #f5c6cb;border-radius:8px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;gap:10px}
    .alert strong{color:#e74c3c}
    .no-data{padding:20px 16px;color:#aaa;font-style:italic;text-align:center}
  </style>
  <script>
    async function retryOrder(wooOrderId) {
      const btn = document.getElementById('retry-' + wooOrderId);
      btn.textContent = '...';
      btn.disabled = true;
      const res = await fetch('/api/cj/retry/' + wooOrderId, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        btn.textContent = '✓ OK';
        btn.style.background = '#27ae60';
        setTimeout(() => location.reload(), 1500);
      } else {
        btn.textContent = 'Échec';
        btn.style.background = '#e74c3c';
        btn.disabled = false;
        alert('Erreur: ' + (data.error || 'Inconnue'));
      }
    }
    setTimeout(() => location.reload(), 30000); // auto-refresh 30s
  </script>
</head>
<body>
  <header>
    <h1>🔗 WooCommerce × CJ Dropshipping</h1>
    <span class="badge">Gateway Admin</span>
    <span class="refresh">Actualisation auto 30s</span>
  </header>
  <div class="container">

    ${errorOrders.length > 0 ? `
    <div class="alert">
      ⚠️ <strong>${errorOrders.length} commande(s) en erreur</strong> — vérifiez le tableau ci-dessous et relancez manuellement.
    </div>` : ""}

    <div class="stats">
      <div class="stat"><div class="num">${orders.length}</div><div class="label">Commandes totales</div></div>
      <div class="stat"><div class="num">${orders.filter(o => o.status === "submitted").length}</div><div class="label">Soumises à CJ</div></div>
      <div class="stat"><div class="num">${orders.filter(o => o.trackingNumber).length}</div><div class="label">Avec tracking</div></div>
      <div class="stat error"><div class="num">${errorOrders.length}</div><div class="label">Erreurs</div></div>
      <div class="stat"><div class="num">${logs.length}</div><div class="label">Webhooks reçus</div></div>
    </div>

    <section>
      <h2>📦 Commandes CJ Dropshipping <span style="font-size:13px;color:#aaa;font-weight:400">(50 dernières)</span></h2>
      ${orders.length === 0 ? `<div class="no-data">Aucune commande reçue</div>` : `
      <div style="overflow-x:auto">
      <table>
        <thead><tr>
          <th>Woo #</th><th>CJ Order ID</th><th>Client</th><th>Statut</th><th>Tracking</th><th>Date</th><th>Action</th>
        </tr></thead>
        <tbody>
          ${orders.map(o => `<tr>
            <td><code>${o.wooOrderId}</code></td>
            <td>${o.cjOrderId ? `<code>${o.cjOrderId}</code>` : "<span style='color:#aaa'>—</span>"}</td>
            <td style="color:#555">${o.customerEmail}</td>
            <td>${statusBadge(o.status)}${o.error ? `<div class="error-text" title="${o.error}">${o.error.slice(0, 60)}…</div>` : ""}</td>
            <td>${o.trackingNumber ? `<a href="${o.trackingUrl ?? "#"}" target="_blank" style="color:#4A7C59"><code>${o.trackingNumber}</code></a>` : "<span style='color:#aaa'>—</span>"}</td>
            <td style="white-space:nowrap;color:#888">${formatDate(o.createdAt)}</td>
            <td>${o.status === "error" ? `<button class="retry-btn" id="retry-${o.wooOrderId}" onclick="retryOrder('${o.wooOrderId}')">↺ Réessayer</button>` : "—"}</td>
          </tr>`).join("")}
        </tbody>
      </table>
      </div>`}
    </section>

    <section>
      <h2>📋 Logs Webhooks WooCommerce <span style="font-size:13px;color:#aaa;font-weight:400">(50 derniers)</span></h2>
      ${logs.length === 0 ? `<div class="no-data">Aucun webhook reçu</div>` : `
      <div style="overflow-x:auto">
      <table>
        <thead><tr><th>ID</th><th>Woo #</th><th>Événement</th><th>Statut</th><th>Erreur</th><th>Date</th></tr></thead>
        <tbody>
          ${logs.map(l => `<tr>
            <td style="color:#aaa">#${l.id}</td>
            <td><code>${l.wooOrderId}</code></td>
            <td><code>${l.event}</code></td>
            <td>${statusBadge(l.status)}</td>
            <td class="error-text">${l.error ? l.error.slice(0, 80) : "—"}</td>
            <td style="white-space:nowrap;color:#888">${formatDate(l.createdAt)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
      </div>`}
    </section>

    <p style="text-align:center;color:#ccc;font-size:12px;padding-bottom:24px">
      WooCommerce × CJ Gateway · E-Shop Horizon PetCare · ${new Date().toLocaleString("fr-FR")}
    </p>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

export default router;
