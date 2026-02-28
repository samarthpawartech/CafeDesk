package com.cafedesk.backend.customer.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private int rating;
    private String remark;
    private LocalDateTime date;

    // Getters & Setters

    public Long getId() { return id; }

    public String getCustomerName() { return customerName; }

    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public int getRating() { return rating; }

    public void setRating(int rating) { this.rating = rating; }

    public String getRemark() { return remark; }

    public void setRemark(String remark) { this.remark = remark; }

    public LocalDateTime getDate() { return date; }

    public void setDate(LocalDateTime date) { this.date = date; }

}