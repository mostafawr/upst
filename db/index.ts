import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

/**
 * Resolves the Drizzle client for the D1 binding.
 *
 * `cloudflare:workers` is imported dynamically so this module stays loadable
 * outside the Workers runtime — the rendered-HTML test suite imports the built
 * worker in plain Node, where that specifier does not resolve.
 */
export async function getDb() {
  const { env } = await import("cloudflare:workers");
  const bindings = env as typeof env & { DB?: D1Database };

  if (!bindings.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(bindings.DB, { schema });
}
