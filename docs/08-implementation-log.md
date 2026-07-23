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

# PostgreSQL Migration Verification

## Objective

Verify that migrating the backend from SQL Server to PostgreSQL preserved all existing application behaviour.

## Motivation

Changing the persistence layer is a high-impact architectural change. Before introducing new functionality, the migrated backend needed to demonstrate behavioural parity with the previous implementation.

## Changes

- Executed Prisma validation.
- Verified migration status.
- Adapted the Postman/Newman regression suite for local execution.
- Executed the complete integration suite against the PostgreSQL database.
- Corrected an issue in the regression suite where an authorization test intended for DELETE requests mistakenly executed a GET request.

## Challenges Encountered

One endpoint intentionally returned HTTP 600 from a previous deployment assessment exercise. After restoring the correct implementation, the regression suite completed successfully.

## Validation

- Prisma schema validation passed.
- Database migration status confirmed.
- 22 requests executed.
- 64 assertions passed.
- Average response time: 17 ms.

## Architectural Impact

This verification establishes PostgreSQL as the new persistence baseline. Future feature development (such as Training Streaks) can proceed with confidence that the migration itself introduced no behavioural regressions.

## Related Commit

```
3fd5650
verify PostgreSQL migration with integration regression suite
```
# Streak 

## Repository

### Objective

Introduce a dedicated persistence layer for training streak state.

## Motivation

Training streak functionality requires a repository that encapsulates all database interactions. Following the existing layered architecture keeps business logic isolated within the service layer and maintains consistency across repositories.

## Changes

- Added `trainingStreakRepository`.
- Implemented retrieval by user ID.
- Implemented creation of an initial streak record.
- Implemented updates to persisted streak state.
- Followed the established Prisma repository conventions used throughout the backend.

## Challenges Encountered

No significant challenges were encountered. The implementation followed the existing repository pattern introduced for training sessions and weekly goals.

## Validation

- Verified the repository module loads successfully.
- Confirmed exported functions are available.
- Reviewed the implementation to ensure no business logic resides within the repository.

## Architectural Impact

Extends the persistence layer with dedicated support for the `TrainingStreak` aggregate while preserving separation of concerns between repository and service layers.

## Related Commit

```
9bbe29e
feat(repository): add training streak repository
```
---

## Training Streak Registration and Evaluation Boundary

### Objective

Establish the lifecycle foundation for the Training Streak feature by ensuring that every newly registered user receives a corresponding `TrainingStreak` record.

The milestone also clarified how the evaluator will determine the first calendar week eligible for streak evaluation without expanding the current database schema.

### Motivation

A persisted streak record is required to track:

- the user’s current streak;
- the most recently evaluated completed week;
- whether a completed week has already affected the streak.

Creating this record during registration guarantees that every new user begins with a consistent streak state:

- `current_streak = 0`;
- `last_evaluated_week = null`.

The initial evaluation boundary also needed to be defined. Registration time and weekly-goal creation were considered, but neither accurately represents the beginning of a user’s actual training activity without introducing additional temporal data.

The user’s first registered training session was therefore selected as the beginning of the streak lifecycle.

### Changes

The user repository was updated so that `createUser` creates the related `TrainingStreak` through Prisma’s nested relation creation.

The user and streak are now inserted as one atomic database operation.

The existing registration service and API response did not require changes. The repository still returns only the safe user fields:

- `id`;
- `email`.

The following streak initialization values are explicitly provided:

- `current_streak: 0`;
- `last_evaluated_week: null`.

The evaluator design was refined with the following initialization rule:

- If the user has no weekly goal, no evaluation occurs.
- If the streak has never been evaluated, the evaluator finds the user’s earliest training session.
- If no training session exists, the streak remains unchanged.
- The calendar week containing the earliest session becomes the first eligible streak week.
- That week is evaluated only after it has been completed.
- Weeks before the first recorded training session are ignored.

### Challenges Encountered

The main design challenge was determining where streak evaluation should begin when `last_evaluated_week` is `null`.

Several possible boundaries were considered:

- user registration;
- weekly-goal creation;
- a separate goal-effective date;
- the first registered training session.

Using registration could cause inactive weeks before the user began training to count as failed weeks. Using weekly-goal creation would require additional timestamps or goal-history modelling that the current application does not need.

The first registered training session provides a boundary using existing domain data. Because sessions are created in real time and historical sessions cannot be added, the earliest session reliably represents the beginning of recorded training activity.

Concurrency-specific persistence logic and historical weekly-goal modelling were deliberately deferred. The first implementation will establish and test the normal chronological evaluation path before introducing production-hardening mechanisms.

### Validation

The Prisma schema was validated successfully:

```text
The schema at prisma\schema.prisma is valid
```
The existing Newman API regression suite was executed against the local backend:

- 22 requests executed;
- 44 test scripts executed;
- 64 assertions passed;
- 0 failures.

The most recently registered user was queried directly through Prisma with the related streak included.

The query confirmed:

- the user was created successfully;
- the related `TrainingStreak` was created;
- `TrainingStreak.user_id` matched `User.id`;
- `current_streak` was initialized to `0`;
- `last_evaluated_week` was initialized to `null`;
- the existing registration response and API behaviour remained intact.

### Architectural Impact

Training-streak creation remains within the repository layer, which is the only layer that communicates directly with Prisma.

Nested creation preserves the existing request flow:

```text
route → controller → authentication service → user repository → Prisma → PostgreSQL
```

No additional service orchestration or explicit transaction was required. Prisma performs the related user and streak inserts atomically.

The decision to use the first training session as the evaluation boundary also keeps the initial evaluator compatible with the existing schema. The evaluator will later require access to the user’s earliest training session, but no schema changes are required for that query.

### Related Commit
```
c867ec8 feat: create training streak during registration

---

# 2026-07-23 — Earliest Training Session Lookup

## Objective

Add the repository operation required to locate the beginning of a user’s
streak lifecycle.

## Motivation

When `TrainingStreak.last_evaluated_week` is `null`, the evaluator must begin
with the calendar week containing the user’s earliest registered training
session. Weeks before that session are outside the streak lifecycle.

## Changes

- Added `findFirstSessionByUserId(userId)` to `sessionRepository`.
- Filtered the query by `user_id`.
- Ordered first by `date` ascending and then by `id` ascending for
  deterministic selection.
- Exported the new repository operation for later use by the streak service.

## Challenges Encountered

The lookup needed a deterministic tie-breaker because more than one session may
share the same date. Ordering by `id` after `date` makes the selected first
session stable.

## Validation

- Reviewed the Prisma query against the existing `TrainingSession` model.
- Confirmed that the query is scoped to one user.
- Confirmed that the ordering returns the earliest date and lowest identifier
  when dates are equal.
- No evaluator integration test was run because the streak service has not yet
  been implemented.

## Architectural Impact

The streak service can discover its initial evaluation boundary without
accessing Prisma directly. Database access remains encapsulated in the
repository layer.

## Related Commit

Pending

---

# 2026-07-23 — Functional Rules and Streak Persistence Consolidation

## Objective

Consolidate the accepted training-session, weekly-goal, and streak rules before
continuing schema and evaluator implementation.

## Motivation

Design discussion had mixed settled decisions with alternative proposals. A
single functional source of truth was required to prevent goal-change timing,
session deletion, and historical streak evaluation from being implemented
inconsistently.

## Changes

- Established the GYMX Functional Specification as the authoritative source for
  rule status.
- Settled that the first weekly goal takes effect immediately.
- Settled that later goal changes take effect on the following Monday.
- Settled that the newest pending goal change replaces any earlier pending
  value.
- Required a weekly goal before training-session registration in both the
  frontend and backend.
- Settled that every evaluated completed week persists one immutable Boolean
  `goal_reached` outcome.
- Rejected historical duplication of target and session-count values in the
  weekly result.
- Added `WeeklyGoalResult` and pending-goal state to the database design and
  ERD.
- Aligned the Project Specification, Domain Analysis, System Architecture, API
  Specification, Deployment Guide, and TODO with the same rules.

## Challenges Encountered

The main challenge was preserving the distinction between product behaviour and
technical implementation. Concurrency remains unresolved as an evaluator
design decision, while the functional invariant that each week affects the
streak exactly once remains mandatory.

The weekly outcome also had to remain minimal without losing correctness.
Completed-week sessions are immutable, so a stored Boolean is sufficient and
does not require historical target or session-count duplication.

## Validation

- Searched all updated documents for stale unresolved versions of WG-05,
  WG-07, and ST-09.
- Checked that the ERD cardinality permits one weekly result per user and week.
- Checked that pending-goal fields appear consistently in the functional,
  database, API, and deployment documentation.
- Checked that session creation is documented as requiring a weekly goal in
  both frontend and backend rules.
- No application tests were run because this milestone changes design
  documentation, not runtime behaviour.

## Architectural Impact

The persistence model now distinguishes:

- current streak aggregate state in `TrainingStreak`;
- active and pending target state in `WeeklyGoal`;
- immutable completed-week outcomes in `WeeklyGoalResult`.

This prevents later goal changes from reinterpreting finalized weeks and keeps
the streak aligned with the user’s weekly commitment.

## Related Commit

Pending
```
