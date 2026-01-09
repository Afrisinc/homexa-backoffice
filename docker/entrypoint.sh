#!/bin/sh
set -e

VITE_SERVER_URL=${VITE_SERVER_URL}

if [ -z "$VITE_SERVER_URL" ]; then
  echo "Error: VITE_SERVER_URL environment variable is required"
  exit 1
fi

NGINX_HTML_DIR="/usr/share/nginx/html"
CONFIG_FILE="${NGINX_HTML_DIR}/config.json"

if [ ! -d "$NGINX_HTML_DIR" ]; then
  echo "Error: ${NGINX_HTML_DIR} directory not found"
  exit 1
fi

printf '{
  "serverUrl": "%s"
}\n' "$VITE_SERVER_URL" > "$CONFIG_FILE"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Failed to create ${CONFIG_FILE}"
  exit 1
fi

echo "Config injected: serverUrl=${VITE_SERVER_URL}"
exec "$@"
