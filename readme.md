# JK Tech POC

A microservices-based application built with NestJS, featuring a gateway service and an ingestion service.

## Project Architecture

The project consists of two main services:

1. **Gateway Service** (Port 3000): Main API gateway handling authentication, authorization, and document management
2. **Ingestion Service** (Port 3001): Microservice for handling document ingestion and processing

## Features

### Gateway Service

#### [Read more](gateway/README.md)

- Authentication and Authorization using JWT
- Role-based access control (RBAC) with CASL
- Swagger API documentation
- File upload capabilities
- User management
- Document management (CRUD operations)

### Ingestion Service

#### [Read more](ingestion/README.md)

- Document processing
- Asynchronous event handling
- Status tracking for ingestion tasks

## User Roles and Permissions

### Admin

- Full access to all features
- User management
- Document management
- Ingestion management

### Editor

- Document management (CRUD)
- Ingestion creation and viewing

### Viewer

- Document viewing
- Ingestion status viewing

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker and Docker Compose
- PostgreSQL database

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/dev-nasrullah/jktech-poc
cd jktech-poc
```

2. Start the application using Docker Compose:

```bash
docker-compose up --build
```

3. Access the application:

- Gateway API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api

## Authentication

To get access to the application as an admin, use the following curl command:

```bash
curl --location 'http://localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@example.com",
    "password": "password"
}'
```

## Environment Variables

The application uses the following environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `UPLOAD_PATH`: Path for file uploads

## Development

### Running Services Individually

Gateway Service:

```bash
cd gateway
yarn install
yarn start:dev
```

Ingestion Service:

```bash
cd ingestion
yarn install
yarn start:dev
```

### Database Migrations

```bash
cd gateway
yarn prisma generate
yarn prisma migrate dev
```

## Testing

Run tests for both services:

```bash
# Gateway Service
cd gateway
yarn test

# Ingestion Service
cd ingestion
yarn test
```

## Docker Support

The application is containerized using Docker. Each service has its own Dockerfile and can be built and run independently:

```bash
# Build and run all services
docker-compose up --build

# Build individual services
docker build -t gateway ./gateway
docker build -t ingestion ./ingestion
```

## API Documentation

The API documentation is available through Swagger UI at:

```
http://localhost:3000/api
```

## Project Structure

```
.
├── gateway/           # Main API Gateway service
│   ├── src/          # Source code
│   ├── prisma/       # Database schema and migrations
│   └── Dockerfile    # Gateway service container
├── ingestion/        # Document ingestion microservice
│   ├── src/         # Source code
│   └── Dockerfile   # Ingestion service container
└── docker-compose.yml # Container orchestration
```
