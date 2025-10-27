# Use Node.js base image
FROM node:18-alpine

# Set work directory
WORKDIR /usr/src/app

# Copy frontend files
COPY frontend/ ./

# Install dependencies and build
RUN npm install && npm run build

# Serve using simple HTTP server
RUN npm install -g serve

# Expose frontend port
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]
