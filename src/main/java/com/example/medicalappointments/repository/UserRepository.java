package com.example.medicalappointments.repository;

import com.example.medicalappointments.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByDni(String dni);

    Boolean existsByDni(String dni);

    Boolean existsByEmail(String email);

    List<User> findByFullNameContainingIgnoreCase(String name);
}
