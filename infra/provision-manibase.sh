#!/usr/bin/env bash
#
# One-time provisioning for manibase.aicoreinfra.de on the prod server.
# Run ONCE as the deploy user (it uses sudo internally):
#
#     sudo bash ~/provision-manibase.sh
#
# Prerequisites:
#   * DNS A record:  manibase.aicoreinfra.de -> 72.62.42.27  (must resolve first,
#     certbot validates over HTTP-01)
#   * nginx + certbot already installed (they are)
#
# Idempotent: safe to re-run. Creates the deploy-owned docroot, an nginx
# vhost mirroring the schauersberger.com static-site pattern (security
# headers + Calendly-aware CSP), and a Let's Encrypt certificate.
# After this runs once, deploys happen automatically via GitHub Actions
# (.github/workflows/deploy.yml) on every merge to main.

set -euo pipefail

DOMAIN="manibase.aicoreinfra.de"
WEBROOT="/var/www/${DOMAIN}"
DEPLOY_USER="deploy"
CERT_EMAIL="kontakt@demiospace.ai"   # Let's Encrypt expiry notices

echo ">> Provisioning ${DOMAIN}"

# --- 1) docroot skeleton (deploy-owned, releases/current pattern) ----------
mkdir -p "${WEBROOT}/releases" "${WEBROOT}/shared"
INIT="${WEBROOT}/releases/00000000000000"
if [ ! -e "${WEBROOT}/current" ]; then
  mkdir -p "${INIT}"
  cat > "${INIT}/index.html" <<'HOLD'
<!doctype html><meta charset="utf-8"><title>manibase</title>
<h1>manibase</h1><p>Seite wird in Kürze ausgespielt.</p>
HOLD
  ln -sfn "${INIT}" "${WEBROOT}/current"
fi
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${WEBROOT}"

# --- 2) nginx vhost (HTTP; certbot adds the 443 block + redirect) ----------
VHOST="/etc/nginx/sites-available/${DOMAIN}"
cat > "${VHOST}" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()" always;
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;
    # CSP allows the on-demand Calendly inline widget; everything else is self-hosted.
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://assets.calendly.com; style-src 'self' 'unsafe-inline' https://assets.calendly.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://calendly.com https://*.calendly.com; frame-src https://calendly.com https://*.calendly.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" always;

    root ${WEBROOT}/current;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \.(?:css|js|jpg|jpeg|gif|png|svg|ico|webp|woff2?)\$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }
}
NGINX

ln -sfn "${VHOST}" "/etc/nginx/sites-enabled/${DOMAIN}"
nginx -t
systemctl reload nginx

# --- 3) TLS via Let's Encrypt (adds 443 server block + http->https) --------
certbot --nginx -d "${DOMAIN}" \
    --non-interactive --agree-tos -m "${CERT_EMAIL}" --redirect

nginx -t
systemctl reload nginx

echo ">> Done. https://${DOMAIN}/ is live (placeholder until first deploy)."
echo ">> Merge a PR to main (or run the deploy workflow) to publish site/."
