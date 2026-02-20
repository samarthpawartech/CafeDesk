package com.cafedesk.backend.admin.DTO;

import com.cafedesk.backend.admin.enums.EmployeeManagementRole;
import com.cafedesk.backend.admin.enums.EmployeeManagementShift;
import com.cafedesk.backend.admin.enums.EmployeeManagementStatus;
import jakarta.validation.constraints.*;

public class EmployeeManagementRequest {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 10, max = 15)
    private String phone;

    @NotNull
    private EmployeeManagementRole role;

    @NotNull
    private EmployeeManagementShift shift;

    @NotNull
    private EmployeeManagementStatus status;

    @NotNull
    private Double salary;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public EmployeeManagementRole getRole() { return role; }
    public void setRole(EmployeeManagementRole role) { this.role = role; }

    public EmployeeManagementShift getShift() { return shift; }
    public void setShift(EmployeeManagementShift shift) { this.shift = shift; }

    public EmployeeManagementStatus getStatus() { return status; }
    public void setStatus(EmployeeManagementStatus status) { this.status = status; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }
}
