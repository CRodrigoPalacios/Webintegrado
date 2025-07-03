package com.example.medicalappointments.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DoctorRegistrationRequest {

    @NotBlank
    @Size(min = 8, max = 8)
    private String dni;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    @Size(max = 100)
    private String fullName;

    @NotBlank
    @Size(max = 100)
    private String specialization;

    // Constructors
    public DoctorRegistrationRequest() {}

    public DoctorRegistrationRequest(String dni, String email, String password, String fullName, String specialization) {
        this.dni = dni;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.specialization = specialization;
    }

    // Getters and Setters
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}
