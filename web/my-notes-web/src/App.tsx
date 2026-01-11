import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import type { Note } from "./type";
import { useNotes } from "./hooks/useNotes";

function App() {
  // track user state (simple local state for demo)
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem("my_notes_app_user")
  );

  // 1. Use the custom hook instead of manual state
  const { notes, isLoading, error, addNote, updateNote, deleteNote } =
    useNotes();
  const [editing, setEditing] = useState<Note | null>(null);

  // 2. Create simple wrappers to handle UI logic (like closing the editor)
  const handleAdd = async (payload: Omit<Note, "id">) => {
    await addNote(payload);
    setEditing(null);
  };

  const handleUpdate = async (updated: Note) => {
    await updateNote(updated);
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this note?")) return;
    await deleteNote(id);
  };

  if (!userEmail) {
    return (
      <div className="app-root">
        <Login onLogin={(email) => setUserEmail(email)} />
      </div>
    );
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>My Notes</h1>
        <div>
          <span className="app-user">Signed in as {userEmail}</span>
          <button className="signout-button" onClick={() => setUserEmail(null)}>
            Sign out
          </button>
        </div>
      </header>
      <main>
        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        )}

        {/* Toggle between Edit and Create modes */}
        {editing ? (
          <section className="editor-section">
            <h2>Edit note</h2>
            <NoteEditor
              key={`edit-${editing.id}`}
              initial={editing}
              onSave={(n) => handleUpdate(n as Note)}
              onCancel={() => setEditing(null)}
            />
          </section>
        ) : (
          <section className="editor-section">
            <h2>Create a note</h2>
            <NoteEditor
              key="create"
              onSave={(n) => handleAdd(n as Omit<Note, "id">)}
            />
          </section>
        )}

        <section className="notes-section">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <NotesList
              notes={notes}
              onEdit={(note) => setEditing(note)}
              onDelete={(id) => handleDelete(id)}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
