# 1. Vision

GYMX is a full-stack web application that empowers people to build lasting training habits by making their consistency visible, measurable, and actionable. It combines personal progress tracking with contextual information, such as gym occupancy, to help users make informed training decisions and build sustainable fitness habits.

## Vision Principles

The application should:

- Encourage long-term consistency rather than short-term motivation.
- Reduce barriers to exercising.
- Present meaningful information rather than overwhelming users with data.
- Remain simple and intuitive to use.
- Provide reliable and trustworthy information.

---

# 2. Problem Statement

Many fitness applications focus primarily on recording workouts, calories, or body measurements. While these metrics are valuable, they often overlook one of the strongest predictors of long-term fitness success: consistency.

People frequently struggle to maintain a regular training routine because they:

- lose sight of their weekly progress;
- find it difficult to judge whether they are on track;
- encounter overcrowded gyms that reduce motivation;
- receive little meaningful feedback about their training habits.

As a result, many users stop exercising consistently despite having clear fitness goals.

GYMX addresses this problem by helping users understand their weekly training behaviour, monitor progress toward self-defined goals, and make informed decisions about when to visit the gym.

---

# 3. Goals

## Primary Goals

- Help users maintain consistent training habits.
- Provide a clear overview of weekly progress.
- Reduce uncertainty when planning gym visits.
- Minimise friction when registering training sessions.
- Deliver a responsive, reliable web application.

## Technical Goals

- Clean layered backend architecture.
- Secure authentication and authorization.
- Well-documented REST API.
- Automated testing.
- CI/CD pipeline.
- Cloud deployment.
- Maintainable and extensible codebase.

---

# 4. Scope

## In Scope (MVP)

### Authentication

The application shall provide secure user authentication through user registration, login, and logout functionality. Users must be able to create an account, authenticate using their credentials, and securely end their session.

### Training

Users shall be able to register completed training sessions with minimal effort after configuring a weekly goal. Users shall be able to remove the latest eligible incorrectly registered training session while the associated calendar week is still in progress. Training sessions belonging to completed weeks are immutable.

### Dashboard

The dashboard provides a centralized overview of the user's current training consistency. It displays the current week's progress, the configured weekly goal, completed training sessions, the current training streak, and the current gym occupancy.

### Settings

Users shall be able to configure their personal weekly training goal and choose whether their training streak is displayed within the application. The first weekly goal takes effect immediately. Later goal changes take effect on the following Monday so the current week's commitment cannot be changed retroactively.

### Occupancy

The application shall provide users with information about current gym occupancy using a simulated external data source. It shall display the occupancy status together with the timestamp supplied by the external Access Control System indicating when the occupancy information was last updated.

### Backend

The backend shall expose a secure REST API that serves as the single source of truth for the application. It shall use PostgreSQL as its relational database, Prisma ORM for data access, and JWT-based authentication and authorization to secure protected resources.

---

## Out of Scope (MVP)

The following functionality is explicitly excluded from the Minimum Viable Product:

- Workout planning
- Exercise library
- Nutrition tracking
- Wearable integrations
- Push notifications
- Social features
- Support for multiple gyms
- AI coaching

---

## Assumptions

The following assumptions apply to the current version of GYMX:

- Users train at a single gym.
- Each user manages their own account.
- Gym occupancy information is obtained from an external Access Control System through a REST API.
- During development, occupancy is simulated using a representative dataset.
- A training streak represents consecutive completed calendar weeks in which the user's configured weekly goal was achieved.
- Completed calendar weeks are evaluated only once for streak progression.
- Weekly progress is calculated using calendar weeks (Monday–Sunday).

---

# 5. Users

## Primary User

Individuals who regularly visit a gym and want to improve the consistency of their training routine. These users value a simple, distraction-free application that helps them understand their progress and make informed decisions about when to train.

## Secondary Users (Future)

Gym operators could eventually expose occupancy data through an API, allowing GYMX to provide real-time occupancy information.

---

# 6. Functional Requirements

## 6.1 Authentication

### FR-001 – Register User

**Priority:** Must Have

The system shall allow a new user to create an account using a unique email address and password.

---

### FR-002 – Authenticate User

**Priority:** Must Have

The system shall authenticate registered users and issue a secure JWT for subsequent authenticated requests.

---

### FR-003 – Logout User

**Priority:** Must Have

The system shall allow authenticated users to securely end their session.

---

### FR-004 – Retrieve Current User

**Priority:** Must Have

The system shall allow an authenticated user to retrieve their profile information.

---

## 6.2 Training Sessions

### FR-101 – Register Training Session

**Priority:** Must Have

The system shall allow an authenticated user to register a completed training session only after the user has configured a weekly training goal.

The frontend shall disable the check-in action while no goal exists, and the backend shall reject session creation without an active weekly goal.

---

### FR-102 – Delete Training Session

**Priority:** Must Have

The system shall allow users to undo only the latest eligible incorrectly registered training session belonging to the current calendar week. Training sessions from completed weeks shall not be removable.

---

### FR-103 – View Weekly Training Sessions

**Priority:** Must Have

The system shall allow users to retrieve all training sessions belonging to the current calendar week.

---

## 6.3 Weekly Goals

### FR-201 – View Weekly Goal

**Priority:** Must Have

The system shall allow users to retrieve their configured weekly training goal.

---

### FR-202 – Update Weekly Goal

**Priority:** Must Have

The system shall allow users to create and update their weekly training goal.

The first goal shall take effect immediately. A later change shall be stored as
pending and take effect on the following Monday. If the pending value is changed
again before Monday, the newest valid value shall replace it.

---

## 6.4 Progress

### FR-301 – View Weekly Progress

**Priority:** Must Have

The system shall calculate and present the authenticated user's progress toward the configured weekly training goal for the current calendar week.

---

## 6.5 Training Streak

### FR-401 – View Training Streak

**Priority:** Must Have

The system shall maintain the authenticated user's training streak based on consecutive completed calendar weeks (Monday–Sunday) in which the configured weekly goal was achieved.

Completed weeks shall be evaluated only once. The current incomplete week shall not increase or break the user's training streak.

---

### FR-402 – Toggle Training Streak Visibility

**Priority:** Must Have

The system shall allow users to choose whether their calculated training streak is displayed within the application. This preference shall not affect streak evaluation or progression.

---

## 6.6 Gym Occupancy

### FR-501 – View Current Gym Occupancy

**Priority:** Must Have

The system shall display the current occupancy status of the user's gym using data obtained from a simulated external Access Control System.

---

### FR-502 – View Occupancy Timestamp

**Priority:** Must Have

The system shall display the timestamp supplied by the external Access Control System indicating when the occupancy information was last updated.

---

## 6.7 User Preferences

### FR-601 – Manage User Preferences

**Priority:** Must Have

The system shall allow users to configure personal application preferences, including the visibility of their training streak.

---

# 6.8 Business Rules

### BR-001 – Calendar Week

A training week starts on Monday and ends on Sunday.

---

### BR-002 – Weekly Progress

Weekly progress is calculated using training sessions registered during the current calendar week.

---

### BR-003 – Goal Before Check-In

A user must have a weekly training goal before registering a training session.
This rule shall be enforced by both the frontend and backend.

---

### BR-004 – Goal Change Activation

The first weekly goal takes effect immediately. Later changes take effect on the
following Monday. The current week retains the target under which it began.

---

### BR-005 – Training Streak

A training streak represents consecutive completed calendar weeks in which the configured weekly goal was achieved.

---

### BR-006 – Streak Evaluation

Completed calendar weeks shall be evaluated only once.

---

### BR-007 – Weekly Goal Outcome

Each evaluated completed week shall persist one immutable Boolean outcome
indicating whether the applicable weekly goal was reached.

---

### BR-008 – Completed Weeks

Training sessions belonging to completed weeks shall be immutable.

---

### BR-009 – Training Streak Visibility

The user's visibility preference affects presentation only and shall not affect streak calculation or persistence.

---

# 7. Non-Functional Requirements

### NFR-001 – Performance

The application should provide a responsive user experience. Under normal operating conditions, API requests should complete within two seconds.

---

### NFR-002 – Availability

The application shall remain available to users during normal operation, except for scheduled maintenance or unexpected service interruptions.

---

### NFR-003 – Security

The application shall protect user data through secure authentication, authorization, password hashing, and encrypted communication.

---

### NFR-004 – Scalability

The backend architecture shall support future expansion without requiring significant redesign, including support for additional gym integrations, new features, and external systems.

---

### NFR-005 – Maintainability

The application shall follow a layered architecture with clear separation of concerns to promote readability, maintainability, and extensibility.

---

### NFR-006 – Reliability

The application shall preserve data integrity by validating user input, preventing unauthorized or inconsistent modifications, and enforcing business rules that maintain the correctness of persisted domain state.

---

### NFR-007 – Usability

The application shall provide a simple and intuitive user interface that minimizes the effort required to register training sessions and understand personal progress.

---

### NFR-008 – Portability

The application shall be deployable using containerization technologies and remain independent of a specific cloud provider.

---

### NFR-009 – Testability

The application shall support automated unit, integration, and end-to-end testing to ensure system quality throughout development.

---

# 8. Supporting Documentation

The following documents provide detailed technical information and evolve alongside the implementation:

- Functional Specification (`docs/GYMX_FUNCTIONAL_SPECIFICATION.md`)
- Domain Analysis (`docs/domain-analysis.md`)
- System Architecture (`docs/architecture.md`)
- Database Design (`docs/database.md`)
- API Specification (`docs/api-specification.md`)
- Deployment Guide (`docs/deployment.md`)
- Architecture Decision Records (`docs/adr/`)
- Product Roadmap (`docs/roadmap.md`)
