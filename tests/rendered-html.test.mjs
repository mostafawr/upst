import assert from "node:assert/strict";
import test from "node:test";

let workerPromise;

async function getWorker() {
  workerPromise ??= import(
    new URL(`../dist/server/index.js?test=${process.pid}-${Date.now()}`, import.meta.url)
      .href
  ).then((module) => module.default);
  return workerPromise;
}

async function request(path, init = {}) {
  const worker = await getWorker();

  return worker.fetch(
    new Request(`http://upstack.test${path}`, {
      headers: { accept: "text/html", ...init.headers },
      ...init,
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished UPSTACK homepage", async () => {
  const response = await request("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Systems That Sell — UPSTACK<\/title>/i);
  assert.match(html, /Systems[\s\S]*That Sell/i);
  assert.match(html, /Shopify storefronts that convert/i);
  assert.match(html, /Odoo systems that run operations/i);
  assert.match(html, /Book a Strategy Call/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("all public routes render their primary content", async () => {
  const expectations = [
    ["/capabilities", /Commerce, Connected End to End/i],
    ["/work", /Selected Systems/i],
    ["/process", /From Strategy to Scale/i],
    ["/about", /One Partner for the Full Commerce System/i],
    ["/contact", /Start with the System/i],
  ];

  for (const [path, heading] of expectations) {
    const response = await request(path);
    assert.equal(response.status, 200, `${path} should render`);
    assert.match(await response.text(), heading);
  }
});

test("work records are disclosed without invented results", async () => {
  const response = await request("/work");
  const html = await response.text();

  assert.match(html, /Concept Case Study/i);
  assert.match(html, /Representative Engagement/i);
  assert.match(html, /no named client or performance claim/i);
  assert.doesNotMatch(html, /client satisfaction|projects delivered|revenue generated/i);
});

test("contact form exposes the complete accessible brief", async () => {
  const response = await request("/contact");
  const html = await response.text();

  for (const field of [
    "firstName",
    "lastName",
    "email",
    "company",
    "website",
    "phone",
    "engagementType",
    "servicesNeeded",
    "timeline",
    "budget",
    "details",
    "referralSource",
  ]) {
    assert.match(html, new RegExp(`name=["']${field}["']`, "i"));
  }

  assert.match(html, /aria-label=["']Project enquiry["']/i);
});

test("contact API rejects incomplete data and never fakes delivery", async () => {
  const invalid = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({}),
  });
  assert.equal(invalid.status, 422);

  const complete = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      company: "Example Commerce",
      website: "https://example.com",
      phone: "",
      engagementType: "Shopify–Odoo Integration",
      servicesNeeded: ["Shopify–Odoo Integration"],
      timeline: "Within 1–3 months",
      budget: "",
      details: "Connect the commerce storefront with operational inventory.",
      referralSource: "Professional referral",
    }),
  });

  assert.equal(complete.status, 503);
  assert.match(await complete.text(), /not configured/i);
});

test("robots and sitemap use the incoming origin", async () => {
  const [robots, sitemap] = await Promise.all([
    request("/robots.txt"),
    request("/sitemap.xml"),
  ]);

  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: http:\/\/upstack\.test\/sitemap\.xml/i);

  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.match(xml, /<loc>http:\/\/upstack\.test\/capabilities<\/loc>/i);
  assert.match(xml, /<loc>http:\/\/upstack\.test\/contact<\/loc>/i);
});
