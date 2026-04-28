package com.cafedesk.backend.employee.Repository;

import com.cafedesk.backend.employee.entity.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TableRepository extends JpaRepository<TableEntity, Long> {

    // 🔍 Find table by QR code (T01, T02)
    Optional<TableEntity> findByTableCode(String tableCode);

    // ✅ Prevent duplicate inserts (VERY IMPORTANT)
    boolean existsByTableCode(String tableCode);
}