"use client";

import { useEffect } from "react";
import { posthogConfig } from "@/lib/analytics-config";

interface AnalyticsProps {
  posthogKey?: string;
  posthogHost?: string;
  gaMeasurementId?: string;
}

declare global {
  interface Window {
    posthog?: {
      init: (key: string, options: Record<string, unknown>) => void;
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadScript(src: string, id: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

/**
 * Loads the measurement tags that are configured. Each block is a no-op when
 * its key is absent, so local development and previews stay untracked.
 */
export default function Analytics({
  posthogKey,
  posthogHost,
  gaMeasurementId,
}: AnalyticsProps) {
  useEffect(() => {
    if (!posthogKey) return;

    const host = posthogHost || posthogConfig.host;

    import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(posthogKey, {
          api_host: host,
          defaults: posthogConfig.defaults,
          // Client-side navigation is history-based here, so pageviews must be
          // captured on history change rather than only on first load.
          capture_pageview: "history_change",
          capture_pageleave: true,
          person_profiles: "identified_only",
        });
        window.posthog = posthog as unknown as Window["posthog"];
      })
      .catch(() => {
        // Analytics must never break the page.
      });
  }, [posthogKey, posthogHost]);

  useEffect(() => {
    if (!gaMeasurementId) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaMeasurementId);

    loadScript(
      `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`,
      "ga4-tag",
    );
  }, [gaMeasurementId]);

  return null;
}
