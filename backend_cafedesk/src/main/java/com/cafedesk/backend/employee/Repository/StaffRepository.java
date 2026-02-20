package com.cafedesk.backend.employee.Repository;

import com.cafedesk.backend.employee.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    Optional<Staff> findByMobileNumberAndEmail(String mobileNumber, String email);
}
