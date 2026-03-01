package com.cafedesk.backend.customer.controller;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.DTO.CustomerLoginRequest;
import com.cafedesk.backend.customer.DTO.CustomerRegisterRequest;
import com.cafedesk.backend.customer.DTO.FeedbackRequest;
import com.cafedesk.backend.customer.DTO.AuthResponse;
import com.cafedesk.backend.customer.entity.Bill;
import com.cafedesk.backend.customer.entity.Feedback;
import com.cafedesk.backend.customer.entity.MenuCard;
import com.cafedesk.backend.customer.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /* ================= AUTH ================= */

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody CustomerRegisterRequest request) {
        return ResponseEntity.ok(customerService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody CustomerLoginRequest request) {
        return ResponseEntity.ok(customerService.login(request));
    }

    /* ================= DASHBOARD ================= */

    @GetMapping("/menu")
    public List<MenuCard> getMenu() {
        return customerService.getMenu();
    }

    // ✅ FIXED: place-order endpoint properly reads request body
    @PostMapping("/place-order")
    public ResponseEntity<Bill> placeOrder(@RequestBody PlaceOrderRequest request) {
        Bill savedBill = customerService.placeOrder(request);
        return ResponseEntity.ok(savedBill);
    }

    @GetMapping("/bills/{username}")
    public List<Bill> getBills(@PathVariable String username) {
        return customerService.getBills(username);
    }

    @PostMapping("/feedback")
    public ResponseEntity<Feedback> submitFeedback(@RequestBody FeedbackRequest request) {
        Feedback feedback = customerService.submitFeedback(request);
        return ResponseEntity.ok(feedback);
    }
}