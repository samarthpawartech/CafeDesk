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

        // ✅ Create Order
        CurrentOrder order = new CurrentOrder();
        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());
        order.setAmount(request.getAmount());
        order.setStatus(OrderStatus.APPROVED);

        List<OrderItem> items = new ArrayList<>();

        // ✅ Null safety (IMPORTANT)
        if (request.getItems() != null) {
            for (OrderItemDTO dto : request.getItems()) {

                OrderItem item = new OrderItem();
                item.setName(dto.getName());
                item.setPrice(dto.getPrice());
                item.setQuantity(dto.getQuantity());

                // Link item to order
                item.setOrder(order);

                items.add(item);
            }
        }

        // ✅ Attach items to order (required for cascade)
        order.setItems(items);

        // ✅ Save order (items auto-saved via cascade)
        return orderRepository.save(order);
    }

    public List<CurrentOrder> getCustomerBills(String username) {
        return orderRepository.findByCustomerName(username);
    }

    public List<CurrentOrder> getAllOrders() {
        return orderRepository.findAll();
    }
}