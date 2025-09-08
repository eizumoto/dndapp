# Use Node.js official image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Define default values
ARG PORT=3000

# Expose port
EXPOSE ${PORT}

ENV PORT=${PORT}

# Run compiled app
CMD ["npm", "start"]