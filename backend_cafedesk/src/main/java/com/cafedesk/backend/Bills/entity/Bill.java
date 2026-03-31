package com.cafedesk.backend.Bills.entity;

import com.cafedesk.backend.customer.entity.CurrentOrder;
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

    @Column(unique = true, nullable = false)
    private String invoiceNumber;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String tableNumber;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // ✅ OPTIONAL RELATION (safe)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = true)
    private CurrentOrder order;

    // ✅ CASCADE + SAFE FETCH
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

        if (this.invoiceNumber == null || this.invoiceNumber.isEmpty()) {
            this.invoiceNumber = "INV-" + System.currentTimeMillis();
        }

        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }

        if (this.status == null || this.status.isEmpty()) {
            this.status = "PENDING";
        }

        if (this.totalAmount == null) {
            this.totalAmount = 0.0;
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

    public Double getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public CurrentOrder getOrder() {
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

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setOrder(CurrentOrder order) {
        this.order = order;
    }

    public void setItems(List<BillItem> items) {
        this.items = items != null ? items : new ArrayList<>();

        // 🔥 IMPORTANT: maintain bidirectional mapping
        for (BillItem item : this.items) {
            item.setBill(this);
        }
    }
}