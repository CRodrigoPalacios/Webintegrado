package com.example.medicalappointments.controller;

import com.example.medicalappointments.dto.MessageResponse;
import com.example.medicalappointments.model.User;
import com.example.medicalappointments.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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

    @GetMapping("/pending")
    @PreAuthorize("hasRole('MEDICO') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllPendingBookings() {
        java.util.List<com.example.medicalappointments.model.Booking> bookings = bookingService.getAllBookingsByStatus(com.example.medicalappointments.model.BookingStatus.PENDING_CONFIRMATION);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/pending-by-doctor")
    @PreAuthorize("hasRole('MEDICO')")
    public ResponseEntity<?> getPendingBookingsByDoctor() {
        User currentUser = getCurrentUser();
        java.util.List<com.example.medicalappointments.model.Booking> bookings = bookingService.getPendingBookingsByDoctor(currentUser.getId());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/completed-cancelled")
    @PreAuthorize("hasRole('MEDICO') or hasRole('ADMIN')")
    public ResponseEntity<?> getCompletedCancelledBookings() {
        java.util.List<com.example.medicalappointments.model.Booking> bookings = bookingService.getBookingsByStatuses(
                java.util.Arrays.asList(
                        com.example.medicalappointments.model.BookingStatus.CONFIRMED,
                        com.example.medicalappointments.model.BookingStatus.CANCELLED
                )
        );
        java.util.List<com.example.medicalappointments.dto.BookingResponseDTO> response = new java.util.ArrayList<>();
        for (com.example.medicalappointments.model.Booking booking : bookings) {
            response.add(new com.example.medicalappointments.dto.BookingResponseDTO(booking));
        }
        return ResponseEntity.ok(response);
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

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserBookings(@RequestParam("status") String statusStr) {
        User user = getCurrentUser();
        com.example.medicalappointments.model.BookingStatus status;
        try {
            status = com.example.medicalappointments.model.BookingStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid booking status"));
        }
        java.util.List<com.example.medicalappointments.model.Booking> bookings = bookingService.getBookingsForPatientAndStatus(user, status);
        return ResponseEntity.ok(bookings);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof com.example.medicalappointments.service.UserDetailsImpl) {
            com.example.medicalappointments.service.UserDetailsImpl userDetails = (com.example.medicalappointments.service.UserDetailsImpl) authentication.getPrincipal();
            User user = new User();
            user.setId(userDetails.getId());
            user.setDni(userDetails.getDni());
            user.setEmail(userDetails.getEmail());
            return user;
        }
        throw new RuntimeException("User not authenticated");
    }
}
