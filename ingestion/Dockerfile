# Use Node.js LTS as base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the rest of the app files
COPY . .

# Expose port for the microservice
EXPOSE 4000

# Command to start the microservice
CMD ["yarn", "start"]
