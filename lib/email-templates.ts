/**
 * Email template generation utilities.
 * Shared between frontend (preview) and backend (sending).
 */

export interface LevyInvoiceData {
  amount: bigint | number;
  lotNumber: string;
  ownerName: string;
  ownerEmail: string;
  ownerAddress?: string;
  unitEntitlement: number;
  percentageShare: number;
}

export interface LevyRunData {
  fundType: "admin" | "capital_works";
  periodLabel: string;
  dueDate: number;
  totalAmount: bigint | number;
}

function formatCurrency(cents: bigint | number): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(dollars);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Generate HTML email body for a levy notice.
 */
export function generateLevyNoticeHTML(
  invoice: LevyInvoiceData,
  levyRun: LevyRunData,
  schemeName: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Levy Notice - ${invoice.lotNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      color: #1e293b;
    }
    .header {
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 24px;
      color: #4f46e5;
      margin-bottom: 5px;
    }
    .header p {
      color: #64748b;
      font-size: 14px;
    }
    .notice-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .owner-details {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .owner-details p {
      margin-bottom: 5px;
    }
    .owner-name {
      font-size: 18px;
      font-weight: 600;
    }
    .amount-box {
      background: #4f46e5;
      color: white;
      padding: 25px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 25px;
    }
    .amount-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    .amount {
      font-size: 36px;
      font-weight: 700;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 25px;
    }
    .detail-item {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
    }
    .detail-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 5px;
    }
    .detail-value {
      font-size: 16px;
      font-weight: 600;
    }
    .due-date {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 25px;
    }
    .due-date-label {
      font-size: 12px;
      color: #92400e;
      margin-bottom: 5px;
    }
    .due-date-value {
      font-size: 18px;
      font-weight: 700;
      color: #92400e;
    }
    .calculation {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .calculation-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .calculation-row:last-child {
      border-bottom: none;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${schemeName}</h1>
    <p>Strata Scheme Levy Notice</p>
  </div>

  <div class="notice-title">
    ${levyRun.fundType === "admin" ? "Administrative Fund" : "Capital Works Fund"} Levy Notice
  </div>

  <div class="section">
    <div class="section-title">Issued To</div>
    <div class="owner-details">
      <p class="owner-name">${invoice.ownerName}</p>
      <p>Lot ${invoice.lotNumber}</p>
      <p>${invoice.ownerEmail}</p>
      ${invoice.ownerAddress ? `<p>${invoice.ownerAddress}</p>` : ""}
    </div>
  </div>

  <div class="amount-box">
    <div class="amount-label">Amount Due</div>
    <div class="amount">${formatCurrency(invoice.amount)}</div>
  </div>

  <div class="due-date">
    <div class="due-date-label">Payment Due By</div>
    <div class="due-date-value">${formatDate(levyRun.dueDate)}</div>
  </div>

  <div class="details-grid">
    <div class="detail-item">
      <div class="detail-label">Levy Period</div>
      <div class="detail-value">${levyRun.periodLabel}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Fund Type</div>
      <div class="detail-value">${levyRun.fundType === "admin" ? "Admin Fund" : "Capital Works"}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Calculation Details</div>
    <div class="calculation">
      <div class="calculation-row">
        <span>Total Budget</span>
        <span>${formatCurrency(levyRun.totalAmount)}</span>
      </div>
      <div class="calculation-row">
        <span>Your Unit Entitlement</span>
        <span>${invoice.unitEntitlement} UE</span>
      </div>
      <div class="calculation-row">
        <span>Your Share</span>
        <span>${invoice.percentageShare.toFixed(2)}%</span>
      </div>
      <div class="calculation-row">
        <span>Your Contribution</span>
        <span>${formatCurrency(invoice.amount)}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This notice was generated by Strata Manager on ${formatDate(Date.now())}</p>
    <p>Please retain this notice for your records.</p>
  </div>
</body>
</html>
`;
}

/**
 * Format email subject line for a levy notice.
 */
export function formatLevyEmailSubject(
  schemeName: string,
  periodLabel: string
): string {
  return `Levy Notice: ${schemeName} - ${periodLabel}`;
}
