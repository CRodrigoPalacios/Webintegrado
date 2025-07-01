package com.example.medicalappointments.repository;

import com.example.medicalappointments.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.example.medicalappointments.model.AppointmentSlot;
import com.example.medicalappointments.model.User;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByConfirmationToken(String confirmationToken);

    Optional<Booking> findByPatientAndAppointmentSlot(User patient, AppointmentSlot appointmentSlot);
}
