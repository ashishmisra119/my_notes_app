package com.mynotes.backend.controller;

import com.mynotes.backend.model.User;
import com.mynotes.backend.repository.UserRepository;
import com.mynotes.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController { 

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (username == null || password == null) return ResponseEntity.badRequest().body(Map.of("error", "username and password required"));
        if (userRepository.findByUsername(username).isPresent()) return ResponseEntity.status(409).body(Map.of("error", "User exists"));
        User u = new User(username, passwordEncoder.encode(password));
        User saved = userRepository.save(u);
        Map<String, Object> resp = Map.of("id", saved.getId(), "username", saved.getUsername());
        return ResponseEntity.created(URI.create("/api/users/" + saved.getId())).body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (username == null || password == null) return ResponseEntity.badRequest().build();
        return userRepository.findByUsername(username)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .map(u -> ResponseEntity.ok(Map.of("token", jwtService.generateToken(u.getUsername()), "username", u.getUsername())))
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }
}
