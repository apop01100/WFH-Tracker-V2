# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files first to install dependencies (optimizes Docker caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Expose the port your Express app runs on (default 5000)
EXPOSE 5000

# Define the command to run your app
CMD ["node", "server.js"]
