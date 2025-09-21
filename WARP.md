# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express API for an acquisitions system with user authentication, built with:

- **Framework**: Express.js (ES modules)
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schemas
- **Logging**: Winston with Morgan integration

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Database operations
npm run db:generate     # Generate Drizzle migrations
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Drizzle Studio GUI

# Code quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check Prettier formatting
```

## Architecture Structure

### Import Path Mapping

The project uses Node.js subpath imports for clean module resolution:

- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middlewares/*` → `./src/middlewares/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Key Components

**Database Configuration** (`src/config/database.js`):

- Neon serverless PostgreSQL connection
- Drizzle ORM setup with HTTP adapter

**Authentication Flow**:

1. **Routes** (`src/routes/auth.routes.js`) - Define endpoints
2. **Controllers** (`src/controllers/auth.controller.js`) - Handle requests/responses
3. **Validations** (`src/validations/auth.validation.js`) - Zod schema validation
4. **Services** (`src/services/auth.service.js`) - Business logic and database operations
5. **Models** (`src/models/user.model.js`) - Drizzle schema definitions

**Utilities**:

- `src/utils/jwt.js` - JWT token signing/verification
- `src/utils/cookies.js` - HTTP cookie management with security defaults
- `src/utils/format.js` - Validation error formatting
- `src/utils/try-catch.js` - Async error handling wrapper

**Logging** (`src/config/logger.js`):

- Winston logger with file and console transports
- Integrated with Morgan for HTTP request logging
- Environment-based configuration (dev vs production)

## Database Schema

**Users Table** (`users`):

- `id` (serial, primary key)
- `name` (varchar, 250 chars)
- `email` (varchar, 250 chars, unique)
- `password` (varchar, 250 chars, hashed)
- `role` (varchar, 50 chars, default: 'user')
- `createdAt`, `updatedAt` (timestamps)

## Environment Variables Required

- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `LOG_LEVEL` - Winston log level
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (defaults to 3000)

## Development Notes

- Server runs on `http://localhost:3000` by default
- Health check endpoint: `/health`
- API base path: `/api`
- Authentication routes: `/api/auth/*`
- Log files stored in `logs/` directory (error.log, combined.log)
- Drizzle migrations stored in `drizzle/` directory
- Cookie settings automatically adjust for production (secure flag)
- All database queries return arrays - use destructuring for single results

## Security Features

- Helmet.js for security headers
- CORS enabled
- HTTP-only cookies for JWT storage
- Password hashing with bcrypt (10 rounds)
- Input validation with Zod schemas
- Request logging for audit trails
