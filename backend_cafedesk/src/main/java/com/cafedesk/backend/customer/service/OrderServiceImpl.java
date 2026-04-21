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
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // ================= PLACE ORDER =================
    public CurrentOrder placeOrder(PlaceOrderRequest request) {

        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order items cannot be empty");
        }

        CurrentOrder order = new CurrentOrder();
        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());
        order.setAmount(request.getAmount());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> items = new ArrayList<>();

        for (OrderItemDTO i : request.getItems()) {

            if (i == null) continue;

            OrderItem item = new OrderItem();
            item.setName(i.getName());
            item.setPrice(i.getPrice());
            item.setQuantity(i.getQuantity());

            item.setOrder(order);
            items.add(item);
        }

        if (items.isEmpty()) {
            throw new RuntimeException("No valid items in order");
        }

        order.setItems(items);

        return orderRepository.save(order);
    }

    // ================= FETCH CUSTOMER ORDERS =================
    public List<CurrentOrder> getCustomerOrders(String username) {

        List<CurrentOrder> allOrders = orderRepository.findAll();

        return allOrders.stream()
                .filter(order -> order.getCustomerName() != null &&
                        order.getCustomerName().equalsIgnoreCase(username))
                .collect(Collectors.toList());
    }

    // ================= CUSTOMER BILLS =================
    public List<CurrentOrder> getCustomerBills(String username) {

        List<CurrentOrder> allOrders = orderRepository.findAll();

        return allOrders.stream()
                .filter(order -> order.getCustomerName() != null &&
                        order.getCustomerName().equalsIgnoreCase(username))
                .collect(Collectors.toList());
    }

    // ================= ALL ORDERS =================
    public List<CurrentOrder> getAllOrders() {
        return orderRepository.findAll();
    }
}