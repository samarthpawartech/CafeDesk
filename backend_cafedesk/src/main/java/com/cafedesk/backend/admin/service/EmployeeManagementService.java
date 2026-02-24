package com.cafedesk.backend.admin.service;

import com.cafedesk.backend.admin.DTO.EmployeeManagementRequest;
import com.cafedesk.backend.admin.DTO.EmployeeManagementResponse;
import com.cafedesk.backend.admin.entity.EmployeeManagement;
import com.cafedesk.backend.admin.repository.EmployeeManagementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeManagementService {

    private final EmployeeManagementRepository repository;

    public EmployeeManagementService(EmployeeManagementRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public EmployeeManagementResponse create(EmployeeManagementRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        EmployeeManagement emp = new EmployeeManagement(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getRole(),
                request.getShift(),
                request.getStatus(),
                request.getSalary()
        );
        EmployeeManagement saved = repository.save(emp);
        return mapToResponse(saved);
    }

    // GET ALL
    public List<EmployeeManagementResponse> getAll() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // UPDATE
    public EmployeeManagementResponse update(Long id, EmployeeManagementRequest request) {
        EmployeeManagement emp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Check for email uniqueness on update
        if (!emp.getEmail().equals(request.getEmail()) && repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        emp.setName(request.getName());
        emp.setEmail(request.getEmail());
        emp.setPhone(request.getPhone());
        emp.setRole(request.getRole());
        emp.setShift(request.getShift());
        emp.setStatus(request.getStatus());
        emp.setSalary(request.getSalary());

        EmployeeManagement updated = repository.save(emp);
        return mapToResponse(updated);
    }

    // DELETE
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Employee not found");
        }
        repository.deleteById(id);
    }

    // MAP ENTITY TO DTO
    private EmployeeManagementResponse mapToResponse(EmployeeManagement e) {
        return new EmployeeManagementResponse(
                e.getId(),
                e.getName(),
                e.getEmail(),
                e.getPhone(),
                e.getRole(),
                e.getShift(),
                e.getStatus(),
                e.getSalary()
        );
    }
}