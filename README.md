# URL Shortener API Monorepo

## Overview

This project is a production-ready, scalable URL Shortener system built as a monorepo using [Turborepo](https://turbo.build/) and [NestJS](https://nestjs.com/). It includes:

- **Authentication API** (`apps/auth-api`): Handles user authentication and JWT issuance.
- **URL Shortener API** (`apps/url-shortener-api`): Manages URL shortening, redirection, and related features. Uses Redis for high-performance URL redirection caching.
- **Shared Packages** (`packages/shared`): Common code, DTOs, entities, and utilities.
- **Config Packages**: Centralized ESLint, Jest, and TypeScript configurations for consistency across the monorepo.

The system is designed for cloud deployment, observability, and horizontal scalability. Redis is used to cache redirection lookups, reducing database load and improving latency.

---

## Supported Node.js and npm Versions

- **Node.js**: `>=18` (recommended: 18.x, as used in Docker and CI)
- **npm**: Use [pnpm](https://pnpm.io/) (see `packageManager` in root `package.json`)

---

## Monorepo Structure & Turborepo

This project uses [Turborepo](https://turbo.build/) for high-performance monorepo management. The structure is:

```
url-shortener-api/
├── apps/
│   ├── auth-api/              # Authentication microservice (NestJS)
│   └── url-shortener-api/     # URL shortener microservice (NestJS)
├── packages/
│   ├── shared/                # Shared code (DTOs, entities, modules, etc)
│   ├── eslint-config/         # Centralized ESLint config
│   ├── jest-config/           # Centralized Jest config
│   └── typescript-config/     # Centralized TypeScript config
├── scripts/                   # Helper scripts for Docker Compose
├── docker-compose.*.yml       # Docker Compose files for different stacks
└── ...
```

- **Apps** are independent NestJS services.
- **Packages** provide shared logic and configuration.
- **Turborepo** enables fast builds, caching, and task orchestration across the monorepo.

---

## Running the Project

### 1. With Docker Compose

Multiple Docker Compose files are provided for different stacks:

- `docker-compose.local.yml`: Minimal stack (APIs only)
- `docker-compose.local.postgres.yml`: APIs + Postgres
- `docker-compose.local.elastic.yml`: APIs + Elastic Stack
- `docker-compose.local.elastic-and-postgres.yml`: Full stack (APIs, Postgres, Elastic, Kibana, APM)

#### Scripts

Use the scripts in `/scripts` to start the desired stack:

```bash
# APIs only
./scripts/docker-compose-up.local.sh

# APIs + Postgres
./scripts/docker-compose-up.local.postgres.sh

# APIs + Elastic Stack
./scripts/docker-compose-up.local.elastic.sh

# Full stack (APIs, Postgres, Elastic, Kibana, APM)
./scripts/docker-compose-up.local.elastic-and-postgres.sh
```

**Difference:** Each script brings up a different set of services, depending on your local development or testing needs.

### 2. Running Locally (without Docker Compose)

You can run the services directly using Turborepo or individually:

```bash
# Install dependencies (at root)
pnpm install

# Start all apps in dev mode (at root)
pnpm run dev

# Or, start a specific app:
cd apps/auth-api && pnpm run dev
cd apps/url-shortener-api && pnpm run dev
```

---

## Building the Project

- **Build everything (from root):**
  ```bash
  pnpm run build
  ```
- **Build a specific app/package:**
  ```bash
  cd apps/auth-api && pnpm run build
  cd apps/url-shortener-api && pnpm run build
  cd packages/shared && pnpm run build
  ```

---

## Linting & Formatting

- **Lint everything (from root):**
  ```bash
  pnpm run lint
  ```
- **Lint a specific app/package:**
  ```bash
  cd apps/auth-api && pnpm run lint
  cd apps/url-shortener-api && pnpm run lint
  cd packages/shared && pnpm run lint
  ```
- **Format code (from root):**
  ```bash
  pnpm format
  ```

---

## Husky Setup

Husky is used for Git hooks (e.g., pre-commit linting/formatting). To set up Husky after cloning:

```bash
pnpm install
pnpm run prepare
```

---

## Running Tests

- **Unit tests (all apps / packages):**
  ```bash
  pnpm run test
  ```
- **Unit tests (individual app):**
  ```bash
  cd apps/auth-api && pnpm run test
  cd apps/url-shortener-api && pnpm run test
  ```
- **End-to-end tests:**
  ```bash
  pnpm run test:e2e
  # or per app:
  cd apps/auth-api && pnpm run test:e2e
  cd apps/url-shortener-api && pnpm run test:e2e
  ```

---

## Environment Variables (.env)

Each service (apps/) requires its own `.env` file. Example variable names:

### Common Variables

- `DATABASE_URL` (Postgres connection string)
- `JWT_SECRET` (JWT signing secret)

### Auth API (`apps/auth-api/.env.local` or `.env.docker.local`)

- `AUTH_API_PORT=3000`
- `AUTH_API_BASE_URL=http://localhost:3000`
- `AUTH_API_SWAGGER_PATH=api/docs`
- `APM_ENABLED=true`
- `ELASTIC_APM_AUTH_API_SERVICE_NAME=auth-api`
- `ELASTIC_APM_SERVER_URL=... (http://apm-server:8200 for local docker)`
- `ELASTIC_APM_SECRET_TOKEN=... (not required for local docker)`
- `ELASTIC_APM_ENVIRONMENT=local (not required for local docker)`
- `ELASTIC_APM_VERIFY_SERVER_CERT=false`
- `DATABASE_URL=... (postgresql://postgres:12345678@postgres:5432/url_shortener_api_db for local docker)`
- `JWT_SECRET=your_jwt_secret`

### URL Shortener API (`apps/url-shortener-api/.env.local` or `.env.docker.local`)

- `URL_SHORTENER_API_PORT=3001`
- `URL_SHORTENER_API_BASE_URL=http://localhost:3001`
- `URL_SHORTENER_API_SWAGGER_PATH=api/docs`
- `APM_ENABLED=true`
- `ELASTIC_APM_URL_SHORTENER_API_SERVICE_NAME=url-shortener-api`
- `ELASTIC_APM_SERVER_URL=... (http://apm-server:8200 for local docker)`
- `ELASTIC_APM_SECRET_TOKEN=... (not required for local docker)`
- `ELASTIC_APM_ENVIRONMENT=local (not required for local docker)`
- `ELASTIC_APM_VERIFY_SERVER_CERT=false`
- `DATABASE_URL=... (postgresql://postgres:12345678@postgres:5432/url_shortener_api_db for local docker)`
- `JWT_SECRET=your_jwt_secret`
- `REDIS_HOST=...` (default: `localhost` if installed locally or with docker)
- `REDIS_PORT=...` (default: `6379` if installed locally or with docker)
- `REDIS_PASSWORD=...` (optional, if your Redis instance requires authentication)

#### Test Environments

- Use `.env.test.local` in each app for test-specific overrides (see CI workflow for usage).

---

## API Documentation (Swagger)

Both APIs expose interactive Swagger documentation:

- **Auth API:** `/api/docs` (e.g., `http://localhost:3000/api/docs`) or defined in `.env` files
- **URL Shortener API:** `/api/docs` (e.g., `http://localhost:3001/api/docs`) or defined in `.env` files

All endpoints, request/response schemas, and authentication flows are documented in Swagger. Please refer to the Swagger UI for up-to-date API details.

---

## Deployment

The system is deployed on [Render](https://render.com) for tests:

- **Auth API:** [https://auth-api-yz49.onrender.com/](https://auth-api-yz49.onrender.com/)
- **URL Shortener API:** [https://url-shortener-api-l9vs.onrender.com/](https://url-shortener-api-l9vs.onrender.com/)

The deploy uses a managed Postgres database (Render), Redis Cloud, and is integrated with Elastic Cloud for APM (metrics, logs, tracing).

---

## Observability (Elastic APM)

Both services are instrumented with Elastic APM for distributed tracing, metrics, and logging. Elastic APM configuration is controlled via environment variables (see above).

---

## Scalability & Improvement Points

- **Horizontal Scaling:**

  - Run multiple stateless APIs instances behind a load balancer for high availability and throughput.
  - Use a shared database, centralized logging/metrics, and Redis caching to support distributed workloads.
  - **Key improvements:**
    - Add distributed rate limiting and abuse prevention (e.g., via Redis or API gateway).
    - Implement centralized session/token revocation if needed.
    - Consider database sharding or partitioning for very large datasets.
  - **Biggest challenges:**
    - Ensuring data consistency and cache coherence across instances.
    - Managing distributed rate limiting and abuse detection.
    - Scaling the database and cache layers to match API scale.

- **Vertical Scaling:**

  - Increase resources (CPU, RAM, storage) of a single server or container to handle more load per instance.
  - Adjust resource limits in your orchestrator (if implemented) or upgrade your cloud/server instance as needed.
  - **Key improvements:**
    - Monitor application performance and resource usage to know when to scale up.
    - Tune application and database settings for higher resource utilization.
  - **Biggest challenges:**
    - There is a physical or cost limit to how much a single machine can scale.
    - Single point of failure: if the server goes down, the whole app is affected.
    - No redundancy or high availability by itself.

- **Best practice:**

  - Combine horizontal and vertical scaling for maximum flexibility, reliability, and cost-effectiveness.

- **Other improvements:**
  - Add health checks and readiness probes for orchestration (e.g., Kubernetes, Docker Compose).
  - Implement CI/CD pipelines for automated deploys.
  - Add more granular monitoring and alerting for proactive issue detection.

---

## Useful Links

- [Turborepo Documentation](https://turborepo.com/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [pnpm Documentation](https://pnpm.io/)
- [Render](https://render.com/)
- [Elastic Cloud](https://www.elastic.co/cloud/)
- [Redis](https://redis.io/docs/latest/)

---

For any questions or contributions, please open an issue or pull request.
