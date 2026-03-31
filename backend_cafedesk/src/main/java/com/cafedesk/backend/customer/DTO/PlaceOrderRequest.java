package com.cafedesk.backend.customer.DTO;

import java.util.List;

public class PlaceOrderRequest {

    private String customerName;
    private String tableNumber;
    private double amount;
    private List<OrderItemDTO> items;

    // ✅ Default constructor (required)
    public PlaceOrderRequest() {
    }

    // ✅ Getters & Setters

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

    // ✅ DEBUG SUPPORT (VERY IMPORTANT 🔥)
    @Override
    public String toString() {
        return "PlaceOrderRequest{" +
                "customerName='" + customerName + '\'' +
                ", tableNumber='" + tableNumber + '\'' +
                ", amount=" + amount +
                ", items=" + items +
                '}';
    }
}