package com.example.medicalappointments.controller;

import com.example.medicalappointments.model.Hospital;
import com.example.medicalappointments.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    @Autowired
    private HospitalRepository hospitalRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEDICO')")
    public ResponseEntity<?> createHospital(@RequestBody Hospital hospital) {
        try {
            Hospital savedHospital = hospitalRepository.save(hospital);
            return ResponseEntity.ok(savedHospital);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating hospital: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllHospitals() {
        try {
            return ResponseEntity.ok(hospitalRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching hospitals: " + e.getMessage());
        }
    }
}
