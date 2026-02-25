package com.cafedesk.backend.admin.repository;

import com.cafedesk.backend.admin.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Long> {
}