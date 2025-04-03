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

# Generate prisma client
RUN npx prisma generate

# Expose port for the REST API
EXPOSE 3000

# Command to start the app
CMD ["sh", "-c", "yarn prisma migrate deploy && yarn prisma db seed && yarn start"]
