package com.cafedesk.backend.customer.DTO;

public class OrderItemDTO {

    private String name;
    private Double price;
    private Integer quantity;

    // ✅ Default constructor
    public OrderItemDTO() {}

    // ✅ Getters
    public String getName() {
        return name;
    }

    public Double getPrice() {
        return price != null ? price : 0.0;
    }

    public Integer getQuantity() {
        return quantity != null ? quantity : 1;
    }

    // ✅ Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}