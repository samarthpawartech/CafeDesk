package com.cafedesk.backend.customer.controller;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.service.OrderServiceImpl;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
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
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody PlaceOrderRequest request) {

        try {
            // 🔥 DEBUG LOG
            System.out.println("API HIT: Place Order");
            System.out.println("Request Data: " + request);

            CurrentOrder order = orderService.placeOrder(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(order);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Order failed: " + e.getMessage());
        }
    }

    // ================= FETCH CUSTOMER ORDERS =================
    @GetMapping("/customer/{username}")
    public ResponseEntity<List<CurrentOrder>> getCustomerOrders(@PathVariable String username) {

        System.out.println("Fetching orders for: " + username);

        List<CurrentOrder> orders = orderService.getCustomerBills(username);
        return ResponseEntity.ok(orders);
    }

    // ================= CUSTOMER BILLS =================
    @GetMapping("/{username}/order-bills")
    public ResponseEntity<List<CurrentOrder>> getCustomerBills(@PathVariable String username) {

        List<CurrentOrder> orders = orderService.getCustomerBills(username);
        return ResponseEntity.ok(orders);
    }

    // ================= ALL ORDERS =================
    @GetMapping("/all")
    public ResponseEntity<List<CurrentOrder>> getAllOrders() {

        System.out.println("Fetching all orders");

        List<CurrentOrder> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
}