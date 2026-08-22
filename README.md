# UPSTACK Commerce Systems

A responsive, multi-route agency website for Shopify storefront design and
development, Odoo implementation, platform integration, and continuous commerce
optimization. The visual system translates a premium 1997 financial broadsheet
into a modern, accessible web experience.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The development server prints the exact local URL. If port 3000 is occupied it
will select the next available port.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

## Routes

- `/` — Home
- `/capabilities` — Shopify, Odoo, integration, optimization, reporting, and support
- `/work` — live client storefronts (Surur, Dress Code, More Cottons)
- `/process` — six-stage delivery process
- `/about` — positioning, audiences, principles, and platform expertise
- `/contact` — accessible enquiry form (name, phone, email, budget)
- `/privacy` — privacy policy
- `/terms` — terms of use

## Content integrity

The `/work` page shows live client storefronts that UPSTACK built or operates:
Surur, Dress Code, and More Cottons. Each entry links to the live site so the
claim is verifiable. Scope descriptions in `app/work/page.tsx` describe work
actually performed; no performance figures are claimed.

## Lead handling

Enquiries are validated in the browser and again on the server, then written to
the Cloudflare D1 `leads` table before any notification is attempted, so a lead
survives an email or webhook outage. Copy `.env.example` to `.env.local` and fill
in the delivery and measurement variables documented there.

Apply the D1 migration before the first production submission:

```bash
npx wrangler d1 migrations apply site-creator-d1 --remote
```
