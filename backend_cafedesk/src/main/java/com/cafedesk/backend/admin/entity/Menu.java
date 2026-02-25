package com.cafedesk.backend.admin.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Menu_Data")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Boolean availability;

    private String imagePath;

    private LocalDateTime createdAt;

    public Menu() {}

    public Menu(String name, String description, Double price,
                String category, Boolean availability,
                String imagePath, LocalDateTime createdAt) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.availability = availability;
        this.imagePath = imagePath;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters & Setters

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getAvailability() { return availability; }
    public void setAvailability(Boolean availability) { this.availability = availability; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}