package com.example.medicalappointments.service;

import com.example.medicalappointments.model.AppointmentSlot;
import com.example.medicalappointments.model.Booking;
import com.example.medicalappointments.model.BookingStatus;
import com.example.medicalappointments.model.User;
import com.example.medicalappointments.repository.AppointmentSlotRepository;
import com.example.medicalappointments.repository.BookingRepository;
import com.example.medicalappointments.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AppointmentSlotRepository appointmentSlotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public Booking createBooking(Long patientId, Long appointmentSlotId) {
        User patient = userRepository.findById(patientId).orElseThrow(() -> new RuntimeException("Patient not found"));
        AppointmentSlot appointmentSlot = appointmentSlotRepository.findById(appointmentSlotId).orElseThrow(() -> new RuntimeException("Appointment slot not found"));

        // Check if patient already has a booking for this appointment slot
        if (bookingRepository.findByPatientAndAppointmentSlot(patient, appointmentSlot).isPresent()) {
            throw new RuntimeException("You already have a booking for this appointment slot");
        }

        if (appointmentSlot.getAvailableSlots() <= 0) {
            throw new RuntimeException("No available slots");
        }

        int slotNumber = appointmentSlot.getTotalSlots() - appointmentSlot.getAvailableSlots() + 1;

        Booking booking = new Booking(patient, appointmentSlot);
        booking.setSlotNumber(slotNumber);
        booking.setConfirmationToken(UUID.randomUUID().toString());
        booking.setTokenExpiryDate(LocalDateTime.now().plusHours(24));

        appointmentSlot.setAvailableSlots(appointmentSlot.getAvailableSlots() - 1);
        appointmentSlotRepository.save(appointmentSlot);

        bookingRepository.save(booking);

        String confirmationUrl = "http://localhost:4200/confirm-appointment?token=" + booking.getConfirmationToken();
        emailService.sendSimpleMessage(patient.getEmail(), "Confirm your appointment", "Please click the link to confirm your appointment: " + confirmationUrl);

        return booking;
    }

    public java.util.List<Booking> getBookingsForDoctorAndStatus(User doctor, com.example.medicalappointments.model.BookingStatus status) {
        return bookingRepository.findByAppointmentSlot_DoctorAndStatus(doctor, status);
    }

    public java.util.List<Booking> getBookingsForPatientAndStatus(User patient, com.example.medicalappointments.model.BookingStatus status) {
        return bookingRepository.findByPatientAndStatus(patient, status);
    }

    public Booking confirmBooking(String token) {
        Booking booking = bookingRepository.findByConfirmationToken(token).orElseThrow(() -> new RuntimeException("Invalid token"));

        if (booking.getTokenExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        booking.setStatus(com.example.medicalappointments.model.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return booking;
    }

    public java.util.List<Booking> getAllBookingsByStatus(com.example.medicalappointments.model.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public java.util.List<Booking> getPendingBookingsByDoctor(Long doctorId) {
        User doctor = userRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));
        return bookingRepository.findByAppointmentSlot_DoctorAndStatus(doctor, com.example.medicalappointments.model.BookingStatus.PENDING_CONFIRMATION);
    }

    public java.util.List<Booking> getBookingsByStatuses(java.util.List<com.example.medicalappointments.model.BookingStatus> statuses) {
        return bookingRepository.findByStatusIn(statuses);
    }
}
