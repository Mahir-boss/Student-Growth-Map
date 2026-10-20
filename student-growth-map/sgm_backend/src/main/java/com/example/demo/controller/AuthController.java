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
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String id = credentials.get("id");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        User user = userOpt.get();

        // Ensure user has platform access (your custom boolean field)
        if (!user.isHasAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Revoked by Teacher");
        }

        // In production, use BCryptPasswordEncoder. For now, matching plain text:
        if (password.equals(user.getPassword()) || (user.getPassword() == null && password.isEmpty())) {
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(Map.of(
                "token", token,
                "userId", user.getId(),
                "role", user.getType()
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}