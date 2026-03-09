package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.DTO.OrderItemDTO;
import com.cafedesk.backend.customer.entity.Order;
import com.cafedesk.backend.customer.entity.OrderItem;
import com.cafedesk.backend.customer.repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl extends OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Order placeOrder(PlaceOrderRequest request) {

        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());
        order.setAmount(request.getAmount());
        order.setStatus("PENDING");

        List<OrderItem> items = new ArrayList<>();

        for (OrderItemDTO dto : request.getItems()) {

            OrderItem item = new OrderItem();
            item.setName(dto.getName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());

            // Link item to order
            item.setOrder(order);

            items.add(item);
        }

        // Attach items to order
        order.setItems(items);

        // Cascade will save items automatically
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getCustomerBills(String username) {

        // Return only this customer's bills
        return orderRepository.findByCustomerName(username);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}