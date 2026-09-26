# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all files
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/next.config.ts ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
