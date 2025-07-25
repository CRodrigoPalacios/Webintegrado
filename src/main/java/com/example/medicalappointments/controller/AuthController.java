package com.example.medicalappointments.controller;

import com.example.medicalappointments.dto.*;
import lombok.Getter;
import lombok.Setter;
import com.example.medicalappointments.model.ERole;
import com.example.medicalappointments.model.Role;
import com.example.medicalappointments.model.User;
import com.example.medicalappointments.repository.RoleRepository;
import com.example.medicalappointments.repository.UserRepository;
import com.example.medicalappointments.security.JwtUtils;
import com.example.medicalappointments.service.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping(value = "/signin", produces = "application/json")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getDni(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getDni(),
                    userDetails.getFullName(),
                    userDetails.getEmail(),
                    roles));
        } catch (Exception e) {
            // Log authentication failure
            System.err.println("Authentication failed for user: " + loginRequest.getDni() + " - " + e.getMessage());
            return ResponseEntity.status(401).body(new MessageResponse("Authentication failed: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            if (userRepository.existsByDni(signUpRequest.getDni())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: DNI is already taken!"));
            }

            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }

            User user = new User(signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword()),
                    signUpRequest.getDni(),
                    signUpRequest.getFullName());

            Set<String> strRoles = signUpRequest.getRole();
            Set<Role> roles = new HashSet<>();

            if (strRoles == null) {
                Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(userRole);
            } else {
                strRoles.forEach(role -> {
                    switch (role) {
                        case "admin":
                            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(adminRole);

                            break;
                        case "medico":
                            Role modRole = roleRepository.findByName(ERole.ROLE_MEDICO)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(modRole);

                            break;
                        default:
                            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(userRole);
                    }
                });
            }

            user.setRoles(roles);
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            System.err.println("User registration failed: " + e.getMessage());
            return ResponseEntity.status(500).body(new MessageResponse("User registration failed: " + e.getMessage()));
        }
    }



    @PostMapping("/register-doctor")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> registerDoctor(@Valid @RequestBody DoctorRegistrationRequest doctorRequest) {
        try {
            // Verificar si el DNI ya existe
            if (userRepository.existsByDni(doctorRequest.getDni())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: DNI is already taken!"));
            }

            // Verificar si el email ya existe
            if (userRepository.existsByEmail(doctorRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }

            // Crear nuevo usuario
            User doctor = new User(
                    doctorRequest.getEmail(),
                    encoder.encode(doctorRequest.getPassword()),
                    doctorRequest.getDni(),
                    doctorRequest.getFullName()
            );

            // Agregar especialización
            doctor.setSpecialization(doctorRequest.getSpecialization());

            // Asignar rol de doctor
            Role doctorRole = roleRepository.findByName(ERole.ROLE_MEDICO)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

            Set<Role> roles = new HashSet<>();
            roles.add(doctorRole);
            doctor.setRoles(roles);

            // Guardar en base de datos
            userRepository.save(doctor);

            return ResponseEntity.ok(new MessageResponse("Doctor registered successfully!"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error registering doctor: " + e.getMessage()));
        }
    }














}
