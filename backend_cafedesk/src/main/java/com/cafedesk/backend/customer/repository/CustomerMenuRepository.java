package com.cafedesk.backend.customer.repository;

import com.cafedesk.backend.customer.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerMenuRepository extends JpaRepository<MenuItem, Long> {

    // Find only available menu items
    List<MenuItem> findByAvailableTrue();

    // Find by exact name (case-sensitive)
    List<MenuItem> findByName(String name);

    // Optional: Find by name containing text (case-insensitive)
    List<MenuItem> findByNameContainingIgnoreCase(String namePart);
}