const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const statusElement = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitBtn = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");

let notes = [];
let nextLocalId = -1;
let activeRequests = 0;

// JSONPlaceholder simulates POST and DELETE operations.
// New posts and deletions are not permanently saved by the API.
// We use temporary negative IDs for locally created notes.


// 1. REUSABLE REQUEST FUNCTION

async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.body
                ? { "Content-Type": "application/json" }
                : {}),
            ...options.headers
        }
    });

    // fetch() does not automatically throw for HTTP errors.
    // Check response.ok and throw if the request failed.
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = response.status === 204
        ? null
        : await response.json();

    return {
        data,
        status: response.status
    };
}


// 2. STATUS MESSAGE AND BUTTON HELPERS

function setStatus(message, type = "") {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`.trim();
}

function setBusy(isBusy) {
    loadBtn.disabled = isBusy;
    submitBtn.disabled = isBusy;

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.disabled = isBusy;
    });
}

function beginRequest(message) {
    activeRequests++;
    setBusy(true);
    setStatus(message, "loading");
}

function endRequest() {
    activeRequests = Math.max(0, activeRequests - 1);
    setBusy(activeRequests > 0);
}


// 3. DISPLAY NOTES SAFELY

function renderNotes() {
    notesList.replaceChildren();

    // Show an empty state when there are no notes.
    if (notes.length === 0) {
        const emptyItem = document.createElement("li");

        emptyItem.className = "empty";
        emptyItem.textContent =
            "No notes found. Load notes or create a note.";

        notesList.appendChild(emptyItem);
        return;
    }

    notes.forEach(note => {
        const item = document.createElement("li");
        item.className = "note";

        const heading = document.createElement("h3");
        heading.textContent = note.title || "(Untitled note)";

        const body = document.createElement("p");
        body.textContent = note.body || "No body provided.";

        const actions = document.createElement("div");
        actions.className = "note-actions";

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.setAttribute(
            "aria-label",
            `Delete note: ${note.title || "Untitled note"}`
        );

        deleteButton.addEventListener("click", () => {
            deleteNote(note.id);
        });

        actions.appendChild(deleteButton);
        item.append(heading, body, actions);

        notesList.appendChild(item);
    });

    setBusy(activeRequests > 0);
}


// 4. GET: LOAD NOTES

async function loadNotes() {
    beginRequest("Loading notes...");

    try {
        const result = await request(`${API_URL}?_limit=10`);

        notes = result.data.map(post => ({
            id: post.id,
            title: post.title,
            body: post.body
        }));

        renderNotes();

        if (notes.length === 0) {
            setStatus("No notes were found.", "");
        } else {
            setStatus(
                `Loaded ${notes.length} notes from the server.`,
                "success"
            );
        }
    } catch (error) {
        console.error("Error loading notes:", error);

        setStatus(
            "Sorry, we could not load notes. Check your connection and try again.",
            "error"
        );
    } finally {
        endRequest();
    }
}


// 5. POST: CREATE A NOTE

async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validate the title before sending the request.
    if (!title) {
        setStatus("Please enter a title.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        setStatus(
            "The title must not exceed 100 characters.",
            "error"
        );

        titleInput.focus();
        return;
    }

    beginRequest("Creating note...");

    try {
        const result = await request(API_URL, {
            method: "POST",
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        // JSONPlaceholder simulates creating a post.
        // It does not permanently save the new post.
        // Use a temporary negative ID to track this note locally.
        const localNote = {
            id: nextLocalId--,
            title: result.data.title,
            body: result.data.body
        };

        notes.unshift(localNote);

        renderNotes();
        noteForm.reset();

        setStatus(
            `Note created (status ${result.status}, id ${result.data.id}). ` +
            "This demo API does not permanently save new notes.",
            "success"
        );
    } catch (error) {
        console.error("Error creating note:", error);

        setStatus(
            "Sorry, we could not create your note. Please try again.",
            "error"
        );
    } finally {
        endRequest();
    }
}


// 6. DELETE: REMOVE A NOTE

async function deleteNote(id) {
    beginRequest("Deleting note...");

    try {
        // IMPORTANT:
        // There is only ONE method property in this object.
        // JSONPlaceholder accepts DELETE but does not permanently
        // remove the post from its underlying dataset.
        const result = await request('${API_URL}/${id}', {
            method: "DELETE"
        });

        // Remove the note from our current page after success.
        notes = notes.filter(note => note.id !== id);

        renderNotes();

        setStatus(
            'Note removed from the current list (status ${result.status}).',
            "success"
        );
    } catch (error) {
        console.error("Error deleting note:", error);

        setStatus(
            "Sorry, we could not delete the note. Please try again.",
            "error"
        );
    } finally {
        endRequest();
    }
}


// 7. CONNECT THE BUTTONS AND FORM

loadBtn.addEventListener("click", loadNotes);

noteForm.addEventListener("submit", createNote);

// Display the empty state when the page first opens.
renderNotes();