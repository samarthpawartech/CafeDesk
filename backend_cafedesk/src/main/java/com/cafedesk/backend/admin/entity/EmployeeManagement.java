package com.cafedesk.backend.admin.entity;

import com.cafedesk.backend.admin.enums.EmployeeManagementRole;
import com.cafedesk.backend.admin.enums.EmployeeManagementShift;
import com.cafedesk.backend.admin.enums.EmployeeManagementStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "Staff_Data")
public class EmployeeManagement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, length = 15)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeManagementRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeManagementShift shift;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeManagementStatus status;

    @Column(nullable = false)
    private Double salary;

    public EmployeeManagement() {}

    public EmployeeManagement(String name, String email, String phone,
                              EmployeeManagementRole role, EmployeeManagementShift shift,
                              EmployeeManagementStatus status, Double salary) {
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
