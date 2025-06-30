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
        // Create roles if not exist
        if (roleRepository.findAll().isEmpty()) {
            Role userRole = new Role(ERole.ROLE_USER);
            roleRepository.save(userRole);

            Role doctorRole = new Role(ERole.ROLE_MEDICO);
            roleRepository.save(doctorRole);

            Role adminRole = new Role(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }

        // Create users if not exist
        if (userRepository.findAll().isEmpty()) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER).orElseThrow();
            Role doctorRole = roleRepository.findByName(ERole.ROLE_MEDICO).orElseThrow();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow();

            // User
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRoles(Set.of(userRole));
            userRepository.save(user);

            // Doctor
            User doctor = new User();
            doctor.setUsername("doctor");
            doctor.setEmail("doctor@example.com");
            doctor.setPassword(passwordEncoder.encode("doctor123"));
            doctor.setRoles(Set.of(doctorRole));
            doctor.setSpecialization("Cardiologia");
            userRepository.save(doctor);

            // Admin
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
        }
    }
}
