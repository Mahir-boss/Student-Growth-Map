package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @Column(name = "role_id", length = 50)
    private String id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 100)
    private String domain;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "role_requirements", joinColumns = @JoinColumn(name = "role_id"))
    @Column(name = "skill_id")
    private List<String> requiredSkills;
}