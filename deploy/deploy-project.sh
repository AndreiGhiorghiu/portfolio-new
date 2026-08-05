#!/usr/bin/env bash
# Deploy a project to <name>.andrei-ghiorghiu.dev on the Vultr server.
#
#   ./deploy-project.sh <name> <local-dir> [options]
#
#   --build "cmd"        local build command (default: "npm run build"; "none" to skip)
#   --static <dir>       directory to serve as web root, relative to local-dir (default: dist)
#   --port <n>           app server port -> enables node mode (systemd service + proxy)
#   --proxy <path>       nginx location proxied to 127.0.0.1:<port> (repeatable, e.g. --proxy /io)
#   --start "cmd"        systemd ExecStart in node mode (default: "npx tsx server/main.ts")
#   --env KEY=VALUE      systemd Environment= entry (repeatable)
#   --spa                SPA fallback: unknown paths serve /index.html
#
# Example (family-quest):
#   ./deploy-project.sh family-quest ~/Projects/Personal/family-quest \
#     --port 8787 --proxy /io --spa \
#     --env HUB_PORT=8787 --env DB_URL=/var/www/apps/family-quest/data/family-quest.db
#
# Idempotent: re-running redeploys code, restarts the service, keeps the cert and data/.
# Note: app ports are internal-only — UFW allows just 22/80/443 from outside.
set -euo pipefail

SERVER="root@64.177.116.163"
DOMAIN="andrei-ghiorghiu.dev"

# ── args ──────────────────────────────────────────────────────────────────────
NAME="${1:-}"; LOCAL_DIR="${2:-}"
[[ -n "$NAME" && -n "$LOCAL_DIR" ]] || { grep '^#' "$0" | sed 's/^# \{0,1\}//' | head -20; exit 1; }
[[ "$NAME" =~ ^[a-z0-9-]+$ ]] || { echo "name must be [a-z0-9-]"; exit 1; }
LOCAL_DIR="${LOCAL_DIR%/}"
[[ -d "$LOCAL_DIR" ]] || { echo "no such directory: $LOCAL_DIR"; exit 1; }
shift 2

BUILD="npm run build"; STATIC_DIR="dist"; PORT=""; START="npx tsx server/main.ts"; SPA=0
PROXIES=(); ENVS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --build)  BUILD="$2"; shift 2 ;;
    --static) STATIC_DIR="$2"; shift 2 ;;
    --port)   PORT="$2"; shift 2 ;;
    --proxy)  PROXIES+=("$2"); shift 2 ;;
    --start)  START="$2"; shift 2 ;;
    --env)    ENVS+=("$2"); shift 2 ;;
    --spa)    SPA=1; shift ;;
    *) echo "unknown option: $1"; exit 1 ;;
  esac
done

SUB="$NAME.$DOMAIN"
BASE="/var/www/apps/$NAME"
SERVICE="app-$NAME"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

echo "==> deploying $LOCAL_DIR -> https://$SUB"

# ── 1. server prep: Node 22 (node mode only, first time) ─────────────────────
if [[ -n "$PORT" ]]; then
  ssh "$SERVER" 'command -v node >/dev/null 2>&1 || {
    echo "installing Node 22...";
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null 2>&1;
    apt-get install -y -qq nodejs; }; node --version'
fi

# ── 2. local build ───────────────────────────────────────────────────────────
if [[ "$BUILD" != "none" ]]; then
  echo "==> build: $BUILD"
  (cd "$LOCAL_DIR" && eval "$BUILD")
fi
[[ -d "$LOCAL_DIR/$STATIC_DIR" ]] || { echo "web root $LOCAL_DIR/$STATIC_DIR missing"; exit 1; }

# ── 3. sync files ────────────────────────────────────────────────────────────
ssh "$SERVER" "mkdir -p '$BASE/app' '$BASE/data'"

if [[ -n "$PORT" ]]; then
  echo "==> sync source"
  rsync -az --delete \
    --exclude node_modules --exclude .git --exclude "$STATIC_DIR" --exclude data \
    --exclude '*.db' --exclude '*.db-wal' --exclude '*.db-shm' --exclude '*.db-journal' \
    --exclude pnpm-lock.yaml --exclude pnpm-workspace.yaml --exclude .env \
    "$LOCAL_DIR/" "$SERVER:$BASE/app/"
fi

echo "==> sync web root"
rsync -az --delete "$LOCAL_DIR/$STATIC_DIR/" "$SERVER:$BASE/app/$STATIC_DIR/"

# ── 4. node mode: deps + systemd service ─────────────────────────────────────
if [[ -n "$PORT" ]]; then
  echo "==> install deps + service"
  ENV_LINES=""
  for kv in "${ENVS[@]+"${ENVS[@]}"}"; do ENV_LINES+="Environment=$kv"$'\n'; done

  cat > "$TMP/$SERVICE.service" <<UNIT
[Unit]
Description=$NAME ($SUB)
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=$BASE/app
ExecStart=/usr/bin/env $START
$ENV_LINES\
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT

  scp -q "$TMP/$SERVICE.service" "$SERVER:/etc/systemd/system/$SERVICE.service"
  ssh "$SERVER" "cd '$BASE/app' &&
    if [ -d node_modules ]; then npm install --no-audit --no-fund --loglevel=error; \
    else npm ci --no-audit --no-fund --loglevel=error; fi &&
    chown -R www-data:www-data '$BASE' &&
    systemctl daemon-reload &&
    systemctl enable --now '$SERVICE' >/dev/null 2>&1 &&
    systemctl restart '$SERVICE' &&
    sleep 1 && systemctl is-active '$SERVICE'"
fi

# ── 5. nginx vhost ───────────────────────────────────────────────────────────
FALLBACK="=404"; [[ $SPA -eq 1 ]] && FALLBACK="/index.html"

PROXY_BLOCKS=""
for p in "${PROXIES[@]+"${PROXIES[@]}"}"; do
  PROXY_BLOCKS+="
    location $p {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
"
done

COMMON="
    root $BASE/app/$STATIC_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ $FALLBACK;
    }
$PROXY_BLOCKS
    location /assets/ {
        add_header Cache-Control \"public, max-age=31536000, immutable\";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 512;

    add_header X-Content-Type-Options \"nosniff\" always;
"

HAS_CERT=$(ssh "$SERVER" "[ -d /etc/letsencrypt/live/$SUB ] && echo yes || echo no")

if [[ "$HAS_CERT" == "yes" ]]; then
  cat > "$TMP/vhost.conf" <<CONF
# $SUB — generated by deploy-project.sh
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name $SUB;
$COMMON
    ssl_certificate /etc/letsencrypt/live/$SUB/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$SUB/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    listen [::]:80;
    server_name $SUB;
    return 301 https://$SUB\$request_uri;
}
CONF
else
  cat > "$TMP/vhost.conf" <<CONF
# $SUB — generated by deploy-project.sh (pre-certificate)
server {
    listen 80;
    listen [::]:80;
    server_name $SUB;
$COMMON
}
CONF
fi

echo "==> nginx vhost"
scp -q "$TMP/vhost.conf" "$SERVER:/etc/nginx/sites-available/$SUB"
ssh "$SERVER" "ln -sf /etc/nginx/sites-available/$SUB /etc/nginx/sites-enabled/$SUB &&
  nginx -t 2>&1 | tail -1 && systemctl reload nginx"

# ── 6. certificate (first run) ───────────────────────────────────────────────
if [[ "$HAS_CERT" == "no" ]]; then
  echo "==> obtaining certificate for $SUB"
  ssh "$SERVER" "certbot certonly --nginx -d '$SUB' --non-interactive 2>&1 | grep -E 'Success|error|failed' | head -2"
  # regenerate the vhost in its final HTTPS form
  exec "$0" "$NAME" "$LOCAL_DIR" --build none --static "$STATIC_DIR" \
    $( [[ -n "$PORT" ]] && printf -- '--port %s ' "$PORT" ) \
    $( for p in "${PROXIES[@]+"${PROXIES[@]}"}"; do printf -- '--proxy %s ' "$p"; done ) \
    $( for kv in "${ENVS[@]+"${ENVS[@]}"}"; do printf -- '--env %s ' "$kv"; done ) \
    --start "$START" $( [[ $SPA -eq 1 ]] && echo --spa )
fi

# ── 7. verify ────────────────────────────────────────────────────────────────
CODE=$(curl -s -o /dev/null -m 15 -w '%{http_code}' \
  --resolve "$SUB:443:64.177.116.163" "https://$SUB/")
echo "==> https://$SUB/ -> HTTP $CODE"
[[ "$CODE" == "200" ]] || { echo "WARNING: expected 200"; exit 1; }
echo "==> done: https://$SUB"
