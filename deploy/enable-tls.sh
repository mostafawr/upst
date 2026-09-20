#!/usr/bin/env bash
# Issues the Let's Encrypt certificate for upstack.pro and switches the vhost
# to HTTPS. Run once, after upstack.pro's A records point at this server.
#
# Certbot edits only /etc/nginx/sites-available/upstack.pro; the dashboards on
# this box have their own vhosts and certificates and are not touched.
set -euo pipefail

DOMAIN=upstack.pro
EMAIL="${CERTBOT_EMAIL:-ziad.ghanem@morecottons.com}"
EXPECTED_IP="$(curl -fsS https://api.ipify.org)"

for host in "$DOMAIN" "www.$DOMAIN"; do
  resolved="$(dig +short "$host" A @1.1.1.1 | tail -1)"
  if [ "$resolved" != "$EXPECTED_IP" ]; then
    echo "error: $host resolves to '${resolved:-nothing}', expected $EXPECTED_IP" >&2
    echo "Point the A record at this server and wait for the TTL to lapse." >&2
    exit 1
  fi
done

certbot --nginx \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --agree-tos --no-eff-email -m "$EMAIL" \
  --redirect --non-interactive

nginx -t
systemctl reload nginx

echo
curl -s -o /dev/null -w "https://%{url.host} -> %{http_code}\n" "https://$DOMAIN/"
