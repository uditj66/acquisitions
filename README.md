# Acquisitions - Dockerized Node.js Application with Neon Database

A modern Node.js Express application with Neon Database integration, fully containerized with Docker for both development and production environments.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [Docker Commands](#docker-commands)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

- **Node.js Express** application with modern ES modules
- **Neon Database** integration with Drizzle ORM
- **Docker containerization** with multi-stage builds
- **Development environment** with Neon Local for ephemeral branches
- **Production ready** with Neon Cloud Database
- **Hot reload** in development
- **Security hardened** with Helmet, CORS, and Arcjet
- **Health checks** and monitoring
- **Logging** with Winston and Morgan

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (v20.10 or later)
- **Docker Compose** (v2.0 or later)
- **Neon Account** - [Sign up here](https://console.neon.tech)

### Neon Setup Requirements

1. Create a Neon project at [console.neon.tech](https://console.neon.tech)
2. Generate an API key from your Neon console
3. Note your Project ID from the Project Settings

## 🚀 Quick Start

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd acquisitions
   ```

2. **Configure environment variables:**

   ```bash
   # Copy and configure development environment
   cp .env.development.example .env.development
   # Edit .env.development with your Neon credentials
   ```

3. **Start development environment:**

   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

4. **Access your application:**
   - Application: http://localhost:3000
   - Health Check: http://localhost:3000/health
   - API: http://localhost:3000/api

## 🛠 Development Setup

### Using Neon Local (Recommended)

Neon Local creates ephemeral database branches for isolated development environments.

1. **Configure Development Environment:**

   Edit `.env.development` with your Neon credentials:

   ```env
   # Neon Configuration
   NEON_API_KEY=your_neon_api_key_here
   NEON_PROJECT_ID=your_neon_project_id_here
   PARENT_BRANCH_ID=main
   DELETE_BRANCH=true

   # Application Configuration
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your_dev_jwt_secret
   ARCJET_KEY=your_dev_arcjet_key
   ```

2. **Start Development Environment:**

   ```bash
   # Start with Neon Local proxy
   docker-compose -f docker-compose.dev.yml up

   # Or run in detached mode
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **What happens when you start:**
   - Neon Local container starts and creates an ephemeral branch
   - Your application connects to this local Postgres endpoint
   - Hot reload is enabled for development
   - Database schema is automatically applied

4. **Run Database Migrations:**

   ```bash
   # Access the app container
   docker-compose -f docker-compose.dev.yml exec app sh

   # Inside the container
   npm run db:generate  # Generate migrations
   npm run db:migrate   # Apply migrations
   npm run db:studio    # Open Drizzle Studio
   ```

5. **Stop Development Environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```
   The ephemeral branch will be automatically deleted when containers stop.

### Development Features

- **Hot Reload:** Code changes are reflected immediately
- **Debug Logging:** Detailed logs for development
- **Database Isolation:** Each startup gets a fresh database branch
- **Volume Mapping:** Source code is mounted for live editing

## 🏭 Production Deployment

### Using Neon Cloud Database

Production uses your actual Neon Cloud Database without the local proxy.

1. **Configure Production Environment:**

   Edit `.env.production` with your production settings:

   ```env
   # Production Database (Neon Cloud)
   DATABASE_URL=postgresql://user:password@ep-endpoint.region.aws.neon.tech/dbname?sslmode=require

   # Production Configuration
   NODE_ENV=production
   PORT=3000
   LOG_LEVEL=warn
   JWT_SECRET=your_very_secure_production_secret
   ARCJET_KEY=your_production_arcjet_key
   ```

2. **Deploy to Production:**

   ```bash
   # Build and start production containers
   docker-compose -f docker-compose.prod.yml up -d

   # View logs
   docker-compose -f docker-compose.prod.yml logs -f
   ```

3. **Production Features:**
   - Optimized Docker image with multi-stage builds
   - Non-root user for security
   - Resource limits and health checks
   - Log rotation and monitoring
   - Optional Nginx reverse proxy

4. **Run Production Database Migrations:**
   ```bash
   # One-time setup for production database
   docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
   ```

## 🔐 Environment Variables

### Development (.env.development)

| Variable           | Description                                 | Example         |
| ------------------ | ------------------------------------------- | --------------- |
| `NEON_API_KEY`     | Your Neon API key                           | `neon_api_...`  |
| `NEON_PROJECT_ID`  | Your Neon project ID                        | `proj_123...`   |
| `PARENT_BRANCH_ID` | Branch to create ephemeral branches from    | `main`          |
| `DELETE_BRANCH`    | Auto-delete ephemeral branches              | `true`          |
| `DATABASE_URL`     | Will be set automatically to use neon-local | Auto-configured |

### Production (.env.production)

| Variable       | Description                  | Example                        |
| -------------- | ---------------------------- | ------------------------------ |
| `DATABASE_URL` | Your Neon Cloud Database URL | `postgresql://...neon.tech...` |
| `NODE_ENV`     | Environment mode             | `production`                   |
| `JWT_SECRET`   | Secure JWT secret            | Strong random string           |
| `LOG_LEVEL`    | Logging level                | `warn` or `error`              |

## 🗄 Database Configuration

### Development Database (Neon Local)

- **Endpoint:** `neon-local:5432` (within Docker network)
- **Credentials:** `neon:npg` (default Neon Local credentials)
- **SSL:** Required with self-signed certificate
- **Branch Management:** Automatic ephemeral branches

### Production Database (Neon Cloud)

- **Endpoint:** Your actual Neon endpoint
- **Credentials:** Your production database credentials
- **SSL:** Required with proper certificates
- **Branch Management:** Use your main production branch

### Connection Examples

**For standard Postgres driver:**

```javascript
// Development (via Neon Local)
postgres://neon:npg@neon-local:5432/dbname?sslmode=require

// Production (direct to Neon Cloud)
postgres://user:pass@ep-endpoint.region.aws.neon.tech/dbname?sslmode=require
```

**For Neon serverless driver:**

```javascript
import { neon, neonConfig } from '@neondatabase/serverless';

// Development configuration
neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
neonConfig.useSecureWebSocket = false;
neonConfig.poolQueryViaFetch = true;

// Production uses default settings (direct to Neon Cloud)
const sql = neon(process.env.DATABASE_URL);
```

## 🐳 Docker Commands

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Start in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop and remove containers
docker-compose -f docker-compose.dev.yml down

# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build

# Access app container shell
docker-compose -f docker-compose.dev.yml exec app sh

# Run npm commands in container
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

### Production Commands

```bash
# Deploy production
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f app

# Scale application (if using orchestrator)
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Update production deployment
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Production maintenance
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Utility Commands

```bash
# Clean up unused Docker resources
docker system prune -f

# View container resource usage
docker stats

# Check container health
docker-compose -f docker-compose.dev.yml ps

# Build specific stage
docker build --target development -t acquisitions:dev .
```

## 🔍 Troubleshooting

### Common Issues

**1. Neon Local Connection Issues**

```bash
# Check if Neon Local container is healthy
docker-compose -f docker-compose.dev.yml ps

# View Neon Local logs
docker-compose -f docker-compose.dev.yml logs neon-local

# Restart Neon Local
docker-compose -f docker-compose.dev.yml restart neon-local
```

**2. Environment Variables Not Loading**

```bash
# Verify environment files exist and have correct values
cat .env.development
cat .env.production

# Check environment variables in running container
docker-compose -f docker-compose.dev.yml exec app env | grep DATABASE_URL
```

**3. Database Connection Issues**

```bash
# Test database connectivity from app container
docker-compose -f docker-compose.dev.yml exec app node -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
sql\`SELECT 1\`.then(console.log).catch(console.error);
"
```

**4. Port Conflicts**

```bash
# Check if port 3000 or 5432 is already in use
netstat -tulpn | grep :3000
netstat -tulpn | grep :5432

# Use different ports by modifying docker-compose files
```

### Health Checks

**Application Health:**

```bash
curl http://localhost:3000/health
```

**Database Health (Development):**

```bash
docker-compose -f docker-compose.dev.yml exec neon-local pg_isready -h localhost -p 5432 -U neon
```

### Debugging

**Enable Debug Logging:**

```bash
# Add to your .env.development
DEBUG=*
LOG_LEVEL=debug
```

**Access Container Logs:**

```bash
# Follow logs for all services
docker-compose -f docker-compose.dev.yml logs -f

# Follow logs for specific service
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f neon-local
```

## 🔄 Development Workflow

1. **Start Development:**

   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

2. **Make Code Changes:** Edit files in your IDE - changes are reflected immediately

3. **Database Changes:**

   ```bash
   # Generate migrations
   docker-compose -f docker-compose.dev.yml exec app npm run db:generate

   # Apply migrations
   docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
   ```

4. **Test Changes:** Application automatically restarts with changes

5. **Commit Changes:** Normal Git workflow

6. **Deploy to Production:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both development and production configurations
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🆘 Support

- **Neon Documentation:** https://neon.tech/docs
- **Neon Local Guide:** https://neon.com/docs/local/neon-local
- **Docker Documentation:** https://docs.docker.com
- **Project Issues:** Create an issue in this repository

---

**Happy Coding! 🚀**
