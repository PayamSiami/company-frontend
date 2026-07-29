FROM node:20-alpine AS builder

WORKDIR /app

# ✅ Accept build argument
ARG VITE_API_URL

# ✅ Set as environment variable for the build
ENV VITE_API_URL=$VITE_API_URL

# ✅ Print for debugging (optional)
RUN echo "Building with VITE_API_URL: $VITE_API_URL"

# Build the panel app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]