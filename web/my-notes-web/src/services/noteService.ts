import type { Note } from "../type";

const STORAGE_KEY = "my_notes_app_notes_v1";
const API_PREFIX = import.meta.env.VITE_BACKEND_URL
  ? `${(import.meta.env.VITE_BACKEND_URL as string).replace(
      /\/$/,
      ""
    )}/api/notes`
  : "/api/notes";
const TOKEN_KEY = "my_notes_app_token";

function authHeaders(): Record<string, string> | undefined {
  const t = localStorage.getItem(TOKEN_KEY);
  return t ? { Authorization: `Bearer ${t}` } : undefined;
}

export const noteService = {
  async getNotes(): Promise<Note[]> {
    try {
      const headers: Record<string, string> = authHeaders()
        ? { ...authHeaders() }
        : {};
      const res = await fetch(API_PREFIX, { headers });
      if (!res.ok) throw new Error(`GET /api/notes failed: ${res.status}`);
      return (await res.json()) as Note[];
    } catch (error) {
      console.warn("Backend unavailable — falling back to localStorage", error);
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Note[]) : [];
      } catch (err) {
        console.error("Failed to load notes from localStorage", err);
        return [];
      }
    }
  },

  async createNote(payload: Omit<Note, "id">): Promise<Note> {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(authHeaders() || {}),
      };
      const res = await fetch(API_PREFIX, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`POST /api/notes failed: ${res.status}`);
      return (await res.json()) as Note;
    } catch (error) {
      console.warn("Create failed — falling back to localStorage", error);
      const notes = await this.getNotes();
      const newNote = { ...payload, id: Date.now() } as Note;
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newNote, ...notes]));
      return newNote;
    }
  },

  async updateNote(updated: Note): Promise<Note> {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(authHeaders() || {}),
      };
      const res = await fetch(`${API_PREFIX}/${updated.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updated),
      });
      if (!res.ok)
        throw new Error(`PUT /api/notes/${updated.id} failed: ${res.status}`);
      return (await res.json()) as Note;
    } catch (error) {
      console.warn("Update failed — falling back to localStorage", error);
      const notes = await this.getNotes();
      const newNotes = notes.map((n) => (n.id === updated.id ? updated : n));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
      return updated;
    }
  },

  async deleteNote(id: number): Promise<void> {
    try {
      const headers: Record<string, string> = authHeaders()
        ? { ...authHeaders() }
        : {};
      const res = await fetch(`${API_PREFIX}/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok)
        throw new Error(`DELETE /api/notes/${id} failed: ${res.status}`);
    } catch (error) {
      console.warn("Delete failed — falling back to localStorage", error);
      const notes = await this.getNotes();
      const newNotes = notes.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
    }
  },
};
