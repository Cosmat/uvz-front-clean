# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Generate runtime config at build time (fallback)
RUN echo "window.__RUNTIME_CONFIG__ = {" > /app/dist/spa/config.js && \
    echo "  VUE_APP_API_URL: \"${VUE_APP_API_URL:-https://uvz-api.onrender.com}\"" >> /app/dist/spa/config.js && \
    echo "};" >> /app/dist/spa/config.js && \
    echo "=== Generated config.js at build time ===" && \
    cat /app/dist/spa/config.js

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Runtime entrypoint to overwrite config.js with actual runtime env vars
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && sed -i 's/\r$//' /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]