package com.cafedesk.backend.admin.DTO;

import java.time.LocalDateTime;

public class MenuResponse {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private Boolean availability;
    private String imagePath;
    private LocalDateTime createdAt;

    // ✅ FULL Constructor
    public MenuResponse(Long id, String name, String description,
                        Double price, String category,
                        Boolean availability, String imagePath,
                        LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.availability = availability;
        this.imagePath = imagePath;
        this.createdAt = createdAt;
    }

    // ✅ Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Double getPrice() { return price; }
    public String getCategory() { return category; }
    public Boolean getAvailability() { return availability; }
    public String getImagePath() { return imagePath; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}