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
- `/work` — disclosed concept case studies and representative engagements
- `/process` — six-stage delivery process
- `/about` — positioning, audiences, principles, and platform expertise
- `/contact` — accessible project brief and strategy-call enquiry form

## Contact delivery

The form validates in the browser and again on the server. Copy `.env.example`
to `.env.local`, then set `CONTACT_FORM_ENDPOINT` to a secure HTTPS endpoint that
accepts the validated enquiry JSON. If it is absent or unavailable, the form
shows an honest delivery error and never reports a false success.

## Content integrity

The current work records are explicitly labeled `Concept Case Study` or
`Representative Engagement`. They do not claim real clients, testimonials, or
measured performance results. Replace these entries in `lib/content.ts` only when
verified project content is available.
