# Ingestion Microservice

A NestJS-based microservice for data ingestion, part of the JKTech POC project.

## Overview

This microservice is responsible for handling data ingestion operations in the system. It's built using NestJS framework and includes features for data processing, validation, and storage.

## Tech Stack

- **Framework**: NestJS
- **Database**: Prisma ORM
- **Language**: TypeScript
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker (optional, for containerized deployment)

## Installation

1. Install dependencies:

```bash
yarn install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Update the .env file with your configuration
```

3. Set up the database:

```bash
yarn prisma generate
yarn prisma migrate dev
```

## Development

Start the development server:

```bash
yarn start:dev
```

## Building for Production

```bash
yarn build
```

## Docker Deployment

Build the Docker image:

```bash
docker build -t ingestion-service .
```

Run the container:

```bash
docker run -p 3001:3001 ingestion-service
```

## Project Structure

```
src/
├── ingestion/        # Main application logic
├── database/         # Database related code
├── app.module.ts     # Root application module
└── main.ts          # Application entry point
```

## Available Scripts

- `yarn start`: Start the application
- `yarn start:dev`: Start in development mode with hot-reload
- `yarn build`: Build the application
- `yarn test`: Run unit tests
- `yarn test:e2e`: Run end-to-end tests
- `yarn lint`: Lint the code
- `yarn format`: Format the code using Prettier
