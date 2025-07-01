package com.example.medicalappointments.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private List<String> roles;

    public JwtResponse(String accessToken, Long id, String fullName, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.roles = roles;
    }
}
