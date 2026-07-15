#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${1:-/Users/zzm/Documents/mvnight/public/data}"
TARGET_DIR="${2:-public/data}"

if [[ ! -f "$SOURCE_DIR/manifest.json" ]]; then
  echo "Source catalog is missing manifest.json: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
rsync -a --delete --exclude .gitkeep "$SOURCE_DIR/" "$TARGET_DIR/"
node scripts/stamp-manifest.mjs "$TARGET_DIR/manifest.json"
node scripts/validate-data.mjs "$TARGET_DIR"

echo "Catalog copied into this project: $SOURCE_DIR -> $TARGET_DIR"
