package com.example.medicalappointments.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name = "appointment_slot_id", nullable = false)
    private AppointmentSlot appointmentSlot;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private String confirmationToken;

    private LocalDateTime tokenExpiryDate;

    public Booking(User patient, AppointmentSlot appointmentSlot) {
        this.patient = patient;
        this.appointmentSlot = appointmentSlot;
        this.status = BookingStatus.PENDING_CONFIRMATION;
    }
}
