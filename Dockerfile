# Base node image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

# Copy only the lock and manifest files for dependency install
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies based on lockfile
RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm install --frozen-lockfile; \
    else echo "❌ Lockfile not found." && exit 1; \
    fi

# Rebuild the source code only when needed
FROM base AS builder

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY . .

# Optional: disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# # Build the Next.js application
# RUN yarn build

RUN yarn build && ls -la .next



# Production image, minimal
FROM base AS runner

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Add non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -u 1001 -S nextjs -G nodejs

# Copy necessary files from build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Expose Next.js default port
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start", "-p", "3000", "-H", "0.0.0.0"]
