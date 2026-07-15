#!/usr/bin/env bash
set -euo pipefail

HOST="${MOVIE_NIGHT_HOST:-38.148.205.95}"
PORT="${MOVIE_NIGHT_PORT:-31380}"
USER="${MOVIE_NIGHT_USER:-root}"
REMOTE_ROOT="${MOVIE_NIGHT_REMOTE_ROOT:-/var/www/movie-night}"
DATA_DIR="${1:-public/data}"
RELEASE="$(date +%Y%m%d%H%M%S)"

node scripts/validate-data.mjs "$DATA_DIR"
ssh -p "$PORT" "$USER@$HOST" "mkdir -p '$REMOTE_ROOT/shared/data/releases/$RELEASE'"
rsync -az --delete -e "ssh -p $PORT" "$DATA_DIR/" "$USER@$HOST:$REMOTE_ROOT/shared/data/releases/$RELEASE/"

ssh -p "$PORT" "$USER@$HOST" "REMOTE_ROOT='$REMOTE_ROOT' RELEASE='$RELEASE' bash -s" <<'REMOTE'
set -euo pipefail
DATA_ROOT="$REMOTE_ROOT/shared/data"
test -f "$DATA_ROOT/releases/$RELEASE/manifest.json"
test -f "$DATA_ROOT/releases/$RELEASE/home.json"
ln -sfn "$DATA_ROOT/releases/$RELEASE" "$DATA_ROOT/current.next"
mv -Tf "$DATA_ROOT/current.next" "$DATA_ROOT/current"
find "$DATA_ROOT/releases" -mindepth 1 -maxdepth 1 -type d | sort -r | tail -n +4 | xargs -r rm -rf
REMOTE

echo "Data deployed: $RELEASE"
