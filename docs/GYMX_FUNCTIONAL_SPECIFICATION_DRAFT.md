# GYMX Functional Specification

**Document status:** Draft for review  
**Version:** 0.3  
**Last updated:** 23 July 2026  
**Purpose:** Authoritative source for GYMX functional behaviour and business rules

---

## 1. How to use this specification

This document defines what GYMX must do. It does not prescribe controllers,
services, repositories, Prisma queries, frontend components, or other
implementation details unless a technical constraint is necessary to preserve a
functional rule.

Every rule has an identifier and a status:

| Status | Meaning |
|---|---|
| **Settled** | Accepted behaviour. Safe to design and implement. |
| **Proposed** | A possible solution that has been discussed but not accepted. |
| **Unresolved** | A decision is still required. Do not implement assumptions around it. |
| **Deferred** | Accepted direction, but intentionally planned for a later milestone. |

If a conversation conflicts with a settled rule in this document, the conflict
must be resolved explicitly and recorded in the decision history before the
implementation changes.

---

## 2. Product purpose and scope

### PR-01 — Product purpose

**Status: Settled**

GYMX is a full-stack training-consistency application. It helps a user register
training sessions, set a weekly training target, view weekly progress, and
maintain a training streak.

The application is a portfolio project created by adapting and connecting
earlier frontend and backend projects. Its documentation should communicate
engineering decisions clearly to future employers and collaborators.

### PR-02 — Current functional scope

**Status: Settled**

The current product scope includes:

- user registration, login, and authenticated access;
- training-session registration and retrieval;
- a weekly training goal;
- current-week progress;
- a training streak;
- a user preference for showing or hiding the streak;
- gym occupancy derived from an external or simulated data source.

### PR-03 — Scope control

**Status: Settled**

Features discussed during development are not requirements until they are marked
**Settled** in this specification.

---

## 3. Terminology

| Term | Definition |
|---|---|
| **Training session** | A registered occurrence of training belonging to one user. |
| **Check-in** | The user action that registers a training session. |
| **Current week** | The active Monday-to-Sunday calendar week. |
| **Completed week** | A Monday-to-Sunday week for which Sunday has ended. |
| **Weekly goal** | The number of training sessions the user aims to complete in a week. |
| **Successful week** | A completed week in which the applicable weekly goal was reached. |
| **Training streak** | The number of consecutive completed successful weeks. |
| **Lazy evaluation** | Processing completed but unevaluated weeks when the streak is requested, instead of using a scheduled background job. |
| **Undo last check-in** | Removal of the latest eligible session after an erroneous registration. |

---

## 4. Users and authentication

### AU-01 — Registration

**Status: Settled**

A person can register an account using an email address and password.

- The email address must be unique.
- The password must never be stored in plain text.
- A newly registered user starts with a training streak of `0`.
- The user’s initial streak record is created atomically with the user account.

### AU-02 — Login

**Status: Settled**

A registered user can authenticate using valid credentials. Successful
authentication returns the token or authentication state required to access
protected resources.

### AU-03 — Protected resources

**Status: Settled**

Training sessions, goals, progress, streak information, and user preferences are
available only to an authenticated user.

### AU-04 — Ownership

**Status: Settled**

A user can access or modify only resources belonging to that user. Ownership
must be enforced by the backend; frontend restrictions are not sufficient.

### AU-05 — Logout and persisted authentication

**Status: Settled**

- The frontend supports logout by removing its stored authentication state.
- Authentication should persist across a browser refresh until the user logs
  out or the authentication token becomes invalid.
- Unauthenticated users attempting to access protected frontend routes are
  redirected to login.

---

## 5. Calendar, date, and timezone rules

### DT-01 — Week boundary

**Status: Settled**

A GYMX training week begins on Monday at `00:00:00.000` and ends on Sunday at
`23:59:59.999`.

### DT-02 — Completed-week boundary

**Status: Settled**

A week becomes completed and eligible for streak evaluation when the following
Monday begins.

### DT-03 — Current week

**Status: Settled**

The current incomplete week can show progress, but it cannot yet increment or
break the training streak.

### DT-04 — Application timezone

**Status: Unresolved**

All week calculations must use one explicit application timezone policy.

The current utilities calculate Monday-to-Sunday boundaries in the backend
runtime’s local timezone. Before production deployment, choose and document one
of the following:

1. one fixed application timezone;
2. a timezone stored per user;
3. another explicit policy.

The production timezone must not be allowed to change accidentally with the
hosting environment.

### DT-05 — Date-only storage and comparison

**Status: Settled**

Calendar dates that represent a training day or week start must preserve their
intended local calendar date when stored, returned, formatted, and compared.
A UTC representation that appears to show the previous date is not itself an
error when it represents the correct local midnight.

---

## 6. Training sessions

### TS-01 — Register a session

**Status: Settled**

An authenticated user can register a training session only after creating a
weekly goal. The backend assigns the session to the authenticated user.

- The frontend disables check-in while no weekly goal exists.
- The frontend displays: “Please set a weekly target before registering a
  training session.”
- The backend rejects session creation when the authenticated user has no
  weekly goal; the frontend restriction is not the enforcement boundary.

### TS-02 — No historical check-ins

**Status: Settled**

Sessions are registered in real time. A user cannot backdate a new session into
an earlier day or completed week.

### TS-03 — Retrieve sessions

**Status: Settled**

An authenticated user can retrieve:

- all sessions belonging to that user;
- sessions belonging to the current week;
- one session by identifier, provided it belongs to that user.

### TS-04 — Session ordering

**Status: Settled**

Session lists are returned in a deterministic order. The current repository
returns the newest session first. Where equal dates are possible, an identifier
may be used as the tie-breaker.

### TS-05 — Arbitrary deletion

**Status: Deferred**

The existing arbitrary session-deletion behaviour will be replaced by
**Undo last check-in**. Completed-week sessions will not remain generally
deletable.

Until the replacement is implemented, existing deletion behaviour is legacy
behaviour and must not be used as the basis for new streak rules.

---

## 7. Undo last check-in

### UN-01 — Purpose

**Status: Deferred**

Undo exists to correct an immediately noticed erroneous check-in. It is not a
general-purpose history editor.

### UN-02 — Eligible session

**Status: Settled design, deferred implementation**

Only the latest eligible session belonging to the authenticated user may be
undone.

### UN-03 — Current-week restriction

**Status: Settled design, deferred implementation**

The eligible session must belong to the current incomplete week. A session from
a completed week cannot be undone.

### UN-04 — Completed-week immutability

**Status: Settled design, deferred implementation**

Sessions belonging to completed weeks are immutable. Consequently, a finalized
weekly streak result does not need to be recalculated because of session
removal.

### UN-05 — Meaning of “immediately”

**Status: Unresolved**

The project has settled that undo is for the latest current-week check-in, but
has not yet settled whether there is also a time limit such as a fixed number of
minutes after registration.

Do not add a time limit unless this rule is explicitly resolved.

---

## 8. Weekly goals

### WG-01 — Goal range

**Status: Settled**

The weekly target is an integer from `1` through `7`, inclusive.

### WG-02 — One current goal per user

**Status: Settled**

A user has at most one current weekly-goal record.

### WG-03 — Create and retrieve goal

**Status: Settled**

An authenticated user can create a weekly goal if none exists and retrieve the
goal belonging to that user.

The first weekly goal takes effect immediately. Creating it enables training
session registration.

### WG-04 — Change goal

**Status: Settled**

An authenticated user can change that user’s weekly target to another valid
value.

### WG-05 — Effective moment of a goal change

**Status: Settled**

The first weekly goal takes effect immediately. A later target change does not
alter the current week’s commitment and takes effect at the start of the
following Monday.

- The current week continues to use the active target.
- The requested value is stored as the pending target.
- The interface displays: “Your new target will take effect on Monday. Your
  current weekly target remains [X] sessions.”
- The completed week is finalized using the target that remained active during
  that week before the pending target is activated.

This prevents a user from lowering the target late in the week merely to
preserve a streak and keeps the streak aligned with GYMX’s habit-formation
purpose.

### WG-06 — Multiple changes before activation

**Status: Settled**

If the user changes a pending target again before it becomes active, the newest
valid value replaces the earlier pending value. Only the most recently selected
target takes effect on Monday.

### WG-07 — No goal

**Status: Settled**

- Current-week progress cannot be calculated without a weekly goal and uses the
  established not-found behaviour.
- A training session cannot be registered before the first weekly goal exists.
- The restriction is enforced in both the frontend and backend.

Consequently, a valid training session always has an applicable weekly target,
and no pre-goal session history needs to be interpreted by streak evaluation.

### WG-08 — Pending-target activation

**Status: Settled**

When a request on or after the effective Monday requires goal-dependent state,
the backend:

1. finalizes every completed unevaluated week that still used the old target;
2. persists each weekly Boolean outcome;
3. activates the pending target;
4. clears the pending target and effective date.

The target is functionally effective from Monday even when this catch-up work is
performed lazily on the first relevant request after Monday.

---

## 9. Weekly progress

### WP-01 — Current-week calculation

**Status: Settled**

Current-week progress is calculated from:

- the authenticated user’s weekly target;
- the number of that user’s sessions in the current Monday-to-Sunday week.

### WP-02 — Progress values

**Status: Settled**

The progress response must communicate the current session count, the target,
and enough information for the frontend to display progress toward the goal.

Progress may exceed the target when the user trains more often than required.
The frontend must not incorrectly discard sessions completed beyond the target.

### WP-03 — Missing goal

**Status: Settled**

If no weekly goal exists, current-week progress uses the established `404`
not-found behaviour.

---

## 10. Training streak

### ST-01 — Meaning of a streak

**Status: Settled**

The training streak is the number of consecutive completed calendar weeks in
which the user reached the weekly training goal applicable to each week.

### ST-02 — Successful week

**Status: Settled**

A completed week is successful when:

```text
number of registered sessions >= target applicable to that week
```

### ST-03 — Chronological evaluation

**Status: Settled**

Completed weeks are evaluated in chronological order.

- A successful week increments the current streak by `1`.
- An unsuccessful week resets the current streak to `0`.
- After a reset, the next successful completed week begins a new streak at `1`.

### ST-04 — Current week exclusion

**Status: Settled**

The current incomplete week cannot increment or reset the persisted streak.

### ST-05 — First eligible week

**Status: Settled**

- Weeks before the user’s earliest registered training session are ignored.
- The first eligible week is the Monday-to-Sunday week containing that first
  session.
- If the user has never registered a session, the streak remains `0`.

### ST-06 — Lazy catch-up

**Status: Settled**

Whenever the streak is requested, the service processes every completed but
unevaluated eligible week in chronological order before returning the persisted
result.

No scheduled background job is required for routine streak evaluation.

### ST-07 — Persisted streak state

**Status: Settled**

The current aggregate streak state contains:

- `current_streak`;
- `last_evaluated_week`.

`last_evaluated_week` identifies the Monday of the most recently evaluated
week.

### ST-08 — Initial streak state

**Status: Settled**

Every new user receives a streak record with:

```text
current_streak = 0
last_evaluated_week = null
```

The user and initial streak are created atomically.

### ST-09 — Weekly Boolean result

**Status: Settled**

Persist one final Boolean result for each evaluated week:

```text
user_id
week_start
goal_reached
```

The uniqueness rule is one result per `(user_id, week_start)`.

The streak calculation needs only the chronological Boolean sequence:

```text
true  -> increment
false -> reset to 0
```

Because completed-week sessions are immutable, a finalized Boolean result does
not require recalculation after an undo.

Before a pending target becomes active, the preceding week is finalized using
the old active target. Later streak processing reads the persisted Boolean and
does not reinterpret that week using a newer target.

### ST-10 — Historical target and session count

**Status: Settled rejection**

Do not persist `target_sessions` or `session_count` with a finalized weekly
result in the current design.

For streak calculation, these values are relevant only while producing
`goal_reached`. The stored historical outcome is intentionally minimal.

### ST-11 — Display preference

**Status: Settled**

`show_streak` is a presentation preference only.

- Hiding the streak does not pause it.
- Hiding the streak does not reset it.
- Streak calculation continues independently of whether it is displayed.

### ST-12 — Concurrency and atomicity

**Status: Unresolved technical rule**

Two requests must not evaluate the same week twice or produce an inconsistent
streak. The implementation requires an explicit concurrency strategy and
transaction boundary before the evaluator is considered production-ready.

This is a technical design decision, but the functional invariant is settled:
each eligible week affects the streak exactly once.

---

## 11. Representative streak scenarios

### SC-01 — Basic continuation and reset

**Status: Settled**

| Week | Target | Sessions | Successful | Resulting streak |
|---|---:|---:|---|---:|
| Week 1 | 3 | 3 | Yes | 1 |
| Week 2 | 3 | 4 | Yes | 2 |
| Week 3 | 3 | 1 | No | 0 |
| Week 4 | 3 | 0 | No | 0 |
| Week 5 | 3 | 3 | Yes | 1 |

### SC-02 — Current week not finalized

**Status: Settled**

If the persisted streak is `2` and the user has already reached the goal during
the current week, the returned completed-week streak remains `2` until the week
ends and becomes eligible for evaluation.

### SC-03 — First session

**Status: Settled**

If the user’s first-ever session occurs on a Wednesday:

- weeks before that Monday are ignored;
- that Monday-to-Sunday week becomes the first eligible week;
- it is evaluated only after the week has completed.

### SC-04 — Long inactivity

**Status: Settled**

If the application is not accessed for several weeks, the next streak request
processes all completed unevaluated weeks in order. An unsuccessful or empty
eligible week resets the streak to `0`.

### SC-05 — Goal change during the current week

**Status: Settled**

Example:

```text
Thursday
current target: 3
sessions: 2
requested new target: 4
```

Current progress remains `2 of 3`. The requested target of `4` is stored as the
pending target and takes effect on the following Monday. If the user selects
another valid value before then, that newer value replaces `4`.

### SC-06 — Goal required before first check-in

**Status: Settled**

If a newly registered user has not yet created a weekly goal:

- the check-in control is disabled;
- the interface asks the user to set a weekly target;
- a direct session-creation API request is rejected.

After the first goal is created, it takes effect immediately and check-in
becomes available.

### SC-07 — Undo

**Status: Settled design, deferred implementation**

If the user accidentally registers the latest session during the current week,
the user may undo that check-in. A session from a completed week cannot be
removed.

---

## 12. Occupancy

### OC-01 — Derived information

**Status: Settled**

Gym occupancy is derived information, not a user-owned core domain entity in the
GYMX ERD.

### OC-02 — Data source

**Status: Deferred**

Occupancy will use an external integration or a simulated external dataset. The
exact source, update frequency, and fallback behaviour must be specified before
implementation.

### OC-03 — User-facing meaning

**Status: Unresolved**

The scale and labels used to communicate occupancy—such as percentage, quiet,
moderate, or busy—still require a settled contract.

---

## 13. Visibility and presentation

### UI-01 — Business logic independence

**Status: Settled**

Frontend visibility does not determine backend business state. Hiding an
element, disabling a button, or protecting a route in the frontend does not
replace backend validation and authorization.

### UI-02 — Streak visibility

**Status: Settled**

The user may choose whether the streak is shown. The preference does not change
the calculated streak.

### UI-03 — Feedback after actions

**Status: Settled principle**

The interface should give clear confirmation after meaningful actions such as
registering a session, changing a goal, undoing a check-in, logging in, or
logging out.

Exact wording belongs in the relevant feature rule when behaviour depends on
that wording.

---

## 14. API behaviour

### API-01 — Existing endpoint baseline

**Status: Settled**

The established backend baseline contains:

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/sessions
GET    /api/sessions
GET    /api/sessions/:id
DELETE /api/sessions/:id          legacy; to become undo behaviour

GET    /api/weekly-goal
POST   /api/weekly-goal
PATCH  /api/weekly-goal

GET    /api/progress/current-week
```

### API-02 — Streak endpoint

**Status: Settled direction; contract unresolved**

GYMX will expose an authenticated endpoint that returns the user’s streak after
lazy catch-up evaluation. The working route is:

```text
GET /api/streak
```

The exact response body and error contract must be recorded before controller
implementation.

### API-03 — Streak visibility update

**Status: Proposed**

A user endpoint or preference endpoint may update `show_streak`. The exact
route and response contract are not yet settled.

### API-04 — Error handling

**Status: Settled**

The backend uses controlled errors and stable error codes. It must not expose
internal implementation details in ordinary API error responses.

### API-05 — Successful session removal

**Status: Settled legacy behaviour**

The existing delete endpoint returns `204 No Content` after successful removal.
The final undo endpoint contract must be reconsidered when arbitrary deletion is
replaced.

---

## 15. Persistence rules

### DB-01 — User relationships

**Status: Settled**

A user may own:

- multiple training sessions;
- at most one weekly goal;
- one training streak;
- multiple weekly goal results, with at most one result per calendar week.

### DB-02 — Cascading ownership cleanup

**Status: Settled**

User-owned dependent data should not remain orphaned if its owning user is
removed.

### DB-03 — Session lookup

**Status: Settled**

The data model supports efficient lookup of a user’s sessions by date.

### DB-04 — Streak result model

**Status: Settled**

Add a weekly result related to the user with a composite primary key on:

```text
(user_id, week_start)
```

The result stores only `goal_reached` in addition to its identifying fields.
It does not store the historical target or session count.

### DB-05 — Pending goal fields

**Status: Settled**

The weekly goal distinguishes:

- `target_sessions`: the target currently in effect;
- `pending_target_sessions`: the target requested for the next week, or `null`;
- `pending_effective_date`: the Monday on which the pending target becomes
  effective, or `null`.

When the pending target becomes active, it replaces `target_sessions` and both
pending fields are cleared.

---

## 16. Deferred work

The following work is accepted as future work but is not part of the current
streak-evaluator milestone:

- replace arbitrary session deletion with Undo last check-in;
- add the frontend authentication flow and protected routes;
- replace hardcoded backend URLs with shared environment-based API
  configuration;
- connect frontend sessions, weekly goal, progress, and streak views to the real
  backend;
- add occupancy using an external or simulated data source;
- publish an OpenAPI specification;
- implement the streak visibility control if retained;
- add deployment configuration for the combined application.

Deferred does not mean optional. Each item still requires its own reviewed
functional rules before implementation.

---

## 17. Unresolved decisions

These decisions currently block part of the design:

| ID | Decision | Blocks |
|---|---|---|
| DT-04 | Which timezone policy defines calendar weeks in production? | Reliable deployment and date behaviour |
| UN-05 | Does undo have a time limit in addition to latest/current-week restrictions? | Final undo API contract |
| ST-12 | What transaction/concurrency strategy guarantees exactly-once evaluation? | Production-safe evaluator |
| OC-03 | How is occupancy represented to users? | Occupancy API and UI |
| API-02 | What is the exact streak response and error contract? | Controller and frontend integration |

### Recommended decision order

1. ST-12 — concurrency and transaction boundary.
2. API-02 — streak response contract.
3. DT-04 — production timezone policy.

---

## 18. Decision history

### DH-01 — PostgreSQL migration

**Status: Completed**

The backend database was migrated from SQL Server to PostgreSQL. The migrated
backend passed the existing regression collection.

### DH-02 — Atomic streak creation

**Status: Settled and implemented**

The initial training streak is created through the nested user creation rather
than a separate service call, preserving the invariant that every new user has a
streak.

### DH-03 — First eligible streak week

**Status: Settled**

The first eligible week is based on the earliest registered session, rather
than the registration date or goal-creation date.

### DH-04 — Lazy evaluation

**Status: Settled**

Streak catch-up occurs when requested rather than through a background
scheduler.

### DH-05 — Completed-week session immutability

**Status: Settled design**

Arbitrary deletion is being replaced by Undo last check-in. Only the latest
eligible current-week session may be undone; completed-week sessions are
immutable.

### DH-06 — Historical weekly result discussion

**Status: Settled**

A minimal Boolean outcome is persisted for every evaluated completed week. The
result contains `user_id`, `week_start`, and `goal_reached`. Historical target
and session-count values are not stored.

### DH-07 — Goal-change timing discussion

**Status: Settled**

The first target takes effect immediately. Later target changes take effect on
the following Monday, and the newest pending value replaces any earlier pending
change. This preserves the weekly target as a commitment rather than allowing a
late target reduction to rescue a streak.

### DH-08 — Goal required before check-in

**Status: Settled**

The frontend disables check-in until a first weekly goal exists, and the backend
enforces the same prerequisite. Sessions before a first goal therefore cannot
exist through valid application behaviour.

---

## 19. Review checklist

During review, confirm:

- [ ] Every rule marked **Settled** reflects an actual accepted decision.
- [ ] No discussed idea has accidentally been promoted to **Settled**.
- [ ] The session and Undo rules match the intended user experience.
- [x] The first-session and no-goal interaction is made explicit.
- [x] One option is selected for WG-05.
- [x] ST-09 is accepted.
- [ ] The production timezone policy is explicit.
- [ ] The streak API response is specified before implementation resumes.
- [ ] Accepted decisions are added to the decision history.

---

## 20. Immediate implementation hold

The functional and persistence decisions required for the next schema revision
are settled:

```text
WG-05  Later goal changes take effect on the following Monday
WG-07  A goal is required before session registration
ST-09  Persist one immutable Boolean outcome per evaluated week
```

Schema work may resume. ST-12 remains a required technical design decision
before the evaluator is considered complete, but it does not block modelling
the settled entities and fields.
