package com.example.medicalappointments.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    public Role() {
        // Default constructor required by JPA
    }

    public Role(ERole name) {
        this.name = name;
    }

    public ERole getName() {
        return this.name;
    }
}
