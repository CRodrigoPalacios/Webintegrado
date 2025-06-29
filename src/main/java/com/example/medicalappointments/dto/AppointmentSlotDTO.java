package com.example.medicalappointments.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AppointmentSlotDTO {
    private Long doctorId;
    private Long hospitalId;
    private LocalDateTime appointmentTime;
    private int totalSlots;
}
