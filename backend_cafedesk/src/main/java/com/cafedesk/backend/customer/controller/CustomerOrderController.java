package com.cafedesk.backend.customer.controller;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.entity.Order;
import com.cafedesk.backend.customer.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/orders")
@CrossOrigin(origins = "*")
public class CustomerOrderController {

    private final OrderService orderService;

    public CustomerOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ================= PLACE ORDER =================
    @PostMapping("/place-order")
    public ResponseEntity<?> placeOrder(@RequestBody PlaceOrderRequest request) {

        try {
            Order order = orderService.placeOrder(request);
            return ResponseEntity.ok(order);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Order failed: " + e.getMessage());
        }
    }

    // ================= FETCH CUSTOMER ORDERS =================
    @GetMapping("/customer/{username}")
    public ResponseEntity<List<Order>> getCustomerOrders(@PathVariable String username) {

        List<Order> orders = orderService.getCustomerBills(username);

        return ResponseEntity.ok(orders);
    }

    // ================= CUSTOMER BILLS =================
    @GetMapping("/bills/{username}")
    public ResponseEntity<List<Order>> getCustomerBills(@PathVariable String username) {

        List<Order> orders = orderService.getCustomerBills(username);

        return ResponseEntity.ok(orders);
    }

    // ================= ALL ORDERS (ADMIN / KITCHEN) =================
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {

        List<Order> orders = orderService.getAllOrders();

        return ResponseEntity.ok(orders);
    }
}