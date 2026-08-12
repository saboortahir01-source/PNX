# Multi-stage build for production using pnpm (preferred)
# Uses Node 22 as required by package.json engines

FROM node:22-bullseye-slim AS builder
WORKDIR /app

# Install basic build tools
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Enable corepack and prepare pnpm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Copy package files and lockfile and install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy rest of source
COPY . .

# Build SSR + client assets
RUN pnpm run build:prod

# Final image
FROM node:22-bullseye-slim AS runner
WORKDIR /app

# Enable pnpm in runtime (not strictly necessary but keeps env consistent)
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Copy server runtime and built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.mjs ./server.mjs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only production dependencies needed at runtime
RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "--enable-source-maps", "server.mjs"]
