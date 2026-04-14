package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.DTO.OrderItemDTO;
import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.entity.OrderItem;
import com.cafedesk.backend.customer.entity.OrderStatus;
import com.cafedesk.backend.customer.repository.OrderRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // 🔥 FIXED: Transaction added
    @Transactional
    public CurrentOrder placeOrder(PlaceOrderRequest request) {

        // ✅ DEBUG LOG
        System.out.println("Incoming Order Request: " + request);

        // ❌ VALIDATION
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order items cannot be empty");
        }

        // ✅ CREATE ORDER
        CurrentOrder order = new CurrentOrder();
        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());
        order.setAmount(request.getAmount());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> items = new ArrayList<>();

        // 🔥 MAP DTO → ENTITY
        for (OrderItemDTO i : request.getItems()) {

            if (i == null) continue;

            OrderItem item = new OrderItem();
            item.setName(i.getName());
            item.setPrice(i.getPrice());
            item.setQuantity(i.getQuantity());

            // 🔥 VERY IMPORTANT: Set relation
            item.setOrder(order);

            items.add(item);
        }

        // ❌ prevent empty list crash
        if (items.isEmpty()) {
            throw new RuntimeException("No valid items in order");
        }

        // ✅ SET ITEMS (also ensures bidirectional mapping)
        order.setItems(items);

        // ✅ DEBUG
        System.out.println("Saving order with " + items.size() + " items");

        // ✅ SAVE (cascade saves items automatically)
        CurrentOrder savedOrder = orderRepository.save(order);

        System.out.println("Order Saved Successfully: " + savedOrder.getId());

        return savedOrder;
    }

    public List<CurrentOrder> getCustomerBills(String username) {
        return orderRepository.findByCustomerName(username);
    }

    public List<CurrentOrder> getAllOrders() {
        return orderRepository.findAll();
    }
}