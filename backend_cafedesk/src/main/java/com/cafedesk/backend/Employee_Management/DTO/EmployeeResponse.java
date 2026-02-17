package com.cafedesk.backend.Employee_Management.DTO;

import com.cafedesk.backend.Employee_Management.enums.*;

public class EmployeeResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private EmployeeRole role;
    private EmployeeShift shift;
    private EmployeeStatus status;
    private Double salary;

    public EmployeeResponse(Long id, String name, String email,
                            String phone, EmployeeRole role,
                            EmployeeShift shift, EmployeeStatus status,
                            Double salary) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.shift = shift;
        this.status = status;
        this.salary = salary;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public EmployeeRole getRole() { return role; }
    public EmployeeShift getShift() { return shift; }
    public EmployeeStatus getStatus() { return status; }
    public Double getSalary() { return salary; }
}
