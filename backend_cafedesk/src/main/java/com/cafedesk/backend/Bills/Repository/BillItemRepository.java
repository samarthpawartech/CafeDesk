package com.cafedesk.backend.Bills.Repository;

import com.cafedesk.backend.Bills.entity.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillItemRepository extends JpaRepository<BillItem, Long> {
    // Optional: add custom queries if needed
}