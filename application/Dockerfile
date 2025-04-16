# Use a minimal Node.js image
FROM node:18-alpine

# Install tzdata for timezone configuration
RUN apk add --no-cache tzdata

# Set the timezone to IST (Asia/Kolkata)
ENV TZ=Asia/Kolkata #Setting this here as I want the container to run in IST hours. This can be changed to appropriate timezone as required.

# Create and set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using yarn)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
  && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the port your app runs on
EXPOSE 3001

# Run the app
CMD ["node", "index.js"]
