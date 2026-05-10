package com.cafedesk.backend.admin.controller;

import com.cafedesk.backend.admin.DTO.CategorySalesDTO;
import com.cafedesk.backend.admin.DTO.DashboardSummaryDTO;
import com.cafedesk.backend.admin.DTO.WeeklySalesDTO;
import com.cafedesk.backend.admin.service.DashboardService;
import com.cafedesk.backend.admin.entity.InventoryItem;
import com.cafedesk.backend.customer.entity.CurrentOrder;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin("*")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    public AdminDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryDTO getSummary() {
        return dashboardService.getSummary();
    }

    @GetMapping("/weekly-sales")
    public List<WeeklySalesDTO> getWeeklySales() {
        return dashboardService.getWeeklySales();
    }

    @GetMapping("/category-sales")
    public List<CategorySalesDTO> getCategorySales() {
        return dashboardService.getCategorySales();
    }

    @GetMapping("/low-stock")
    public List<InventoryItem> getLowStockItems() {
        return dashboardService.getLowStockItems();
    }

    @GetMapping("/active-orders")
    public List<CurrentOrder> getActiveOrders() {
        return dashboardService.getActiveOrders();
    }
}