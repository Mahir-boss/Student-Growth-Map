package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Column(name = "user_id", length = 50)
    private String id;

    private String password;

    @Column(nullable = false, length = 20)
    private String type; // TEACHER, STUDENT, INDIVIDUAL

    @Column(name = "has_access")
    private boolean hasAccess = true;

    @Column(name = "target_role_id", length = 50)
    private String targetRole;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_progress", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill_id")
    private Set<String> userSkills = new HashSet<>();
    
}