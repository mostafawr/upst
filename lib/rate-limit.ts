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

/** Submissions allowed from one address inside the window. */
const PER_ADDRESS = 3;
/** Submissions allowed from everyone combined, to blunt distributed spam. */
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

export function checkRateLimit(address: string): RateLimitResult {
  const now = Date.now();

  // Opportunistic sweep: without it the map grows for every address ever seen.
  if (hits.size > 5_000) {
    for (const key of [...hits.keys()]) recent(key, now);
  }

  const mine = recent(address, now);
  const all = recent("__global__", now);

  const blocked =
    mine.length >= PER_ADDRESS ? mine : all.length >= GLOBAL ? all : null;

  if (blocked) {
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - blocked[0])) / 1000) };
  }

  hits.set(address, [...mine, now]);
  hits.set("__global__", [...all, now]);
  return { ok: true, retryAfter: 0 };
}

/** Test seam: drops all recorded hits. */
export function resetRateLimit() {
  hits.clear();
}
