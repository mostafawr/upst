import { requestOrigin } from "@/lib/request-origin";

const routes = [
  "",
  "/capabilities",
  "/work",
  "/process",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

/**
 * Bump this when page copy changes materially.
 *
 * It is a hand-set constant rather than the current date because a lastmod
 * that moves on every crawl is a lie search engines learn to discount, and
 * there is nothing in a static build that records when a given page's words
 * last changed. `changefreq` and `priority` are left out; Google stopped
 * using them.
 */
const LAST_MODIFIED = "2026-09-20";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET(request: Request) {
  const origin = requestOrigin(request);
  const urls = routes
    .map(
      (route) =>
        `<url><loc>${escapeXml(`${origin}${route || "/"}`)}</loc><lastmod>${LAST_MODIFIED}</lastmod></url>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8" } },
  );
}
