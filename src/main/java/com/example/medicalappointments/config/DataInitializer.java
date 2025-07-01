package com.example.medicalappointments.config;

import com.example.medicalappointments.model.ERole;
import com.example.medicalappointments.model.Role;
import com.example.medicalappointments.model.User;
import com.example.medicalappointments.repository.RoleRepository;
import com.example.medicalappointments.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running DataInitializer...");

        // Initialize roles if not present
        if (roleRepository.count() == 0) {
            System.out.println("Initializing roles...");
            Role userRole = new Role(ERole.ROLE_USER);
            roleRepository.save(userRole);

            Role adminRole = new Role(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);

            Role medicoRole = new Role(ERole.ROLE_MEDICO);
            roleRepository.save(medicoRole);
        }

        // Initialize a default user with encoded password
        if (!userRepository.existsByDni("12345678")) {
            System.out.println("Creating default user...");
            User user = new User();
            user.setDni("12345678");
            user.setEmail("user@example.com");
            user.setFullName("Default User");
            user.setPassword(passwordEncoder.encode("user123"));

            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER).orElse(null);
            if (userRole != null) {
                roles.add(userRole);
            }
            user.setRoles(roles);

            userRepository.save(user);
            System.out.println("Default user created.");
        } else {
            System.out.println("Default user already exists.");
        }
    }
}
