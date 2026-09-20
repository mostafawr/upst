# Self-hosting upstack.pro

The site is built as a Cloudflare Worker (`worker/index.ts`, bindings `ASSETS`,
`DB`, `IMAGES`). Cloudflare is not in the path here, so the VPS runs that same
bundle under **Miniflare**, which supplies workerd plus local implementations of
the three bindings. Nothing about the application code changes between the two.

## Layout on the server

```
/srv/upstack/
  dist/            build output (dist/server = worker, dist/client = assets)
  drizzle/         D1 migrations, applied on boot
  deploy/          this directory, plus node_modules for miniflare
  data/            persisted D1 / cache / images  (the only writable path)
  .env             secrets, mode 600, owned by upstack
```

Service: `upstack.service`, user `upstack`, listening on `127.0.0.1:8787`.
nginx (`/etc/nginx/sites-available/upstack.pro`) terminates TLS and proxies to it.

## Deploying a new build

From a checkout on your machine:

```bash
npm run build
rsync -az --delete dist drizzle deploy root@161.97.170.182:/srv/upstack/
ssh root@161.97.170.182 'cd /srv/upstack/deploy && npm install --omit=dev && chown -R upstack:upstack /srv/upstack && systemctl restart upstack'
```

`npm install` is only needed when `deploy/package.json` changes.

## Operations

```bash
systemctl status upstack
journalctl -u upstack -f
systemctl restart upstack          # after editing /srv/upstack/.env
```

Leads land in the D1 SQLite file under `/srv/upstack/data/d1/`. Read them with:

```bash
sqlite3 "$(ls /srv/upstack/data/d1/miniflare-D1DatabaseObject/*.sqlite | grep -v metadata)" \
  'select id, full_name, email, phone, budget, created_at from leads order by id desc limit 20;'
```

## TLS

`./enable-tls.sh` once the A records point here. It refuses to run while DNS
still points elsewhere, so it cannot burn a Let's Encrypt rate limit on a
failing challenge.
