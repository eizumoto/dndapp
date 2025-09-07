# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Run compiled app
CMD ["npm", "start"]