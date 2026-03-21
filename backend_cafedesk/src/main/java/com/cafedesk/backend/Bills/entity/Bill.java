package com.cafedesk.backend.Bills.entity;

import com.cafedesk.backend.customer.entity.Order;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bill")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Unique invoice
    @Column(unique = true, nullable = false)
    private String invoiceNumber;

    private String customerName;
    private String tableNumber;
    private Double amount;

    // ✅ Use consistent uppercase (matches frontend filter)
    private String status;

    private LocalDateTime date;

    // ✅ Link with Order (IMPORTANT)
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @OneToMany(
            mappedBy = "bill",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<BillItem> items = new ArrayList<>();

    // ================= AUTO GENERATION =================

    @PrePersist
    public void prePersist() {

        // ✅ Invoice number
        if (this.invoiceNumber == null || this.invoiceNumber.isEmpty()) {
            this.invoiceNumber = "INV-" + System.currentTimeMillis();
        }

        // ✅ Date
        if (this.date == null) {
            this.date = LocalDateTime.now();
        }

        // ✅ Status FIX (must match frontend)
        if (this.status == null || this.status.isEmpty()) {
            this.status = "PENDING";   // 🔥 IMPORTANT (uppercase)
        }

        // ✅ Prevent null amount
        if (this.amount == null) {
            this.amount = 0.0;
        }
    }

    // ================= GETTERS =================

    public Long getId() {
        return id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public Double getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public Order getOrder() {
        return order;
    }

    public List<BillItem> getItems() {
        return items;
    }

    // ================= SETTERS =================

    public void setId(Long id) {
        this.id = id;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setItems(List<BillItem> items) {
        this.items = items;

        // ✅ Maintain relationship
        if (items != null) {
            for (BillItem item : items) {
                item.setBill(this);
            }
        }
    }
}