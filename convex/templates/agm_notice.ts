/**
 * AGM Notice Template - NSW SSMA 2015 Compliant
 *
 * This template generates an AGM Notice document with all mandatory
 * statutory motions required under the Strata Schemes Management Act 2015.
 */

export interface AgmNoticeData {
  schemeName: string;
  strataNumber: string;
  address: string;
  meetingDate: Date;
  meetingTime: string;
  meetingLocation: string;
  secretaryName?: string;
}

/**
 * Formats a date as "Day, DD Month YYYY" (e.g., "Tuesday, 10 March 2026")
 */
function formatDate(date: Date): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
}

/**
 * Calculates the proxy deadline (24 hours before AGM)
 */
function calculateProxyDeadline(meetingDate: Date): Date {
  const deadline = new Date(meetingDate);
  deadline.setDate(deadline.getDate() - 1);
  return deadline;
}

/**
 * Generates the AGM Notice HTML content
 */
export function generateAgmNoticeHtml(data: AgmNoticeData): string {
  const proxyDeadline = calculateProxyDeadline(data.meetingDate);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Notice of Annual General Meeting - ${escapeHtml(data.schemeName)}</title>
  <style>
    body {
      font-family: Georgia, 'Times New Roman', serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      line-height: 1.6;
      color: #1e293b;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #334155;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 24px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .header .scheme-details {
      font-size: 14px;
      color: #475569;
    }
    .notice-title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin: 30px 0;
      text-transform: uppercase;
    }
    .section {
      margin: 25px 0;
    }
    .section-title {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 10px;
      color: #334155;
    }
    .meeting-details {
      background: #f8fafc;
      padding: 20px;
      border-left: 4px solid #334155;
      margin: 20px 0;
    }
    .meeting-details p {
      margin: 8px 0;
    }
    .agenda {
      margin: 30px 0;
    }
    .agenda ol {
      padding-left: 20px;
    }
    .agenda li {
      margin: 15px 0;
      padding-left: 10px;
    }
    .motion-title {
      font-weight: bold;
    }
    .motion-description {
      font-size: 14px;
      color: #475569;
      margin-top: 5px;
    }
    .proxy-section {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 20px;
      margin: 30px 0;
    }
    .proxy-section .deadline {
      font-weight: bold;
      color: #92400e;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .signature {
      margin-top: 40px;
    }
    .disclaimer {
      font-size: 12px;
      color: #64748b;
      margin-top: 30px;
      padding: 15px;
      background: #f1f5f9;
    }
    @media print {
      body { padding: 20px; }
      .proxy-section { background: #fff; border: 2px solid #000; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(data.schemeName)}</h1>
    <div class="scheme-details">
      <div>${escapeHtml(data.strataNumber)}</div>
      <div>${escapeHtml(data.address)}</div>
    </div>
  </div>

  <div class="notice-title">Notice of Annual General Meeting</div>

  <p>Notice is hereby given that the Annual General Meeting of ${escapeHtml(data.schemeName)} will be held as follows:</p>

  <div class="meeting-details">
    <p><strong>Date:</strong> ${formatDate(data.meetingDate)}</p>
    <p><strong>Time:</strong> ${escapeHtml(data.meetingTime)}</p>
    <p><strong>Location:</strong> ${escapeHtml(data.meetingLocation)}</p>
  </div>

  <div class="section agenda">
    <div class="section-title">AGENDA</div>
    <ol>
      <li>
        <div class="motion-title">Motion 1: Confirmation of Minutes</div>
        <div class="motion-description">
          To confirm the minutes of the last Annual General Meeting as a true and accurate record.
        </div>
      </li>
      <li>
        <div class="motion-title">Motion 2: Adoption of Financial Statements</div>
        <div class="motion-description">
          To receive and adopt the Financial Statements for the strata scheme for the financial year,
          including the statement of income and expenditure, balance sheet, and auditor's report (if applicable).
        </div>
      </li>
      <li>
        <div class="motion-title">Motion 3: Capital Works Fund Plan</div>
        <div class="motion-description">
          To consider and, if thought fit, approve the 10-year Capital Works Fund Plan as required under
          section 80 of the Strata Schemes Management Act 2015 (NSW).
        </div>
      </li>
      <li>
        <div class="motion-title">Motion 4: Election of Strata Committee</div>
        <div class="motion-description">
          To elect members of the Strata Committee for the ensuing year. Nominations may be made prior
          to or at the meeting.
        </div>
      </li>
      <li>
        <div class="motion-title">General Business</div>
        <div class="motion-description">
          To consider any other business of which due notice has been given.
        </div>
      </li>
    </ol>
  </div>

  <div class="proxy-section">
    <div class="section-title">VOTING BY PROXY</div>
    <p>
      If you are unable to attend the meeting, you may appoint a proxy to attend and vote on your behalf.
      Proxy forms must be in the approved form and lodged with the Secretary.
    </p>
    <p>
      <span class="deadline">Proxy Deadline: ${formatDate(proxyDeadline)} by ${escapeHtml(data.meetingTime)}</span>
    </p>
    <p>
      Proxy forms received after this time will not be valid for voting purposes.
    </p>
  </div>

  <div class="footer">
    <p>All lot owners are encouraged to attend or submit a proxy if unable to attend in person.</p>

    <div class="signature">
      <p>By order of the Strata Committee</p>
      ${data.secretaryName ? `<p><strong>${escapeHtml(data.secretaryName)}</strong><br>Secretary</p>` : "<p>Secretary</p>"}
      <p>${escapeHtml(data.schemeName)}</p>
    </div>
  </div>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> This notice has been generated for guidance purposes.
    The Owners Corporation should verify compliance with all applicable statutory requirements
    under the Strata Schemes Management Act 2015 (NSW) and associated regulations.
    This document does not constitute legal advice.
  </div>
</body>
</html>`;
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
