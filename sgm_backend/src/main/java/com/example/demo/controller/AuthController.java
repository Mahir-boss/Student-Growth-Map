package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String id = credentials.getOrDefault("id", credentials.get("username"));
        String password = credentials.getOrDefault("password", "");

        if (id == null || id.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "User ID is required"));
        }

        Optional<User> userOpt = userRepository.findById(id.trim());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        // Ensure user has platform access (your custom boolean field)
        if (!user.isHasAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access Revoked by Teacher"));
        }

        // In production, use BCryptPasswordEncoder. For now, matching plain text:
        if ((user.getPassword() != null && user.getPassword().equals(password)) || (user.getPassword() == null && password.isEmpty())) {
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(Map.of(
                "token", token != null ? token : "",
                "userId", user.getId(),
                "role", user.getType() != null ? user.getType() : "STUDENT"
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
    }
}