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

## Deploying

Local development uses a placeholder D1 database. A real deploy needs a real one,
so create it once and keep the id:

```bash
npx wrangler login
npx wrangler d1 create upstack-leads          # prints the database_id
```

Export both values so the build writes them into `dist/server/wrangler.json`,
apply the migration, then deploy:

```bash
export D1_DATABASE_NAME=upstack-leads
export D1_DATABASE_ID=<the id wrangler printed>

npm run build
npm run db:migrate:remote                     # creates the `leads` table
npm run deploy                                # prints the workers.dev URL
```

Set the delivery secrets on the deployed worker (they are not in the bundle):

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put CONTACT_NOTIFICATION_TO
npx wrangler secret put CONTACT_NOTIFICATION_FROM
```

Re-running `npm run deploy` after a change is enough; the database and secrets
persist. Leads land in D1 whether or not email is configured, so the form is
safe to publish before the Resend domain is verified.
