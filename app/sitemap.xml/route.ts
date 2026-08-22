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

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const urls = routes
    .map(
      (route) =>
        `<url><loc>${escapeXml(`${origin}${route || "/"}`)}</loc></url>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8" } },
  );
}
