package com.example.medicalappointments.controller;

import com.example.medicalappointments.dto.MessageResponse;
import com.example.medicalappointments.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/{patientId}/{appointmentSlotId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createBooking(@PathVariable Long patientId, @PathVariable Long appointmentSlotId) {
        try {
            bookingService.createBooking(patientId, appointmentSlotId);
            return ResponseEntity.ok(new MessageResponse("Booking created successfully! Please check your email to confirm."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/confirm")
    public ResponseEntity<?> confirmBooking(@RequestParam("token") String token) {
        try {
            bookingService.confirmBooking(token);
            return ResponseEntity.ok(new MessageResponse("Booking confirmed successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
