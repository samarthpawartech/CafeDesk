package com.cafedesk.backend.admin.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cafedesk.backend.admin.entity.Admin;
import com.cafedesk.backend.admin.repository.AdminRepository;
import com.cafedesk.backend.Security.jwt.JwtUtil;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository,
                        JwtUtil jwtUtil,
                        PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public String authenticate(String username, String password) {

        Admin admin = adminRepository
                .findByUsername(username)
                .orElse(null);

        if (admin == null) {
            return null;
        }

        // ✅ BCrypt password check (FIXED)
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            return null;
        }

        // ✅ Generate JWT token with role
        return jwtUtil.generateToken(
                admin.getUsername(),
                admin.getRole()
        );
    }
}