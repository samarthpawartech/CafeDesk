package com.cafedesk.backend.admin.service;

import org.springframework.stereotype.Service;

import com.cafedesk.backend.admin.entity.Admin;
import com.cafedesk.backend.admin.repository.AdminRepository;
import com.cafedesk.backend.Security.jwt.JwtUtil;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;

    public AdminService(AdminRepository adminRepository,
                        JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
    }

    public String authenticate(String username, String password) {

        Admin admin = adminRepository
                .findByUsername(username)
                .orElse(null);

        if (admin == null) {
            return null;
        }

        // 🔐 Plain password check (NOT secure, for testing only)
        if (!admin.getPassword().equals(password)) {
            return null;
        }

        // ✅ Generate JWT token
        return jwtUtil.generateToken(admin.getUsername(), "ADMIN");
    }
}
