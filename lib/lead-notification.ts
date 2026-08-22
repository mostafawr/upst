import type { LeadPayload } from "./lead-payload";

/**
 * Notification sinks for a validated enquiry. Both are optional: persistence in
 * D1 is the record of truth, and notification is best-effort on top of it.
 */

function formatBriefText(payload: LeadPayload) {
  const lines = [
    `Name: ${payload.fullName}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Budget: ${payload.budget}`,
    `Website: ${payload.website || "—"}`,
    "",
    "What they need:",
    payload.details || "—",
    "",
    `Submitted at: ${payload.submittedAt}`,
  ];

  return lines.join("\n");
}

async function sendEmail(payload: LeadPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_TO;
  const from = process.env.CONTACT_NOTIFICATION_FROM;

  if (!apiKey || !to || !from) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((address) => address.trim()).filter(Boolean),
        reply_to: payload.email,
        subject: `New enquiry — ${payload.fullName} (${payload.budget})`,
        text: formatBriefText(payload),
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function sendWebhook(payload: LeadPayload): Promise<boolean> {
  const endpoint = process.env.CONTACT_FORM_ENDPOINT;

  if (!endpoint) return false;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/** True when at least one configured sink accepted the enquiry. */
export async function notifyLead(payload: LeadPayload): Promise<boolean> {
  const results = await Promise.all([sendEmail(payload), sendWebhook(payload)]);

  return results.some(Boolean);
}

/** True when any notification sink is configured at all. */
export function hasNotificationSink(): boolean {
  return Boolean(
    (process.env.RESEND_API_KEY &&
      process.env.CONTACT_NOTIFICATION_TO &&
      process.env.CONTACT_NOTIFICATION_FROM) ||
      process.env.CONTACT_FORM_ENDPOINT,
  );
}
