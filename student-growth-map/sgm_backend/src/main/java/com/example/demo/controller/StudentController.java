package com.example.demo
.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final UserRepository userRepository;
    private final ProgressService progressService;

    @GetMapping
    public List<User> getAllStudents() {
        return userRepository.findByType("STUDENT");
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getStudent(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/target")
    public ResponseEntity<User> setTargetRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        String roleId = body.get("targetRole");
        return ResponseEntity.ok(progressService.updateTargetRole(id, roleId));
    }

    @PostMapping("/{id}/skills/{skillId}")
    public ResponseEntity<Set<String>> toggleSkill(@PathVariable String id, @PathVariable String skillId) {
        return ResponseEntity.ok(progressService.toggleSkill(id, skillId));
    }

    @PostMapping("/{id}/toggle-access")
    public ResponseEntity<User> toggleAccess(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        user.setHasAccess(!user.isHasAccess());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/create-token")
    public ResponseEntity<User> createStudentToken(@RequestBody Map<String, String> body) {
        String newId = body.get("id");
        if (userRepository.existsById(newId)) {
            return ResponseEntity.badRequest().build();
        }
        User newUser = new User(newId, null, "STUDENT", true, "", new HashSet<>());
        return ResponseEntity.ok(userRepository.save(newUser));
    }
}