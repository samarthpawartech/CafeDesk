package com.cafedesk.backend.customer.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "current_orders")
public class CurrentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String tableNumber;
    private double amount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ✅ FIX: LAZY (not EAGER)
    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<OrderItem> items = new ArrayList<>();

    // ✅ HELPER METHODS
    public void addItem(OrderItem item) {
        item.setOrder(this);
        this.items.add(item);
    }

    public void removeItem(OrderItem item) {
        item.setOrder(null);
        this.items.remove(item);
    }

    // ================= GETTERS =================

    public Long getId() { return id; }

    public String getCustomerName() { return customerName; }

    public String getTableNumber() { return tableNumber; }

    public double getAmount() { return amount; }

    public OrderStatus getStatus() { return status; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public List<OrderItem> getItems() { return items; }

    // ================= SETTERS =================

    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public void setAmount(double amount) { this.amount = amount; }

    public void setStatus(OrderStatus status) { this.status = status; }

    public void setItems(List<OrderItem> items) {
        this.items.clear();
        if (items != null) {
            for (OrderItem item : items) {
                addItem(item);
            }
        }
    }
}