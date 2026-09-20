#!/usr/bin/env bash
#
# Uptime watch for upstack.pro.
#
# Runs on the same box as the site, which is the limitation worth stating: it
# catches the service dying, hanging, or serving errors, but not the machine or
# its network going away. For that you want an off-box pinger as well.
#
# Recovery is attempted once before alerting, because the overwhelmingly common
# failure is the worker wedging, and a restart fixes it faster than an email.
set -uo pipefail

URL="https://upstack.pro/"
RESOLVE="upstack.pro:443:127.0.0.1"
STATE=/var/lib/upstack-health/state
RETRIES=3
TIMEOUT=15

RESEND_KEY=""; ALERT_TO=""; ALERT_FROM=""
# The site's own credentials; no second place to keep them in sync.
[ -r /srv/upstack/.env ] && . <(grep -E '^(RESEND_API_KEY|CONTACT_NOTIFICATION_TO|CONTACT_NOTIFICATION_FROM)=' /srv/upstack/.env)
RESEND_KEY="${RESEND_API_KEY:-}"
ALERT_TO="${CONTACT_NOTIFICATION_TO:-}"
ALERT_FROM="${CONTACT_NOTIFICATION_FROM:-}"

mkdir -p "$(dirname "$STATE")"
previous="$(cat "$STATE" 2>/dev/null || echo up)"

probe() {
  curl -sk -o /dev/null -w '%{http_code}' --max-time "$TIMEOUT" \
    --resolve "$RESOLVE" "$URL" 2>/dev/null || echo 000
}

code=000
for _ in $(seq "$RETRIES"); do
  code="$(probe)"
  [ "$code" = "200" ] && break
  sleep 5
done

notify() {
  local subject="$1" body="$2"
  logger -t upstack-health "$subject"
  [ -n "$RESEND_KEY" ] && [ -n "$ALERT_TO" ] && [ -n "$ALERT_FROM" ] || return 0
  curl -s -o /dev/null -X POST https://api.resend.com/emails \
    -H "authorization: Bearer $RESEND_KEY" \
    -H 'content-type: application/json' \
    --data "$(printf '{"from":%s,"to":[%s],"subject":%s,"text":%s}' \
      "$(printf '%s' "$ALERT_FROM" | jq -Rs .)" \
      "$(printf '%s' "$ALERT_TO"   | jq -Rs .)" \
      "$(printf '%s' "$subject"    | jq -Rs .)" \
      "$(printf '%s' "$body"       | jq -Rs .)")"
}

if [ "$code" = "200" ]; then
  if [ "$previous" != "up" ]; then
    notify "upstack.pro is back up" "Recovered at $(date -u +%Y-%m-%dT%H:%M:%SZ). Responding 200."
  fi
  echo up > "$STATE"
  exit 0
fi

logger -t upstack-health "probe returned $code; restarting upstack"
systemctl restart upstack
sleep 12
after="$(probe)"

if [ "$after" = "200" ]; then
  # Only shout if this is new, so a flapping service does not mail every run.
  if [ "$previous" = "up" ]; then
    notify "upstack.pro recovered after a restart" \
"The site returned $code at $(date -u +%Y-%m-%dT%H:%M:%SZ).
It was restarted automatically and is now responding 200.

Worth a look at why it stopped:
  journalctl -u upstack -n 100 --no-pager"
  fi
  echo up > "$STATE"
  exit 0
fi

echo down > "$STATE"
if [ "$previous" = "up" ]; then
  notify "upstack.pro is DOWN" \
"The site returned $code at $(date -u +%Y-%m-%dT%H:%M:%SZ).
A restart was attempted and it still returns $after.

  systemctl status upstack
  journalctl -u upstack -n 100 --no-pager"
fi
exit 1
