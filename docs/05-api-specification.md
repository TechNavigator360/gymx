# GYMX API Specification

## 1. Purpose

This document defines the REST API exposed by GYMX. The API serves as the communication layer between the frontend web application and the backend services.

The existing backend endpoints are preserved. New endpoints are added for training streaks, user preferences, and gym occupancy.

The API is responsible for:

- registering and authenticating users;
- retrieving the authenticated user;
- managing training sessions;
- managing weekly goals;
- calculating weekly progress;
- retrieving the current training streak;
- managing user preferences;
- retrieving current gym occupancy information.

---

## OpenAPI Specification

In addition to this document, a machine-readable OpenAPI specification is provided to describe the GYMX REST API.

The OpenAPI specification serves as the authoritative technical definition of the API, including endpoint definitions, request and response schemas, authentication requirements, and HTTP status codes. It enables interactive documentation, client generation, and API validation while ensuring consistency between the implementation and its documentation.

Location:

![OpenAPI specification](api/openapi.yaml)

---

## 2. API Principles

The GYMX API follows these principles:

- RESTful, resource-oriented design;
- JSON request and response bodies;
- stateless communication;
- JWT Bearer authentication for protected endpoints;
- HTTPS in deployed environments;
- consistent HTTP status codes;
- consistent error responses;
- ownership checks for user-specific resources.

---

## 3. Base URL

### Development

```text
http://localhost:3000/api
```

### Production

The production base URL is configured during deployment and documented in the Deployment Guide.

---

## 4. Authentication

Protected endpoints require a valid JWT Bearer token.

```http
Authorization: Bearer <token>
```

The following endpoints are public:

- `POST /api/auth/register`
- `POST /api/auth/login`

All other endpoints are protected.

Logout is handled by removing the stored JWT from the client. Because the API uses stateless JWT authentication and does not maintain server-side sessions, no logout endpoint is required.

---

## 5. Endpoint Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve the authenticated user |
| POST | `/api/sessions` | Register a training session |
| GET | `/api/sessions` | Retrieve training sessions |
| GET | `/api/sessions/{id}` | Retrieve a specific training session |
| DELETE | `/api/sessions/{id}` | Delete a training session |
| GET | `/api/weekly-goal` | Retrieve the user's weekly goal |
| POST | `/api/weekly-goal` | Create a weekly goal |
| PATCH | `/api/weekly-goal` | Update a weekly goal |
| GET | `/api/progress/current-week` | Retrieve progress for the current week |
| GET | `/api/streak` | Retrieve the current training streak |
| GET | `/api/preferences` | Retrieve user preferences |
| PATCH | `/api/preferences` | Update user preferences |
| GET | `/api/occupancy` | Retrieve current gym occupancy |

---

# 6. Authentication Endpoints

## 6.1 Register User

### `POST /api/auth/register`

Creates a new user account.

### Request

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Response

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1003,
    "email": "user@example.com"
  }
}
```

### Status Codes

| Status | Description |
|---|---|
| `201 Created` | User successfully created |
| `400 Bad Request` | Validation failed |
| `409 Conflict` | Email address already exists |

---

## 6.2 Authenticate User

### `POST /api/auth/login`

Authenticates a registered user and returns a JWT.

### Request

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Response

```json
{
  "token": "<jwt-token>",
  "user": {
    "id": 1003,
    "email": "user@example.com"
  }
}
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | Authentication successful |
| `400 Bad Request` | Validation failed |
| `401 Unauthorized` | Invalid credentials |

---

## 6.3 Retrieve Current User

### `GET /api/auth/me`

Returns the authenticated user.

### Headers

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "id": 1003,
  "email": "user@example.com",
  "show_streak": true
}
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | User returned |
| `401 Unauthorized` | Authentication required |

---

# 7. Training Session Endpoints

## 7.1 Register Training Session

### `POST /api/sessions`

Registers a completed training session for the authenticated user. The user
must already have an active weekly goal.

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request

```json
{
  "date": "2026-07-18"
}
```

### Response

```json
{
  "id": 1027,
  "user_id": 1003,
  "date": "2026-07-18T00:00:00.000Z"
}
```

### Status Codes

| Status | Description |
|---|---|
| `201 Created` | Training session created |
| `400 Bad Request` | Invalid date or request body |
| `401 Unauthorized` | Authentication required |
| `409 Conflict` | A weekly goal must be configured before session registration |

---

## 7.2 Retrieve Training Sessions

### `GET /api/sessions`

Returns training sessions belonging to the authenticated user.

### Headers

```http
Authorization: Bearer <token>
```

### Query Parameters

| Parameter | Required | Description |
|---|---|---|
| `week` | No | Use `current` to retrieve sessions from the current calendar week |

### Example Request

```http
GET /api/sessions?week=current
```

### Response

```json
[
  {
    "id": 10,
    "user_id": 1003,
    "date": "2026-07-18"
  }
]
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | Training sessions returned |
| `401 Unauthorized` | Authentication required |

---

## 7.3 Retrieve Training Session

### `GET /api/sessions/{id}`

Returns a specific training session belonging to the authenticated user.

### Headers

```http
Authorization: Bearer <token>
```

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | Integer | Training session identifier |

### Response

```json
{
  "id": 10,
  "user_id": 1003,
  "date": "2026-07-18"
}
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | Training session returned |
| `401 Unauthorized` | Authentication required |
| `403 Forbidden` | Training session belongs to another user |
| `404 Not Found` | Training session not found |

---

## 7.4 Delete Training Session

### `DELETE /api/sessions/{id}`

Legacy contract for deleting a training session belonging to the authenticated
user. This endpoint will be narrowed to Undo last check-in: only the latest
eligible session from the current incomplete week may be removed. Sessions from
completed weeks are immutable.

### Headers

```http
Authorization: Bearer <token>
```

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | Integer | Training session identifier |

### Status Codes

| Status | Description |
|---|---|
| `204 No Content` | Training session deleted |
| `401 Unauthorized` | Authentication required |
| `403 Forbidden` | Training session belongs to another user |
| `404 Not Found` | Training session not found |
| `409 Conflict` | Session is not eligible for undo |

---

# 8. Weekly Goal Endpoints

## 8.1 Retrieve Weekly Goal

### `GET /api/weekly-goal`

Returns the weekly goal belonging to the authenticated user.

### Headers

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "user_id": 1003,
  "target_sessions": 3,
  "pending_target_sessions": null,
  "pending_effective_date": null
}
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | Weekly goal returned |
| `401 Unauthorized` | Authentication required |
| `404 Not Found` | No weekly goal configured |

---

## 8.2 Create Weekly Goal

### `POST /api/weekly-goal`

Creates the first weekly goal for the authenticated user. The first goal takes
effect immediately and enables training session registration.

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request

```json
{
  "target_sessions": 3
}
```

### Response

```json
{
  "user_id": 1003,
  "target_sessions": 3,
  "pending_target_sessions": null,
  "pending_effective_date": null
}
```

### Status Codes

| Status | Description |
|---|---|
| `201 Created` | Weekly goal created |
| `400 Bad Request` | Validation failed |
| `401 Unauthorized` | Authentication required |
| `409 Conflict` | Weekly goal already exists |

---

## 8.3 Update Weekly Goal

### `PATCH /api/weekly-goal`

Requests a new weekly target for the authenticated user. The current target
remains active for the current week. The requested value becomes effective on
the following Monday. A later PATCH before activation replaces the earlier
pending value.

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request

```json
{
  "target_sessions": 5
}
```

### Response

```json
{
  "user_id": 1003,
  "target_sessions": 3,
  "pending_target_sessions": 5,
  "pending_effective_date": "2026-07-27"
}
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | Weekly goal updated |
| `400 Bad Request` | Validation failed |
| `401 Unauthorized` | Authentication required |
| `404 Not Found` | Weekly goal not found |

---

# 9. Progress Endpoint

## 9.1 Retrieve Current-Week Progress

### `GET /api/progress/current-week`

Returns the authenticated user's progress for the current calendar week.

Progress is calculated from the user's weekly goal and training sessions registered between Monday and Sunday of the current week.

### Headers

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "completedSessions": 2,
  "weeklyGoal": 3,
  "remainingSessions": 1,
  "weekStart": "2026-07-13",
  "weekEnd": "2026-07-19"
}
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | Progress returned |
| `401 Unauthorized` | Authentication required |
| `404 Not Found` | Weekly goal not configured |

---

# 10. Training Streak Endpoint

## 10.1 Retrieve Training Streak

### `GET /api/streak`

Returns the authenticated user's current training streak.

The streak is maintained internally by the backend based on consecutive completed calendar weeks in which the user's configured weekly goal was achieved. Before returning, the backend lazily finalizes completed unevaluated weeks in chronological order. Each finalized week stores one immutable reached/not-reached outcome and affects the streak exactly once.

### Headers

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "current_streak": 8
}
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | Training streak returned |
| `401 Unauthorized` | Authentication required |
| `404 Not Found` | Training streak not initialised |

The training streak cannot be modified directly through the API.

---

# 11. User Preference Endpoints

## 11.1 Retrieve User Preferences

### `GET /api/preferences`

Returns the application preferences belonging to the authenticated user.

### Headers

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "show_streak": true
}
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | Preferences returned |
| `401 Unauthorized` | Authentication required |

---

## 11.2 Update User Preferences

### `PATCH /api/preferences`

Updates application preferences belonging to the authenticated user.

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request

```json
{
  "show_streak": false
}
```

### Response

```json
{
  "show_streak": false
}
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | Preferences updated |
| `400 Bad Request` | Validation failed |
| `401 Unauthorized` | Authentication required |

---

# 12. Occupancy Endpoint

## 12.1 Retrieve Current Gym Occupancy

### `GET /api/occupancy`

Returns the current occupancy information obtained from the simulated external Access Control System.

### Headers

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "status": "moderate",
  "last_updated": "2026-07-18T14:25:00Z"
}
```

### Status Codes

| Status | Description |
|---|---|
| `200 OK` | Occupancy returned |
| `401 Unauthorized` | Authentication required |
| `503 Service Unavailable` | Occupancy information unavailable |

---

# 13. Validation Rules

| Resource | Rule |
|---|---|
| User | Email address is required and must be unique |
| User | Password is required |
| Training Session | Date must be a valid ISO 8601 date |
| Training Session | User must have an active weekly goal before registration |
| Weekly Goal | `target_sessions` must be an integer between 1 and 7 |
| Weekly Goal | Only one weekly goal may exist per user |
| User Preferences | `show_streak` must be a Boolean value |

---

# 14. Authorization Rules

Authenticated users may only access and modify their own resources.

This applies to:

- user profile information;
- training sessions;
- weekly goals;
- weekly progress;
- training streaks;
- user preferences.

Requests attempting to access another user's protected resource return `403 Forbidden`.

---

# 15. Error Handling

The API uses standard HTTP status codes.

| Status Code | Description |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created |
| `204 No Content` | Resource deleted |
| `400 Bad Request` | Invalid request |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Access denied |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Resource already exists |
| `500 Internal Server Error` | Unexpected server error |
| `503 Service Unavailable` | External occupancy service unavailable |

Error responses use a consistent JSON structure.

```json
{
  "code": "VALIDATION_ERROR",
  "message": "The supplied request is invalid."
}
```

---

# 16. Resource and Response Models

## User

```json
{
  "id": 1003,
  "email": "user@example.com",
  "show_streak": true
}
```

## Training Session

```json
{
  "id": 10,
  "user_id": 1003,
  "date": "2026-07-18"
}
```

## Weekly Goal

```json
{
  "user_id": 1003,
  "target_sessions": 3,
  "pending_target_sessions": 5,
  "pending_effective_date": "2026-07-27"
}
```

## Progress

```json
{
  "completedSessions": 2,
  "weeklyGoal": 3,
  "remainingSessions": 1,
  "weekStart": "2026-07-13",
  "weekEnd": "2026-07-19"
}
```

Progress is a calculated response model and is not persisted as a database entity.

## Training Streak

```json
{
  "current_streak": 8
}
```

## User Preferences

```json
{
  "show_streak": true
}
```

## Occupancy

```json
{
  "status": "moderate",
  "last_updated": "2026-07-18T14:25:00Z"
}
```

---

# 17. Versioning

The current API represents Version 1 of the GYMX backend.

Future breaking changes should be introduced through URI versioning.

```text
/api/v2/...
```

---

# 18. Traceability

The API specification is directly traceable to the preceding project documentation.

- The exposed resources originate from the Domain Analysis.
- Endpoint responsibilities align with the System Architecture.
- Persistent resources correspond to the Database Design.
- Authentication and authorization rules follow the Project Specification.
- Existing backend endpoints are preserved.
- New endpoints support training streaks, user preferences, and occupancy.
