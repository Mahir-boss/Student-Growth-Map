package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        // Ensure standard admin credentials exist
        if (!userRepository.existsById("admin")) {
            userRepository.save(new User("admin", "admin", "TEACHER", true, null, new HashSet<>()));
        }

        // Seed initial default student if not present
        if (!userRepository.existsById("STU-101")) {
            userRepository.save(new User("STU-101", null, "STUDENT", true, "R01", new HashSet<>()));
        }
    }
}