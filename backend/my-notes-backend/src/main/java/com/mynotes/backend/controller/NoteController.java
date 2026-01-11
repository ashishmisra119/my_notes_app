package com.mynotes.backend.controller;

import com.mynotes.backend.model.Note;
import com.mynotes.backend.model.User;
import com.mynotes.backend.repository.NoteRepository;
import com.mynotes.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = {"http://localhost:5173", "https://your-production-domain.com"}) // adjust for prod
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes(Principal principal) {
        User u = userRepository.findByUsername(principal.getName()).orElse(null);
        if (u == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(noteRepository.findByUser(u));
    }

    @PostMapping
    public ResponseEntity<Note> createNote(Principal principal, @RequestBody Note note) {
        User u = userRepository.findByUsername(principal.getName()).orElse(null);
        if (u == null) return ResponseEntity.status(401).build();
        note.setUser(u);
        Note saved = noteRepository.save(note);
        return ResponseEntity.created(URI.create("/api/notes/" + saved.getId())).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(Principal principal, @PathVariable Long id) {
        User u = userRepository.findByUsername(principal.getName()).orElse(null);
        if (u == null) return ResponseEntity.status(401).build();
        return noteRepository.findById(id)
                .filter(note -> note.getUser() != null && note.getUser().getId().equals(u.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(Principal principal, @PathVariable Long id, @RequestBody Note noteDetails) {
        User u = userRepository.findByUsername(principal.getName()).orElse(null);
        if (u == null) return ResponseEntity.status(401).build();
        return noteRepository.findById(id)
                .filter(note -> note.getUser() != null && note.getUser().getId().equals(u.getId()))
                .map(note -> {
                    note.setTitle(noteDetails.getTitle());
                    note.setContent(noteDetails.getContent());
                    Note updated = noteRepository.save(note);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(Principal principal, @PathVariable Long id) {
        User u = userRepository.findByUsername(principal.getName()).orElse(null);
        if (u == null) return ResponseEntity.status(401).build();
        return noteRepository.findById(id)
                .filter(note -> note.getUser() != null && note.getUser().getId().equals(u.getId()))
                .map(note -> {
                    noteRepository.deleteById(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
