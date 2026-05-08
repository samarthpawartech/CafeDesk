package com.cafedesk.backend.admin.controller;

import com.cafedesk.backend.admin.DTO.InventoryDTO;
import com.cafedesk.backend.admin.entity.InventoryItem;
import com.cafedesk.backend.admin.service.InventoryService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin("*")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // ================= GET ALL =================

    @GetMapping
    public List<InventoryItem> getAllItems() {
        return inventoryService.getAllItems();
    }

    // ================= ADD =================

    @PostMapping
    public InventoryItem addItem(@RequestBody InventoryDTO dto) {
        return inventoryService.addItem(dto);
    }

    // ================= UPDATE =================

    @PutMapping("/{id}")
    public InventoryItem updateItem(
            @PathVariable Long id,
            @RequestBody InventoryDTO dto
    ) {
        return inventoryService.updateItem(id, dto);
    }

    // ================= DELETE =================

    @DeleteMapping("/{id}")
    public String deleteItem(@PathVariable Long id) {

        inventoryService.deleteItem(id);

        return "Inventory item deleted successfully";
    }
}