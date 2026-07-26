# frontend/app2/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Build the panel app
COPY package*.json ./
COPY .env.production ./
RUN npm ci

COPY . .
RUN npm run build

# Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/panel
# COPY nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/panel || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]