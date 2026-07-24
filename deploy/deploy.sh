#!/usr/bin/env bash
# Build locally and sync the static output to the Vultr server.
set -euo pipefail

SERVER="root@64.177.116.163"
DEST="/var/www/portfolio"

cd "$(dirname "$0")/.."

npm run build
rsync -az --delete dist/ "$SERVER:$DEST/"

echo "Deployed to $SERVER:$DEST"
