package com.example.medicalappointments.controller;

import com.example.medicalappointments.dto.AppointmentSlotDTO;
import com.example.medicalappointments.model.AppointmentSlot;
import com.example.medicalappointments.model.Hospital;
import com.example.medicalappointments.model.User;
import com.example.medicalappointments.repository.AppointmentSlotRepository;
import com.example.medicalappointments.repository.HospitalRepository;
import com.example.medicalappointments.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    @Autowired
    private AppointmentSlotRepository appointmentSlotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @PostMapping("/slots")
    @PreAuthorize("hasRole('MEDICO') or hasRole('ADMIN')")
    public ResponseEntity<?> createAppointmentSlot(@RequestBody AppointmentSlotDTO appointmentSlotDTO) {
        User doctor = userRepository.findById(appointmentSlotDTO.getDoctorId()).orElseThrow(() -> new RuntimeException("Doctor not found"));
        Hospital hospital = hospitalRepository.findById(appointmentSlotDTO.getHospitalId()).orElseThrow(() -> new RuntimeException("Hospital not found"));

        AppointmentSlot appointmentSlot = new AppointmentSlot(doctor, hospital, appointmentSlotDTO.getAppointmentTime(), appointmentSlotDTO.getTotalSlots());
        appointmentSlotRepository.save(appointmentSlot);

        return ResponseEntity.ok("Appointment slot created successfully!");
    }

    @GetMapping("/slots/{doctorId}")
    @PreAuthorize("hasRole('MEDICO') or hasRole('ADMIN')")
    public List<AppointmentSlot> getDoctorAppointmentSlots(@PathVariable Long doctorId) {
        try {
            User doctor = userRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));
            return appointmentSlotRepository.findByDoctor(doctor);
        } catch (Exception e) {
            System.err.println("Error fetching appointment slots for doctor " + doctorId + ": " + e.getMessage());
            throw e;
        }
    }
}
