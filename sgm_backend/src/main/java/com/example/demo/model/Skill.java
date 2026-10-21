package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Skill {
    @Id
    @Column(name = "skill_id", length = 50)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 50)
    private String tier;

    @Column(name = "doc_url", columnDefinition = "TEXT")
    private String docUrl;

    @Column(name = "tutorial_url", columnDefinition = "TEXT")
    private String tutorialUrl;

    @Column(name = "video_url", columnDefinition = "TEXT")
    private String videoUrl;

    @Column(name = "practice_url", columnDefinition = "TEXT")
    private String practiceUrl;
}