# Dockerfile for Production Deployment

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build info will be set during CI/CD build
ARG BUILD_TIMESTAMP
ARG BUILD_VERSION
ARG GIT_COMMIT
ENV BUILD_TIMESTAMP=${BUILD_TIMESTAMP:-unknown}
ENV BUILD_VERSION=${BUILD_VERSION:-dev}
ENV GIT_COMMIT=${GIT_COMMIT:-unknown}

# Next.js public env vars (needed at build time for client-side code)
# These should be set in CI/CD before building Docker image
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
# In standalone mode, Next.js creates a minimal server structure
# We need to copy the standalone output, static files, and public folder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Ensure public folder is accessible (standalone mode may need it at root)
# The standalone server.js expects public at ./public relative to where server.js is

USER nextjs

# Cloud Run sets PORT automatically, but default to 3000 for local
EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

