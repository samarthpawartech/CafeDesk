package com.cafedesk.backend.admin.DTO;

public class DashboardSummaryDTO {

    private double totalSales;
    private long totalOrders;
    private long activeOrders;
    private long pendingBills;
    private long inventoryAlerts;

    public DashboardSummaryDTO(
            double totalSales,
            long totalOrders,
            long activeOrders,
            long pendingBills,
            long inventoryAlerts
    ) {
        this.totalSales = totalSales;
        this.totalOrders = totalOrders;
        this.activeOrders = activeOrders;
        this.pendingBills = pendingBills;
        this.inventoryAlerts = inventoryAlerts;
    }

    public double getTotalSales() {
        return totalSales;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getActiveOrders() {
        return activeOrders;
    }

    public long getPendingBills() {
        return pendingBills;
    }

    public long getInventoryAlerts() {
        return inventoryAlerts;
    }
}