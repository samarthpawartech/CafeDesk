package com.cafedesk.backend.admin.DTO;

public class InventoryDTO {

    private String name;
    private String category;
    private Double quantity;
    private String unit;
    private Double minStock;

    public InventoryDTO() {
    }

    public InventoryDTO(String name, String category,
                        Double quantity, String unit,
                        Double minStock) {
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.unit = unit;
        this.minStock = minStock;
    }

    // ================= GETTERS & SETTERS =================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getMinStock() {
        return minStock;
    }

    public void setMinStock(Double minStock) {
        this.minStock = minStock;
    }
}