package com.cafedesk.backend.customer.DTO;

public class OrderItemDTO {

    private String name;
    private double price;
    private int quantity;

    // ✅ Default constructor (required for JSON)
    public OrderItemDTO() {
    }

    // ✅ Parameterized constructor
    public OrderItemDTO(String name, double price, int quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    // ✅ Getters & Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        // 🔥 prevent null issues
        this.name = (name != null) ? name : "";
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        // 🔥 prevent negative values
        this.price = Math.max(price, 0);
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        // 🔥 prevent 0 or negative quantity
        this.quantity = (quantity > 0) ? quantity : 1;
    }

    // ✅ DEBUG SUPPORT (VERY IMPORTANT)
    @Override
    public String toString() {
        return "OrderItemDTO{" +
                "name='" + name + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                '}';
    }
}