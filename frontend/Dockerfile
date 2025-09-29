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
RUN npm install --build-from-source
COPY . .
RUN npm run build

# Production stage
FROM node:20
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
