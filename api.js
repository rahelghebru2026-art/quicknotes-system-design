const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// DOM Elements
const loadBtn = document.getElementById('load-btn');
const submitBtn = document.getElementById('submit-btn');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title-input');
const bodyInput = document.getElementById('body-input');
const notesList = document.getElementById('notes-list');
const statusP = document.getElementById('status');

// Status Helper Functions
function showStatus(message, type) {
    statusP.textContent = message;
    statusP.className = `status-${type}`;
}

function clearStatus() {
    statusP.textContent = '';
    statusP.className = 'status-hidden';
}

function setButtonsDisabled(disabled) {
    loadBtn.disabled = disabled;
    submitBtn.disabled = disabled;
    if (disabled) {
        loadBtn.classList.add('btn-loading');
        submitBtn.classList.add('btn-loading');
    } else {
        loadBtn.classList.remove('btn-loading');
        submitBtn.classList.remove('btn-loading');
    }
}

// Reusable async request function
async function request(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // If DELETE request or empty response body
        if (response.status === 204) {
            return null;
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// GET: Load 10 notes
async function loadNotes() {
    clearStatus();
    showStatus('Loading notes...', 'loading');
    setButtonsDisabled(true);

    try {
        // Fetch posts and slice to 10
        const posts = await request(`${API_URL}?_limit=10`);
        renderNotes(posts);
        showStatus('Notes loaded successfully!', 'success');
    } catch (error) {
        showStatus(`Failed to load notes: ${error.message}`, 'error');
    } finally {
        setButtonsDisabled(false);
    }
}

// POST: Create a note
async function createNote(title, body) {
    clearStatus();
    showStatus('Creating note...', 'loading');
    setButtonsDisabled(true);

    try {
        const newPost = {
            title: title,
            body: body,
            userId: 1
        };

        const result = await request(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(newPost)
        });

        appendNoteToDOM(result);
        showStatus('Note created successfully!', 'success');
        noteForm.reset();
    } catch (error) {
        showStatus(`Failed to create note: ${error.message}`, 'error');
    } finally {
        setButtonsDisabled(false);
    }
}

// DELETE: Remove a note
async function deleteNote(id, listItem) {
    clearStatus();
    showStatus('Deleting note...', 'loading');
    setButtonsDisabled(true);

    try {
        await request(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        listItem.remove();
        showStatus('Note deleted successfully!', 'success');
        
        // Check if list is empty
        if (notesList.children.length === 0) {
            showEmptyState();
        }
    } catch (error) {
        showStatus(`Failed to delete note: ${error.message}`, 'error');
    } finally {
        setButtonsDisabled(false);
    }
}

// Render Functions (using textContent only for user text)
function renderNotes(posts) {
    notesList.textContent = ''; // Clear list

    if (!posts || posts.length === 0) {
        showEmptyState();
        return;
    }

    posts.forEach(post => {
        appendNoteToDOM(post);
    });
}

function appendNoteToDOM(post) {
    // Remove empty state message if present
    const emptyMsg = document.getElementById('empty-state');
    if (emptyMsg) {
        emptyMsg.remove();
    }

    const li = document.createElement('li');
    li.className = 'note-item';
    li.dataset.id = post.id;

    const titleH3 = document.createElement('h3');
    titleH3.textContent = post.title;

    const bodyP = document.createElement('p');
    bodyP.textContent = post.body;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteNote(post.id, li));

    li.appendChild(titleH3);
    li.appendChild(bodyP);
    li.appendChild(deleteBtn);

    notesList.appendChild(li);
}

function showEmptyState() {
    notesList.textContent = '';
    const li = document.createElement('li');
    li.id = 'empty-state';
    li.textContent = 'No notes available. Click "Load Notes" or create a new note.';
    li.className = 'empty-notice';
    notesList.appendChild(li);
}

// Event Listeners
loadBtn.addEventListener('click', loadNotes);

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validation
    if (!title) {
        showStatus('Validation Error: Title is required.', 'error');
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        showStatus('Validation Error: Title must be 100 characters or less.', 'error');
        titleInput.focus();
        return;
    }

    createNote(title, body);
});

// Initial empty state check on load
showEmptyState();