package com.cafedesk.backend.admin.controller;

import com.cafedesk.backend.admin.DTO.*;
import com.cafedesk.backend.admin.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuService service;

    public MenuController(MenuService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MenuResponse> createMenu(
            @Valid @RequestPart("menu") MenuRequest dto,
            @RequestPart("image") MultipartFile image
    ) {
        return ResponseEntity.ok(service.saveMenu(dto, image));
    }

    @GetMapping
    public ResponseEntity<List<MenuResponse>> getAll() {
        return ResponseEntity.ok(service.getAllMenus());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getMenuById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuResponse> update(
            @PathVariable Long id,
            @Valid @RequestPart("menu") MenuRequest dto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        return ResponseEntity.ok(service.updateMenu(id, dto, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteMenu(id);
        return ResponseEntity.ok("Menu deleted successfully");
    }
}