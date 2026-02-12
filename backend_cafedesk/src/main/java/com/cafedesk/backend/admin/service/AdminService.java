package com.cafedesk.backend.admin.service;

import org.springframework.stereotype.Service;

@Service
public class AdminService {

    public boolean authenticate(String username, String password) {

        // Example hardcoded validation
        if ("admin".equals(username) && "admin123".equals(password)) {
            return true;
        }

        return false;
    }
}
