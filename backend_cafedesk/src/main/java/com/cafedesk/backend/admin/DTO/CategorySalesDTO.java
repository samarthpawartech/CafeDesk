package com.cafedesk.backend.admin.DTO;

public class CategorySalesDTO {

    private String name;
    private double value;

    public CategorySalesDTO(String name, double value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public double getValue() {
        return value;
    }
}