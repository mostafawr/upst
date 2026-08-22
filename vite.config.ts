import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

// Vite rejects requests whose Host header it does not recognise, which protects
// the dev server against DNS-rebinding attacks. Sharing a local preview through
// a tunnel means the Host arrives as the tunnel's domain, so those domains have
// to be allowed explicitly. A leading dot matches any subdomain, which matters
// because free tunnels get a fresh random subdomain on every restart.
//
// This applies to `npm run dev` only. It has no effect on the deployed Worker.
const TUNNEL_HOSTS = [
  ".ngrok-free.dev",
  ".ngrok-free.app",
  ".ngrok.app",
  ".ngrok.io",
  ".trycloudflare.com",
  ".loca.lt",
];

const allowedHosts = [
  ...TUNNEL_HOSTS,
  // Anything else, comma-separated: DEV_ALLOWED_HOSTS=preview.example.com
  ...(process.env.DEV_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean),
];

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          // Local dev uses the placeholder database. For a real deploy, set
          // D1_DATABASE_ID (and optionally D1_DATABASE_NAME) so the generated
          // dist/server/wrangler.json points at the actual database.
          database_name: process.env.D1_DATABASE_NAME ?? "site-creator-d1",
          database_id:
            process.env.D1_DATABASE_ID ?? SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
          // `wrangler d1 migrations apply` looks here for the drizzle-kit SQL.
          migrations_dir: "drizzle",
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: {
      allowedHosts,
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      }),
    ],
  };
});
