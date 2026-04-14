package com.cafedesk.backend.customer.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "current_orders") // 🔥 FIXED (lowercase for PostgreSQL)
public class CurrentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String tableNumber;
    private double amount;

    // ✅ Status
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    // ✅ Timestamp
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // 🔥 RELATION
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<OrderItem> items;

    // ================= GETTERS =================

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public double getAmount() {
        return amount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    // ================= SETTERS =================

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;

        // 🔥 ENSURE BIDIRECTIONAL LINK (VERY IMPORTANT)
        if (items != null) {
            for (OrderItem item : items) {
                item.setOrder(this);
            }
        }
    }
}