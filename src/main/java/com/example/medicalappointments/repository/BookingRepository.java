package com.example.medicalappointments.repository;

import com.example.medicalappointments.model.Booking;
import com.example.medicalappointments.model.BookingStatus;
import com.example.medicalappointments.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByPatientAndAppointmentSlot(User patient, com.example.medicalappointments.model.AppointmentSlot appointmentSlot);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByAppointmentSlot_DoctorAndStatus(User doctor, BookingStatus status);
    List<Booking> findByPatientAndStatus(User patient, BookingStatus status);
    List<Booking> findByStatusIn(List<BookingStatus> statuses);

    List<Booking> findByStatusAndTokenExpiryDateBefore(BookingStatus status, LocalDateTime dateTime);

    List<Booking> findByStatusAndCompletedFalseAndAppointmentSlot_AppointmentTimeBefore(BookingStatus status, LocalDateTime dateTime);

    Optional<Booking> findByConfirmationToken(String token);
}
