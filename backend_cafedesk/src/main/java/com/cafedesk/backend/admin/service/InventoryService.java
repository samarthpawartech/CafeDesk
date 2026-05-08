package com.cafedesk.backend.admin.service;

import com.cafedesk.backend.admin.DTO.InventoryDTO;
import com.cafedesk.backend.admin.entity.InventoryItem;
import com.cafedesk.backend.admin.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    // ================= STATUS =================

    private String getStatus(Double quantity, Double minStock) {

        if (quantity == 0) {
            return "critical";
        }

        if (quantity < minStock * 0.5) {
            return "critical";
        }

        if (quantity < minStock) {
            return "low-stock";
        }

        return "in-stock";
    }

    // ================= GET ALL =================

    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    // ================= ADD ITEM =================

    public InventoryItem addItem(InventoryDTO dto) {

        InventoryItem item = new InventoryItem();

        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setQuantity(dto.getQuantity());
        item.setUnit(dto.getUnit());
        item.setMinStock(dto.getMinStock());

        item.setStatus(
                getStatus(dto.getQuantity(), dto.getMinStock())
        );

        return inventoryRepository.save(item);
    }

    // ================= UPDATE ITEM =================

    public InventoryItem updateItem(Long id, InventoryDTO dto) {

        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setQuantity(dto.getQuantity());
        item.setUnit(dto.getUnit());
        item.setMinStock(dto.getMinStock());

        item.setStatus(
                getStatus(dto.getQuantity(), dto.getMinStock())
        );

        return inventoryRepository.save(item);
    }

    // ================= DELETE ITEM =================

    public void deleteItem(Long id) {
        inventoryRepository.deleteById(id);
    }
}