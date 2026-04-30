package com.cafedesk.backend.customer.repository;

import com.cafedesk.backend.customer.entity.CurrentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<CurrentOrder, Long> {

    // ✅ Existing
    List<CurrentOrder> findByCustomerName(String customerName);

    // ✅ ADD THIS (IMPORTANT)
    List<CurrentOrder> findByTableNumber(String tableNumber);
}