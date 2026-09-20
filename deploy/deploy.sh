#!/usr/bin/env bash
#
# The only sanctioned way to put code on the server.
#
# Production is whatever is running at 161.97.170.182, and the point of this
# script is that it can only ever be a commit that exists on origin/production.
# Everything before the rsync is a refusal check; everything after it can undo
# itself if the new release does not come up healthy.
set -euo pipefail

SERVER="${DEPLOY_SERVER:-root@161.97.170.182}"
REMOTE=/srv/upstack
BRANCH=production
# What gets shipped. Everything else on the server is state, not artefact.
PAYLOAD="dist drizzle deploy"
HEALTH_HOST="${DEPLOY_HEALTH_HOST:-upstack.pro}"
HEALTH_IP=127.0.0.1

die() { printf '\n  refusing to deploy: %s\n\n' "$1" >&2; exit 1; }
step() { printf '\n==> %s\n' "$1"; }

cd "$(dirname "$0")/.."
[ -d .git ] || die "not a git checkout"

# --- refusal checks -----------------------------------------------------------

step "checking the tree"

current="$(git rev-parse --abbrev-ref HEAD)"
[ "$current" = "$BRANCH" ] || die "on branch '$current'. Deploys come from '$BRANCH' only.
    git checkout $BRANCH && git pull"

# An unclean tree means the artefact would not match any commit, so there would
# be no way to tell later what is actually running.
[ -z "$(git status --porcelain)" ] || die "working tree has uncommitted changes.
$(git status --short | sed 's/^/    /')"

git fetch -q origin "$BRANCH"
local_sha="$(git rev-parse HEAD)"
remote_sha="$(git rev-parse "origin/$BRANCH")"

if [ "$local_sha" != "$remote_sha" ]; then
  ahead="$(git rev-list --count "origin/$BRANCH..HEAD")"
  behind="$(git rev-list --count "HEAD..origin/$BRANCH")"
  die "local $BRANCH is $ahead ahead / $behind behind origin/$BRANCH.
    Push or pull first, so the deployed commit is one others can see."
fi

short="$(git rev-parse --short HEAD)"
subject="$(git log -1 --pretty=%s)"
echo "    $BRANCH @ $short — $subject"

# --- build --------------------------------------------------------------------

step "building"
npm run build

[ -f dist/server/index.js ] || die "build produced no dist/server/index.js"
[ -d dist/client ] || die "build produced no dist/client"

# --- ship ---------------------------------------------------------------------

step "snapshotting the current release for rollback"
# Hardlinks, so the snapshot costs no disk and takes no time; rsync replaces a
# changed file by writing a new inode and renaming over it, which leaves the
# snapshot's copy untouched. deploy/ is included because a broken server.mjs or
# unit file needs rolling back just as much as a broken build does.
ssh "$SERVER" "rm -rf $REMOTE/.prev && mkdir -p $REMOTE/.prev
for d in $PAYLOAD; do [ -d $REMOTE/\$d ] && cp -al $REMOTE/\$d $REMOTE/.prev/\$d; done
true"

step "uploading"
# node_modules lives only on the server — it is installed there, never shipped.
# Without this exclude, --delete would wipe it on every deploy and npm would
# re-download workerd each time.
rsync -az --delete --exclude 'node_modules/' $PAYLOAD "$SERVER:$REMOTE/"

# Cheap now that node_modules survives the upload: npm no-ops unless
# deploy/package.json actually changed.
step "syncing runtime dependencies"
ssh "$SERVER" "cd $REMOTE/deploy && npm install --omit=dev --no-audit --no-fund >/dev/null && chown -R upstack:upstack $REMOTE"

step "restarting"
ssh "$SERVER" "install -m 644 $REMOTE/deploy/upstack.service /etc/systemd/system/upstack.service && systemctl daemon-reload && systemctl restart upstack"

# --- verify, or undo ----------------------------------------------------------

step "health check"
healthy=0
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  sleep 3
  code="$(ssh "$SERVER" "curl -sk -o /dev/null -w '%{http_code}' https://$HEALTH_HOST/ --resolve $HEALTH_HOST:443:$HEALTH_IP" || true)"
  echo "    attempt $attempt: $code"
  [ "$code" = "200" ] && { healthy=1; break; }
done

if [ "$healthy" != "1" ]; then
  step "UNHEALTHY — rolling back to the previous release"
  ssh "$SERVER" "
    if [ -d $REMOTE/.prev ]; then
      for d in $PAYLOAD; do
        [ -d $REMOTE/.prev/\$d ] || continue
        rm -rf $REMOTE/\$d && mv $REMOTE/.prev/\$d $REMOTE/\$d
      done
      rm -rf $REMOTE/.prev
      chown -R upstack:upstack $REMOTE
      install -m 644 $REMOTE/deploy/upstack.service /etc/systemd/system/upstack.service
      systemctl daemon-reload && systemctl restart upstack
      echo '    previous release restored'
    else
      echo '    no snapshot to roll back to'
    fi
    journalctl -u upstack -n 30 --no-pager"
  die "$short did not come up. Rolled back."
fi

step "recording the release"
# Written only once the release is known good, so RELEASE always names the
# commit that is actually serving — including after a rollback.
ssh "$SERVER" "cat > $REMOTE/RELEASE <<REL
commit=$local_sha
short=$short
branch=$BRANCH
subject=$subject
deployed_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)
deployed_by=$(git config user.email 2>/dev/null || whoami)
REL
chown upstack:upstack $REMOTE/RELEASE
rm -rf $REMOTE/.prev"

step "deployed"
ssh "$SERVER" "sed 's/^/    /' $REMOTE/RELEASE"
echo
