#!/bin/sh
# Generate runtime config from environment variables
cat > /usr/share/nginx/html/config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  VUE_APP_API_URL: "${VUE_APP_API_URL:-https://uvz-api.onrender.com}"
};
EOF

# Start nginx
nginx -g "daemon off;"