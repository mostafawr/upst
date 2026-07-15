import {
  budgetChoices,
  engagementChoices,
  referralChoices,
  servicesNeededChoices,
  timelineChoices,
} from "@/lib/content";

const requiredTextFields = [
  "firstName",
  "lastName",
  "email",
  "company",
  "website",
  "engagementType",
  "timeline",
  "details",
  "referralSource",
] as const;

type ContactPayload = Record<string, unknown>;

function cleanText(value: unknown, maxLength = 2_000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isWorkEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
  let incoming: ContactPayload;

  try {
    incoming = (await request.json()) as ContactPayload;
  } catch {
    return Response.json(
      { message: "The enquiry could not be read. Please review the form and try again." },
      { status: 400 },
    );
  }

  const payload = {
    firstName: cleanText(incoming.firstName, 80),
    lastName: cleanText(incoming.lastName, 80),
    email: cleanText(incoming.email, 160),
    company: cleanText(incoming.company, 160),
    website: cleanText(incoming.website, 240),
    phone: cleanText(incoming.phone, 80),
    engagementType: cleanText(incoming.engagementType, 120),
    servicesNeeded: Array.isArray(incoming.servicesNeeded)
      ? incoming.servicesNeeded
          .map((item) => cleanText(item, 120))
          .filter(Boolean)
          .slice(0, 10)
      : [],
    timeline: cleanText(incoming.timeline, 120),
    budget: cleanText(incoming.budget, 120),
    details: cleanText(incoming.details, 4_000),
    referralSource: cleanText(incoming.referralSource, 240),
    submittedAt: new Date().toISOString(),
    source: "upstack-website",
  };

  const missing = requiredTextFields.filter((field) => !payload[field]);
  const invalidChoice =
    !isAllowed(payload.engagementType, engagementChoices) ||
    !isAllowed(payload.timeline, timelineChoices) ||
    !isAllowed(payload.referralSource, referralChoices) ||
    (payload.budget ? !isAllowed(payload.budget, budgetChoices) : false) ||
    payload.servicesNeeded.some(
      (service) => !isAllowed(service, servicesNeededChoices),
    );

  if (
    missing.length ||
    !isWorkEmail(payload.email) ||
    !isValidWebsite(payload.website) ||
    invalidChoice ||
    payload.servicesNeeded.length === 0
  ) {
    return Response.json(
      {
        message: "Please complete each required field with a valid work email.",
        fields:
          payload.servicesNeeded.length === 0
            ? [...missing, "servicesNeeded"]
            : missing,
      },
      { status: 422 },
    );
  }

  const endpoint = process.env.CONTACT_FORM_ENDPOINT;

  if (!endpoint) {
    return Response.json(
      {
        message:
          "Enquiry delivery is not configured yet. Add the contact endpoint before publishing the form.",
      },
      { status: 503 },
    );
  }

  try {
    const forwarded = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!forwarded.ok) {
      return Response.json(
        { message: "The enquiry service is temporarily unavailable. Please try again shortly." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { message: "The enquiry service could not be reached. Please try again shortly." },
      { status: 502 },
    );
  }
}
