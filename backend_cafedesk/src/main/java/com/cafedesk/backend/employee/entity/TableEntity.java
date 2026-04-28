package com.cafedesk.backend.employee.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tables")
public class TableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String tableCode; // T01, T02

    private int capacity;

    @Enumerated(EnumType.STRING)
    private TableStatus status;

    public TableEntity() {}

    public TableEntity(String tableCode, int capacity, TableStatus status) {
        this.tableCode = tableCode;
        this.capacity = capacity;
        this.status = status;
    }

    public Long getId() { return id; }

    public String getTableCode() { return tableCode; }
    public void setTableCode(String tableCode) { this.tableCode = tableCode; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public TableStatus getStatus() { return status; }
    public void setStatus(TableStatus status) { this.status = status; }
}