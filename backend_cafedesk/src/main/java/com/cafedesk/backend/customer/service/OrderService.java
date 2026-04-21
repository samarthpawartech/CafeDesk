package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.DTO.OrderItemDTO;
import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.entity.OrderItem;
import com.cafedesk.backend.customer.entity.OrderStatus;
import com.cafedesk.backend.customer.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public CurrentOrder placeOrder(PlaceOrderRequest request) {

        // ✅ Create order
        CurrentOrder order = new CurrentOrder();
        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());

        double total = 0;
        List<OrderItem> items = new ArrayList<>();

        // ✅ Create items + link to order
        for (OrderItemDTO dto : request.getItems()) {

            OrderItem item = new OrderItem();
            item.setName(dto.getName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());

            // 🔥 VERY IMPORTANT
            item.setOrder(order);

            total += dto.getPrice() * dto.getQuantity();
            items.add(item);
        }

        // ✅ attach items to order
        order.setItems(items);

        // ✅ set calculated total
        order.setAmount(total);

        // ✅ correct initial status
        order.setStatus(OrderStatus.PENDING);

        // ✅ SINGLE SAVE (cascade handles items)
        return orderRepository.save(order);
    }

    public List<CurrentOrder> getCustomerBills(String username) {
        return orderRepository.findByCustomerName(username);
    }

    public List<CurrentOrder> getAllOrders() {
        return orderRepository.findAll();
    }
}