# QuickNotes System Design & API Client

## Description
QuickNotes is a full-stack system design and client application that allows users to seamlessly create, view, and delete notes. Built as part of a comprehensive system design capstone, this project combines a robust RESTful API client with professional architecture and data modeling documentation.

---

## How to Run the API Client
Because this project utilizes ES modules and standard browser `fetch`, you can run the client locally using any static file server:
1. Clone or download this repository.
2. Open your terminal in the root project folder.
3. Run a local server (e.g., using Python or Node.js):
   - **Python 3:** `python3 -m http.server 8000`
   - **Node.js (npx):** `npx serve`
4. Open your web browser and navigate to `http://localhost:8000` (or the port provided by your server).
5. Interact with the app: click **"Load Notes"** to fetch posts from JSONPlaceholder, or fill out the form to create a new note.

---

## Documentation Links
- **API Design:** [`docs/api-design.md`](docs/api-design.md)
- **Data Model:** [`docs/data-model.md`](docs/data-model.md)
- **Architecture & Scaling Plan:** [`docs/architecture.md`](docs/architecture.md)

---

## What I Learned
1. **Robust Error Handling & State Management:** Implementing loading, success, error, and empty states alongside async/try-catch blocks taught me how to build resilient, user-friendly web interfaces that gracefully handle network failures.
2. **Security & XSS Prevention:** Adhering strictly to `textContent` rather than `innerHTML` when inserting user-generated text reinforced critical web security practices against Cross-Site Scripting (XSS) vulnerabilities.
3. **Scalable System Architecture:** Designing for 1 million users deepened my understanding of read-to-write ratio optimization, caching layers (Redis), read replicas, and asynchronous background worker queues.