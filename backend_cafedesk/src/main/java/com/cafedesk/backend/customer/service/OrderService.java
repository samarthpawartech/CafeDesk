package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.DTO.OrderItemDTO;
import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.entity.OrderItem;
import com.cafedesk.backend.customer.entity.OrderStatus;
import com.cafedesk.backend.customer.repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // ================= PLACE ORDER =================
    public CurrentOrder placeOrder(PlaceOrderRequest request) {

        CurrentOrder order = new CurrentOrder();

        order.setCustomerName(request.getCustomerName());

        // ✅ Normalize table code properly
        String tableCode = request.getTableNumber().toUpperCase().trim();
        order.setTableNumber(tableCode);

        double total = 0;

        List<OrderItem> itemList = new ArrayList<>();

        if (request.getItems() != null) {
            for (OrderItemDTO dto : request.getItems()) {

                OrderItem item = new OrderItem();
                item.setName(dto.getName());
                item.setPrice(dto.getPrice());
                item.setQuantity(dto.getQuantity());

                item.setOrder(order); // ✅ IMPORTANT (bi-directional mapping fix)

                itemList.add(item);

                total += dto.getPrice() * dto.getQuantity();
            }
        }

        order.setItems(itemList); // ✅ set full list

        order.setAmount(total);
        order.setStatus(OrderStatus.PENDING);

        CurrentOrder saved = orderRepository.save(order);

        System.out.println("✅ ORDER SAVED: ID=" + saved.getId() + " TABLE=" + tableCode);

        return saved;
    }

    // ================= GET CUSTOMER ORDERS =================
    public List<CurrentOrder> getCustomerBills(String username) {
        return orderRepository.findByCustomerName(username);
    }

    // ================= GET ALL ORDERS =================
    public List<CurrentOrder> getAllOrders() {

        List<CurrentOrder> orders = orderRepository.findAll();

        System.out.println("🔥 TOTAL ORDERS IN DB: " + orders.size());

        return orders != null ? orders : List.of();
    }

    // ================= UPDATE STATUS =================
    public void updateOrderStatus(Long orderId, String status) {

        CurrentOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());

        order.setStatus(newStatus);

        orderRepository.save(order);
    }

    // ================= GET ORDERS BY TABLE =================
    public List<CurrentOrder> getOrdersByTable(String tableCode) {

        // ✅ Normalize input
        String normalized = tableCode.toUpperCase().trim();

        System.out.println("🔍 Fetching orders for table: " + normalized);

        List<CurrentOrder> orders = orderRepository.findByTableNumber(normalized);

        if (orders == null || orders.isEmpty()) {
            System.out.println("⚠️ No orders found for table: " + normalized);
            return List.of();
        }

        System.out.println("📦 Orders found: " + orders.size());

        // ✅ FIX Lazy loading (VERY IMPORTANT)
        orders.forEach(order -> {
            if (order.getItems() != null) {
                order.getItems().forEach(item -> {
                    item.getName(); // force load
                });
            }
        });

        return orders;
    }
}