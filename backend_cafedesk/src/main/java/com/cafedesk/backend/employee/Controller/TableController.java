package com.cafedesk.backend.employee.Controller;

import com.cafedesk.backend.employee.entity.TableEntity;
import com.cafedesk.backend.employee.entity.TableStatus;
import com.cafedesk.backend.employee.Service.TableService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee/tables")
@CrossOrigin(
        origins = "http://localhost:5173", // ✅ frontend URL
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    // ✅ Get all tables
    @GetMapping
    public List<TableEntity> getAllTables() {
        return tableService.getAllTables();
    }

    // ✅ UPDATE STATUS
    @PutMapping("/{tableCode}/status")
    public TableEntity updateStatus(
            @PathVariable String tableCode,
            @RequestParam TableStatus status
    ) {
        return tableService.updateStatus(tableCode, status);
    }

    // ✅ CREATE TABLE
    @PostMapping
    public TableEntity createTable(@RequestBody TableEntity table) {
        return tableService.createTable(table);
    }
}