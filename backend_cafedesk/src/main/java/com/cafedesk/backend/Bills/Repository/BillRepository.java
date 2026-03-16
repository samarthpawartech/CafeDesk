package com.cafedesk.backend.Bills.Repository;

import com.cafedesk.backend.Bills.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    // 🔍 Find bills by customer name
    List<Bill> findByCustomerName(String customerName);

    // 🔥 Used for auto invoice number generation (INV-0001)
    Long countBy();
}