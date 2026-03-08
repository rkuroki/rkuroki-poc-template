# Setup Home Interfaces

**Objective:** Build the `/home` core routing and standard user views.

**Steps:**
1. Create `app/home/page.tsx`.
2. Read the server session to retrieve the logged-in user's identity.
3. If the user is `admin`, render a component containing navigational links to `/home/users`, `/home/pageurls`, and `/home/notes`.
4. If the user is not `admin`, fetch their notes via `getNotesByUserId(userId)`.
5. Render a simple component for the standard user providing a text `<input>` and a `<button>Adicionar</button>` to create a note, executing a Server Action to append the note natively.
6. Underneath the input, render a neat table iterating over the fetched notes showing their text and order.
