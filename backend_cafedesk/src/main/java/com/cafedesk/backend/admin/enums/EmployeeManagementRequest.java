package com.cafedesk.backend.admin.enums;

import jakarta.validation.constraints.*;

public class EmployeeManagementRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    private String phone;

    @NotNull(message = "Role is required")
    private EmployeeManagementRole role;

    @NotNull(message = "Shift is required")
    private EmployeeManagementShift shift;

    @NotNull(message = "Status is required")
    private EmployeeManagementStatus status;


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

    public EmployeeManagementRole getRole() {
        return role;
    }

    public void setRole(EmployeeManagementRole role) {
        this.role = role;
    }

    public EmployeeManagementShift getShift() {
        return shift;
    }

    public void setShift(EmployeeManagementShift shift) {
        this.shift = shift;
    }

    public EmployeeManagementStatus getStatus() {
        return status;
    }

    public void setStatus(EmployeeManagementStatus status) {
        this.status = status;
    }
}
