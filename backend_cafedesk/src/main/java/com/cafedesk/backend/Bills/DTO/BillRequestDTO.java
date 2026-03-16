package com.cafedesk.backend.Bills.DTO;

import com.cafedesk.backend.Bills.DTO.BillitemDTO;

import java.util.List;

public class BillRequestDTO {

    private String customerName;
    private String tableNumber;
    private List<BillitemDTO> items;

    // getters & setters
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public List<BillitemDTO> getItems() { return items; }
    public void setItems(List<BillitemDTO> items) { this.items = items; }
}