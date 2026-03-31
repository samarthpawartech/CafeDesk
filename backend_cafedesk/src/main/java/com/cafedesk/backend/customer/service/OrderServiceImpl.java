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
public class OrderServiceImpl {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public CurrentOrder placeOrder(PlaceOrderRequest request) {

        // ✅ DEBUG LOG
        System.out.println("Incoming Order Request: " + request);

        // ❌ VALIDATION
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order items cannot be empty");
        }

        CurrentOrder order = new CurrentOrder();
        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());
        order.setAmount(request.getAmount());
        order.setStatus(OrderStatus.PLACED);

        List<OrderItem> items = new ArrayList<>();

        for (OrderItemDTO i : request.getItems()) {

            if (i == null) continue;

            OrderItem item = new OrderItem();
            item.setName(i.getName());
            item.setPrice(i.getPrice());
            item.setQuantity(i.getQuantity());

            // 🔥 IMPORTANT RELATION
            item.setOrder(order);

            items.add(item);
        }

        // ❌ prevent empty list crash
        if (items.isEmpty()) {
            throw new RuntimeException("No valid items in order");
        }

        order.setItems(items);

        // ✅ SAVE
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