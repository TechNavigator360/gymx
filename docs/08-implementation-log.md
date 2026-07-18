# GYMX Implementation Log

## Purpose

This document records significant implementation milestones, architectural decisions, and technical changes throughout the development of GYMX.

It complements the Git commit history by documenting *why* changes were made rather than only *what* changed.

---

# 2026-07-18 — PostgreSQL Migration

## Objective

Replace the SQL Server database used during the original backend project with PostgreSQL to create a production-oriented foundation for the portfolio application.

---

## Motivation

The original backend was designed around SQL Server because it aligned with the educational environment. For the portfolio version, PostgreSQL was selected because it is widely adopted, well supported by cloud providers, integrates seamlessly with Prisma, and is better suited for future deployment.

---

## Changes

### Database

- Changed the Prisma datasource from SQL Server to PostgreSQL.
- Generated a new PostgreSQL migration history.
- Removed the previous SQL Server migration.

### Data Model

Added:

- `TrainingStreak`
- `User.show_streak`

Modified:

- `TrainingSession` index changed from:

```prisma
@@index([user_id])
```

to

```prisma
@@index([user_id, date])
```

to improve queries that retrieve a user's sessions for a specific week.

### Infrastructure

- Added Docker Compose configuration for local PostgreSQL.
- Created a reproducible local development environment.
- Updated environment configuration for PostgreSQL.

---

## Challenges Encountered

Several configuration issues were encountered during the migration.

### Docker Compose

The PostgreSQL container initially created only the default `postgres` role because of typographical errors in the Docker Compose configuration.

Issues included:

- `POSTGRES_USERS` instead of `POSTGRES_USER`
- `POSTGRESS_DB` instead of `POSTGRES_DB`
- inconsistent use of `gymx-user` and `gymx_user`
- incorrect Docker volume target

These issues prevented PostgreSQL from creating the expected database user and resulted in authentication failures during Prisma migrations.

After correcting the configuration and recreating the Docker volume, the database initialized successfully.

---

## Validation

The migration was validated by:

- Successfully applying the Prisma migration.
- Regenerating the Prisma Client.
- Starting the backend successfully.
- Verifying the `/health` endpoint.
- Confirming that the PostgreSQL container reached a healthy state.

---

## Architectural Impact

This migration establishes PostgreSQL as the permanent database platform for GYMX.

Future work—including streak calculations, occupancy simulation, deployment, and CI/CD—will build upon this database foundation.

---

## Related Commit

```
8f06aa5
refactor database from SQL Server to PostgreSQL
```