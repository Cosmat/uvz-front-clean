# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && sed -i 's/\r$//' /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]