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
RUN pnpm install --no-frozen-lockfile

# Copy rest of source
COPY . .

# Build SSR + client assets (vite build -> nitro build)
RUN NODE_OPTIONS="--max-old-space-size=6144" pnpm run build

# Ensure client/static assets are present under .output/public for node-server runtime.
# Some configurations (when nitro plugin wasn't applied correctly) emit client files to dist/ or dist/client.
# Copy any generated dist public assets into .output/public so runtime serves them.
RUN mkdir -p .output/public \
  && if [ -d "dist/client" ]; then cp -r dist/client/* .output/public/ || true; fi \
  && if [ -d "dist" ] && [ ! -d "dist/client" ]; then cp -r dist/* .output/public/ || true; fi \
  && if [ -d "public" ]; then cp -r public/* .output/public/ || true; fi

# Final image
FROM node:22-bullseye-slim AS runner
WORKDIR /app

# Enable pnpm in runtime (not strictly necessary but keeps env consistent)
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Copy Nitro output and package files
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only production dependencies needed at runtime
RUN pnpm install --prod --no-frozen-lockfile

ENV NODE_ENV=production
# Default port for Azure Container Apps; Azure will override PORT at runtime
ENV PORT=8080
# Ensure Nitro binds externally
ENV NITRO_HOST=0.0.0.0
EXPOSE 8080

CMD ["node", "--enable-source-maps", ".output/server/index.mjs"]
