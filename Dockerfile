# Stage 1: Build the Vite app
FROM node:18-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install deps based on lockfile first
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --reporter=append-only

# Copy source and build
COPY . .
RUN pnpm run build

# Stage 2: Production image served by nginx
FROM nginx:stable-alpine

# Create a script to generate config.json at runtime
RUN mkdir -p /usr/local/bin
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Add nginx config (fallback to index.html for SPA)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
