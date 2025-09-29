# # frontend/Dockerfile
# FROM node:20

# WORKDIR /app

# # Install dependencies
# COPY package.json package-lock.json ./
# RUN npm install --build-from-source

# # Copy source
# COPY . .

# RUN npm run build
# # Force webpack (disable Turbopack)
# CMD ["npm", "start"]

# EXPOSE 3000

# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN  npm test
RUN npm run build

# Production stage
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
