FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY ../../shared ./shared

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3005

# Start service
CMD ["npm", "start"]


