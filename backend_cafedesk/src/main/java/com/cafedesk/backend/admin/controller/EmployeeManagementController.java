package com.cafedesk.backend.admin.controller;

import com.cafedesk.backend.admin.DTO.EmployeeManagementRequest;
import com.cafedesk.backend.admin.DTO.EmployeeManagementResponse;
import com.cafedesk.backend.admin.service.EmployeeManagementService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:5173") // React/Vite frontend
public class EmployeeManagementController {

    private final EmployeeManagementService service;

    public EmployeeManagementController(EmployeeManagementService service) {
        this.service = service;
    }

    /* ================= CREATE ================= */

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeManagementResponse create(@Valid @RequestBody EmployeeManagementRequest request) {
        return service.create(request);
    }

    /* ================= GET ALL ================= */

    @GetMapping
    public List<EmployeeManagementResponse> getAll() {
        return service.getAll();
    }

    /* ================= UPDATE ================= */

    @PutMapping("/{id}")
    public EmployeeManagementResponse update(@PathVariable Long id,
                                             @Valid @RequestBody EmployeeManagementRequest request) {

        return service.update(id, request);
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
