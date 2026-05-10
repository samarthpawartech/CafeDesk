package com.cafedesk.backend.admin.DTO;

public class WeeklySalesDTO {

    private String name;
    private double sales;

    public WeeklySalesDTO(String name, double sales) {
        this.name = name;
        this.sales = sales;
    }

    public String getName() {
        return name;
    }

    public double getSales() {
        return sales;
    }
}