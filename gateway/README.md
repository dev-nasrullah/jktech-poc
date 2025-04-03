# JK Tech API Gateway

A NestJS-based API Gateway service that serves as the entry point for the JK Tech microservices architecture.

## Features

- Authentication and Authorization using JWT
- Role-based access control (RBAC) with CASL
- Swagger API documentation
- Prisma ORM for database operations
- File upload capabilities
- Docker support
- Comprehensive test coverage

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker (optional, for containerization)
- PostgreSQL database

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dev-nasrullah/jktech-poc
cd gateway
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your-jwt-secret"
```

4. Set up the database:

```bash
yarn prisma generate
yarn prisma migrate dev
```

## Steps to Execute

To start building the services:

```bash
docker-compose up --build
```

### Accessing the Application

To get access to the application as an admin, use the following curl command:

```bash
curl --location 'http://localhost:3000/user/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@example.com",
    "password": "password"
}'
```

## Types of Users

### Admin

This user can perform any operations in the application such as:

- Registering new user
- CRUD of Document
- Create and get details of an Ingestion

### Editor

This type of user can perform any operation on the document:

- CRUD of Document
- Create and Details of ingestion

### Viewer

This type of user can perform any operation on the document:

- Details of ingestion
- Read any document

## User Authentication

The authentication implementation can be found in the auth module. Passport's JWT auth is used for this purpose. An Auth guard is placed in app module to make only authenticated access.

Key files:

- `gateway/src/modules/auth/guards/jwt-auth.guard.ts`
- `gateway/src/modules/auth/strategies/jwt.strategy.ts`

## User Authorization

CASL is used as a robust rule engine module for building the authorization mechanism. Find more information at https://casl.js.org/v6/en/

Building ACL rules based on roles is done in the CASL module:

- `gateway/src/common/factory/casl-ability.factory.ts`

The module is used along with a decorator to tag controller APIs with appropriate permissions:

- `gateway/src/common/decorators/permissions.decorator.ts`

The guard is used to identify the invoker's list of permissions and whether they can successfully execute the target API:

- `gateway/src/common/guards/casl.guard.ts`

## Mocked Ingestion Service

The ingestion service is another NestJS microservice that runs along with the gateway. It has APIs to add and get details of the ingestion as @MessagePattern with linked commands.

**Note:** Once a new ingestion is added, an event is fired to update its status. This event is then asynchronously handled to update the status to success/failed.

## Running the Application

### Development

```bash
yarn start:dev
```

### Production

```bash
yarn build
yarn start:prod
```

### Docker

```bash
docker build -t gateway .
docker run -p 3000:3000 gateway
```

## Testing

```bash
# unit tests
yarn test

# test coverage
yarn test:cov
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## Project Structure

```
src/
├── common/         # Shared utilities, guards, and decorators
├── modules/        # Feature modules
├── database/       # Database configuration
├── app.module.ts   # Root application module
└── main.ts         # Application entry point
prisma/
├── migrations/        # Generated Migrations
├── schema.prisma/     # db schema
```
