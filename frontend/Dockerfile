# frontend/Dockerfile
FROM node:20

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --build-from-source

# Copy source
COPY . .

RUN npm run build
# Force webpack (disable Turbopack)
CMD ["npm", "start"]

EXPOSE 3000
