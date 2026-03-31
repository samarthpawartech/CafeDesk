package com.cafedesk.backend.Bills.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class BillResponseDTO {

    private Long id;
    private String invoiceNumber;
    private String customerName;
    private String tableNumber;

    // ✅ FIXED NAME
    private Double totalAmount;

    private String status;

    // ✅ FIXED NAME
    private LocalDateTime createdAt;

    private List<BillitemDTO> items;

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

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setItems(List<BillitemDTO> items) {
        this.items = items;
    }
}