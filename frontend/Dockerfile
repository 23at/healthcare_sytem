# # # frontend/Dockerfile
# # FROM node:20

# # WORKDIR /app

# # # Install dependencies
# # COPY package.json package-lock.json ./
# # RUN npm install --build-from-source

# # # Copy source
# # COPY . .

# # RUN npm run build
# # # Force webpack (disable Turbopack)
# # CMD ["npm", "start"]

# # EXPOSE 3000

# # Build stage
# # Builder
# FROM node:18 AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install 
# COPY . .
# RUN npm run build

# # Test
# FROM builder AS tester
# RUN npm test

# # Production
# FROM node:20 AS production
# WORKDIR /app
# COPY --from=builder /app ./
# ENV NODE_ENV=production
# EXPOSE 3000
# CMD ["npm", "start"]
# --------------------
# Stage 1: Builder
# --------------------
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --------------------
# Stage 2: Unit & Integration Tests
# --------------------
FROM builder AS tester
ENV NODE_ENV=test
RUN npm test

# --------------------
# Stage 3: Production
# --------------------
# FROM node:20 AS production
# WORKDIR /app

# # Copy only what’s needed
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public

# ENV NODE_ENV=production
# EXPOSE 3000
# CMD ["npm", "start"]
FROM node:20 AS production
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]