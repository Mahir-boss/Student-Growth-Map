package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "prerequisites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(Prerequisite.PrerequisiteId.class)
public class Prerequisite {
    @Id
    @Column(name = "target_skill_id", length = 50)
    private String target;

    @Id
    @Column(name = "source_skill_id", length = 50)
    private String source;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrerequisiteId implements Serializable {
        private String target;
        private String source;
    }
}