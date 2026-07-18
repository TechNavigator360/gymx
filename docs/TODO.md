# GYMX Full-Stack TODO

## Repository setup

- [ ] Initialise the new root Git repository.
- [ ] Create a root `.gitignore`.
- [ ] Create a root `README.md`.
- [ ] Decide whether to use npm workspaces.
- [ ] Add root scripts for frontend and backend commands.
- [ ] Remove legacy repositories from the final repository before the first commit.
- [ ] Remove temporary tree files when no longer needed.

---

# Frontend

## Authentication

- [ ] Replace hardcoded `http://localhost:3000` URLs with a shared API client.
- [ ] Add environment-based API configuration for development and production.
- [ ] Add authentication state.
- [ ] Add registration page.
- [ ] Add login page.
- [ ] Add logout by removing the stored JWT.
- [ ] Add protected routes.
- [ ] Add JWT handling.
- [ ] Persist authentication across browser refreshes.
- [ ] Redirect unauthenticated users to the login page.
- [ ] Redirect users to the login page after JWT expiration.

## Backend integration

- [ ] Replace JSON Server with the real backend.
- [ ] Connect sessions UI to the real backend.
- [ ] Connect weekly goal UI to the real backend.
- [ ] Connect progress UI to the real backend.
- [ ] Decide whether `calculateProgress.js` remains or is replaced by backend progress data.

## Training sessions

- [ ] Add session deletion/correction UI.
- [ ] Add a confirmation step before deleting a training session.
- [ ] Refresh session and progress data after deletion.

## Streak and preferences

- [ ] Add streak display.
- [ ] Add a short explanation of how streaks are calculated.
- [ ] Add a UI control for `show_streak`.
- [ ] Connect streak display to `GET /api/streak`.
- [ ] Connect streak preference to `GET /api/preferences`.
- [ ] Connect streak preference updates to `PATCH /api/preferences`.
- [ ] Display confirmation after updating preferences.

## Occupancy

- [ ] Add occupancy meter using backend API data.
- [ ] Display occupancy status.
- [ ] Display the last-updated timestamp.
- [ ] Add stale or unavailable occupancy states.

## Testing and usability

- [ ] Fix date-dependent `calculateProgress` unit test.
- [ ] Fix React `act(...)` warnings in routing tests.
- [ ] Rewrite Cypress tests against the real backend.
- [ ] Add loading states.
- [ ] Add API error states.
- [ ] Add empty states.
- [ ] Review the UI against LU20 usability findings.
- [ ] Remove obsolete prototype code after backend integration.

---

# Backend

## Database

- [ ] Replace SQL Server with PostgreSQL.
- [ ] Create a new Prisma migration history for PostgreSQL.
- [ ] Update the Prisma `User` model with `show_streak`.
- [ ] Add the `TrainingStreak` Prisma model.
- [ ] Add the required relationships and referential actions.
- [ ] Apply the PostgreSQL migration.
- [ ] Migrate existing users to include the default `show_streak` value.
- [ ] Update seed data if seed data is retained.
- [ ] Ensure `password_hash` is never returned by the API.

## Existing endpoint alignment

- [ ] Preserve all existing API endpoints.
- [ ] Preserve `GET /api/sessions?week=current`.
- [ ] Preserve the current progress response structure.
- [ ] Extend `GET /api/auth/me` with `show_streak`.
- [ ] Verify existing request and response field names against `openapi.yaml`.

## Streak

- [ ] Finalise streak rules.
- [ ] Implement streak repository operations.
- [ ] Implement streak evaluation logic.
- [ ] Ensure only completed Monday-to-Sunday weeks are evaluated.
- [ ] Ensure the current incomplete week does not break a streak.
- [ ] Ensure repeated requests do not evaluate the same week twice.
- [ ] Persist `current_streak`.
- [ ] Persist `last_evaluated_week`.
- [ ] Add `GET /api/streak`.
- [ ] Prevent direct modification of streak values through the API.

## Preferences

- [ ] Add `GET /api/preferences`.
- [ ] Add `PATCH /api/preferences`.
- [ ] Validate that `show_streak` is Boolean.
- [ ] Ensure users can only read and update their own preferences.

## Occupancy

- [ ] Define the external Access Control System contract.
- [ ] Design the external occupancy provider interface.
- [ ] Implement the simulated occupancy provider.
- [ ] Add `GET /api/occupancy`.
- [ ] Map provider data to the API occupancy response.
- [ ] Add occupancy error handling.
- [ ] Add stale-data handling.
- [ ] Ensure occupancy is not persisted as a database entity.

## Testing and configuration

- [ ] Add automated backend integration tests using Jest and Supertest.
- [ ] Add tests for `show_streak` in `/api/auth/me`.
- [ ] Add tests for the streak endpoint and streak evaluation.
- [ ] Add tests for preference retrieval and updates.
- [ ] Add tests for occupancy success and failure responses.
- [ ] Run all existing endpoint tests as regression tests.
- [ ] Replace placeholder `npm test` script with real tests.
- [ ] Remove or replace `test:azure`.
- [ ] Generalise the Postman collection.
- [ ] Review concurrent-user smoke test for PostgreSQL.
- [ ] Review CORS configuration after frontend/backend integration.
- [ ] Review Dockerfile for the combined deployment.
- [ ] Review environment variables and `.env.example`.
- [ ] Validate the OpenAPI specification as part of CI.
- [ ] Generate Swagger UI from `openapi.yaml` (optional).

---

# API design

- [x] Audit existing backend endpoints.
- [x] Audit frontend data requirements.
- [x] Create frontend/backend gap analysis.
- [x] Preserve existing endpoint contracts.
- [x] Define authentication contract.
- [x] Define session contract.
- [x] Define weekly-goal contract.
- [x] Define progress contract.
- [x] Define streak contract.
- [x] Define preferences contract.
- [x] Define occupancy contract.
- [x] Define shared error response format.
- [x] Create the Markdown API specification.
- [x] Create the OpenAPI specification.
- [ ] Validate the implemented API against `docs/api/openapi.yaml`.
- [ ] Keep `05-api-specification.md` and `openapi.yaml` aligned during implementation.

---

# Occupancy simulation

- [ ] Define the simulated external Access Control System response format.
- [ ] Select or create a realistic occupancy dataset.
- [ ] Include weekday and weekend patterns.
- [ ] Include multiple time intervals per day.
- [ ] Decide whether the simulator is a separate service or an in-process backend provider.
- [ ] Add deterministic simulation mode for tests.
- [ ] Add last-known occupancy behaviour.
- [ ] Decide whether historical occupancy data is required for a future release.

---

# Architecture and documentation

- [x] Create full-stack target architecture.
- [x] Create system context diagram.
- [x] Create container diagram.
- [x] Create backend component diagram.
- [x] Create database design.
- [x] Create API specification.
- [x] Create OpenAPI artefact.
- [ ] Add the `openapi.yaml` reference to `05-api-specification.md`.
- [ ] Link the Architecture, Database Design, API Specification, OpenAPI and Deployment Guide together.
- [ ] Create deployment diagram after hosting is selected.
- [ ] Record significant architecture decisions using ADRs.
- [ ] Document the SQL Server-to-PostgreSQL migration.
- [ ] Document the external Access Control System simulation.
- [ ] Create the deployment guide.
- [ ] Document deployment and rollback.
- [ ] Update the project README with local development instructions.
- [ ] Update the project README with deployment instructions.
- [ ] Add screenshots of the completed application.

---

# Deployment

- [ ] Finalise the Azure replacement.
- [ ] Select application hosting platform.
- [ ] Select managed PostgreSQL hosting.
- [ ] Design the new CI pipeline.
- [ ] Design the new deployment pipeline.
- [ ] Configure automatic database migrations during deployment.
- [ ] Configure production environment variables.
- [ ] Configure production secret management.
- [ ] Configure health checks.
- [ ] Configure logs and monitoring.
- [ ] Configure custom domain.
- [ ] Configure HTTPS.
- [ ] Define the PostgreSQL backup and restore strategy.
- [ ] Define rollback procedure.
- [ ] Add production smoke tests against the deployed application.

---

# Code quality

- [ ] Review naming consistency across frontend, backend and API (`snake_case` vs `camelCase`).
- [ ] Refactor duplicated business logic where appropriate.
- [ ] Remove obsolete prototype code after backend integration.

---

# Domain

- [ ] Decide between a GYMX-specific domain and a personal portfolio domain.
- [ ] Check domain availability.
- [ ] Check renewal pricing.
- [ ] Check possible name or trademark conflicts.
- [ ] Register the chosen domain if a new domain is selected.
- [ ] Configure DNS after hosting is selected.

---

# Future improvements

- [ ] Add API rate limiting.
- [ ] Add structured request logging.
- [ ] Add API versioning.
- [ ] Add pagination for training sessions.
- [ ] Add filtering of training sessions by date range.
- [ ] Add a user profile page.
- [ ] Add password change functionality.