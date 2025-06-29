package com.example.medicalappointments.controller;

import com.example.medicalappointments.model.AppointmentSlot;
import com.example.medicalappointments.repository.AppointmentSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentSlotRepository appointmentSlotRepository;

    @GetMapping
    public ResponseEntity<List<AppointmentSlot>> getAllAvailableAppointmentSlots() {
        List<AppointmentSlot> availableSlots = appointmentSlotRepository.findAll(); // In a real app, you'd filter by availableSlots > 0 and future dates
        return ResponseEntity.ok(availableSlots);
    }
}
