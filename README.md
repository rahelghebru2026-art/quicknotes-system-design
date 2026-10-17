# QuickNotes System Design

## Project description

QuickNotes is a learning project demonstrating how a browser client communicates with a REST API and how a production notes service could be designed for one million users.

The client uses JSONPlaceholder to demonstrate GET, POST, and DELETE operations. The documentation describes the proposed production API, relational database model, and scalable architecture.

## Project structure

```text
quicknotes-system-design/
├── index.html
├── style.css
├── api.js
├── README.md
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## How to run the client

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the Live Server extension.
4. Click **Load notes** to fetch ten sample posts.
5. Enter a title and optional body, then click **Create note**.
6. Click **Delete** beside a note to remove it from the current display.

An internet connection is required for JSONPlaceholder.

**Demo limitation:** JSONPlaceholder simulates creating and deleting posts. New posts and deletions are not permanently stored by the service. This client updates its displayed list after successful responses, but it is not connected to a persistent QuickNotes backend.

## Design documents

* [API Design](docs/api-design.md)
* [Data Model](docs/data-model.md)
* [Architecture](docs/architecture.md)

## What I learned

* How to send GET, POST, and DELETE requests using JavaScript `fetch`.
* How to handle HTTP errors and show loading, success, error, and empty states.
* Why user-provided content should be displayed with `textContent`.
* How REST endpoints use HTTP methods and status codes.
* How relational tables, primary keys, foreign keys, and JOIN queries work.
* How load estimates influence caching, database replication, and horizontal scaling.

## Future improvements

* Replace JSONPlaceholder with a persistent backend.
* Add authentication and authorization.
* Implement note search, pagination, and tags.
* Add automated tests and production monitoring.
