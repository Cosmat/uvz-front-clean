#!/bin/sh
echo "=== entrypoint.sh started ==="
echo "VUE_APP_API_URL = ${VUE_APP_API_URL}"
echo "PWD = $(pwd)"
ls -la /usr/share/nginx/html/

# Generate runtime config from environment variables
cat > /usr/share/nginx/html/config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  VUE_APP_API_URL: "${VUE_APP_API_URL:-https://uvz-api.onrender.com}"
};
EOF

echo "=== Generated config.js ==="
cat /usr/share/nginx/html/config.js
echo "=== File exists: $(ls -la /usr/share/nginx/html/config.js) ==="

# Start nginx
echo "=== Starting nginx ==="
exec nginx -g "daemon off;"