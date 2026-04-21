package com.cafedesk.backend.Bills.Repository;

import com.cafedesk.backend.Bills.entity.Bill;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    // ✅ FIX N+1 problem
    @EntityGraph(attributePaths = {"items"})
    List<Bill> findByCustomerName(String customerName);
}