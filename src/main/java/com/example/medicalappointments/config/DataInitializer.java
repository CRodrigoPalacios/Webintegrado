package com.example.medicalappointments.config;

import com.example.medicalappointments.model.ERole;
import com.example.medicalappointments.model.Hospital;
import com.example.medicalappointments.model.Role;
import com.example.medicalappointments.model.User;
import com.example.medicalappointments.repository.HospitalRepository;
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

    @Autowired
    private HospitalRepository hospitalRepository;
    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running DataInitializer...");

        final String HOSPITAL_NAME = "Hospital Regional Cayetano Heredia";
        final String HOSPITAL_ADDRESS = "Av. Guardia Civil S/N, Piura"; // Reemplaza con la dirección correcta

        // Verificar si el hospital ya existe en la base de datos
        if (hospitalRepository.findByName(HOSPITAL_NAME).isEmpty()) {
            // Si no existe, créalo
            Hospital cayetano = new Hospital();
            cayetano.setName(HOSPITAL_NAME);
            cayetano.setAddress(HOSPITAL_ADDRESS);

            hospitalRepository.save(cayetano);
            System.out.println("✅ Hospital '" + HOSPITAL_NAME + "' inicializado en la base de datos.");
        } else {
            System.out.println("ℹ️ Hospital '" + HOSPITAL_NAME + "' ya existe en la base de datos. No se requiere inicialización.");
        }

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
            user.setEmail("carlosrodrigopz@hotmail.com");
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

        // Initialize a default doctor user
        if (!userRepository.existsByDni("87654321")) {
            System.out.println("Creating default doctor user...");
            User doctor = new User();
            doctor.setDni("87654321");
            doctor.setEmail("doctor@example.com");
            doctor.setFullName("Default Doctor");
            doctor.setPassword(passwordEncoder.encode("doctor123"));

            Set<Role> doctorRoles = new HashSet<>();
            Role doctorRole = roleRepository.findByName(ERole.ROLE_MEDICO).orElse(null);
            if (doctorRole != null) {
                doctorRoles.add(doctorRole);
            }
            doctor.setRoles(doctorRoles);

            userRepository.save(doctor);
            System.out.println("Default doctor user created.");
        } else {
            System.out.println("Default doctor user already exists.");
        }

        // Initialize a default admin user
        if (!userRepository.existsByDni("11223344")) {
            System.out.println("Creating default admin user...");
            User admin = new User();
            admin.setDni("11223344");
            admin.setEmail("admin@example.com");
            admin.setFullName("Default Admin");
            admin.setPassword(passwordEncoder.encode("admin123"));

            Set<Role> adminRoles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).orElse(null);
            if (adminRole != null) {
                adminRoles.add(adminRole);
            }
            admin.setRoles(adminRoles);

            userRepository.save(admin);
            System.out.println("Default admin user created.");
        } else {
            System.out.println("Default admin user already exists.");
        }
    }
}
