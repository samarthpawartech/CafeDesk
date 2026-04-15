package com.cafedesk.backend.Bills.DTO;

public class BillitemDTO {

    private String name;

    private Integer quantity;   // ✅ use wrapper

    private Double price;       // ✅ FIXED (was double)

    // ================= GETTERS =================

    public String getName() {
        return name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Double getPrice() {
        return price;
    }

    // ================= SETTERS =================

    public void setName(String name) {
        this.name = name;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}