package com.cafedesk.backend.admin.repository;

import com.cafedesk.backend.admin.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
}