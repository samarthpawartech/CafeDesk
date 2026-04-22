package com.cafedesk.backend.customer.DTO;

public class OrderItemDTO {

    private String name;
    private Double price;
    private Integer quantity;

    // ✅ Default constructor
    public OrderItemDTO() {}

    // ✅ Optional: Parameterized constructor (useful)
    public OrderItemDTO(String name, Double price, Integer quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    // ================= GETTERS =================

    public String getName() {
        return name != null ? name : "";
    }

    public Double getPrice() {
        return price != null ? price : 0.0;
    }

    public Integer getQuantity() {
        return quantity != null ? quantity : 1;
    }

    // ================= SETTERS =================

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