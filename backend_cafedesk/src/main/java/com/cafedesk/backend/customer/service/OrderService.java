package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.DTO.OrderItemDTO;
import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.entity.OrderItem;
import com.cafedesk.backend.customer.entity.OrderStatus;
import com.cafedesk.backend.customer.repository.OrderRepository;

// 🔥 IMPORT BILL MODULE
import com.cafedesk.backend.Bills.Service.BillService;
import com.cafedesk.backend.Bills.DTO.BillRequestDTO;
import com.cafedesk.backend.Bills.DTO.BillitemDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // 🔥 ADD THIS
    @Autowired
    private BillService billService;

    // ================= PLACE ORDER =================
    public CurrentOrder placeOrder(PlaceOrderRequest request) {

        CurrentOrder order = new CurrentOrder();
        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());

        double total = 0;

        // 🔥 ADD ITEMS
        for (OrderItemDTO dto : request.getItems()) {

            OrderItem item = new OrderItem();
            item.setName(dto.getName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());

            order.addItem(item);

            total += dto.getPrice() * dto.getQuantity();
        }

        order.setAmount(total);
        order.setStatus(OrderStatus.PENDING);

        // ✅ SAVE ORDER
        CurrentOrder saved = orderRepository.save(order);

        System.out.println("✅ ORDER SAVED WITH ID: " + saved.getId());

        // ================= 🔥 CREATE BILL =================
        try {
            BillRequestDTO billRequest = new BillRequestDTO();
            billRequest.setCustomerName(saved.getCustomerName());
            billRequest.setTableNumber(saved.getTableNumber());

            // 🔥 CONVERT ORDER ITEMS → BILL ITEMS
            List<BillitemDTO> billItems = saved.getItems()
                    .stream()
                    .map(item -> {
                        BillitemDTO dto = new BillitemDTO();
                        dto.setName(item.getName());
                        dto.setPrice(item.getPrice());
                        dto.setQuantity(item.getQuantity());
                        return dto;
                    })
                    .collect(Collectors.toList());

            billRequest.setItems(billItems);

            billService.createBill(billRequest);

            System.out.println("🧾 BILL CREATED SUCCESSFULLY");
        } catch (Exception e) {
            System.out.println("❌ BILL CREATION FAILED: " + e.getMessage());
        }

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