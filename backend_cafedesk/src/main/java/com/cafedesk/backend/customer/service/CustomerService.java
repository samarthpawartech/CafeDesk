package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.DTO.*;
import com.cafedesk.backend.customer.entity.*;
import com.cafedesk.backend.customer.repository.*;
import com.cafedesk.backend.Security.jwt.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMenuRepository menuRepository;
    private final BillRepository billRepository;
    private final FeedbackRepository feedbackRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public CustomerService(
            CustomerRepository customerRepository,
            CustomerMenuRepository menuRepository,
            BillRepository billRepository,
            FeedbackRepository feedbackRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.customerRepository = customerRepository;
        this.menuRepository = menuRepository;
        this.billRepository = billRepository;
        this.feedbackRepository = feedbackRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /* ================= AUTH ================= */

    public AuthResponse register(CustomerRegisterRequest request) {

        if (customerRepository.existsByUsername(request.getUsername().trim())) {
            throw new RuntimeException("Username already exists");
        }

        if (customerRepository.existsByEmail(request.getEmail().trim())) {
            throw new RuntimeException("Email already exists");
        }

        Customer customer = new Customer();
        customer.setUsername(request.getUsername().trim());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail().trim());
        customer.setPhone(request.getPhone());
        customer.setRole("CUSTOMER");

        customerRepository.save(customer);

        String token = jwtUtil.generateToken(
                customer.getUsername(),
                customer.getRole()
        );

        return new AuthResponse(token);
    }

    public AuthResponse login(CustomerLoginRequest request) {

        Customer customer = customerRepository
                .findByUsername(request.getUsername().trim())
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                customer.getPassword())
        ) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(
                customer.getUsername(),
                customer.getRole()
        );

        return new AuthResponse(token);
    }

    /* ================= DASHBOARD ================= */

    public List<MenuCard> getMenu() {
        return menuRepository.findByAvailableTrue();
    }

    /* ================= PLACE ORDER ================= */

    public Bill placeOrder(PlaceOrderRequest request) {

        Bill bill = new Bill();

        // Auto generate invoice number
        bill.setInvoiceNumber("INV-" + System.currentTimeMillis());

        bill.setCustomerName(request.getCustomerName());
        bill.setTableNumber(request.getTableNumber());
        bill.setAmount(request.getAmount());
        bill.setStatus("PAID");
        bill.setDate(LocalDateTime.now());

        List<BillItem> billItems = new ArrayList<>();

        if (request.getItems() != null) {

            for (OrderItemDTO item : request.getItems()) {

                BillItem billItem = new BillItem();
                billItem.setName(item.getName());
                billItem.setPrice(item.getPrice());
                billItem.setQuantity(item.getQuantity());
                billItem.setBill(bill);

                billItems.add(billItem);
            }
        }

        bill.setItems(billItems);

        return billRepository.save(bill);
    }

    /* ================= BILLS ================= */

    public List<Bill> getBills(String username) {
        return billRepository.findByCustomerName(username);
    }

    /* ================= FEEDBACK ================= */

    public Feedback submitFeedback(FeedbackRequest request) {

        Feedback feedback = new Feedback();
        feedback.setCustomerName(request.getCustomerName());
        feedback.setRating(request.getRating());
        feedback.setRemark(request.getRemark());
        feedback.setDate(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }
}