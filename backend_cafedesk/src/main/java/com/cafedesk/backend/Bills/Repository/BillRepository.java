package com.cafedesk.backend.Bills.Repository;

import com.cafedesk.backend.Bills.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    // 🔍 OLD (kept if needed)
    List<Bill> findByCustomerName(String customerName);

    // 🔥 FIX 1: Fetch all bills with items (avoids N+1)
    @Query("SELECT DISTINCT b FROM Bill b LEFT JOIN FETCH b.items")
    List<Bill> findAllWithItems();

    // 🔥 FIX 2: Fetch customer bills with items (avoids N+1)
    @Query("SELECT DISTINCT b FROM Bill b LEFT JOIN FETCH b.items WHERE b.customerName = :name")
    List<Bill> findByCustomerNameWithItems(@Param("name") String name);

    // 🔥 Used for auto invoice number generation (INV-0001)
    Long countBy();
}