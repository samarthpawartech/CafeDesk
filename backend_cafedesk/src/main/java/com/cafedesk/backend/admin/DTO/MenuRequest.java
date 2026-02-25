package com.cafedesk.backend.admin.DTO;

import jakarta.validation.constraints.*;

public class MenuRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Availability is required")
    private Boolean availability;

    public MenuRequest() {}

    // Getters & Setters

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
}