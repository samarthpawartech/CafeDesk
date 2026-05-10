package com.cafedesk.backend.admin.service;

import com.cafedesk.backend.Bills.Repository.BillRepository;
import com.cafedesk.backend.Bills.entity.Bill;
import com.cafedesk.backend.admin.DTO.CategorySalesDTO;
import com.cafedesk.backend.admin.DTO.DashboardSummaryDTO;
import com.cafedesk.backend.admin.DTO.WeeklySalesDTO;
import com.cafedesk.backend.admin.entity.InventoryItem;
import com.cafedesk.backend.admin.repository.InventoryRepository;
import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.entity.OrderStatus;
import com.cafedesk.backend.customer.repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final BillRepository billRepository;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;

    public DashboardService(
            BillRepository billRepository,
            OrderRepository orderRepository,
            InventoryRepository inventoryRepository
    ) {
        this.billRepository = billRepository;
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
    }

    // ================= SUMMARY =================

    public DashboardSummaryDTO getSummary() {

        List<Bill> bills = billRepository.findAll();

        double totalSales = bills.stream()
                .filter(b -> "PAID".equalsIgnoreCase(b.getStatus()))
                .mapToDouble(Bill::getTotalAmount)
                .sum();

        long totalOrders = orderRepository.count();

        long activeOrders = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != OrderStatus.COMPLETED)
                .count();

        long pendingBills = bills.stream()
                .filter(b -> "PENDING".equalsIgnoreCase(b.getStatus()))
                .count();

        long inventoryAlerts = inventoryRepository.findAll().stream()
                .filter(i ->
                        "low-stock".equalsIgnoreCase(i.getStatus())
                                || "critical".equalsIgnoreCase(i.getStatus())
                )
                .count();

        return new DashboardSummaryDTO(
                totalSales,
                totalOrders,
                activeOrders,
                pendingBills,
                inventoryAlerts
        );
    }

    // ================= WEEKLY SALES =================

    public List<WeeklySalesDTO> getWeeklySales() {

        List<Bill> bills = billRepository.findAll();

        Map<DayOfWeek, Double> salesMap = new LinkedHashMap<>();

        for (DayOfWeek day : DayOfWeek.values()) {
            salesMap.put(day, 0.0);
        }

        LocalDate now = LocalDate.now();

        bills.stream()
                .filter(b -> "PAID".equalsIgnoreCase(b.getStatus()))
                .forEach(b -> {

                    LocalDate billDate = b.getCreatedAt().toLocalDate();

                    if (billDate.isAfter(now.minusDays(7))) {

                        DayOfWeek day = billDate.getDayOfWeek();

                        salesMap.put(
                                day,
                                salesMap.get(day) + b.getTotalAmount()
                        );
                    }
                });

        return salesMap.entrySet()
                .stream()
                .map(e -> new WeeklySalesDTO(
                        e.getKey().name().substring(0, 3),
                        e.getValue()
                ))
                .collect(Collectors.toList());
    }

    // ================= CATEGORY SALES =================

    public List<CategorySalesDTO> getCategorySales() {

        List<InventoryItem> items = inventoryRepository.findAll();

        Map<String, Double> categoryMap = new HashMap<>();

        for (InventoryItem item : items) {

            categoryMap.put(
                    item.getCategory(),
                    categoryMap.getOrDefault(item.getCategory(), 0.0)
                            + item.getQuantity()
            );
        }

        return categoryMap.entrySet()
                .stream()
                .map(e -> new CategorySalesDTO(
                        e.getKey(),
                        e.getValue()
                ))
                .collect(Collectors.toList());
    }

    // ================= LOW STOCK =================

    public List<InventoryItem> getLowStockItems() {

        return inventoryRepository.findAll()
                .stream()
                .filter(i ->
                        "low-stock".equalsIgnoreCase(i.getStatus())
                                || "critical".equalsIgnoreCase(i.getStatus())
                )
                .collect(Collectors.toList());
    }

    // ================= ACTIVE ORDERS =================

    public List<CurrentOrder> getActiveOrders() {

        return orderRepository.findAll()
                .stream()
                .filter(o -> o.getStatus() != OrderStatus.COMPLETED)
                .collect(Collectors.toList());
    }
}