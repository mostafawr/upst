/**
 * Conversion reporting. Every call is safe when no tag is loaded, so the site
 * behaves identically with analytics disabled.
 */
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  try {
    window.posthog?.capture(event, properties);
    window.gtag?.("event", event, properties ?? {});
  } catch {
    // Never let measurement interrupt the user's flow.
  }
}
