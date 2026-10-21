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
@CrossOrigin(originPatterns = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

   @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String id = credentials.getOrDefault("id", credentials.get("username"));
        String password = credentials.getOrDefault("password", "");
        String loginType = credentials.getOrDefault("loginType", "student"); // Get the portal type

        if (id == null || id.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "User ID is required"));
        }

        Optional<User> userOpt = userRepository.findById(id.trim());

        // AUTO-REGISTRATION MAGIC
        if (userOpt.isEmpty()) {
            if ("teacher".equalsIgnoreCase(loginType) && "admin".equalsIgnoreCase(id.trim())) {
                // 1. Auto-create the Admin account on first login
                User adminUser = new User();
                adminUser.setId("admin");
                adminUser.setPassword("admin");
                adminUser.setHasAccess(true);
                adminUser.setType("ADMIN");
                userRepository.save(adminUser);
                userOpt = Optional.of(adminUser);
            } 
            else if ("individual".equalsIgnoreCase(loginType)) {
                // 2. Auto-register a new Individual user
                User newUser = new User();
                newUser.setId(id.trim());
                newUser.setPassword(password);
                newUser.setHasAccess(true);
                newUser.setType("INDIVIDUAL");
                userRepository.save(newUser);
                userOpt = Optional.of(newUser);
            } 
            else {
                // 3. Normal Students must be pre-registered by a teacher
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
            }
        }

        User user = userOpt.get();

        if (!user.isHasAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access Revoked by Teacher"));
        }

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