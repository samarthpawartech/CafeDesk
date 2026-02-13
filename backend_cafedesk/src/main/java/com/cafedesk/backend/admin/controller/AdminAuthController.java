package com.cafedesk.backend.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cafedesk.backend.admin.DTO.AdminLoginRequest;
import com.cafedesk.backend.admin.DTO.AdminLoginResponse;
import com.cafedesk.backend.admin.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    private final AdminService adminService;

    public AdminAuthController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(
            @RequestBody AdminLoginRequest request) {

        String token = adminService.authenticate(
                request.getUsername(),
                request.getPassword()
        );

        if (token == null) {
            return ResponseEntity
                    .status(401)
                    .body(new AdminLoginResponse("Invalid username or password", null));
        }

        return ResponseEntity.ok(
                new AdminLoginResponse("Login successful", token)
        );
    }
}
