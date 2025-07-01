package com.example.medicalappointments.dto;

import jakarta.validation.constraints.NotBlank;
public class LoginRequest {
    @NotBlank
    private String dni;

    @NotBlank
    private String password;

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
