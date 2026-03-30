package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.DTO.OrderItemDTO;
import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.entity.OrderItem;
import com.cafedesk.backend.customer.entity.OrderStatus;
import com.cafedesk.backend.customer.repository.OrderRepository;
import com.cafedesk.backend.customer.repository.OrderItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public CurrentOrder placeOrder(PlaceOrderRequest request) {

        // Create order
        CurrentOrder order = new CurrentOrder();
        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());
        order.setAmount(request.getAmount());
        order.setStatus(OrderStatus.APPROVED);

        // Save order first
        CurrentOrder savedOrder = orderRepository.save(order);

        List<OrderItem> items = new ArrayList<>();

        for (OrderItemDTO dto : request.getItems()) {

            OrderItem item = new OrderItem();

            item.setName(dto.getName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());

            // link item to order
            item.setOrder(savedOrder);

            items.add(item);
        }

        // Save all order items
        orderItemRepository.saveAll(items);

        return savedOrder;
    }

    public List<CurrentOrder> getCustomerBills(String username) {
        return orderRepository.findByCustomerName(username);
    }

    public List<CurrentOrder> getAllOrders() {
        return orderRepository.findAll();
    }
}