package com.cafedesk.backend.customer.controller;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/orders")
@CrossOrigin(origins = "*")
public class CustomerOrderController {

    private final OrderService orderService;

    // ✅ Constructor Injection
    public CustomerOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ================= PLACE ORDER =================
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody PlaceOrderRequest request) {

        try {
            System.out.println("🚀 API HIT: Place Order");
            System.out.println("📦 Request Data: " + request);

            CurrentOrder order = orderService.placeOrder(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(order);

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("❌ Order failed: " + e.getMessage());
        }
    }

    // ================= CUSTOMER ORDERS =================
    @GetMapping("/customer/{username}")
    public ResponseEntity<List<CurrentOrder>> getOrdersByCustomer(@PathVariable String username) {

        try {
            System.out.println("📦 Fetching orders for: " + username);

            List<CurrentOrder> orders = orderService.getCustomerBills(username);

            return ResponseEntity.ok(orders != null ? orders : List.of());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    // ================= CUSTOMER BILLS =================
    @GetMapping("/bills/{username}")
    public ResponseEntity<List<CurrentOrder>> getCustomerBills(@PathVariable String username) {

        try {
            System.out.println("🧾 Fetching bills for: " + username);

            List<CurrentOrder> orders = orderService.getCustomerBills(username);

            return ResponseEntity.ok(orders != null ? orders : List.of());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    // ================= ALL ORDERS (EMPLOYEE USES THIS) =================
    @GetMapping("/all")
    public ResponseEntity<List<CurrentOrder>> getAllOrders() {

        try {
            System.out.println("📊 Fetching all orders");

            List<CurrentOrder> orders = orderService.getAllOrders();

            return ResponseEntity.ok(orders != null ? orders : List.of());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    // ================= 🔥 UPDATE ORDER STATUS (NEW FIX) =================
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        try {
            System.out.println("🔄 Updating order " + orderId + " to " + status);

            orderService.updateOrderStatus(orderId, status);

            return ResponseEntity.ok("✅ Status updated");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("❌ Failed to update status: " + e.getMessage());
        }
    }
}