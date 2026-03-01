package com.cafedesk.backend.customer.repository;

import com.cafedesk.backend.customer.entity.MenuCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerMenuRepository extends JpaRepository<MenuCard, Long> {

    // Find only available menu items
    List<MenuCard> findByAvailableTrue();

    // Find by exact name (case-sensitive)
    List<MenuCard> findByName(String name);

    // Optional: Find by name containing text (case-insensitive)
    List<MenuCard> findByNameContainingIgnoreCase(String namePart);
}