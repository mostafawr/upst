import { requestOrigin } from "@/lib/request-origin";

export function GET(request: Request) {
  const origin = requestOrigin(request);

  return new Response(`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
