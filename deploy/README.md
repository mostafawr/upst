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

## Deploying

```bash
git checkout production && git pull
./deploy/deploy.sh
```

That script is the only sanctioned deploy path. It refuses to run unless:

- you are on `production` — not `staging`, not a feature branch;
- the working tree is clean, so the artefact matches a real commit;
- local `production` equals `origin/production`, so the deployed commit is one
  your colleagues can actually see.

It then builds, snapshots the current `dist/` as `dist.prev` (hardlinks, so it
costs nothing), uploads, restarts, and polls the site for a 200. If the new
release does not come up, it restores the snapshot, restarts, prints the last
30 journal lines and exits non-zero.

### Rehearsing the rollback

Point the health check at a host the vhost will not answer with 200. The deploy
runs for real, fails its check, and restores the snapshot — which is the same
code it just uploaded, so nothing breaks:

```bash
DEPLOY_HEALTH_HOST=morecotton-dashboard.online ./deploy/deploy.sh
```

Expect it to exit non-zero with `did not come up. Rolled back.` and the site to
still answer 200 afterwards. Worth doing after any change to this script.

The deployed commit is recorded in `/srv/upstack/RELEASE`:

```bash
ssh root@161.97.170.182 cat /srv/upstack/RELEASE
```

Nothing on the server *enforces* this — anyone with root can rsync whatever they
like. The gate is the script plus the discipline of using it; `RELEASE` is what
tells you afterwards whether that held.

## Branches

```
staging     day-to-day work
production  what is running on the box
```

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
