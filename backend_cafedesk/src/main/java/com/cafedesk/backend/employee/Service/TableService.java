package com.cafedesk.backend.employee.Service;

import com.cafedesk.backend.employee.entity.TableEntity;
import com.cafedesk.backend.employee.entity.TableStatus;
import com.cafedesk.backend.employee.Repository.TableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableService {

    private final TableRepository tableRepository;

    public TableService(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    public List<TableEntity> getAllTables() {
        return tableRepository.findAll();
    }

    // 🔥 CORE METHOD (QR BASED)
    public TableEntity updateStatus(String tableCode, TableStatus status) {
        TableEntity table = tableRepository.findByTableCode(tableCode)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setStatus(status);
        return tableRepository.save(table);
    }

    public TableEntity createTable(TableEntity table) {
        return tableRepository.save(table);
    }
}