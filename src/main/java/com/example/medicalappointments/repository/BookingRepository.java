package com.example.medicalappointments.repository;

import com.example.medicalappointments.model.AppointmentSlot;
import com.example.medicalappointments.model.Booking;
import com.example.medicalappointments.model.BookingStatus;
import com.example.medicalappointments.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByPatientAndAppointmentSlot(User patient, AppointmentSlot appointmentSlot);

    Optional<Booking> findByConfirmationToken(String token);

    List<Booking> findByPatientAndStatus(User patient, BookingStatus status);

    List<Booking> findByAppointmentSlot_DoctorAndStatus(User doctor, BookingStatus status);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByStatusIn(List<BookingStatus> statuses);
}
