package com.example.medicalappointments.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointment_slots")
@Getter
@Setter
@NoArgsConstructor
public class AppointmentSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    private LocalDateTime appointmentTime;

    private int totalSlots;

    private int availableSlots;

    public AppointmentSlot(User doctor, Hospital hospital, LocalDateTime appointmentTime, int totalSlots) {
        this.doctor = doctor;
        this.hospital = hospital;
        this.appointmentTime = appointmentTime;
        this.totalSlots = totalSlots;
        this.availableSlots = totalSlots;
    }
}
