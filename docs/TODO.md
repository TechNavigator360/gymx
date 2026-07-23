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

Training Streak development is currently in progress on `feature/training-streak`:

- The `TrainingStreak` Prisma model has been created and migrated.
- The training-streak repository has been implemented, verified, committed and pushed.
- New users receive a `TrainingStreak` through atomic nested Prisma creation during registration.
- The initial streak contains `current_streak = 0` and `last_evaluated_week = null`.
- The local Newman regression suite still passes with 64 assertions and 0 failures.
- The created streak relation was verified directly through Prisma.
- The first registered training session defines the start of the streak lifecycle.
- Weeks before the first registered training session are ignored.
- The functional specification is the authoritative source for accepted behaviour.
- The first weekly goal takes effect immediately and is required before check-in.
- Later goal changes take effect on the following Monday.
- One immutable Boolean weekly outcome will be stored for every evaluated completed week.
- The database and API documentation have been aligned with the revised streak model.

The current `main` branch remains the verified PostgreSQL baseline. Training Streak work remains isolated on the feature branch until the complete feature has been implemented and verified.

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

- [ ] Disable check-in until the user has created a weekly goal.
- [ ] Display “Please set a weekly target before registering a training session” while check-in is unavailable.
- [ ] Update the check-in button to send a bodyless authenticated request to `POST /api/sessions`.
- [ ] Use the session ID and backend-generated check-in timestamp returned by the API.
- [ ] Replace general training-history deletion in the UI with an “Undo last check-in” action.
- [ ] Only expose the undo action for the latest eligible current-week training session.
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
- [ ] When a later goal change is requested, show that it takes effect on Monday and display the unchanged current target.

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

## First-use onboarding
- [ ] Add a first-use onboarding flow.
- [ ] Prompt new users to configure their weekly training goal.
- [ ] Keep session registration locked until the first weekly goal is created.
- [ ] Prompt new users to configure streak visibility.
- [ ] Prevent incomplete onboarding from being mistaken for a failed training week.
- [x] Define the first training session as the backend boundary that begins the streak lifecycle.
- [ ] Explain during onboarding that the first completed training week begins streak evaluation.

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

- [x] Update the Prisma `User` model with `show_streak`.
- [x] Add the `TrainingStreak` Prisma model.
- [x] Add the required relationships and referential actions.
- [x] Migrate existing users to include the default `show_streak` value.
- [ ] Add `pending_target_sessions` and `pending_effective_date` to `WeeklyGoal`.
- [ ] Add the `WeeklyGoalResult` model with composite key (`user_id`, `week_start`).
- [ ] Add the `User` to `WeeklyGoalResult` relationship with cascading deletion.
- [ ] Create and apply the pending-goal and weekly-result migration.
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

- [x] Finalise the core streak rules.
- [x] Settle that the first weekly goal takes effect immediately.
- [x] Settle that later goal changes take effect on the following Monday.
- [x] Settle that the newest pending goal value replaces any earlier pending value.
- [x] Require a weekly goal before a training session can be registered.
- [x] Settle one immutable Boolean outcome per evaluated completed week.
- [x] Reject historical target and session-count duplication in the weekly outcome.
- [x] Define the Monday-to-Sunday calendar-week representation.
- [x] Define the first registered training session as the start of the streak lifecycle.
- [x] Define that weeks before the first registered training session are ignored.
- [x] Define that the week containing the first registered session is evaluated only after it is completed.
- [x] Define that no evaluation occurs when the user has no weekly goal.
- [x] Implement `findTrainingStreakByUserId`.
- [x] Implement `createTrainingStreak`.
- [x] Implement `updateTrainingStreak`.
- [x] Create a `TrainingStreak` during user registration.
- [x] Use nested Prisma creation so the user and streak are created atomically.
- [x] Initialise `current_streak` to `0` and `last_evaluated_week` to `null`.
- [x] Verify streak creation through the registration flow.
- [x] Inspect the existing date utilities.
- [x] Inspect the existing training-session repository.
- [x] Add a repository operation for finding the user's earliest training session.
- [ ] Add only the minimum date helpers required by streak evaluation.
- [ ] Implement streak evaluation logic.
- [ ] Return the unchanged streak when no weekly goal exists.
- [ ] Return the unchanged streak when no training sessions exist.
- [ ] Begin initial evaluation from the week containing the earliest training session.
- [ ] Evaluate every completed but unevaluated week chronologically.
- [ ] Finalize completed weeks under the old target before activating a pending target.
- [ ] Persist one `WeeklyGoalResult` per evaluated completed week.
- [ ] Read finalized Boolean outcomes in chronological order when deriving the streak.
- [ ] Ensure only completed Monday-to-Sunday weeks are evaluated.
- [ ] Ensure the current incomplete week does not break a streak.
- [ ] Increment `current_streak` after a successful completed week.
- [ ] Reset `current_streak` to `0` after a failed completed week.
- [ ] Treat an empty completed week after the first session as a failed week.
- [ ] Ensure repeated requests do not evaluate the same week twice.
- [ ] Persist `current_streak`.
- [ ] Persist `last_evaluated_week`.
- [ ] Ensure `show_streak` never affects evaluation.
- [ ] Add `GET /api/streak`.
- [ ] Require authentication for `GET /api/streak`.
- [ ] Prevent direct modification of streak values through the API.

## Training Sessions

- [ ] Reject session creation when the authenticated user has no weekly goal.
- [ ] Change session creation so the backend assigns the current check-in timestamp.
- [ ] Remove the requirement for clients to provide a session date or timestamp.
- [ ] Prevent clients from registering historical training sessions.
- [ ] Update `POST /api/sessions` so it no longer requires a request body.
- [ ] Ensure Prisma generates the session ID during creation.
- [ ] Decide whether to rename `TrainingSession.date` to `checked_in_at`.
- [ ] Change PostgreSQL session storage from date-only to timestamp storage.
- [ ] Create and apply the required Prisma migration for timestamp storage.
- [ ] Update the frontend check-in flow to use the backend-generated session ID and timestamp.
- [ ] Use the timestamp to identify the latest eligible session for “Undo last check-in”.
- [ ] Update the Newman collection for backend-generated session timestamps.
- [ ] Update the API specification and `openapi.yaml` session-creation contract.
- [ ] Verify that the earliest stored training session reliably represents the start of the streak lifecycle.
- [ ] Restrict training session deletion to the current calendar week.
- [ ] Prevent deletion of training sessions belonging to completed weeks.
- [ ] Enforce that only training sessions from the current calendar week may be deleted.
- [ ] Return an appropriate conflict response when deletion is attempted for a completed week.
- [ ] Add integration tests verifying that completed-week sessions are immutable.

## Preferences

- [ ] Add `GET /api/preferences`.
- [ ] Add `PATCH /api/preferences`.
- [ ] Validate that `show_streak` is Boolean.
- [ ] Ensure users can only read and update their own preferences.

## Weekly Goals

- [ ] Keep the first goal immediately active.
- [ ] Store later changes as a pending target with the following Monday as effective date.
- [ ] Replace an existing pending value when another valid change is requested before activation.
- [ ] Lazily activate a pending target on the first relevant request on or after its effective Monday.
- [ ] Finalize preceding completed weeks before pending-target activation.

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

## Automated Testing
- [ ] Add integration tests verifying completed-week sessions cannot be deleted.
- [ ] Add an automated test verifying registration creates an initial streak record.
- [ ] Add an automated test verifying a streak starts at zero with no evaluated week.
- [ ] Add an automated test verifying a user without a weekly goal is not evaluated.
- [ ] Add an automated test verifying session creation is rejected without a weekly goal.
- [ ] Add an automated test verifying the first goal enables session creation immediately.
- [ ] Add an automated test verifying a later goal change leaves the current target unchanged.
- [ ] Add an automated test verifying the newest pending target replaces the earlier pending target.
- [ ] Add an automated test verifying pending activation finalizes the preceding week using the old target.
- [ ] Add an automated test verifying one immutable weekly Boolean result is stored per evaluated week.
- [ ] Add an automated test verifying a user without training sessions is not evaluated.
- [ ] Add an automated test verifying weeks before the first training session are ignored.
- [ ] Add an automated test verifying the earliest session week becomes the first eligible week.
- [ ] Add an automated test verifying the earliest session week is not evaluated while still current.
- [ ] Add an automated test verifying the current incomplete week does not affect the streak.
- [ ] Add an automated test verifying a successful completed week increments the streak.
- [ ] Add an automated test verifying a failed completed week silently resets the streak.
- [ ] Add an automated test verifying an empty completed week resets the streak.
- [ ] Add an automated test verifying multiple unevaluated weeks are processed chronologically.
- [ ] Add an automated test verifying an already evaluated week is not evaluated again.
- [ ] Add an automated test verifying streak evaluation continues when `show_streak` is false.
- [ ] Add an automated test verifying the streak endpoint requires authentication.

### Completed manual verification

- [x] Validate the Prisma schema after adding nested streak creation.
- [x] Run the existing local Newman regression suite.
- [x] Complete 22 Newman requests with 64 passing assertions and 0 failures.
- [x] Query the newly registered user and related streak directly through Prisma.
- [x] Confirm that `TrainingStreak.user_id` matches `User.id`.
- [x] Confirm that `current_streak` is initialised to `0`.
- [x] Confirm that `last_evaluated_week` is initialised to `null`.
- [x] Confirm that the existing registration response remains unchanged.

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
- [x] Document the Training Streak repository milestone.
- [x] Document atomic streak creation during registration.
- [x] Document the first-session streak lifecycle boundary.
- [x] Create the authoritative Functional Specification.
- [x] Document goal-before-check-in and following-Monday target activation.
- [x] Document immutable weekly Boolean outcomes.
- [x] Update the ERD and related documentation for `WeeklyGoalResult` and pending goal state.
- [ ] Document the completed streak-evaluation algorithm.
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
- [ ] Design the transaction and concurrency strategy for streak evaluation.
- [ ] Add database-level or transactional protection so each eligible week affects the streak exactly once.

# Future historical rules
- [ ] Decide whether weekly-goal changes should ever affect previously evaluated weeks.
- [ ] Decide whether completed-week corrections require an administrative correction workflow.
- [ ] Introduce weekly-goal history only if historical recalculation becomes a product requirement.
- [ ] Introduce goal-effective periods only if future product requirements require historical goal interpretation.

# Deployment-time calendar policy
- [ ] Define and document the application timezone used for Monday–Sunday calendar-week boundaries before production deployment.
