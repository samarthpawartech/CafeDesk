package com.cafedesk.backend.admin.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // ✅ ADD ROLE COLUMN
    @Column(nullable = false)
    private String role;

    // =========================
    // Getters and Setters
    // =========================

    public Long getId() {
        return id;
    }

    // Optional (usually not needed manually)
    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ✅ ROLE GETTER & SETTER
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}