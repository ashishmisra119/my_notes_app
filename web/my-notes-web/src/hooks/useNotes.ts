import { useState, useEffect } from "react";
import { noteService } from "../services/noteService";
import type { Note } from "../type";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotes() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await noteService.getNotes();
        setNotes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    }

    // Reload notes whenever user changes (simple localStorage trigger)
    function onStorage(e: StorageEvent) {
      if (e.key === "my_notes_app_token" || e.key === "my_notes_app_user") {
        loadNotes();
      }
    }

    loadNotes();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  async function addNote(payload: Omit<Note, "id">) {
    setError(null);
    try {
      const newNote = await noteService.createNote(payload);
      setNotes((prev) => [newNote, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Failed to create note");
    }
  }

  async function updateNote(updated: Note) {
    try {
      await noteService.updateNote(updated);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } catch (err) {
      console.error(err);
      setError("Failed to update note");
    }
  }

  async function deleteNote(id: number) {
    try {
      await noteService.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete note");
    }
  }

  return { notes, isLoading, error, addNote, updateNote, deleteNote };
}
