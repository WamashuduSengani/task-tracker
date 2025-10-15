# Task Tracker

A full-stack task tracking application built with Spring Boot (Java) for the backend and React (TypeScript) for the frontend. It supports user authentication, task management, overdue alerts, and more.

## Features
- User registration and authentication (JWT)
- Task creation, assignment, filtering, and status updates
- Overdue task detection
- RESTful API (Spring Boot)
- PostgreSQL database (with Flyway migrations)
- Frontend UI (React + TypeScript)
- Dockerized backend and frontend
- Unit and integration tests (JUnit 5, Mockito, TestContainers)

## Project Structure
```
├── backend (Spring Boot)
│   ├── src/main/java/com/wamashudu/task_tracker/... (Java code)
│   ├── src/main/resources/db/migration/ (Flyway SQL migrations)
│   ├── src/test/java/com/wamashudu/task_tracker/... (Tests)
│   ├── pom.xml (Maven config)
│   └── application.properties
├── frontend (React)
│   ├── src/ (TypeScript code)
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── Dockerfile, docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js & npm
- PostgreSQL (for production)
- Docker (optional)

### Backend Setup
1. **Configure Database:**
   - Edit `src/main/resources/application.properties` for your PostgreSQL credentials.
   - For development/testing, H2 in-memory DB is used by default.
2. **Run Migrations:**
   - Flyway will auto-run migrations on startup.
3. **Build & Run:**
   ```bash
   ./mvnw clean spring-boot:run
   ```
4. **Run Tests:**
   ```bash
   ./mvnw test
   ```

### Frontend Setup
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start development server:**
   ```bash
   npm start
   ```

### Docker
To run both backend and frontend with Docker, use **Docker Compose v2**:
```bash
docker compose up --build
```

Once all containers have started, open your browser and go to:
```
http://localhost:3000
```
to access the Task Tracker frontend UI.

**Important:**
- If you see errors like `'ContainerConfig'` or container recreation failures, you are likely using Docker Compose v1. Upgrade to v2 for reliability:
  1. Remove old Docker Compose:
     ```bash
     sudo apt-get remove docker-compose
     sudo apt-get update
     sudo apt-get install docker-compose-plugin
     ```
  2. Use the new command syntax:
     ```bash
     docker compose up --build
     ```
- This ensures smooth builds, restarts, and avoids known bugs in v1.

**Important:**
- For local development and tests, the backend uses H2 by default. You do **not** need PostgreSQL running locally.
- Only the Docker/production profile uses PostgreSQL. This is automatically set when you run Docker Compose or the build script.
- If you ever see errors about connecting to PostgreSQL at `localhost:5432` during local runs or tests, check that:
   - You are **not** running with `SPRING_PROFILES_ACTIVE=docker` locally.
   - Your `src/main/resources/application.properties` contains H2 settings (see below).
   - You are not overriding the profile in your IDE or environment variables.

**Troubleshooting:**
- If you see `Connection to localhost:5432 refused` during local runs/tests, reset your profile and config:
   1. Make sure `application.properties` uses H2 (see Database Configuration section below).
   2. Do **not** set `SPRING_PROFILES_ACTIVE=docker` for local runs/tests.
   3. Only use the `docker` profile when running in Docker.

This ensures you never experience local PostgreSQL connection errors.

### Docker Troubleshooting & Automation

To ensure Docker builds never fail due to leftover containers, volumes, or missing JAR files, use the provided script:

```bash
./docker-cleanup-build.sh
```

This script will:
- Clean up old Docker containers, volumes, images, and build cache
- Remove the previous `target` directory
- Build the Spring Boot JAR
- Run `docker-compose up --build`

**Usage:**
```bash
chmod +x docker-cleanup-build.sh
./docker-cleanup-build.sh
```

This automates all necessary cleanups and builds for a smooth Docker experience.

## API Endpoints
- `/api/auth/*` - Authentication (login, register, refresh)
- `/api/tasks/*` - Task CRUD operations, filtering
- `/api/users/*` - User management

## Core Design Decisions
- Chose **Spring Boot 3.0+** for modern features and compatibility
- Used **Flyway** for simple, versioned DB migrations
- Implemented **JWT** for stateless authentication
- Used **H2** for fast, isolated testing
- Feature branches for clean git history
- **Docker** for easy local/cloud deployment

## Trade-offs Made and Why
- Minimal UI to focus on backend quality
- Email alerts for overdue tasks not implemented (can be added)
- Used Flyway over Liquibase for simplicity

## What I'd Improve With More Time
- Add email/notification integration for overdue tasks
- Expand and polish UI features
- Add advanced filtering and reporting
- Implement caching and Redis
- Enhance API documentation and error responses
- Add more CI/CD automation

## How to Test/Observe the Scheduler Functionality
- Scheduler runs automatically (hourly by default, configurable via `app.scheduler.task-overdue.cron`)
- Marks overdue tasks in the database
- Observe logs for scheduler activity
- Optionally, manually trigger overdue check via REST endpoint

## Testing
- Backend: JUnit 5, Mockito, TestContainers
- Frontend: React Testing Library, Jest

## Contributing
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License
MIT

## Author
Wamashudu Sengani

### Database Configuration

By default, the backend uses **H2** for local development and tests, and **PostgreSQL** for Docker/production.

**Local development & tests:**
- Uses H2 in-memory database (see `src/main/resources/application.properties`).
- No need to run PostgreSQL locally.

**Docker/production:**
- Uses PostgreSQL with credentials from `docker-compose.yml` and `src/main/resources/application-docker.properties`.
- The backend automatically picks up Docker settings when you run:
   ```bash
   docker-compose up --build
   # or
   ./docker-cleanup-build.sh
   ```

**How profiles work:**
- Local: default profile (H2)
- Docker: `docker` profile (PostgreSQL)
   - Spring Boot automatically loads `application-docker.properties` when you set `SPRING_PROFILES_ACTIVE=docker` (already set in Dockerfile or Compose)

**To override profiles manually:**
```bash
SPRING_PROFILES_ACTIVE=docker ./mvnw spring-boot:run
```

**Credentials:**
- Make sure your `docker-compose.yml` and `application-docker.properties` use the same username and password (`taskuser`/`taskpass`).

**Environment variables:**
- You may also use environment variables for secrets in production.
