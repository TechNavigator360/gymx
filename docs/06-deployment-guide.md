# GYMX Deployment Guide

## Purpose

This document describes how GYMX is deployed from source code to a production environment. It documents the deployment architecture, deployment strategy, infrastructure components, CI/CD pipeline, environment configuration, monitoring, and rollback procedures.

The guide serves as a reference for deploying new versions of the application and maintaining a consistent production environment.

---

# 1. Deployment Objectives

The deployment process has been designed to achieve the following objectives.

## Reliability

Deployments should be repeatable and minimise the risk of service interruption.

## Automation

Application builds, testing and deployment should be automated wherever possible through a CI/CD pipeline.

## Security

Sensitive configuration such as database credentials, JWT secrets and API keys shall never be stored inside the source code repository.

## Recoverability

Previous versions of the application should be recoverable if a deployment introduces unexpected issues.

---

# 2. Deployment Architecture

GYMX is deployed as a full-stack web application consisting of four primary components.

- Frontend application
- Backend REST API
- PostgreSQL database
- External Access Control System

The frontend communicates exclusively with the backend API.

The backend is responsible for business logic, authentication, persistence and communication with external systems.

The PostgreSQL database stores all application data, including users, training sessions, weekly goals and training streaks.

The Access Control System is an external service that provides occupancy information. It is not owned or deployed as part of GYMX.

```
                    Internet
                         │
             ┌───────────┴───────────┐
             │                       │
         Frontend              Backend API
                                      │
                   ┌──────────────────┴──────────────────┐
                   │                                     │
             PostgreSQL Database        External Access Control System
```

---

# 3. Deployment Strategy

GYMX follows a continuous deployment approach.

Every change is committed to GitHub and automatically validated through the CI pipeline.

Only changes merged into the main branch are eligible for deployment to the production environment.

Deployments are designed to be repeatable and deterministic, ensuring that identical source code always produces identical deployment artefacts.

---

# 4. Target Environment

The production environment consists of the following logical components.

| Component | Responsibility |
|-----------|----------------|
| Frontend Hosting | Serves the React application |
| Backend Hosting | Hosts the REST API |
| PostgreSQL | Stores application data |
| Domain Provider | Provides the public domain name |
| TLS Certificate | Enables HTTPS |
| External Access Control System | Provides occupancy information |

The specific hosting providers may change over time without affecting the overall deployment architecture.

---

# 5. Continuous Integration and Deployment

The deployment pipeline is divided into two stages.

## Pull Request Validation

Every pull request should automatically execute:

- Dependency installation
- Static analysis
- Unit tests
- Integration tests
- OpenAPI validation
- Build verification

Deployment does not occur during pull request validation.

---

## Production Deployment

After a successful merge into the main branch, the deployment pipeline should:

1. Build the frontend.
2. Build the backend.
3. Execute automated tests.
4. Apply database migrations.
5. Deploy the backend.
6. Deploy the frontend.
7. Execute production smoke tests.

Only successful deployments are considered complete.

---

# 6. Environment Configuration

Runtime configuration is provided through environment variables.

Typical configuration includes:

- Database connection string
- JWT secret
- Frontend origin
- Backend API URL
- External occupancy API endpoint
- Occupancy API credentials

No secrets are stored inside the source code repository.

---

# 7. Database Migration

Database schema changes are managed using Prisma Migrate.

Whenever a deployment contains database changes, migrations should be executed automatically before the new application version begins serving requests.

Migration failures should abort the deployment.

---

# 8. External Integrations

GYMX integrates with an external Access Control System to retrieve occupancy information.

The external system is considered an independent service and is therefore outside the deployment boundary.

If the external service becomes unavailable, GYMX should continue operating while presenting an appropriate occupancy status to users.

---

# 9. Health Checks

The deployed application should expose a health endpoint used by the hosting platform.

The endpoint verifies that:

- the application is running;
- the database connection is available;
- required services are initialised.

Health checks allow the hosting platform to determine whether an instance is healthy.

---

# 10. Monitoring and Logging

The production environment should provide:

- application logs;
- deployment logs;
- startup logs;
- runtime error logs.

Monitoring should support rapid identification of deployment or runtime failures.

---

# 11. Deployment Verification

After deployment the following checks should be performed.

- Application starts successfully.
- Health endpoint returns success.
- Database migrations completed.
- Authentication functions correctly.
- Existing API endpoints remain operational.
- New features behave as expected.
- Frontend communicates with the backend.
- Occupancy information is retrieved successfully or handled gracefully when unavailable.

These checks may be automated as production smoke tests.

---

# 12. Rollback Procedure

If a deployment introduces critical issues, the previous stable version should be restored.

Rollback should include:

1. Stop routing traffic to the faulty version.
2. Restore the previous application version.
3. Verify application health.
4. Investigate deployment logs.
5. Apply corrective changes before redeployment.

Database rollbacks should only be performed when explicitly required and after evaluating the impact on persisted data.

---

# 13. Future Improvements

Possible future enhancements include:

- Blue-green deployments
- Canary deployments
- Automatic scaling
- Distributed caching
- Centralised log aggregation
- Infrastructure as Code
- Automated security scanning
- Performance monitoring