package com.cafedesk.backend.admin.DTO;

import com.cafedesk.backend.admin.enums.EmployeeManagementRole;
import com.cafedesk.backend.admin.enums.EmployeeManagementShift;
import com.cafedesk.backend.admin.enums.EmployeeManagementStatus;

public class EmployeeManagementResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private EmployeeManagementRole role;
    private EmployeeManagementShift shift;
    private EmployeeManagementStatus status;
    private Double salary;

    public EmployeeManagementResponse(Long id, String name, String email,
                                      String phone, EmployeeManagementRole role,
                                      EmployeeManagementShift shift, EmployeeManagementStatus status,
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
    public EmployeeManagementRole getRole() { return role; }
    public EmployeeManagementShift getShift() { return shift; }
    public EmployeeManagementStatus getStatus() { return status; }
    public Double getSalary() { return salary; }
}
