package com.example.medicalappointments.repository;

import com.example.medicalappointments.model.User;
import com.example.medicalappointments.model.AppointmentSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, Long> {
    List<AppointmentSlot> findByDoctor(User doctor);
}
