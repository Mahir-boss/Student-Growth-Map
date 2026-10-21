package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserRepository userRepository;
    private final PrerequisiteRepository prerequisiteRepository;
    private final RoleRepository roleRepository;
    private final SkillRepository skillRepository;

    public Set<String> calculateRequiredPath(String targetRoleId) {
        if (targetRoleId == null || targetRoleId.isBlank()) {
            return new HashSet<>(skillRepository.findAll().stream().map(Skill::getId).toList());
        }

        Role role = roleRepository.findById(targetRoleId).orElse(null);
        if (role == null) {
            return new HashSet<>(skillRepository.findAll().stream().map(Skill::getId).toList());
        }

        Set<String> neededSkills = new HashSet<>(role.getRequiredSkills());
        List<Prerequisite> allPrereqs = prerequisiteRepository.findAll();

        boolean expanded = true;
        while (expanded) {
            expanded = false;
            for (Prerequisite p : allPrereqs) {
                if (neededSkills.contains(p.getTarget()) && !neededSkills.contains(p.getSource())) {
                    neededSkills.add(p.getSource());
                    expanded = true;
                }
            }
        }
        return neededSkills;
    }

    @Transactional
    public Set<String> toggleSkill(String userId, String skillId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (user.getUserSkills().contains(skillId)) {
            user.getUserSkills().remove(skillId);
        } else {
            user.getUserSkills().add(skillId);
        }

        userRepository.save(user);
        return user.getUserSkills();
    }

    @Transactional
    public User updateTargetRole(String userId, String roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setTargetRole(roleId);
        return userRepository.save(user);
    }
}