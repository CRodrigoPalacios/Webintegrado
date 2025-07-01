package com.example.medicalappointments.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.medicalappointments.dto.ActiveAppointmentSlotDTO;
import com.example.medicalappointments.dto.AppointmentSlotDTO;
import com.example.medicalappointments.dto.MessageResponse;
import com.example.medicalappointments.model.AppointmentSlot;
import com.example.medicalappointments.model.User;
import com.example.medicalappointments.repository.AppointmentSlotRepository;
import com.example.medicalappointments.repository.HospitalRepository;
import com.example.medicalappointments.repository.UserRepository;

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
        var hospital = hospitalRepository.findById(appointmentSlotDTO.getHospitalId()).orElseThrow(() -> new RuntimeException("Hospital not found"));

        AppointmentSlot appointmentSlot = new AppointmentSlot(doctor, hospital, appointmentSlotDTO.getAppointmentTime(), appointmentSlotDTO.getTotalSlots());
        appointmentSlotRepository.save(appointmentSlot);

        return ResponseEntity.ok().body(new MessageResponse("Appointment slot created successfully!"));
    }

    @GetMapping("/slots/{doctorId}")
    @PreAuthorize("hasRole('MEDICO') or hasRole('ADMIN')")
    public List<AppointmentSlot> getDoctorAppointmentSlots(@PathVariable Long doctorId) {
        User doctor = userRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));
        return appointmentSlotRepository.findByDoctor(doctor);
    }

    @GetMapping("/active-slots")
    public List<ActiveAppointmentSlotDTO> getActiveAppointmentSlots() {
        List<AppointmentSlot> slots = appointmentSlotRepository.findAll();
        List<ActiveAppointmentSlotDTO> activeSlots = new ArrayList<>();
        for (AppointmentSlot slot : slots) {
            ActiveAppointmentSlotDTO dto = new ActiveAppointmentSlotDTO();
            dto.setId(slot.getId());
            dto.setAppointmentTime(slot.getAppointmentTime());
            dto.setTotalSlots(slot.getTotalSlots());
            dto.setAvailableSlots(slot.getAvailableSlots());
            dto.setDoctorName(slot.getDoctor().getFullName());
            dto.setDoctorSpecialization(slot.getDoctor().getSpecialization());
            activeSlots.add(dto);
        }
        return activeSlots;
    }
}
