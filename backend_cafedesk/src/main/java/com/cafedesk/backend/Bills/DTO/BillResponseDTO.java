package com.cafedesk.backend.Bills.DTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class BillResponseDTO {

    private Long id;
    private String invoiceNumber;
    private String customerName;
    private String tableNumber;

    // ❌ REMOVED orderId (no longer used)

    // ✅ Keep both for frontend compatibility
    private Double amount;
    private Double totalAmount;

    private String status;
    private LocalDateTime createdAt;

    private List<BillitemDTO> items = new ArrayList<>();

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
        return amount != null ? amount : 0.0;
    }

    public Double getTotalAmount() {
        return totalAmount != null ? totalAmount : 0.0;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<BillitemDTO> getItems() {
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

    // 🔥 IMPORTANT: keep both fields in sync
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
        this.amount = totalAmount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
        this.totalAmount = amount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setItems(List<BillitemDTO> items) {
        this.items = items != null ? items : new ArrayList<>();
    }
}