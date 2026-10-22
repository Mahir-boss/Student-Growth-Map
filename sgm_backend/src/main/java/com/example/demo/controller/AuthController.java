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
    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(@RequestBody Map<String, String> request) {
        String id = request.get("id");
        String password = request.get("password");
        
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(password);
            userRepository.save(user); // Commits the new password to Aiven
            return ResponseEntity.ok(Map.of("message", "Password saved"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
    }

    @DeleteMapping("/delete-student/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id); // Permanently removes the user
            return ResponseEntity.ok(Map.of("message", "Student deleted"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
    }
    @PostMapping("/save-progress")
    public ResponseEntity<?> saveProgress(@RequestBody Map<String, Object> request) {
        String id = (String) request.get("id");
        String targetRole = (String) request.get("targetRole");
        
        // Safely extract the list of skills sent from React
        Object skillsObj = request.get("userSkills");
        java.util.Set<String> skillsSet = new java.util.HashSet<>();
        if (skillsObj instanceof java.util.List) {
            skillsSet.addAll((java.util.List<String>) skillsObj);
        }
        
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setTargetRole(targetRole);
            
            // FIXED: Hibernate requires you to clear and add to managed collections!
            if (user.getUserSkills() == null) {
                user.setUserSkills(new java.util.HashSet<>());
            }
            user.getUserSkills().clear();
            user.getUserSkills().addAll(skillsSet);
            
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Progress saved"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
    }

    @GetMapping("/get-progress/{id}")
    public ResponseEntity<?> getProgress(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                "targetRole", user.getTargetRole() == null ? "" : user.getTargetRole(),
                "userSkills", user.getUserSkills() // Spring Boot will automatically convert this Set to a JSON array for React
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
    }
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        java.util.List<User> students = userRepository.findAll().stream()
            .filter(u -> "STUDENT".equalsIgnoreCase(u.getType()))
            .collect(java.util.stream.Collectors.toList());
            
        java.util.List<Map<String, Object>> response = students.stream().map(s -> Map.of(
            "id", s.getId(),
            "hasAccess", s.isHasAccess(),
            "password", s.getPassword() != null ? "set" : "not-set", // FIXED: Map.of strictly forbids null values
            "targetRole", s.getTargetRole() == null ? "" : s.getTargetRole(),
            "userSkills", s.getUserSkills() != null ? s.getUserSkills() : new java.util.HashSet<>()
        )).collect(java.util.stream.Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    @PostMapping("/toggle-access")
    public ResponseEntity<?> toggleAccess(@RequestBody Map<String, String> request) {
        String id = request.get("id");
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setHasAccess(!user.isHasAccess());
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Access updated successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
    }
}