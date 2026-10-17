# QuickNotes REST API Design

## 1. Overview

QuickNotes is a notes service where authenticated users can create, read, update, delete, and organize notes.

This document describes the proposed production API. The browser client uses JSONPlaceholder as a practice API; the endpoints below belong to the QuickNotes backend that the company plans to build.

Base URL:

'https://api.quicknotes.example.com/v1'

## 2. Endpoint table

| Method | Endpoint           | Description                         | Success status |
| ------ | ------------------ | ----------------------------------- | -------------- |
| GET    | `/notes`           | List the authenticated user's notes | 200 OK         |
| GET    | `/notes/{id}`      | Retrieve a single note              | 200 OK         |
| POST   | `/notes`           | Create a note                       | 201 Created    |
| PUT    | `/notes/{id}`      | Replace a note                      | 200 OK         |
| PATCH  | `/notes/{id}`      | Partially update a note             | 200 OK         |
| DELETE | `/notes/{id}`      | Delete a note                       | 204 No Content |
| GET    | `/tags`            | List the user's tags                | 200 OK         |
| POST   | `/notes/{id}/tags` | Associate a tag with a note         | 201 Created    |

All private note endpoints require authentication. The server must verify that the authenticated user owns the requested note.

## 3. Create a note

Request:

'POST /v1/notes'

{
  "title": "Meeting notes",
  "body": "Prepare the project update.",
  "tagIds": [2, 4]
}

Response: `201 Created`

{
  "id": 101,
  "userId": 7,
  "title": "Meeting notes",
  "body": "Prepare the project update.",
  "tags": [
    {"id": 2, "name": "work"},
    {"id": 4, "name": "important"}
  ],
  "createdAt": "2026-10-17T10:00:00Z",
  "updatedAt": "2026-10-17T10:00:00Z"
}

## 4. List notes

Request:

'GET /v1/notes?limit=20&offset=0'

Response: `200 OK`

{
  "items": [
    {
      "id": 101,
      "userId": 7,
      "title": "Meeting notes",
      "body": "Prepare the project update.",
      "tags": [{"id": 2, "name": "work"}],
      "createdAt": "2026-10-17T10:00:00Z",
      "updatedAt": "2026-10-17T10:00:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 1
  }
}

## 5. Error status codes

| Status                    | Meaning                                    |
| ------------------------- | ------------------------------------------ |
| 400 Bad Request           | Invalid input or malformed JSON            |
| 401 Unauthorized          | Missing or invalid authentication          |
| 403 Forbidden             | User is not allowed to access the resource |
| 404 Not Found             | Requested note or tag does not exist       |
| 409 Conflict              | Request conflicts with existing data       |
| 422 Unprocessable Content | Input fails validation                     |
| 429 Too Many Requests     | Rate limit exceeded                        |
| 500 Internal Server Error | Unexpected server-side error               |

Example error body:

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The title is required and must not exceed 100 characters.",
    "details": [
      {
        "field": "title",
        "issue": "required"
      }
    ],
    "requestId": "req-abc123"
  }
}

## 6. API conventions

* Use JSON for request and response bodies.
* Use HTTPS in production.
* Validate all incoming data on the server.
* Return consistent error structures.
* Use pagination for note lists.
* Never trust a client-supplied user ID for authorization.
* Return `201 Created` after successful creation.
* Return `204 No Content` after successful deletion.
* Do not expose passwords, secrets, or internal stack traces.
