### 5. `docs/data-model.md`

```markdown
# QuickNotes Data Model

## Entities and Columns

1. **`users`**
   - `user_id` (INTEGER, Primary Key, Auto-increment)
   - `username` (VARCHAR(50), NOT NULL, UNIQUE)
   - `email` (VARCHAR(100), NOT NULL, UNIQUE)
   - `created_at` (TIMESTAMP, NOT NULL)

2. **`notes`**
   - `note_id` (INTEGER, Primary Key, Auto-increment)
   - `user_id` (INTEGER, NOT NULL, Foreign Key referencing `users(user_id)`)
   - `title` (VARCHAR(100), NOT NULL)
   - `body` (TEXT)
   - `created_at` (TIMESTAMP, NOT NULL)
   - `updated_at` (TIMESTAMP, NOT NULL)

3. **`tags`**
- `tag_id` (INTEGER, Primary Key, Auto-increment)
   - `name` (VARCHAR(30), NOT NULL, UNIQUE)

4. **`note_tags` (Join Table)**
   - `note_id` (INTEGER, NOT NULL, Foreign Key referencing `notes(note_id)`)
   - `tag_id` (INTEGER, NOT NULL, Foreign Key referencing `tags(tag_id)`)
   - Primary Key: Composite `(note_id, tag_id)`

---

## Relationship Explanations
- **One-to-Many (`users` to `notes`):** A single user can create and own multiple notes, but each individual note belongs to exactly one user. Enforced by storing `user_id` as a foreign key in the `notes` table.
- **Many-to-Many (`notes` to `tags`):** A single note can have multiple tags (e.g., `#work`, `#urgent`), and a single tag can be applied to multiple different notes. Because relational databases cannot represent many-to-many relationships natively without redundancy, the junction table `note_tags` breaks this down into two clean one-to-many relationships.

---

## SQL Schema (`CREATE TABLE` Statements)

```sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    note_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE tags (
    tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(note_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);