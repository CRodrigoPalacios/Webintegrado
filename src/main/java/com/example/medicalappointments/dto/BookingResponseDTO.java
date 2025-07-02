package com.example.medicalappointments.dto;

import com.example.medicalappointments.model.Booking;
import java.time.LocalDateTime;

public class BookingResponseDTO {
    private String doctorName;
    private String patientName;
    private LocalDateTime date;
    private String status;

    public BookingResponseDTO(Booking booking) {
        this.patientName = booking.getPatient() != null ? booking.getPatient().getFullName() : null;
        if (booking.getAppointmentSlot() != null) {
            this.date = booking.getAppointmentSlot().getAppointmentTime();
            if (booking.getAppointmentSlot().getDoctor() != null) {
                this.doctorName = booking.getAppointmentSlot().getDoctor().getFullName();
            }
        }
        this.status = booking.getStatus() != null ? booking.getStatus().name() : null;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public String getPatientName() {
        return patientName;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public String getStatus() {
        return status;
    }
}
