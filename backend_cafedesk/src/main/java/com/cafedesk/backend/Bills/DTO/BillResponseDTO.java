package com.cafedesk.backend.Bills.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class BillResponseDTO {

    private Long id;
    private String invoiceNumber;
    private String customerName;
    private String tableNumber;
    private Double amount;
    private String status;
    private LocalDateTime date;
    private List<BillitemDTO> items;

    // ✅ GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public List<BillitemDTO> getItems() {
        return items;
    }

    public void setItems(List<BillitemDTO> items) {
        this.items = items;
    }

}