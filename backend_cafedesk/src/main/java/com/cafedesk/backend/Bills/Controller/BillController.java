package com.cafedesk.backend.Bills.Controller;

import com.cafedesk.backend.Bills.DTO.BillitemDTO;

import java.util.List;

class BillResponseDTO {

    private Long id;
    private String invoiceNumber;
    private String customerName;
    private List<BillitemDTO> items;
    private Double totalAmount;
    private String status;

    // ✅ GETTERS & SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public List<BillitemDTO> getItems() { return items; }
    public void setItems(List<BillitemDTO> items) { this.items = items; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}