package com.cafedesk.backend.customer.controller;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.service.OrderServiceImpl;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/orders")
@CrossOrigin(origins = "*")
public class CustomerOrderController {

    private final OrderServiceImpl orderService;

    public CustomerOrderController(OrderServiceImpl orderService) {
        this.orderService = orderService;
    }

    // ================= PLACE ORDER =================
    @PostMapping("/place-order")
    public ResponseEntity<?> placeOrder(@RequestBody PlaceOrderRequest request) {
        try {
            CurrentOrder order = orderService.placeOrder(request);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Order failed: " + e.getMessage());
        }
    }

    // ================= FETCH CUSTOMER ORDERS =================
    @GetMapping("/customer/{username}")
    public ResponseEntity<List<CurrentOrder>> getCustomerOrders(@PathVariable String username) {

        // ✅ Correct method name (IMPORTANT FIX)
        List<CurrentOrder> orders = orderService.getCustomerOrders(username);

        return ResponseEntity.ok(orders);
    }

    // ================= FETCH CUSTOMER BILLS =================
    @GetMapping("/{username}/order-bills")
    public ResponseEntity<List<CurrentOrder>> getCustomerBills(@PathVariable String username) {

        List<CurrentOrder> bills = orderService.getCustomerBills(username);

        return ResponseEntity.ok(bills);
    }

    // ================= ALL ORDERS =================
    @GetMapping("/all")
    public ResponseEntity<List<CurrentOrder>> getAllOrders() {

        List<CurrentOrder> orders = orderService.getAllOrders();

        return ResponseEntity.ok(orders);
    }
}