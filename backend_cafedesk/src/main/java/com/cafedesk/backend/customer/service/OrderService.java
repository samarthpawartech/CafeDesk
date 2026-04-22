package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.DTO.OrderItemDTO;
import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.entity.OrderItem;
import com.cafedesk.backend.customer.entity.OrderStatus;
import com.cafedesk.backend.customer.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // ================= PLACE ORDER =================
    public CurrentOrder placeOrder(PlaceOrderRequest request) {

        CurrentOrder order = new CurrentOrder();
        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());

        double total = 0;

        // 🔥 IMPORTANT: USE addItem() instead of setItems()
        for (OrderItemDTO dto : request.getItems()) {

            OrderItem item = new OrderItem();
            item.setName(dto.getName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());

            order.addItem(item); // ✅ FIXED

            total += dto.getPrice() * dto.getQuantity();
        }

        order.setAmount(total);
        order.setStatus(OrderStatus.PENDING);

        CurrentOrder saved = orderRepository.save(order);

        System.out.println("✅ ORDER SAVED WITH ID: " + saved.getId());

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
        return orders;
    }

    // ================= UPDATE STATUS =================
    public void updateOrderStatus(Long orderId, String status) {

        CurrentOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
        order.setStatus(newStatus);

        orderRepository.save(order);
    }
}