package com.cafedesk.backend.customer.repository;

import com.cafedesk.backend.customer.entity.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillItemRepository extends JpaRepository<BillItem, Long> {
    // Optional: add custom queries if needed
}