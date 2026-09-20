/**
 * Self-hosted runtime for the UPSTACK Worker.
 *
 * The site is built for Cloudflare Workers (workerd + D1 + ASSETS + IMAGES).
 * Miniflare runs that exact bundle outside Cloudflare, so the deployed VPS
 * behaves like the Worker would: same entry, same bindings, real SQLite for D1.
 *
 * Listens on 127.0.0.1 only; nginx terminates TLS and proxies to it.
 */
import { readFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Miniflare } from "miniflare";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const DIST_SERVER = resolve(root, "dist/server");
const DIST_CLIENT = resolve(root, "dist/client");
const WRANGLER_JSON = resolve(DIST_SERVER, "wrangler.json");

const PORT = Number(process.env.PORT ?? 8787);
const HOST = process.env.HOST ?? "127.0.0.1";
const PERSIST = process.env.PERSIST_DIR ?? resolve(root, ".data");

/** `KEY=value` lines; `#` comments and blank lines ignored, quotes stripped. */
function readEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) out[key] = value;
  }
  return out;
}

const MODULE_TYPES = {
  ".js": "ESModule",
  ".mjs": "ESModule",
  ".wasm": "CompiledWasm",
  ".txt": "Text",
  ".html": "Text",
  ".bin": "Data",
};

/**
 * Enumerates the worker bundle's modules for Miniflare.
 *
 * Miniflare can walk the import graph itself, but the SSR chunks use dynamic
 * `import()` specifiers it cannot statically resolve, so every module in the
 * server output is declared up front instead. The entry must come first.
 */
function collectModules(dir, entry) {
  const paths = [];
  const walk = (current) => {
    for (const item of readdirSync(current, { withFileTypes: true })) {
      const full = resolve(current, item.name);
      if (item.isDirectory()) walk(full);
      else if (MODULE_TYPES[item.name.slice(item.name.lastIndexOf("."))]) paths.push(full);
    }
  };
  walk(dir);

  const entryPath = resolve(dir, entry);
  paths.sort((a, b) => (a === entryPath ? -1 : b === entryPath ? 1 : 0));

  return paths.map((path) => ({
    type: MODULE_TYPES[path.slice(path.lastIndexOf("."))],
    path,
    // Forward slashes: this is a module specifier, not a filesystem path.
    name: relative(dir, path).split(/[\\/]/).join("/"),
  }));
}

const wrangler = JSON.parse(readFileSync(WRANGLER_JSON, "utf8"));
const appEnv = { ...readEnvFile(resolve(root, ".env")), ...wrangler.vars };

mkdirSync(PERSIST, { recursive: true });

const mf = new Miniflare({
  name: wrangler.name,
  modulesRoot: DIST_SERVER,
  compatibilityDate: wrangler.compatibility_date,
  compatibilityFlags: wrangler.compatibility_flags ?? [],

  // The build emits one ESM bundle plus sidecar `.js` modules. Without this,
  // Miniflare's module collector treats the sidecars as CommonJS and the
  // bundle fails to parse.
  modules: collectModules(DIST_SERVER, wrangler.main ?? "index.js"),

  // Static output. The Worker reaches it through env.ASSETS, and the asset
  // router serves matching paths before the Worker runs.
  assets: {
    directory: DIST_CLIENT,
    binding: "ASSETS",
    routerConfig: { has_user_worker: true },
    assetConfig: { html_handling: "auto-trailing-slash", not_found_handling: "none" },
  },

  // Contact-form leads. Real SQLite on disk, so data survives restarts.
  d1Databases: Object.fromEntries(
    (wrangler.d1_databases ?? []).map((d) => [d.binding, d.database_id]),
  ),
  d1Persist: resolve(PERSIST, "d1"),
  cachePersist: resolve(PERSIST, "cache"),

  // /_vinext/image resizing. Cloudflare Images has no self-hosted equivalent;
  // Miniflare's local implementation covers the transforms the site asks for.
  images: { binding: "IMAGES" },
  imagesPersist: resolve(PERSIST, "images"),

  bindings: appEnv,

  host: HOST,
  port: PORT,
});

await mf.ready;

await applyMigrations();

console.log(`upstack worker listening on http://${HOST}:${PORT}`);

/**
 * Applies the drizzle-kit SQL to the persisted D1 database.
 *
 * On Cloudflare this is `wrangler d1 migrations apply`. Self-hosted there is
 * no control plane to run it, so the server brings its own schema up to date
 * on boot. Applied filenames are recorded in `d1_migrations`, matching the
 * table Wrangler uses, so the two stay interchangeable.
 */
async function applyMigrations() {
  const binding = (wrangler.d1_databases ?? [])[0]?.binding;
  if (!binding) return;

  const dir = resolve(root, (wrangler.d1_databases ?? [])[0].migrations_dir ?? "drizzle");
  if (!existsSync(dir)) return;

  const db = await mf.getD1Database(binding);
  await db.exec(
    "CREATE TABLE IF NOT EXISTS d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  );

  const { results } = await db.prepare("SELECT name FROM d1_migrations").all();
  const applied = new Set(results.map((row) => row.name));

  const pending = readdirSync(dir)
    .filter((name) => name.endsWith(".sql") && !applied.has(name))
    .sort();

  for (const name of pending) {
    const sql = readFileSync(resolve(dir, name), "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) {
      const trimmed = statement.trim();
      if (trimmed) await db.exec(trimmed.replace(/\n\s*/g, " "));
    }
    await db.prepare("INSERT INTO d1_migrations (name) VALUES (?)").bind(name).run();
    console.log(`applied migration ${name}`);
  }
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    mf.dispose().then(() => process.exit(0));
  });
}
