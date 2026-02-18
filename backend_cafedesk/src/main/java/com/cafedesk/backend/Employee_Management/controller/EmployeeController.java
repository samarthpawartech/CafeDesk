package com.cafedesk.backend.Employee_Management.controller;

import com.cafedesk.backend.Employee_Management.DTO.EmployeeRequest;
import com.cafedesk.backend.Employee_Management.DTO.EmployeeResponse;
import com.cafedesk.backend.Employee_Management.service.EmployeeService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:5173") // React/Vite frontend
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    /* ================= CREATE ================= */

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
        return service.create(request);
    }

    /* ================= GET ALL ================= */

    @GetMapping
    public List<EmployeeResponse> getAll() {
        return service.getAll();
    }

    /* ================= UPDATE ================= */

    @PutMapping("/{id}")
    public EmployeeResponse update(@PathVariable Long id,
                                   @Valid @RequestBody EmployeeRequest request) {

        return service.update(id, request);
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
