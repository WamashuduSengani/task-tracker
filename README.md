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
To run both backend and frontend with Docker:
```bash
docker-compose up --build
```

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
