package com.cafedesk.backend.Payment;

import com.cafedesk.backend.Bills.entity.Bill;
import com.cafedesk.backend.Bills.Repository.BillRepository;
import com.cafedesk.backend.customer.entity.Customer;
import com.cafedesk.backend.customer.repository.CustomerRepository;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    private final BillRepository billRepository;
    private final CustomerRepository customerRepository;

    // 🔑 ADD YOUR KEYS
    private static final String APP_ID = "YOUR_APP_ID";
    private static final String SECRET_KEY = "YOUR_SECRET_KEY";

    public PaymentController(BillRepository billRepository,
                             CustomerRepository customerRepository) {
        this.billRepository = billRepository;
        this.customerRepository = customerRepository;
    }

    // ✅ CREATE CASHFREE ORDER
    @PostMapping("/create-order/{billId}")
    public ResponseEntity<?> createOrder(@PathVariable Long billId) {

        try {
            // 🔥 Get Bill
            Bill bill = billRepository.findById(billId)
                    .orElseThrow(() -> new RuntimeException("Bill not found"));

            // ❌ Prevent duplicate payment
            if ("PAID".equalsIgnoreCase(bill.getStatus())) {
                return ResponseEntity.badRequest().body("Bill already paid");
            }

            // 🔥 Get Customer from DB
            Customer customerData = customerRepository
                    .findByUsername(bill.getCustomerName())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            String orderId = "order_" + UUID.randomUUID();

            // 🔥 Cashfree API URL
            String url = "https://sandbox.cashfree.com/pg/orders";

            RestTemplate restTemplate = new RestTemplate();

            // 🔥 Headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-client-id", APP_ID);
            headers.set("x-client-secret", SECRET_KEY);
            headers.set("x-api-version", "2022-09-01");
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 🔥 Request Body
            Map<String, Object> body = new HashMap<>();
            body.put("order_id", orderId);
            body.put("order_amount", bill.getTotalAmount());
            body.put("order_currency", "INR");

            Map<String, String> customer = new HashMap<>();
            customer.put("customer_id", "cust_" + customerData.getId());
            customer.put("customer_name", customerData.getUsername());
            customer.put("customer_email", customerData.getEmail());
            customer.put("customer_phone", customerData.getPhone());

            body.put("customer_details", customer);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            // 🔥 Call Cashfree API
            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            // ✅ Save Order ID in DB
            bill.setCfOrderId(orderId);
            billRepository.save(bill);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}