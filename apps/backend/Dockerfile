# Backend Dockerfile
FROM oven/bun:1.2.19-slim AS base

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY package.json bun.lock turbo.json tsconfig.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/ui-components/package.json ./packages/ui-components/
COPY plugins/text-tools/package.json ./plugins/text-tools/

# Install dependencies (including workspace deps)
RUN bun install

# Copy source code
COPY apps/backend/ ./apps/backend/
COPY packages/shared/ ./packages/shared/
COPY packages/api-client/ ./packages/api-client/
COPY packages/ui-components/ ./packages/ui-components/
COPY plugins/text-tools/ ./plugins/text-tools/

# Build shared packages first, then backend
RUN bun run build --filter=@niftytools/shared
RUN bun run build --filter=@niftytools/text-tools-plugin  
RUN bun run build --filter=@niftytools/backend

# Production stage
FROM oven/bun:1.2.19-slim AS production

WORKDIR /app

# Copy workspace configuration to maintain structure
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/bun.lock ./bun.lock

# Copy built application maintaining workspace structure
COPY --from=base /app/apps ./apps
COPY --from=base /app/node_modules ./node_modules

# Copy built packages and plugins with their dist folders
COPY --from=base /app/packages ./packages
COPY --from=base /app/plugins ./plugins

# Set working directory to the backend app
WORKDIR /app/apps/backend

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run health-check || exit 1

# Start the application
CMD ["bun", "run", "start"]