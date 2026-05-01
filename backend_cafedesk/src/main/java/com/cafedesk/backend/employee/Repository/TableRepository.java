package com.cafedesk.backend.employee.Repository;

import com.cafedesk.backend.employee.entity.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface TableRepository extends JpaRepository<TableEntity, Long> {

    // 🔍 Find table by table code (T01, T02)
    Optional<TableEntity> findByTableCode(String tableCode);

    // 🔍 Get all tables sorted properly (T01, T02, T10...)
    List<TableEntity> findAllByOrderByTableCodeAsc();

    // ✅ Prevent duplicate inserts
    boolean existsByTableCode(String tableCode);
}