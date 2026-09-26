# DispatchDesk

> A modern, restrained, and robust delivery and fleet dispatch management system built for small logistics operations.

![DispatchDesk](https://img.shields.io/badge/DispatchDesk-v0.1.0-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.2-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)

---

## 🚀 Overview

**DispatchDesk** provides small logistics and dispatch companies with a desktop-first, reliable management platform. It streamlines order ingestion, real-time driver allocation, state-machine validated delivery tracking, and operational audit history.

Designed around a pragmatic, dense, and functional 2020-era SaaS interface philosophy, DispatchDesk prioritizes readability, instant feedback, and zero clutter.

---

## ✨ Features

- **Role-Based Access Control (RBAC)**: Distinct permissions for `ADMIN`, `DISPATCHER`, and `DRIVER` roles.
- **Order Dispatch & Lifecycle**:
  - Validated state transitions: `PENDING` &rarr; `ASSIGNED` &rarr; `PICKED_UP` &rarr; `OUT_FOR_DELIVERY` &rarr; `DELIVERED` / `FAILED` / `CANCELLED`.
  - Comprehensive status audit history with timestamps and operator notes.
- **Fleet & Driver Management**:
  - Live driver load monitoring (`AVAILABLE`, `ON_DELIVERY`, `OFFLINE`).
  - Single-click driver assignment and re-assignment workflows.
  - Driver deliveries inspection drawer.
- **Customer & Corporate Accounts**:
  - Client directory with contact persons, localized neighborhoods, and complete historical delivery archives.
- **Real-Time Operations Dashboard**:
  - KPI summary metrics (Active Orders, Pending Assignment, Out for Delivery, Delivered Today, Failed Today).
  - 7-Day volume trends with interactive SVG metrics.
  - Live dispatch queue and recent activity feed.
- **System Audit Log**: Full trail of system modifications and administrative actions.
- **Toast Notifications & Modals**: Smooth in-app modal workflows and toast feedback replacing intrusive browser dialogs.

---

## 🛠️ Technology Stack

### Backend
- **Java 17+** (Spring Boot 3.2.5)
- **Spring Security** (Stateless JWT Authentication & BCrypt)
- **Spring Data JPA & Hibernate 6**
- **Flyway Database Migrations**
- **PostgreSQL** (Production & Local) / **H2** (In-memory testing profile)
- **JUnit 5 & Spring Boot Test Suite**

### Frontend
- **React 18** with **TypeScript**
- **Vite 5** Build Tooling
- **React Router 6** (Protected and Public Routes)
- **TanStack React Query 5** (Server state management & cache invalidation)
- **Lucide Icons** (Crisp vector iconography)
- **Axios** (Configured interceptors with automatic auth header injection)

---

## 🗄️ Database Setup

### Using Docker Compose
Run the local PostgreSQL database on port 5433:

```bash
docker compose up -d
```

### Database Schema & Seed Data
Migrations in `backend/src/main/resources/db/migration/` are executed automatically by Flyway on startup:
- `V1__init.sql`: Table definitions and indexes for users, customers, drivers, deliveries, delivery status history, and activity logs.
- `V2__seed.sql`: Realistic Ethiopian logistics seed data (Addis Ababa neighborhoods: Bole, Kazanchis, CMC, Saris, Gerji, Piassa, etc.).
- `V3__fix_seed_passwords.sql`: Bcrypt-hashed credentials for demo accounts.

---

## 🏃 Running the Application

### 1. Backend Service

```bash
cd backend
mvn clean test
mvn spring-boot:run
```

The REST API will be available at `http://localhost:8080/api`.

### 2. Frontend Web Client

```bash
cd frontend
npm install
npm run dev
```

The web client will be available at `http://localhost:5173`.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@dispatchdesk.local` | `password123` |
| **Dispatcher** | `dispatcher@dispatchdesk.local` | `password123` |
| **Driver** | `driver1@dispatchdesk.local` | `password123` |

*(Quick demo login buttons are also available on the Login screen and Settings page.)*

---

## 🧪 Running Tests

Execute the complete backend test suite:

```bash
cd backend
mvn test
```

Build and type-check the frontend:

```bash
cd frontend
npm run build
```