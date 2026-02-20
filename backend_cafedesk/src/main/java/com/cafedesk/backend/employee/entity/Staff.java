package com.cafedesk.backend.employee.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "staff_data")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ DB column is phoned
    @Column(name = "phone", unique = true, nullable = false)
    private String mobileNumber;

    @Column(name = "email", nullable = false)
    private String email;

    private String name;
    private String role;

    public Long getId() { return id; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
