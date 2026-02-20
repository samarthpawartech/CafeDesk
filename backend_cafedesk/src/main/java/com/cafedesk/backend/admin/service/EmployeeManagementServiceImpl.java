package com.cafedesk.backend.admin.service;

import com.cafedesk.backend.admin.DTO.EmployeeManagementRequest;
import com.cafedesk.backend.admin.DTO.EmployeeManagementResponse;
import com.cafedesk.backend.admin.entity.EmployeeManagement;
import com.cafedesk.backend.admin.repository.EmployeeManagementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeManagementServiceImpl {

    private final EmployeeManagementRepository repository;

    public EmployeeManagementServiceImpl(EmployeeManagementRepository repository) {
        this.repository = repository;
    }

    // Create new employee
    public EmployeeManagementResponse create(EmployeeManagementRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        EmployeeManagement employeeManagement = new EmployeeManagement(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getRole(),
                request.getShift(),
                request.getStatus(),
                request.getSalary()
        );

        EmployeeManagement saved = repository.save(employeeManagement);
        return mapToResponse(saved);
    }

    // Get all employees
    public List<EmployeeManagementResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update employee by ID
    public EmployeeManagementResponse update(Long id, EmployeeManagementRequest request) {
        EmployeeManagement employeeManagement = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee with ID " + id + " not found"));

        employeeManagement.setName(request.getName());
        employeeManagement.setEmail(request.getEmail());
        employeeManagement.setPhone(request.getPhone());
        employeeManagement.setRole(request.getRole());
        employeeManagement.setShift(request.getShift());
        employeeManagement.setStatus(request.getStatus());
        employeeManagement.setSalary(request.getSalary());

        EmployeeManagement updated = repository.save(employeeManagement);
        return mapToResponse(updated);
    }

    // Delete employee by ID
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Employee with ID " + id + " not found");
        }
        repository.deleteById(id);
    }

    // Helper method to map Employee entity to DTO
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
