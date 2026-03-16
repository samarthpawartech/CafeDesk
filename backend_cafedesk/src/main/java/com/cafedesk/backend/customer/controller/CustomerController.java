package com.cafedesk.backend.customer.controller;

import com.cafedesk.backend.customer.DTO.PlaceOrderRequest;
import com.cafedesk.backend.customer.DTO.CustomerLoginRequest;
import com.cafedesk.backend.customer.DTO.CustomerRegisterRequest;
import com.cafedesk.backend.customer.DTO.AuthResponse;
import com.cafedesk.backend.Bills.entity.Bill;
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
    public ResponseEntity<AuthResponse> register(
            @RequestBody CustomerRegisterRequest request
    ) {
        AuthResponse response = customerService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody CustomerLoginRequest request
    ) {
        AuthResponse response = customerService.login(request);
        return ResponseEntity.ok(response);
    }

    /* ================= MENU ================= */

    @GetMapping("/menu")
    public ResponseEntity<List<MenuCard>> getMenu() {
        List<MenuCard> menu = customerService.getMenu();
        return ResponseEntity.ok(menu);
    }

    /* ================= ORDER ================= */

    @PostMapping("/place-order")
    public ResponseEntity<Bill> placeOrder(
            @RequestBody PlaceOrderRequest request
    ) {
        Bill savedBill = customerService.placeOrder(request);
        return ResponseEntity.ok(savedBill);
    }

    /* ================= BILLS ================= */

    @GetMapping("/bills/{username}")
    public ResponseEntity<List<Bill>> getBills(
            @PathVariable String username
    ) {
        List<Bill> bills = customerService.getBills(username);
        return ResponseEntity.ok(bills);
    }
}