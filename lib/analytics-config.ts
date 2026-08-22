/**
 * PostHog project configuration.
 *
 * `phc_` keys are publishable — PostHog ships them in the browser bundle by
 * design, so committing this is expected and is not a secret leak. The env vars
 * still take precedence, which is what a second environment would use.
 */
export const posthogConfig = {
  key: process.env.POSTHOG_KEY || "phc_ndHZjs6pjAKxHxHsK2yEyL5AbB8fTdkQ2YGhUbTqppNX",
  host: process.env.POSTHOG_HOST || "https://us.i.posthog.com",
  /** PostHog's dated defaults bundle; pins recommended behaviour for this SDK. */
  defaults: "2026-05-30",
} as const;
