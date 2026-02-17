package com.cafedesk.backend.Employee_Management.entity;

import com.cafedesk.backend.Employee_Management.enums.EmployeeRole;
import com.cafedesk.backend.Employee_Management.enums.EmployeeShift;
import com.cafedesk.backend.Employee_Management.enums.EmployeeStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "Employee_Management")
public class Employee {

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
    private EmployeeRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeShift shift;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeStatus status;

    @Column(nullable = false)
    private Double salary;

    public Employee() {}

    public Employee(String name, String email, String phone,
                    EmployeeRole role, EmployeeShift shift,
                    EmployeeStatus status, Double salary) {
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

    public EmployeeRole getRole() { return role; }
    public void setRole(EmployeeRole role) { this.role = role; }

    public EmployeeShift getShift() { return shift; }
    public void setShift(EmployeeShift shift) { this.shift = shift; }

    public EmployeeStatus getStatus() { return status; }
    public void setStatus(EmployeeStatus status) { this.status = status; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }
}
