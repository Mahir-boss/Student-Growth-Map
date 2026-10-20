package com.example.demo.repository;

import com.example.demo.model.Prerequisite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrerequisiteRepository extends JpaRepository<Prerequisite, Prerequisite.PrerequisiteId> {
    List<Prerequisite> findByTarget(String target);
}