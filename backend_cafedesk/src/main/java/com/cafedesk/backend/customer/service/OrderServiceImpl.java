package com.cafedesk.backend.customer.service;

public class OrderServiceImpl {

    private String name;
    private double price;
    private int quantity;

    // ✅ Default constructor
    public OrderServiceImpl() {
    }

    // ✅ Parameterized constructor
    public OrderServiceImpl(String name, double price, int quantity) {
        this.name = (name != null) ? name : "";
        this.price = Math.max(price, 0);
        this.quantity = (quantity > 0) ? quantity : 1;
    }

    // ✅ Getters & Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = (name != null && !name.trim().isEmpty()) ? name.trim() : "Unknown Item";
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = Math.max(price, 0);
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = (quantity > 0) ? quantity : 1;
    }

    // ✅ Helper
    public int getSafeQuantity() {
        return quantity > 0 ? quantity : 1;
    }

    // ✅ toString (Debug)
    @Override
    public String toString() {
        return "OrderItemDTO{" +
                "name='" + name + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                '}';
    }
}