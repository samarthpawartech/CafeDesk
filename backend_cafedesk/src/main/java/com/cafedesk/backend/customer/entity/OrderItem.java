package com.cafedesk.backend.customer.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private int quantity;

    // ✅ MANY → ONE (keep LAZY by default)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private CurrentOrder order;

    // ================= GETTERS =================

    public Long getId() { return id; }

    public String getName() { return name; }

    public double getPrice() { return price; }

    public int getQuantity() { return quantity; }

    public CurrentOrder getOrder() { return order; }

    // ================= SETTERS =================

    public void setName(String name) { this.name = name; }

    public void setPrice(double price) { this.price = price; }

    public void setQuantity(int quantity) { this.quantity = quantity; }

    public void setOrder(CurrentOrder order) { this.order = order; }
}