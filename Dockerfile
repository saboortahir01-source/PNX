# Multi-stage build for production
# Uses Node 22 as required by package.json engines

FROM node:22-bullseye-slim AS builder
WORKDIR /app

# Install basic build tools
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# Copy rest of source
COPY . .

# Build SSR + client assets
# The project already has `build` and `build:prod` scripts. We run the SSR build to produce server entry.
RUN npm run build:prod

# Final image
FROM node:22-bullseye-slim AS runner
WORKDIR /app

# Copy server runtime and built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.mjs ./server.mjs
COPY package.json ./package.json

# Install only production dependencies needed at runtime
RUN npm install --omit=dev --no-audit --no-fund

ENV NODE_ENV=production
EXPOSE 8080

# Default port is taken from process.env.PORT; Azure Container Apps sets PORT environment variable at runtime
CMD ["node", "--enable-source-maps", "server.mjs"]
