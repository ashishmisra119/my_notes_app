import React from "react";
import type { Note } from "../type";

interface NotesListProps {
  notes: Note[];
  onEdit?: (note: Note) => void;
  onDelete?: (id: number) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onEdit, onDelete }) => {
  return (
    <div>
      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            marginBottom: "8px",
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{note.title}</h3>
            <div>
              {onEdit && (
                <button className="edit-button" onClick={() => onEdit(note)}>
                  Edit
                </button>
              )}
              {onDelete && (
                <button className="delete-button" onClick={() => onDelete(note.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>

          <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
