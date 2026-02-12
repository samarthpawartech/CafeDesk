package com.cafedesk.backend.admin.service;

import org.springframework.stereotype.Service;

import com.cafedesk.backend.admin.repository.AdminRepository;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public boolean authenticate(String username, String password) {
        return adminRepository
                .findByUsernameAndPassword(username, password)
                .isPresent();
    }
}
