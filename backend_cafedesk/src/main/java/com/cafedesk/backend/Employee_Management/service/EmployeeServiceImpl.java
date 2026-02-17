package com.cafedesk.backend.Employee_Management.service;

import com.cafedesk.backend.Employee_Management.DTO.EmployeeRequest;
import com.cafedesk.backend.Employee_Management.DTO.EmployeeResponse;
import com.cafedesk.backend.Employee_Management.entity.Employee;
import com.cafedesk.backend.Employee_Management.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl {

    private final EmployeeRepository repository;

    public EmployeeServiceImpl(EmployeeRepository repository) {
        this.repository = repository;
    }

    // Create new employee
    public EmployeeResponse create(EmployeeRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Employee employee = new Employee(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getRole(),
                request.getShift(),
                request.getStatus(),
                request.getSalary()
        );

        Employee saved = repository.save(employee);
        return mapToResponse(saved);
    }

    // Get all employees
    public List<EmployeeResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update employee by ID
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee with ID " + id + " not found"));

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setRole(request.getRole());
        employee.setShift(request.getShift());
        employee.setStatus(request.getStatus());
        employee.setSalary(request.getSalary());

        Employee updated = repository.save(employee);
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
    private EmployeeResponse mapToResponse(Employee e) {
        return new EmployeeResponse(
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
