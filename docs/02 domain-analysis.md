# GYMX Domain Analysis

## Purpose

This document captures the business domain of GYMX. It serves as the foundation for the application's architecture, database design, API design, and implementation.

Rather than focusing on technical details, this document describes the business concepts, terminology, relationships, events, and rules that define the system.

The model reflects the current GYMX architecture in which:

- GYMX is offered to members of a gym.
- Gym members use GYMX to track training consistency.
- Occupancy information is retrieved from the gym's external Access Control System.
- GYMX does not manage gyms as domain entities.

---

# 1. Ubiquitous Language

The following terminology shall be used consistently throughout the project.

| Term | Definition |
|---|---|
| User | A gym member who uses GYMX to monitor and improve training consistency. |
| Training Session | A completed gym visit registered by a User. |
| Weekly Goal | The target number of Training Sessions a User aims to complete during a Calendar Week. |
| Pending Weekly Goal | A requested replacement target that becomes active on the following Monday. |
| Weekly Goal Result | The immutable Boolean outcome recording whether a User reached the applicable Weekly Goal in one completed Calendar Week. |
| Progress | The current completion status of a User's Weekly Goal for the current Calendar Week. |
| Training Streak | The persisted number of consecutive completed Calendar Weeks in which a User achieved the applicable Weekly Goal. |
| Calendar Week | A Monday-to-Sunday period used to evaluate Weekly Goals, Progress, and Training Streaks. |
| Occupancy | The current estimated crowd level made available to GYMX through the external Access Control System. |
| Access Control System | An external software system that records gym access events and exposes the data required to determine Occupancy. |
| Dashboard | The User's central overview of current Progress, Training Streak, and Occupancy information. |

---

# 2. Domain Concepts

The following concepts have been identified within the GYMX domain.

| Concept | Category | Description |
|---|---|---|
| User | Entity | Represents a gym member and owns the member's training data. |
| Training Session | Entity | Represents a completed gym visit registered by a User. |
| Weekly Goal | Entity | Defines the number of Training Sessions a User aims to complete each Calendar Week. |
| Weekly Goal Result | Entity | Stores the final reached/not-reached outcome for one User and one completed Calendar Week. |
| Training Streak | Entity | Stores the current number of consecutive completed weeks in which the User achieved the applicable Weekly Goal. |
| Progress | Derived Concept | Calculated from the current Weekly Goal and the User's Training Sessions within the current Calendar Week. |
| Calendar Week | Value Object | Represents the Monday-to-Sunday period used in weekly calculations and evaluations. |
| Occupancy | Value Object | Represents the current crowd level retrieved from the external Access Control System. |
| Progress Calculation Service | Domain Service | Calculates current-week Progress from Training Sessions and the Weekly Goal. |
| Training Streak Evaluation Service | Domain Service | Evaluates a completed Calendar Week and updates the persisted Training Streak. |
| Occupancy Service | Application and Integration Service | Retrieves Occupancy information from the external Access Control System. |
| Access Control System | External Software System | Records gym access events and exposes the information required by GYMX to determine Occupancy. |

---

# 3. Domain Events

The following events represent meaningful occurrences within the GYMX domain.

- User Registered
- Weekly Goal Created
- Weekly Goal Updated
- Pending Weekly Goal Activated
- Training Session Registered
- Training Session Check-In Undone
- Calendar Week Completed
- Weekly Goal Result Finalized
- Training Streak Increased
- Training Streak Reset

Authentication events and occupancy retrieval events are operational or integration concerns and are therefore not treated as core domain events.

---

# 4. Business Rules

| ID | Rule |
|---|---|
| BR-001 | Every Training Session belongs to exactly one User. |
| BR-002 | A User may register multiple Training Sessions. |
| BR-003 | A User may have no more than one active Weekly Goal. |
| BR-004 | Progress is calculated from the number of Training Sessions completed during the current Calendar Week and the User's active Weekly Goal. |
| BR-005 | A User must have a Weekly Goal before registering a Training Session. |
| BR-006 | The first Weekly Goal takes effect immediately; a later change takes effect on the following Monday. |
| BR-007 | The newest pending goal change replaces any earlier pending change. |
| BR-008 | A Training Streak is evaluated only for a completed Calendar Week. |
| BR-009 | Each evaluated completed Calendar Week produces one immutable Boolean Weekly Goal Result. |
| BR-010 | A successful Weekly Goal Result increases the persisted Training Streak by one. |
| BR-011 | An unsuccessful Weekly Goal Result resets the persisted Training Streak to zero. |
| BR-012 | A completed Calendar Week may affect the Training Streak only once. |
| BR-013 | Only the latest eligible Training Session from the current Calendar Week may be undone. |
| BR-014 | Training Sessions from completed Calendar Weeks are immutable. |
| BR-015 | Occupancy information is read-only within GYMX and originates from the external Access Control System. |
| BR-016 | Users may only access and modify their own training data. |
| BR-017 | GYMX does not create, update, or manage gym records. |

---

# 5. Candidate Entities

The following concepts have their own identity and lifecycle.

- User
- Training Session
- Weekly Goal
- Weekly Goal Result
- Training Streak

## Entity Responsibilities

### User

The User represents a gym member using GYMX.

A User:

- owns Training Sessions;
- owns one active Weekly Goal at most;
- owns zero or more Weekly Goal Results;
- owns one current Training Streak;
- may only access and modify personal training data.

### Training Session

A Training Session represents a completed gym visit.

A Training Session:

- belongs to exactly one User;
- has a registration date;
- contributes to weekly Progress;
- may affect the outcome of a completed Calendar Week.

### Weekly Goal

A Weekly Goal represents the number of Training Sessions a User aims to complete during each Calendar Week.

A Weekly Goal:

- belongs to exactly one User;
- defines a target number of sessions;
- may contain a pending replacement target and its effective Monday;
- is used to calculate Progress;
- is used when evaluating a completed Calendar Week.

### Weekly Goal Result

A Weekly Goal Result represents the finalized outcome of one completed Calendar
Week for one User.

A Weekly Goal Result:

- belongs to exactly one User;
- is identified by the User and the Monday starting the evaluated week;
- stores only whether the applicable goal was reached;
- is immutable because completed-week Training Sessions are immutable;
- provides the chronological outcome consumed by Training Streak evaluation.

### Training Streak

A Training Streak represents persisted domain state for a User.

A Training Streak:

- belongs to exactly one User;
- stores the current number of consecutive successful Calendar Weeks;
- stores sufficient evaluation state to prevent the same Calendar Week from being processed more than once;
- increases when a completed Calendar Week is successful;
- resets when a completed Calendar Week is unsuccessful.

Persisting the Training Streak avoids repeatedly recalculating the complete streak from all historical Training Sessions whenever it is requested.

---

# 6. Candidate Value Objects

The following concepts do not require their own identity.

## Progress

Progress represents the current completion state of the Weekly Goal.

Possible values include:

- completed session count;
- target session count;
- remaining session count;
- completion percentage;
- goal-achieved status.

Progress is calculated on demand and is not stored as an independent entity.

## Calendar Week

Calendar Week represents a fixed Monday-to-Sunday period.

It may contain:

- start date;
- end date;
- calendar year;
- week number.

Calendar Week is used consistently when selecting Training Sessions, calculating Progress, and evaluating Training Streaks.

## Occupancy

Occupancy represents the current crowd level supplied through the Access Control System.

It may contain:

- current visitor count;
- capacity;
- occupancy percentage;
- crowd-level category;
- retrieval timestamp.

Occupancy has no lifecycle managed by GYMX and is treated as read-only information.

---

# 7. Candidate Services

## Domain Services

### Progress Calculation Service

Calculates a User's Progress for a given Calendar Week from:

- the applicable Weekly Goal;
- the Training Sessions registered within that Calendar Week.

### Training Streak Evaluation Service

Evaluates a completed Calendar Week and updates the persisted Training Streak.

The service is responsible for:

- determining whether the applicable Weekly Goal was achieved;
- persisting one final Weekly Goal Result per completed Calendar Week;
- increasing or resetting the Training Streak;
- ensuring that a Calendar Week is evaluated no more than once.

## Application and Integration Services

### Authentication Service

Handles:

- User registration;
- login;
- password verification;
- token generation;
- authorization of protected requests.

Authentication supports the domain but is not itself part of the training-consistency domain logic.

### Occupancy Service

Coordinates retrieval of Occupancy information from the external Access Control System.

### Access Control System Client

Handles the technical API communication between GYMX and the external Access Control System.

---

# 8. External System Boundary

The Access Control System is outside the GYMX software boundary.

GYMX:

- does not manage the Access Control System;
- does not manage gym access events;
- does not create or update Occupancy data;
- only retrieves the information required to present current Occupancy to Users.

The gym itself is not modeled as a GYMX entity because GYMX does not manage gym identity, gym configuration, or gym lifecycle within the current scope.

---

# 9. Domain Relationships

The current relationships between domain concepts are illustrated below.

```text
User
 │
 ├─────────────────┬─────────────────┐
 │                 │                 │
 ▼                 ▼                 ▼
TrainingSession  WeeklyGoal  WeeklyGoalResult  TrainingStreak
       │              │
       └───────┬──────┘
               ▼
            Progress


Access Control System
          │
          ▼
    Occupancy Service
          │
          ▼
       Occupancy
```

The first group represents application-owned domain data.

The second group represents an external integration used to provide current Occupancy information.

---

# 10. Aggregate Considerations

The current domain suggests User as the ownership boundary for personal training data.

Possible aggregate structure:

```text
User
 ├── Training Sessions
 ├── Weekly Goal
 ├── Weekly Goal Results
 └── Training Streak
```

This does not require all related data to be loaded or persisted together. It expresses that the User owns these concepts and that authorization rules are enforced through User ownership.

Further implementation analysis is required before final aggregate boundaries are fixed.

---

# 11. Open Questions

The following topics require further analysis before implementation.

- Can Users register multiple Training Sessions on the same day?
- Should Training Sessions include optional metadata such as duration or notes?
- What transaction and concurrency strategy guarantees that a completed week is finalized exactly once?
- Should Undo last check-in also have a fixed time limit?
- How frequently should Occupancy information be refreshed?
- What should GYMX display when the Access Control System is unavailable?
- How should stale Occupancy data be identified and presented?

---

# 12. Domain-Driven Development Principles

## Domain First

The business domain is the primary source of truth for the application. Architectural, database, API, and implementation decisions shall be derived from the domain rather than defining it.

## Model Before Code

New business concepts shall be added to the Domain Analysis before implementation begins. Their terminology, relationships, and business rules must be understood before database, API, or application changes are made.

## Single Source of Truth

The GYMX Functional Specification is the authoritative source for accepted
behaviour and rule status. This Domain Analysis defines the corresponding
business concepts and ubiquitous language. All technical documentation and
implementation should remain consistent with both documents.

## Evolving Model

The domain model is expected to evolve throughout the project. Changes are encouraged when they improve understanding of the business domain and remain consistent with the project's vision and architecture.

## Traceability

Major implementation changes should be traceable back to this document. Whenever a new business concept is introduced, the following order should be followed:

1. Update the Project Specification if the scope changes.
2. Update the Domain Analysis.
3. Update the System Architecture if required.
4. Update the Database Design if required.
5. Update the API Specification if required.
6. Implement the changes.
7. Update or create automated tests.
8. Deploy the changes.

---

# 13. Documentation-First Workflow

Every significant feature or architectural change shall follow the workflow below.

```text
Idea
    │
    ▼
Project Specification (if scope changes)
    │
    ▼
Domain Analysis
    │
    ▼
System Architecture
    │
    ▼
Database Design
    │
    ▼
API Specification
    │
    ▼
Implementation
    │
    ▼
Testing
    │
    ▼
Deployment
```

This workflow ensures that design decisions are deliberate, traceable, and documented before implementation begins. The codebase should implement a well-defined design rather than becoming the source of the design itself.
