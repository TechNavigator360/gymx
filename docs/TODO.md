# GYMX Full-Stack TODO

## Current status

The full-stack repository has been initialised and the backend has been migrated from SQL Server to PostgreSQL.

The PostgreSQL migration has been verified against the existing Postman/Newman integration suite:

- 22 requests executed
- 64 assertions passed
- 0 failures
- Authentication, ownership, sessions, weekly goals and progress verified
- Incorrect HTTP method in the cross-user delete test corrected
- Temporary assessment failure in `GET /api/auth/me` restored
- Migration and verification branches merged into `main`
- Obsolete branches removed locally and remotely

The current `main` branch is the verified PostgreSQL baseline for subsequent feature development.

---

# Repository setup

- [x] Initialise the new root Git repository.
- [x] Create a root `.gitignore`.
- [ ] Create or expand the root `README.md`.
- [ ] Decide whether to use npm workspaces.
- [ ] Add root scripts for frontend and backend commands.
- [x] Remove legacy repositories from the final repository before the first commit.
- [ ] Remove temporary tree files when no longer needed.
- [x] Establish a feature-branch and verification-branch workflow.
- [x] Merge the PostgreSQL migration and verification work into `main`.
- [x] Remove obsolete migration branches after merging.

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

## PostgreSQL migration

- [x] Replace SQL Server with PostgreSQL.
- [x] Update the Prisma provider to PostgreSQL.
- [x] Create a new Prisma migration history for PostgreSQL.
- [x] Create the initial PostgreSQL schema migration.
- [x] Apply the PostgreSQL migration.
- [x] Validate the Prisma schema.
- [x] Confirm that the PostgreSQL database schema is up to date.
- [x] Verify existing backend behaviour against PostgreSQL.
- [x] Record the migration in the implementation log.

## Database extensions

- [ ] Update the Prisma `User` model with `show_streak`.
- [x] Add the `TrainingStreak` Prisma model.
- [x] Add the required relationships and referential actions.
- [ ] Create and apply the streak/preferences migration.
- [ ] Migrate existing users to include the default `show_streak` value.
- [ ] Update seed data if seed data is retained.
- [ ] Ensure `password_hash` is never returned by the API.

## Existing endpoint alignment

- [x] Preserve all existing API endpoints during the PostgreSQL migration.
- [x] Preserve `GET /api/sessions?week=current`.
- [x] Preserve the current progress response structure.
- [x] Verify authentication against PostgreSQL.
- [x] Verify session creation, retrieval and deletion against PostgreSQL.
- [x] Verify ownership restrictions against PostgreSQL.
- [x] Verify weekly-goal operations against PostgreSQL.
- [x] Verify progress calculations against PostgreSQL.
- [ ] Extend `GET /api/auth/me` with `show_streak`.
- [ ] Verify all implemented request and response field names against `openapi.yaml`.

## Streak

- [x] Finalise streak rules.
- [x] Define the week representation used by streak evaluation.
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

- [x] Locate and review the existing Postman/Newman integration suites.
- [x] Run the deployed integration collection against the local backend.
- [x] Configure Newman to use a local `baseUrl`.
- [x] Run all existing endpoint tests as PostgreSQL regression tests.
- [x] Verify the complete regression run with zero failures.
- [x] Correct the cross-user delete test from `GET` to `DELETE`.
- [x] Restore the intentionally invalid assessment status code in `/api/auth/me`.
- [ ] Add a local Newman script to `package.json`.
- [ ] Replace the placeholder `npm test` script with a real test command.
- [ ] Rename or replace `test:azure`.
- [ ] Separate local and deployed Newman commands.
- [ ] Remove remaining Azure-specific assumptions from the Postman collection.
- [ ] Add missing negative cases from the older integration collection.
- [ ] Make date-dependent Postman scenarios deterministic.
- [ ] Add exact contract assertions instead of permissive status-code assertions.
- [ ] Add tests for `show_streak` in `/api/auth/me`.
- [ ] Add tests for the streak endpoint and streak evaluation.
- [ ] Add tests for preference retrieval and updates.
- [ ] Add tests for occupancy success and failure responses.
- [ ] Decide whether Jest/Supertest adds sufficient value beyond Newman.
- [ ] Add Jest/Supertest integration tests if selected.
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
- [x] Create the deployment guide structure.
- [x] Create an engineering-journal implementation log.
- [x] Document the SQL Server-to-PostgreSQL migration in the implementation log.
- [x] Record PostgreSQL migration verification results.
- [ ] Add the `openapi.yaml` reference to `05-api-specification.md`.
- [ ] Link the Architecture, Database Design, API Specification, OpenAPI and Deployment Guide together.
- [ ] Create deployment diagram after hosting is selected.
- [ ] Record significant architecture decisions using ADRs.
- [ ] Create an ADR for replacing SQL Server with PostgreSQL.
- [ ] Document the external Access Control System simulation.
- [ ] Complete the deployment guide after hosting is selected.
- [ ] Document deployment and rollback.
- [ ] Update the project README with local development instructions.
- [ ] Update the project README with backend test instructions.
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
- [ ] Remove outdated Azure-specific code and configuration when the replacement deployment is operational.
- [ ] Review test names to ensure they match the actual HTTP method and behaviour.
- [ ] Ensure automated test commands fail when assertions fail.

---

# Domain

- [ ] Confirm whether GYMX will use a subdomain of `jackiejives.nl` or `jackiejives.com`.
- [x] Confirm that an existing personal portfolio domain can host multiple applications using subdomains.
- [x] Confirm that creating subdomains does not normally require purchasing additional domains.
- [ ] Select the final GYMX hostname.
- [ ] Check possible name or trademark conflicts.
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