package com.cafedesk.backend.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cafedesk.backend.admin.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    // ✅ Find by username only
    Optional<Admin> findByUsername(String username);
}
