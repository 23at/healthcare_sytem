# frontend/Dockerfile
FROM node:20

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --build-from-source

# Copy source
COPY . .

# Force webpack (disable Turbopack)
CMD ["npm", "run", "dev",]

EXPOSE 3000
