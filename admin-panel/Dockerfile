FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build it
COPY . .
RUN npm run build

# Install a simple static server mapped as a single-page app (-s flag)
RUN npm install -g serve

# Expose port
EXPOSE 5174

# Start serving the dist folder
CMD ["serve", "-s", "dist", "-l", "5174"]
