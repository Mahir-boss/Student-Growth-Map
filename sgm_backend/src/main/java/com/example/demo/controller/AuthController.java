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
                User adminUser = new User();
                adminUser.setId("admin");
                adminUser.setPassword("admin");
                adminUser.setHasAccess(true);
                adminUser.setType("ADMIN");
                userRepository.save(adminUser);
                userOpt = Optional.of(adminUser);
            } 
            else if ("individual".equalsIgnoreCase(loginType)) {
                User newUser = new User();
                newUser.setId(id.trim());
                newUser.setPassword(password);
                newUser.setHasAccess(true);
                newUser.setType("INDIVIDUAL");
                userRepository.save(newUser);
                userOpt = Optional.of(newUser);
            } 
            else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
            }
        }

        User user = userOpt.get();
        // --- NEW: AUTO-REPAIR ADMIN ROLE ---
        if ("admin".equalsIgnoreCase(user.getId()) && !"ADMIN".equalsIgnoreCase(user.getType())) {
            user.setType("ADMIN");
            userRepository.save(user); // Automatically fixes the database for you!
        }
        // -----------------------------------

        if (!user.isHasAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access Revoked"));
        }

        // --- NEW: PORTAL RESTRICTION LOGIC ---
        String actualRole = user.getType() != null ? user.getType().toUpperCase() : "STUDENT";
        
        if ("teacher".equalsIgnoreCase(loginType) && !"ADMIN".equals(actualRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only teachers can use this portal"));
        } 
        else if ("student".equalsIgnoreCase(loginType) && !"STUDENT".equals(actualRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only students can use this portal"));
        } 
        else if ("individual".equalsIgnoreCase(loginType) && !"INDIVIDUAL".equals(actualRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only individual users can use this portal"));
        }
        // --------------------------------------

        // Final Password Check
        if ((user.getPassword() != null && user.getPassword().equals(password)) || (user.getPassword() == null && password.isEmpty())) {
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(Map.of(
                "token", token != null ? token : "",
                "userId", user.getId(),
                "role", actualRole
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
    }
    @PostMapping("/register-student")
    public ResponseEntity<?> registerStudent(@RequestBody Map<String, String> request) {
        String studentId = request.get("id");
        
        if (studentId == null || studentId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Student ID is required"));
        }
        
        // Check if student already exists
        if (userRepository.findById(studentId.trim()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Student ID already exists"));
        }

        // Create the student in the database (password is null by default for first-time login)
        User student = new User();
        student.setId(studentId.trim());
        student.setPassword(null);
        student.setHasAccess(true);
        student.setType("STUDENT");
        
        userRepository.save(student);
        
        return ResponseEntity.ok(Map.of("message", "Student created successfully"));
    }
}