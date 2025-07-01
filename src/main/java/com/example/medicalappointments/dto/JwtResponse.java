package com.example.medicalappointments.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
    @JsonProperty("token")
    private String token;

    @JsonProperty("type")
    private String type = "Bearer";

    @JsonProperty("id")
    private Long id;

    @JsonProperty("dni")
    private String dni;

    @JsonProperty("fullName")
    private String fullName;

    @JsonProperty("email")
    private String email;

    @JsonProperty("roles")
    private List<String> roles;

    public JwtResponse() {
        // Default constructor for JSON deserialization
    }

    public JwtResponse(String accessToken, Long id, String dni, String fullName, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.dni = dni;
        this.fullName = fullName;
        this.email = email;
        this.roles = roles;
    }
}
