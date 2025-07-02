package com.example.medicalappointments.controller;

import com.example.medicalappointments.model.ERole;
import com.example.medicalappointments.model.Role;
import com.example.medicalappointments.model.User;
import com.example.medicalappointments.repository.RoleRepository;
import com.example.medicalappointments.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsers(@RequestParam(required = false) String name) {
        List<User> users;
        if (name != null && !name.isEmpty()) {
            users = userRepository.findByFullNameContainingIgnoreCase(name);
        } else {
            users = userRepository.findAll();
        }
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @GetMapping("/counts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserCountsByRole() {
        long totalUsers = userRepository.count();
        long totalDoctors = userRepository.countByRoles_Name(ERole.ROLE_MEDICO);
        long totalAdmins = userRepository.countByRoles_Name(ERole.ROLE_ADMIN);
        long totalPatients = userRepository.countByRoles_Name(ERole.ROLE_USER);

        Map<String, Long> counts = new HashMap<>();
        counts.put("totalUsers", totalUsers);
        counts.put("totalDoctors", totalDoctors);
        counts.put("totalAdmins", totalAdmins);
        counts.put("totalPatients", totalPatients);

        return ResponseEntity.ok(counts);
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDoctors() {
        List<User> doctors = userRepository.findByRoles_Name(ERole.ROLE_MEDICO);
        doctors.forEach(doctor -> doctor.setPassword(null));
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('MEDICO')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(null); // Do not expose password
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('MEDICO')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEmail(updatedUser.getEmail());
            user.setFullName(updatedUser.getFullName());
            user.setDni(updatedUser.getDni());
            user.setSpecialization(updatedUser.getSpecialization());
            userRepository.save(user);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRoles(@PathVariable Long id, @RequestBody Set<String> roles) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Set<Role> newRoles = roles.stream()
                .map(roleName -> {
                    try {
                        ERole eRole = ERole.valueOf(roleName);
                        return roleRepository.findByName(eRole);
                    } catch (IllegalArgumentException e) {
                        return Optional.<Role>empty();
                    }
                })
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
            user.setRoles(newRoles);
            userRepository.save(user);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> banUser(@PathVariable Long id, @RequestBody boolean banned) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setBanned(banned);
            userRepository.save(user);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
