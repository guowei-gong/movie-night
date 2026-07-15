#!/usr/bin/env bash
set -euo pipefail

HOST="${MOVIE_NIGHT_HOST:-38.148.205.95}"
PORT="${MOVIE_NIGHT_PORT:-31380}"
USER="${MOVIE_NIGHT_USER:-root}"
REMOTE_ROOT="${MOVIE_NIGHT_REMOTE_ROOT:-/var/www/movie-night}"
DOMAIN="${MOVIE_NIGHT_DOMAIN:-mvnight.xyz}"
WWW_DOMAIN="${MOVIE_NIGHT_WWW_DOMAIN:-www.$DOMAIN}"

ssh -p "$PORT" "$USER@$HOST" "REMOTE_ROOT='$REMOTE_ROOT' DOMAIN='$DOMAIN' WWW_DOMAIN='$WWW_DOMAIN' bash -s" <<'REMOTE'
set -euo pipefail

test -f "$REMOTE_ROOT/current/index.html"
test -f "$REMOTE_ROOT/shared/data/current/manifest.json"

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y nginx rsync certbot python3-certbot-nginx

if [[ -f /etc/nginx/sites-available/mvnight ]]; then
  cp -a /etc/nginx/sites-available/mvnight "/etc/nginx/sites-available/mvnight.backup-$(date +%Y%m%d%H%M%S)"
fi

cat > /etc/nginx/snippets/movie-night-security.conf <<'NGINX'
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Frame-Options "SAMEORIGIN" always;
NGINX

cat > /etc/nginx/sites-available/movie-night <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    root $REMOTE_ROOT/current;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types application/json text/css application/javascript image/svg+xml;

    include /etc/nginx/snippets/movie-night-security.conf;

    location ~* "^/assets/.*-[A-Za-z0-9_-]{8,}\\.(?:js|css)$" {
        include /etc/nginx/snippets/movie-night-security.conf;
        try_files \$uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /assets/ {
        include /etc/nginx/snippets/movie-night-security.conf;
        try_files \$uri =404;
        add_header Cache-Control "public, max-age=604800";
    }

    location /data/ {
        include /etc/nginx/snippets/movie-night-security.conf;
        alias $REMOTE_ROOT/shared/data/current/;
        try_files \$uri =404;
        add_header Cache-Control "no-cache";
        add_header X-Content-Type-Options "nosniff" always;
    }

    location /covers/ {
        include /etc/nginx/snippets/movie-night-security.conf;
        proxy_pass https://static.olelive.com/;
        proxy_set_header Host static.olelive.com;
        proxy_ssl_server_name on;
        proxy_cache movie_night_covers;
        proxy_cache_lock on;
        proxy_cache_valid 200 30d;
        proxy_cache_valid 404 10m;
        add_header X-Cover-Cache \$upstream_cache_status;
        add_header Cache-Control "public, max-age=2592000";
    }

    location = /healthz {
        include /etc/nginx/snippets/movie-night-security.conf;
        access_log off;
        add_header Content-Type text/plain;
        return 200 "ok\\n";
    }

    location / {
        include /etc/nginx/snippets/movie-night-security.conf;
        try_files \$uri \$uri.html \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
NGINX

cat > /etc/nginx/conf.d/movie-night-cache.conf <<NGINX
proxy_cache_path /var/cache/nginx/movie-night-covers levels=1:2 keys_zone=movie_night_covers:10m max_size=2g inactive=30d use_temp_path=off;
NGINX

cat > /etc/nginx/sites-available/movie-night-www <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $WWW_DOMAIN;
    return 301 https://$DOMAIN\$request_uri;
}
NGINX

mkdir -p /var/cache/nginx/movie-night-covers
chown -R www-data:www-data /var/cache/nginx/movie-night-covers

ln -sfn /etc/nginx/sites-available/movie-night /etc/nginx/sites-enabled/movie-night
ln -sfn /etc/nginx/sites-available/movie-night-www /etc/nginx/sites-enabled/movie-night-www
rm -f /etc/nginx/sites-enabled/mvnight /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx

certbot --nginx --cert-name "$DOMAIN" -d "$DOMAIN" -d "$WWW_DOMAIN" --expand --non-interactive --agree-tos --register-unsafely-without-email --redirect
nginx -t
systemctl reload nginx
systemctl enable certbot.timer >/dev/null 2>&1 || true
REMOTE

echo "Server configured: https://$DOMAIN"
