# Use Node.js LTS image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Run in dev mode (good for local development with hot reload)
CMD ["npm", "run", "dev"]