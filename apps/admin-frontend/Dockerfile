# Admin Frontend Dockerfile
FROM oven/bun:1.2.19-slim AS base

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY package.json bun.lock turbo.json tsconfig.json ./
COPY apps/admin-frontend/package.json ./apps/admin-frontend/
COPY packages/shared/package.json ./packages/shared/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/ui-components/package.json ./packages/ui-components/

# Install dependencies
RUN bun install

# Copy source code
COPY apps/admin-frontend/ ./apps/admin-frontend/
COPY packages/shared/ ./packages/shared/

# Build shared packages first, then frontend
RUN bun run build --filter=@niftytools/shared
RUN bun run build --filter=@niftytools/admin-frontend

# Production stage
FROM node:22-alpine AS production

# Install serve package for static file serving
RUN npm install -g serve

# Create app directory
WORKDIR /app

# Copy built application with correct ownership
COPY --from=base /app/apps/admin-frontend/dist ./dist

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/ || exit 1

# Start static file server
CMD ["serve", "-s", "dist", "-l", "3002"]