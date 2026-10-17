# QuickNotes REST API Design

## Endpoints Overview

1. **List Notes**
   - **Method:** `GET`
   - **Path:** `/api/v1/notes`
   - **Description:** Retrieves a paginated list of notes for the authenticated user. Supports query parameters for filtering by tag or search term.
   - **Success Status:** `200 OK`

2. **Create Note**
   - **Method:** `POST`
   - **Path:** `/api/v1/notes`
   - **Description:** Creates a new note associated with the authenticated user.
   - **Success Status:** `201 Created`

3. **Get Single Note**
   - **Method:** `GET`
   - **Path:** `/api/v1/notes/{id}`
   - **Description:** Retrieves a specific note by its unique identifier.
   - **Success Status:** `200 OK`

4. **Update Note**
   - **Method:** `PUT` (or `PATCH`)
   - **Path:** `/api/v1/notes/{id}`
   - **Description:** Updates the title, body, or tags of an existing note.
   - **Success Status:** `200 OK`

5. **Delete Note**
   - **Method:** `DELETE`
   - **Path:** `/api/v1/notes/{id}`
   - **Description:** Permanently deletes a specific note.
   - **Success Status:** `204 No Content`

6. **List Note Tags**
   - **Method:** `GET`
   - **Path:** `/api/v1/notes/{id}/tags`
   - **Description:** Retrieves all tags associated with a specific note.
   - **Success Status:** `200 OK`

---

## JSON Examples

### Creating a Note (`POST /api/v1/notes`)
**Request Body:**
```json
{
  "title": "System Design Notes",
  "body": "Remember to review database normalization and indexing strategies before deployment.",
  "tags": ["backend", "study"]
}