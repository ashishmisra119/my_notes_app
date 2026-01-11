import React, { useState } from "react";
import type { Note } from "../type";

interface NoteEditorProps {
  initial?: Partial<Note>;
  onSave: (note: Omit<Note, "id"> | Note) => void;
  onCancel?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  initial = {},
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initial.title ?? "");
  const [content, setContent] = useState(initial.content ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (initial.id != null) {
      onSave({ id: initial.id, title: title.trim(), content: content.trim() });
    } else {
      onSave({ title: title.trim(), content: content.trim() });
    }
    setTitle("");
    setContent("");
  }

  return (
    <form className="note-editor" onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="note-editor-actions">
        <button type="submit" className="save-button">
          Save
        </button>
        {onCancel && (
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default NoteEditor;
