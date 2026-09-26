# DispatchDesk

A delivery and dispatch management system for small businesses.

## Overview

DispatchDesk is a full-stack web application for managing delivery operations. It provides tools for admins, dispatchers, and drivers to manage deliveries, assign drivers, track status, and view operational activity.

## Features

- **Role-Based Access**: ADMIN, DISPATCHER, and DRIVER roles with appropriate permissions
- **Delivery Management**: Create, assign, and track deliveries through a state machine
- **Driver Management**: Add drivers, assign to deliveries, manage availability
- **Customer Management**: Maintain customer records and delivery history
- **Activity Log**: Operational audit trail
- **Dashboard**: Real-time statistics and delivery overview
- **Authentication**: JWT-based login with BCrypt password hashing
- **State Machine**: Validated status transitions enforced by backend

## Tech Stack

### Backend
- Java 17+
- Spring Boot 3.2
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Flyway (database migrations)
- Maven
- Bean Validation

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- CSS (plain)

## Architecture Overview

```
frontend/          # React + Vite + TypeScript
  src/
    components/    # Reusable UI components
    pages/         # Page-level components
    api/           # API service layer
    hooks/         # Custom React hooks
    types/         # TypeScript interfaces

backend/           # Spring Boot application
  src/main/java/
    config/        # Security, JPA, Web config
    controller/    # REST controllers
    service/       # Business logic
    repository/    # JPA repositories
    entity/        # JPA entities
    dto/           # Data transfer objects
    enum/          # Enumerations
    exception/     # Exception handling
  src/main/resources/
    db/migration/  # Flyway SQL migrations
    application.properties
```

## Database Setup

### Using Docker Compose

```bash
docker compose up -d
```

This starts PostgreSQL on port 5432.

### Manual Setup

1. Install PostgreSQL 15+
2. Create a database named `dispatchdesk`
3. Create a user `dispatchdesk` with password `dispatchdesk`

## Running the Application

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Or build and run the JAR:

```bash
cd backend
./mvnw clean package
java -jar target/dispatchdesk-0.1.0.jar
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

The API runs on `http://localhost:8080`.

## Seed Accounts

| Email | Role | Password |
|-------|------|----------|
| admin@dispatchdesk.local | ADMIN | password123 |
| dispatcher@dispatchdesk.local | DISPATCHER | password123 |
| driver1@dispatchdesk.local | DRIVER | password123 |
| driver2@dispatchdesk.local | DRIVER | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login

### Deliveries
- `GET /api/deliveries` - List deliveries (with search, filter, pagination)
- `GET /api/deliveries/{id}` - Get delivery details
- `POST /api/deliveries` - Create delivery
- `PUT /api/deliveries/{id}` - Update delivery
- `POST /api/deliveries/{id}/assign` - Assign driver
- `POST /api/deliveries/{id}/status` - Change status
- `POST /api/deliveries/{id}/cancel` - Cancel delivery
- `GET /api/deliveries/{id}/history` - Get status history

### Drivers
- `GET /api/drivers` - List drivers
- `GET /api/drivers/{id}` - Get driver details
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/{id}` - Update driver

### Customers
- `GET /api/customers` - List customers
- `GET /api/customers/{id}` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer

### Activity
- `GET /api/activity` - Get activity log

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity

## Testing

Backend tests are located in `backend/src/test/java/com/dispatchdesk/`.

```bash
cd backend
./mvnw test
```

## Future Improvements

- Email notifications
- Export to CSV/PDF
- Map integration
- Real-time updates via WebSockets
- Reporting and analytics

## License

MIT
```