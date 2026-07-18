# GYMX Backend

GYMX Backend is a REST API built with Node.js, Express.js, Prisma ORM and SQL Server.

The API allows users to:

* Register and authenticate
* Manage training sessions
* Manage weekly training goals
* Track weekly training progress
* Access only their own data through JWT-based authentication and ownership checks

---

# Quick Verification

The easiest way to verify the deployed application is to execute the automated validation suite against the live Azure environment.

### Prerequisites

* Git
* Newman

### 1. Clone the Repository

```bash
git clone https://github.com/The-Hague-University/WA-2526-individual-24015067
cd gymx-backend
```

### 2. Install Newman

```bash
npm install -g newman
```

### 3. Run the Deployed Validation Suite

```bash
newman run "tests/GYMX - Deployed.postman_collection.json" \
  --env-var "baseUrl=https://gymx-backend-24015067.azurewebsites.net"
```

This validates the complete deployed solution, including:

* User registration
* Authentication
* Authorization
* Training session management
* Weekly goal management
* Progress calculation
* Azure App Service deployment
* Azure SQL Database connectivity

The validation suite executes against the live Azure environment and does not require a local database, Docker installation, or local application setup.

---

# Live Deployment

Health endpoint:

```text
https://gymx-backend-24015067.azurewebsites.net/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "GYMX backend is running"
}
```

---

# Features

* User registration
* User login
* JWT authentication
* Protected API endpoints
* Training session CRUD operations
* Weekly goal management
* Current-week progress calculation
* Ownership-based authorization
* SQL Server persistence through Prisma ORM

---

# Technology Stack

| Component        | Technology         |
| ---------------- | ------------------ |
| Runtime          | Node.js            |
| Framework        | Express.js         |
| Database         | SQL Server         |
| ORM              | Prisma             |
| Authentication   | JWT                |
| Password Hashing | bcrypt             |
| Containerization | Docker             |
| Testing          | Postman / Newman   |
| CI/CD            | GitHub Actions     |
| Cloud Hosting    | Azure App Service  |
| Cloud Database   | Azure SQL Database |

---

# Architecture Overview

```text
Client
→ Routes
→ Controllers
→ Services
→ Repositories
→ Prisma ORM
→ SQL Server
```

### Layer Responsibilities

**Routes**

Map HTTP requests to controllers.

**Controllers**

Handle request and response logic.

**Services**

Contain business rules and validation.

**Repositories**

Handle database access through Prisma.

**Prisma**

Communicates with SQL Server.

---

# API Overview

## Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/me       |

## Training Sessions

| Method | Endpoint          |
| ------ | ----------------- |
| POST   | /api/sessions     |
| GET    | /api/sessions     |
| GET    | /api/sessions/:id |
| DELETE | /api/sessions/:id |

## Weekly Goals

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /api/weekly-goal |
| POST   | /api/weekly-goal |
| PATCH  | /api/weekly-goal |

## Progress

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | /api/progress/current-week |

---

# CI/CD Overview

The project uses GitHub Actions for automated validation and deployment.

## Continuous Integration (CI)

Validation pipeline:

```text
checkout
→ npm ci
→ prisma validate
→ docker build
```

Purpose:

* Verify dependencies install correctly
* Validate Prisma configuration
* Verify Docker image creation
* Detect issues before deployment

---

## Continuous Deployment (CD)

Deployment flow:

```text
master
→ GitHub Actions
→ Docker Build
→ Azure Container Registry
→ Azure App Service
→ Azure SQL Database
```

After deployment, the live Azure API can be validated using the deployed Newman validation suite.

---

# Project Structure

```text
src/
├── config/
├── controllers/
├── middleware/
├── repositories/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js

prisma/
├── migrations/
└── schema.prisma

tests/

docs/
```

---

# License

Educational project developed for Backend Development at The Hague University of Applied Sciences.

Author: Rute Ferreira Rodrigues
