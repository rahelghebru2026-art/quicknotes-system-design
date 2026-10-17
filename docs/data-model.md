# QuickNotes Data Model

## 1. Database choice

QuickNotes will use PostgreSQL, a relational SQL database. Users, notes, and tags have clear relationships, and foreign keys help maintain data integrity.

## 2. Entities and columns

### Users

| Column        | Type         | Key/constraint   |
| ------------- | ------------ | ---------------- |
| id            | BIGINT       | Primary key      |
| name          | VARCHAR(100) | NOT NULL         |
| email         | VARCHAR(254) | UNIQUE, NOT NULL |
| password_hash | TEXT         | NOT NULL         |
| created_at    | TIMESTAMPTZ  | NOT NULL         |

### Notes

| Column     | Type         | Key/constraint          |
| ---------- | ------------ | ----------------------- |
| id         | BIGINT       | Primary key             |
| user_id    | BIGINT       | Foreign key to users.id |
| title      | VARCHAR(100) | NOT NULL                |
| body       | TEXT         | NOT NULL                |
| created_at | TIMESTAMPTZ  | NOT NULL                |
| updated_at | TIMESTAMPTZ  | NOT NULL                |

### Tags

| Column     | Type        | Key/constraint          |
| ---------- | ----------- | ----------------------- |
| id         | BIGINT      | Primary key             |
| user_id    | BIGINT      | Foreign key to users.id |
| name       | VARCHAR(50) | NOT NULL                |
| created_at | TIMESTAMPTZ | NOT NULL                |

A unique constraint on `(user_id, name)` prevents a user from creating duplicate tag names.

### Note_tags

| Column     | Type        | Key/constraint          |
| ---------- | ----------- | ----------------------- |
| note_id    | BIGINT      | Foreign key to notes.id |
| tag_id     | BIGINT      | Foreign key to tags.id  |
| created_at | TIMESTAMPTZ | NOT NULL                |

The composite primary key is `(note_id, tag_id)`.

## 3. Relationships

* Users to notes: one-to-many. One user can own many notes.
* Users to tags: one-to-many. One user can create many tags.
* Notes to tags: many-to-many. A note can have many tags, and a tag can belong to many notes.
* `note_tags` is the junction table implementing the many-to-many relationship.

## 4. CREATE TABLE statements

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
    note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (note_id, tag_id)
);

## 5. Example SQL queries

### Query 1: List a user's notes

SELECT id, title, body, created_at
FROM notes
WHERE user_id = 7
ORDER BY created_at DESC
LIMIT 20;

### Query 2: Retrieve notes and their tags using JOIN

SELECT n.title, t.name AS tag_name
FROM notes n
JOIN note_tags nt ON nt.note_id = n.id
JOIN tags t ON t.id = nt.tag_id
WHERE n.user_id = 7
ORDER BY n.title;

### Query 3: Count notes per user

SELECT u.id, u.name, COUNT(n.id) AS total_notes
FROM users u
LEFT JOIN notes n ON n.user_id = u.id
GROUP BY u.id, u.name
ORDER BY total_notes DESC;

### Query 4: Create a note

INSERT INTO notes (user_id, title, body)
VALUES (7, 'Meeting notes', 'Prepare the project update.')
RETURNING id, title, body, created_at;

## 6. Indexes

CREATE INDEX idx_notes_user_created
ON notes (user_id, created_at DESC);

This index speeds up the common operation of retrieving a user's notes ordered by creation time.

The unique constraints on user email and per-user tag names also create indexes.

## 7. SQL versus NoSQL

SQL is the preferred choice because QuickNotes contains related entities and requires reliable relationships between users, notes, and tags. Foreign keys, transactions, unique constraints, and joins help protect data integrity. A NoSQL database could support flexible note documents, but it would require more application-level work to maintain these relationships.
