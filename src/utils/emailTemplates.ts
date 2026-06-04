export interface BOQEmailData {
  clientName: string;
  clientEmail: string;
  projectType: string;
  submittedAt: string;
  totalEstimate?: number;
  quoteUrl?: string;
  adminNote?: string;
}

// ─── Shared base wrapper ─────────────────────────────────────────────────────
const wrap = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background: #f4f4f0; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .header { background: #1a1a18; padding: 28px 36px; }
    .header img { height: 28px; }
    .header-title { color: #f5f4ef; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 12px; }
    .body { padding: 36px; color: #3d3d3a; font-size: 15px; line-height: 1.65; }
    .body h2 { font-size: 22px; font-weight: 700; color: #1a1a18; margin: 0 0 8px; }
    .body p { margin: 0 0 16px; }
    .tag { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .info-block { background: #f9f8f4; border: 1px solid #e4e2d8; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; border-bottom: 1px solid #eeecE4; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #888780; font-weight: 600; }
    .cta { display: inline-block; padding: 13px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; margin: 8px 0; }
    .footer { background: #f4f4f0; padding: 20px 36px; font-size: 11px; color: #888780; text-align: center; border-top: 1px solid #e4e2d8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div style="color:#d4af6a;font-size:20px;font-weight:900;letter-spacing:0.04em;">ELVITIGALA</div>
      <div class="header-title">Project Estimations</div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      Elvitigala Construction &amp; Trading · Colombo, Sri Lanka<br/>
      This is an automated notification. Reply to this email to contact our team.
    </div>
  </div>
</body>
</html>`;

// ─── 1. Reviewing — "Assigned to QS" ────────────────────────────────────────
export const reviewingEmail = (d: BOQEmailData) => ({
  subject: `Your BOQ is under review — ${d.projectType}`,
  html: wrap(`
    <span class="tag" style="background:#dbeafe;color:#1e40af;">Under Review</span>
    <h2 style="margin-top:14px;">We've received your BOQ, ${d.clientName.split(" ")[0]}.</h2>
    <p>Your Bill of Quantities has been assigned to our Quantity Surveyor for a detailed assessment. We'll be in touch shortly with a formal estimate.</p>
    <div class="info-block">
      <div class="info-row"><span class="info-label">Project type</span><span>${d.projectType}</span></div>
      <div class="info-row"><span class="info-label">Submitted on</span><span>${d.submittedAt}</span></div>
      <div class="info-row"><span class="info-label">Status</span><span style="color:#1e40af;font-weight:700;">Under Review</span></div>
    </div>
    <p style="color:#888780;font-size:13px;">Typical turnaround for a QS assessment is 2–4 business days. We'll notify you as soon as your estimate is ready.</p>
  `),
});

// ─── 2. Quoting — "Estimate in progress" ────────────────────────────────────
export const quotingEmail = (d: BOQEmailData) => ({
  subject: `Estimate in progress for your ${d.projectType} project`,
  html: wrap(`
    <span class="tag" style="background:#ede9fe;color:#5b21b6;">Preparing Estimate</span>
    <h2 style="margin-top:14px;">Good news — we're preparing your estimate.</h2>
    <p>Our team has completed the quantity survey and is now drafting a detailed commercial bid for your project. You'll receive the official quotation document shortly.</p>
    <div class="info-block">
      <div class="info-row"><span class="info-label">Project type</span><span>${d.projectType}</span></div>
      <div class="info-row"><span class="info-label">Status</span><span style="color:#5b21b6;font-weight:700;">Quoting in Progress</span></div>
      ${d.adminNote ? `<div class="info-row"><span class="info-label">Note from our team</span><span>${d.adminNote}</span></div>` : ""}
    </div>
    <p style="color:#888780;font-size:13px;">No action is required from you at this stage. We'll email you the full quotation document for your review.</p>
  `),
});

// ─── 3. Completed — "Quotation dispatched" (with optional file link) ─────────
export const completedEmail = (d: BOQEmailData) => ({
  subject: `Your quotation is ready — ${d.projectType}`,
  html: wrap(`
    <span class="tag" style="background:#d1fae5;color:#065f46;">Quotation Ready</span>
    <h2 style="margin-top:14px;">Your official quotation is attached.</h2>
    <p>We've finalised and dispatched your project estimate. Please review the quotation document below and don't hesitate to reach out if you have any questions.</p>
    <div class="info-block">
      <div class="info-row"><span class="info-label">Project type</span><span>${d.projectType}</span></div>
      ${d.totalEstimate ? `<div class="info-row"><span class="info-label">Total estimate</span><span style="font-weight:700;color:#1a1a18;">LKR ${d.totalEstimate.toLocaleString()}</span></div>` : ""}
      ${d.adminNote ? `<div class="info-row"><span class="info-label">Note</span><span>${d.adminNote}</span></div>` : ""}
    </div>
    ${d.quoteUrl ? `<a href="${d.quoteUrl}" class="cta" style="background:#1a1a18;color:#d4af6a;">Download Quotation PDF →</a>` : ""}
    <p style="color:#888780;font-size:13px;margin-top:16px;">This quotation is valid for 30 days from the date of issue. To proceed, please reply to this email or contact us directly.</p>
  `),
});

// ─── 4. Declined ─────────────────────────────────────────────────────────────
export const declinedEmail = (d: BOQEmailData) => ({
  subject: `Update on your BOQ submission — ${d.projectType}`,
  html: wrap(`
    <span class="tag" style="background:#fee2e2;color:#991b1b;">Not Proceeding</span>
    <h2 style="margin-top:14px;">Thank you for your submission, ${d.clientName.split(" ")[0]}.</h2>
    <p>After reviewing your Bill of Quantities, we're unfortunately unable to proceed with a formal bid for this project at this time.</p>
    <div class="info-block">
      <div class="info-row"><span class="info-label">Project type</span><span>${d.projectType}</span></div>
      ${d.adminNote ? `<div class="info-row"><span class="info-label">Reason</span><span>${d.adminNote}</span></div>` : ""}
    </div>
    <p>We appreciate your interest in working with us and encourage you to reach out for future projects. Our team would be happy to discuss alternative approaches.</p>
    <a href="mailto:info@elvitigala.lk" class="cta" style="background:#f4f4f0;color:#1a1a18;border:1px solid #ccc;">Contact Our Team</a>
  `),
});