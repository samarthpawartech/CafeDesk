package com.cafedesk.backend.customer.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Current_orders")
public class CurrentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String tableNumber;
    private double amount;

    // ✅ Better status handling
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PLACED;

    // ✅ Timestamp for tracking
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
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

        if (items != null) {
            for (OrderItem item : items) {
                item.setOrder(this);
            }
        }
    }
}