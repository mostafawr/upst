/**
 * A small in-process limiter for the enquiry endpoint.
 *
 * Deliberately stores nothing: the site runs as a single Worker instance
 * behind nginx, so a module-level map is enough to stop the form being
 * hammered, and it keeps us from recording visitor IP addresses to disk when
 * the privacy policy says enquiries are what we keep. The trade-off is that
 * the window resets when the process restarts, which is the right way round —
 * a deploy should not lock anyone out.
 */

/**
 * Two tiers, because the two things being defended against are different.
 *
 * A valid enquiry costs a database write and an email, so few are allowed.
 * A rejected one costs a JSON parse, so the ceiling is loose — it is there to
 * stop a flood, not to punish someone who mistypes their phone number three
 * times and would otherwise be locked out of the contact form for ten minutes.
 */
const ACCEPTED_PER_ADDRESS = 3;
const REQUESTS_PER_ADDRESS = 20;
/** Accepted enquiries from everyone combined, to blunt distributed spam. */
const GLOBAL = 60;
const WINDOW_MS = 10 * 60 * 1000;

const hits = new Map<string, number[]>();

function recent(key: string, now: number) {
  const times = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length) hits.set(key, times);
  else hits.delete(key);
  return times;
}

/**
 * The caller's address, as nginx reports it. X-Forwarded-For may be a chain;
 * the first entry is the client. Falls back to a single bucket so a request
 * with no address still counts against something rather than escaping.
 */
export function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? request.headers.get("cf-connecting-ip") ?? "unknown";
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the caller may retry; only meaningful when `ok` is false. */
  retryAfter: number;
}

function tooSoon(times: number[], now: number): RateLimitResult {
  return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - times[0])) / 1000) };
}

/** Called for every request, before the body is read. */
export function checkRequestRate(address: string): RateLimitResult {
  const now = Date.now();

  // Opportunistic sweep: without it the map grows for every address ever seen.
  if (hits.size > 5_000) {
    for (const key of [...hits.keys()]) recent(key, now);
  }

  const mine = recent(`req:${address}`, now);
  if (mine.length >= REQUESTS_PER_ADDRESS) return tooSoon(mine, now);

  hits.set(`req:${address}`, [...mine, now]);
  return { ok: true, retryAfter: 0 };
}

/** Called only once an enquiry has passed validation and is about to be kept. */
export function checkEnquiryRate(address: string): RateLimitResult {
  const now = Date.now();
  const mine = recent(`ok:${address}`, now);
  const all = recent("__global__", now);

  if (mine.length >= ACCEPTED_PER_ADDRESS) return tooSoon(mine, now);
  if (all.length >= GLOBAL) return tooSoon(all, now);

  hits.set(`ok:${address}`, [...mine, now]);
  hits.set("__global__", [...all, now]);
  return { ok: true, retryAfter: 0 };
}

/** Test seam: drops all recorded hits. */
export function resetRateLimit() {
  hits.clear();
}
