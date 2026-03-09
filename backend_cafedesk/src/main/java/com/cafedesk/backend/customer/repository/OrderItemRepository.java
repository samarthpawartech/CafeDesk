package com.cafedesk.backend.customer.repository;

import com.cafedesk.backend.customer.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}