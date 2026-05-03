package com.cafedesk.backend.customer.repository;

import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<CurrentOrder, Long> {

    List<CurrentOrder> findByCustomerName(String customerName);

    List<CurrentOrder> findByTableNumber(String tableNumber);

    // 🔥 REQUIRED FOR BILL APPROVAL FIX
    CurrentOrder findTopByCustomerNameAndTableNumberAndStatusNotOrderByCreatedAtDesc(
            String customerName,
            String tableNumber,
            OrderStatus status
    );

    @Modifying
    @Query(value = "TRUNCATE TABLE current_orders RESTART IDENTITY CASCADE", nativeQuery = true)
    void truncateOrders();
}