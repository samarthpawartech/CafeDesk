package com.cafedesk.backend.Bills.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class BillRequestDTO {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Table number is required")
    private String tableNumber;

    @NotEmpty(message = "Items list cannot be empty")
    private List<BillitemDTO> items;

    // ================= GETTERS =================

    public String getCustomerName() {
        return customerName;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public List<BillitemDTO> getItems() {
        return items;
    }

    // ================= SETTERS =================

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public void setItems(List<BillitemDTO> items) {
        this.items = items;
    }
}