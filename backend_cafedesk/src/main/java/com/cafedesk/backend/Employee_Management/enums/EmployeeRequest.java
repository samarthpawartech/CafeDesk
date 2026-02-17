package com.cafedesk.backend.Employee_Management.enums;

import com.cafedesk.backend.Employee_Management.enums.EmployeeRole;
import com.cafedesk.backend.Employee_Management.enums.EmployeeShift;
import com.cafedesk.backend.Employee_Management.enums.EmployeeStatus;

import jakarta.validation.constraints.*;

public class EmployeeRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    private String phone;

    @NotNull(message = "Role is required")
    private EmployeeRole role;

    @NotNull(message = "Shift is required")
    private EmployeeShift shift;

    @NotNull(message = "Status is required")
    private EmployeeStatus status;


    private Double salary;

// -------------------- Getters & Setters --------------------

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public EmployeeRole getRole() {
        return role;
    }

    public void setRole(EmployeeRole role) {
        this.role = role;
    }

    public EmployeeShift getShift() {
        return shift;
    }

    public void setShift(EmployeeShift shift) {
        this.shift = shift;
    }

    public EmployeeStatus getStatus() {
        return status;
    }

    public void setStatus(EmployeeStatus status) {
        this.status = status;
    }
}
