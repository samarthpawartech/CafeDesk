package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.DTO.*;
import com.cafedesk.backend.customer.entity.Customer;
import com.cafedesk.backend.customer.repository.CustomerRepository;
import com.cafedesk.backend.Security.jwt.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public CustomerService(CustomerRepository customerRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ✅ REGISTER METHOD (ADDED)
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

        // Generate JWT token after registration
        String token = jwtUtil.generateToken(
                customer.getUsername(),
                customer.getRole()
        );

        return new AuthResponse(token);
    }

    // ✅ LOGIN METHOD (YOUR ORIGINAL - KEPT)
    public AuthResponse login(CustomerLoginRequest request) {

        Customer customer = customerRepository
                .findByUsername(request.getUsername().trim())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(
                customer.getUsername(),
                customer.getRole()
        );

        return new AuthResponse(token);
    }
}
