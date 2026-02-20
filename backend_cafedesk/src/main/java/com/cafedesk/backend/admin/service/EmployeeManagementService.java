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

    // Constructor injection (preferred)
    public EmployeeManagementService(EmployeeManagementRepository repository) {
        this.repository = repository;
    }

    // Create new employee
    public EmployeeManagementResponse create(EmployeeManagementRequest request) {
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

    // Get all employees
    public List<EmployeeManagementResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update employee by id
    public EmployeeManagementResponse update(Long id, EmployeeManagementRequest request) {
        EmployeeManagement emp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee with ID " + id + " not found"));

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

    // Delete employee by id
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Employee with ID " + id + " not found");
        }
        repository.deleteById(id);
    }

    // Helper method to map Employee entity to DTO
    private EmployeeManagementResponse mapToResponse(EmployeeManagement emp) {
        return new EmployeeManagementResponse(
                emp.getId(),
                emp.getName(),
                emp.getEmail(),
                emp.getPhone(),
                emp.getRole(),
                emp.getShift(),
                emp.getStatus(),
                emp.getSalary()
        );
    }
}
