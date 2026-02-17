package com.cafedesk.backend.Employee_Management.DTO;

import com.cafedesk.backend.Employee_Management.enums.*;
import jakarta.validation.constraints.*;

public class EmployeeRequest {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 10, max = 15)
    private String phone;

    @NotNull
    private EmployeeRole role;

    @NotNull
    private EmployeeShift shift;

    @NotNull
    private EmployeeStatus status;

    @NotNull
    private Double salary;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public EmployeeRole getRole() { return role; }
    public void setRole(EmployeeRole role) { this.role = role; }

    public EmployeeShift getShift() { return shift; }
    public void setShift(EmployeeShift shift) { this.shift = shift; }

    public EmployeeStatus getStatus() { return status; }
    public void setStatus(EmployeeStatus status) { this.status = status; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }
}
