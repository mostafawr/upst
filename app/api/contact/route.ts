import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { budgetChoices } from "@/lib/content";
import type { LeadPayload } from "@/lib/lead-payload";
import { hasNotificationSink, notifyLead } from "@/lib/lead-notification";
import { checkRateLimit, clientAddress } from "@/lib/rate-limit";

const requiredTextFields = ["fullName", "email", "phone", "budget"] as const;

type ContactPayload = Record<string, unknown>;

function cleanText(value: unknown, maxLength = 2_000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Accepts international formats; requires enough digits to be callable. */
function isPhone(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function isValidWebsite(value: string) {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

function isAllowed(value: string, choices: readonly string[]) {
  return choices.includes(value);
}

export async function POST(request: Request) {
  // Before parsing anything: an open form endpoint on a public origin gets
  // found. Three enquiries in ten minutes is well past what a real person
  // sends and well short of anything a genuine one would hit.
  const limit = checkRateLimit(clientAddress(request));
  if (!limit.ok) {
    return Response.json(
      { message: "Too many enquiries from this connection. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  let incoming: ContactPayload;

  try {
    incoming = (await request.json()) as ContactPayload;
  } catch {
    return Response.json(
      { message: "The enquiry could not be read. Please review the form and try again." },
      { status: 400 },
    );
  }

  const payload: LeadPayload = {
    fullName: cleanText(incoming.fullName, 160),
    email: cleanText(incoming.email, 160),
    phone: cleanText(incoming.phone, 40),
    budget: cleanText(incoming.budget, 120),
    website: cleanText(incoming.website, 240),
    details: cleanText(incoming.details, 4_000),
    submittedAt: new Date().toISOString(),
    source: "upstack-website",
  };

  const missing = requiredTextFields.filter((field) => !payload[field]);

  if (
    missing.length ||
    !isEmail(payload.email) ||
    !isPhone(payload.phone) ||
    !isAllowed(payload.budget, budgetChoices) ||
    // Optional, but a supplied website must still be usable.
    (payload.website && !isValidWebsite(payload.website))
  ) {
    return Response.json(
      {
        message: "Please complete each required field with valid contact details.",
        fields: missing,
      },
      { status: 422 },
    );
  }

  // The database is the record of truth: persist before notifying so an enquiry
  // is never lost when email or the webhook is down.
  const stored = await storeLead(payload);
  const notified = await notifyLead(payload);

  if (stored !== null && notified) {
    await markNotified(stored);
  }

  if (!stored && !notified) {
    if (!hasNotificationSink()) {
      return Response.json(
        {
          message:
            "Enquiry delivery is not configured yet. Add the contact endpoint before publishing the form.",
        },
        { status: 503 },
      );
    }

    return Response.json(
      { message: "The enquiry service is temporarily unavailable. Please try again shortly." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}

/** Returns the new row id, or null when D1 is unavailable. */
async function storeLead(payload: LeadPayload): Promise<number | null> {
  try {
    const db = await getDb();
    const row = await db
      .insert(leads)
      .values({
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        budget: payload.budget,
        website: payload.website,
        details: payload.details,
        source: payload.source,
      })
      .returning({ id: leads.id })
      .get();

    return row?.id ?? null;
  } catch (error) {
    console.error("Lead could not be stored in D1.", error);
    return null;
  }
}

async function markNotified(id: number) {
  try {
    const db = await getDb();
    await db
      .update(leads)
      .set({ notifiedAt: new Date().toISOString() })
      .where(eq(leads.id, id))
      .run();
  } catch (error) {
    console.error("Lead stored but notification timestamp could not be set.", error);
  }
}
