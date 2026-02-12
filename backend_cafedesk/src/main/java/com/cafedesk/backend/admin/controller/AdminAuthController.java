package com.cafedesk.backend.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cafedesk.backend.admin.DTO.AdminLoginRequest;
import com.cafedesk.backend.admin.DTO.AdminLoginResponse;
import com.cafedesk.backend.admin.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminAuthController {

    private final AdminService adminService;

    public AdminAuthController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {

        boolean isValid = adminService.authenticate(
                request.getUsername(),
                request.getPassword()
        );

        if (isValid) {
            return ResponseEntity.ok(
                    new AdminLoginResponse("Login successful", null)
            );
        }

        return ResponseEntity
                .status(401)
                .body(new AdminLoginResponse("Invalid username or password", null));
    }
}
