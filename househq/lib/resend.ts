import { Resend } from "resend";
import { signUnsubscribeToken } from "./tokens";

let client: Resend | null = null;

function resendClient(): Resend {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Resend is not configured. Set RESEND_API_KEY.");
  }
  client = new Resend(key);
  return client;
}

const FROM = () => process.env.EMAIL_FROM || "HouseHQ <orders@example.com>";
const SITE_URL = () => process.env.SITE_URL || "http://localhost:3000";

/** Transactional email - does not need marketing consent or an unsubscribe link. */
export async function sendVerificationEmail(opts: {
  to: string;
  code: string;
  magicLink: string;
  productName: string;
}) {
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1C2B36;">
    <h2 style="font-family:Georgia,serif;">Your HouseHQ verification code</h2>
    <p>Thanks for your order — <strong>${escapeHtml(opts.productName)}</strong>.</p>
    <p>Enter this code on the HouseHQ website to unlock your download:</p>
    <p style="font-size:32px;font-weight:700;letter-spacing:8px;font-family:monospace;">${opts.code}</p>
    <p>Or just click this link to verify and download in one step:</p>
    <p><a href="${opts.magicLink}" style="color:#A63A2E;">${opts.magicLink}</a></p>
    <p style="font-size:12px;color:#6B7280;">This code expires in 15 minutes. If you didn't make this purchase, you can ignore this email.</p>
  </div>`;
  await resendClient().emails.send({
    from: FROM(),
    to: opts.to,
    subject: "Your HouseHQ verification code",
    html,
  });
}

export async function sendDownloadBackupEmail(opts: {
  to: string;
  links: { name: string; url: string }[];
}) {
  const items = opts.links
    .map((l) => `<li><a href="${l.url}">${escapeHtml(l.name)}</a></li>`)
    .join("");
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1C2B36;">
    <h2 style="font-family:Georgia,serif;">Your HouseHQ download link${opts.links.length > 1 ? "s" : ""}</h2>
    <p>As a backup to the download button on the website, here ${opts.links.length > 1 ? "are your links" : "is your link"}:</p>
    <ul>${items}</ul>
    <p style="font-size:12px;color:#6B7280;">These links expire shortly for security. If they've expired, just re-verify on the website to get a fresh one.</p>
  </div>`;
  await resendClient().emails.send({
    from: FROM(),
    to: opts.to,
    subject: "Your HouseHQ download link",
    html,
  });
}

/** Marketing email - MUST include a working one-click unsubscribe link (Spam Act 2003). */
export async function sendMarketingEmail(opts: {
  to: string;
  subject: string;
  bodyHtml: string;
}) {
  const token = signUnsubscribeToken(opts.to);
  const unsubUrl = `${SITE_URL()}/api/unsubscribe?email=${encodeURIComponent(
    opts.to
  )}&token=${token}`;
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1C2B36;">
    ${opts.bodyHtml}
    <hr style="margin-top:32px;border:none;border-top:1px solid #DDD3B8;" />
    <p style="font-size:11px;color:#6B7280;">
      You're receiving this because you opted in to HouseHQ updates.
      <a href="${unsubUrl}">Unsubscribe</a> at any time.
    </p>
  </div>`;
  await resendClient().emails.send({
    from: FROM(),
    to: opts.to,
    subject: opts.subject,
    html,
  });
}

export async function sendContactNotification(opts: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL;
  if (!notifyTo) return;
  const html = `
    <p><strong>Name:</strong> ${escapeHtml(opts.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(opts.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(opts.phone || "-")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(opts.message).replace(/\n/g, "<br/>")}</p>
  `;
  await resendClient().emails.send({
    from: FROM(),
    to: notifyTo,
    replyTo: opts.email,
    subject: `New HouseHQ contact form message from ${opts.name}`,
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
