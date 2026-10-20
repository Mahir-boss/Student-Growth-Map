package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaxonomyController {

    private final SkillRepository skillRepository;
    private final RoleRepository roleRepository;
    private final PrerequisiteRepository prerequisiteRepository;

    @GetMapping("/skills")
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @GetMapping("/prerequisites")
    public List<Prerequisite> getAllPrerequisites() {
        return prerequisiteRepository.findAll();
    }
}