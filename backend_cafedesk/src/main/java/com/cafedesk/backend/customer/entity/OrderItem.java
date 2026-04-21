package com.cafedesk.backend.customer.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items") // ✅ GOOD PRACTICE (explicit table name)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private int quantity;

    // 🔥 IMPORTANT: Prevent infinite JSON loop
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private CurrentOrder order;

    // ================= GETTERS =================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public CurrentOrder getOrder() {
        return order;
    }

    // ================= SETTERS =================

    public void setName(String name) {
        this.name = (name != null) ? name : ""; // ✅ null safety
    }

    public void setPrice(double price) {
        this.price = Math.max(price, 0); // ✅ no negative price
    }

    public void setQuantity(int quantity) {
        this.quantity = (quantity > 0) ? quantity : 1; // ✅ avoid 0
    }

    public void setOrder(CurrentOrder order) {
        this.order = order;
    }

    // ✅ DEBUG SUPPORT
    @Override
    public String toString() {
        return "OrderItem{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                '}';
    }
}