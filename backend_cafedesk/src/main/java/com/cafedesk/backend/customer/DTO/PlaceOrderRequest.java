package com.cafedesk.backend.customer.DTO;

import java.util.List;

public class PlaceOrderRequest {

    private String customerName;
    private String tableNumber;
    private double amount;
    private List<OrderItemDTO> items;

    // Default constructor (required for JSON deserialization)
    public PlaceOrderRequest() {
    }

    // Parameterized constructor
    public PlaceOrderRequest(String customerName, String tableNumber, double amount, List<OrderItemDTO> items) {
        this.customerName = customerName;
        this.tableNumber = tableNumber;
        this.amount = amount;
        this.items = items;
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

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }
}