#!/usr/bin/env bash
set -euo pipefail

HOST="${MOVIE_NIGHT_HOST:-38.148.205.95}"
PORT="${MOVIE_NIGHT_PORT:-31380}"
USER="${MOVIE_NIGHT_USER:-root}"
REMOTE_ROOT="${MOVIE_NIGHT_REMOTE_ROOT:-/var/www/movie-night}"
RELEASE="$(date +%Y%m%d%H%M%S)"

MOVIE_NIGHT_SITE_URL="${MOVIE_NIGHT_SITE_URL:-https://mvnight.xyz}" npm run build
ssh -p "$PORT" "$USER@$HOST" "mkdir -p '$REMOTE_ROOT/releases/$RELEASE'"
rsync -az --delete --exclude '/data/' -e "ssh -p $PORT" dist/ "$USER@$HOST:$REMOTE_ROOT/releases/$RELEASE/"

ssh -p "$PORT" "$USER@$HOST" "REMOTE_ROOT='$REMOTE_ROOT' RELEASE='$RELEASE' bash -s" <<'REMOTE'
set -euo pipefail
test -f "$REMOTE_ROOT/releases/$RELEASE/index.html"
ln -sfn "$REMOTE_ROOT/releases/$RELEASE" "$REMOTE_ROOT/current.next"
mv -Tf "$REMOTE_ROOT/current.next" "$REMOTE_ROOT/current"
find "$REMOTE_ROOT/releases" -mindepth 1 -maxdepth 1 -type d | sort -r | tail -n +6 | xargs -r rm -rf
REMOTE

echo "Code deployed: $RELEASE"
