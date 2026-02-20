package com.cafedesk.backend.admin.repository;

import com.cafedesk.backend.admin.entity.EmployeeManagement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeManagementRepository extends JpaRepository<EmployeeManagement, Long> {

    Optional<EmployeeManagement> findByEmail(String email);

    boolean existsByEmail(String email);
}
