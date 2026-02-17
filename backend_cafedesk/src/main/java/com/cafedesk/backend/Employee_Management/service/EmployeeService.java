package com.cafedesk.backend.Employee_Management.service;

import com.cafedesk.backend.Employee_Management.DTO.EmployeeRequest;
import com.cafedesk.backend.Employee_Management.DTO.EmployeeResponse;
import com.cafedesk.backend.Employee_Management.entity.Employee;
import com.cafedesk.backend.Employee_Management.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    // Constructor injection (preferred)
    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    // Create new employee
    public EmployeeResponse create(EmployeeRequest request) {
        Employee emp = new Employee(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getRole(),
                request.getShift(),
                request.getStatus(),
                request.getSalary()
        );
        Employee saved = repository.save(emp);
        return mapToResponse(saved);
    }

    // Get all employees
    public List<EmployeeResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update employee by id
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee emp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee with ID " + id + " not found"));

        emp.setName(request.getName());
        emp.setEmail(request.getEmail());
        emp.setPhone(request.getPhone());
        emp.setRole(request.getRole());
        emp.setShift(request.getShift());
        emp.setStatus(request.getStatus());
        emp.setSalary(request.getSalary());

        Employee updated = repository.save(emp);
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
    private EmployeeResponse mapToResponse(Employee emp) {
        return new EmployeeResponse(
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
